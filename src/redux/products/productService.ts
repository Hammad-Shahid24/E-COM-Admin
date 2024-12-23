import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  doc,
  deleteDoc,
  serverTimestamp,
  QueryDocumentSnapshot,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  getCountFromServer,
  DocumentData,
} from "firebase/firestore";
import app from "../../config/firebase";
import { Product } from "../../types/Shopping";
import { convertTimestampToDate } from "../../utils/ConvertFBTimestampToDate"

const db = getFirestore(app);

export const fetchProducts = async (
  lastVisible: QueryDocumentSnapshot<Product> | null | string = null,
  pageSize: number = 1,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<{
  products: Product[];
  lastVisible: QueryDocumentSnapshot<Product, DocumentData> | string | null; // Store just the document ID or other serializable value
  totalProducts: number;
}> => {
  try {
    const productsCol = collection(db, "products");
    let q;


    if (lastVisible) {
      q = query(
        productsCol,
        orderBy(sortField, sortOrder),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(productsCol, orderBy(sortField, sortOrder), limit(pageSize));
    }

    const productSnapshot = await getDocs(q);

    const productsList: Product[] = productSnapshot.docs.map((doc) => {
      const data = doc.data() as Product;

      console.log(data)

      // Convert Timestamp to Date string (ISO format)
      data.createdAt = convertTimestampToDate(data.createdAt) as Date;
      // data.updatedAt = data.updatedAt.toDate().toISOString();
      if (data.discountStartDate && data.discountExpiryDate) {
        data.discountStartDate = convertTimestampToDate(data.discountStartDate) as Date;
        data.discountExpiryDate = convertTimestampToDate(data.discountExpiryDate) as Date;
      }

      return { ...data };
    });

    // Get the last visible document and store just the ID or serializable data
    const lastVisibleDocRef =
      productSnapshot.docs[productSnapshot.docs.length - 1];

    // Get the total number of documents in the collection
    const totalCountSnapshot = await getCountFromServer(productsCol);
    const totalProducts = totalCountSnapshot.data().count;

    return {
      products: productsList,
      lastVisible: lastVisibleDocRef as QueryDocumentSnapshot<Product>,
      totalProducts,
    };
  } catch (error) {
    console.error("Error fetching more products:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("Error fetching products: " + String(error));
    }
  }
};

// Add a new product to Firestore
export const addProduct = async (product: Product): Promise<Product> => {
  try {
    const productsCol = collection(db, "products");

    // Check if a product with the same name already exists
    const q = query(productsCol, where("name", "==", product.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Product name must be unique.");
    }

    // Add a new product and get the docRef
    const docRef = await addDoc(productsCol, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });

    // Return the added product along with its document ID
    return { ...product, id: docRef.id };
  } catch (error) {
    console.error("Error adding product:", error);
    if (error instanceof Error) {
      throw new Error("Error adding product: " + error.message);
    } else {
      throw new Error("Error adding product: " + String(error));
    }
  }
};

// Update a product in Firestore
export const updateProduct = async (
  id: string,
  updatedProduct: Product
): Promise<Product> => {
  try {
    const productsCol = collection(db, "products");

    // Check if a product with the same name already exists (excluding the current product)
    const q = query(
      productsCol,
      where("name", "==", updatedProduct.name),
      where("id", "!=", id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Product name must be unique.");
    }

    const productRef = doc(db, "products", id);
    await updateDoc(productRef, {
      ...updatedProduct,
      updatedAt: serverTimestamp(),
    });

    // Return the updated product, including its ID
    return { ...updatedProduct, id };
  } catch (error) {
    console.error("Error updating product:", error);
    if (error instanceof Error) {
      throw new Error("Error updating product: " + error.message);
    } else {
      throw new Error("Error updating product: " + String(error));
    }
  }
};

// Delete a product
export const deleteProduct = async (id: string): Promise<string> => {
  try {
    const productRef = doc(db, "products", id);
    await deleteDoc(productRef);

    return id;
  } catch (error) {
    console.error("Error deleting product:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting product: " + error.message);
    } else {
      throw new Error("Error deleting product: " + String(error));
    }
  }
};
