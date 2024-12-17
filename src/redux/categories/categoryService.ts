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
} from "firebase/firestore";
import app from "../../config/firebase";
import { Category } from "../../types/Shopping";

const db = getFirestore(app);

// Fetch all categories from Firestore
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const categoriesCol = collection(db, "categories");
    const categorySnapshot = await getDocs(categoriesCol);

    // Map each document to the Category type with proper type assertion
    const categoriesList: Category[] = categorySnapshot.docs.map((doc) => {
      const data = doc.data() as Category; // Explicitly cast Firestore data to Category type
      //   return { ...data, id: doc.id }; // Add the Firestore doc id to Category
      return { ...data }; // Add the Firestore doc id to Category
    });

    return categoriesList;
  } catch (error) {
    console.error("Error fetching categories:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching categories: " + error.message);
    } else {
      throw new Error("Error fetching categories: " + String(error));
    }
  }
};

// Add a new category to Firestore
export const addCategory = async (category: Category): Promise<Category> => {
  try {
    const categoriesCol = collection(db, "categories");

    // Check if a category with the same name already exists
    const q = query(categoriesCol, where("name", "==", category.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Category name must be unique.");
    }

    // Add a new category and get the docRef
    const docRef = await addDoc(categoriesCol, category);

    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });

    // Return the added category along with its document ID
    return { ...category, id: docRef.id };
  } catch (error) {
    console.error("Error adding category:", error);
    if (error instanceof Error) {
      throw new Error("Error adding category: " + error.message);
    } else {
      throw new Error("Error adding category: " + String(error));
    }
  }
};

// Update a category in Firestore
export const updateCategory = async (
  id: string,
  updatedCategory: Category
): Promise<Category> => {
  try {
    const categoriesCol = collection(db, "categories");

    // Check if a category with the same name already exists (excluding the current category)
    const q = query(
      categoriesCol,
      where("name", "==", updatedCategory.name),
      where("id", "!=", id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Category name must be unique.");
    }

    const categoryRef = doc(db, "categories", id);
    await updateDoc(categoryRef, { ...updatedCategory });

    // Return the updated category, including its ID
    return { ...updatedCategory, id };
  } catch (error) {
    console.error("Error updating category:", error);
    if (error instanceof Error) {
      throw new Error("Error updating category: " + error.message);
    } else {
      throw new Error("Error updating category: " + String(error));
    }
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<string> => {
  try {
    const categoryRef = doc(db, "categories", id);
    await deleteDoc(categoryRef);

    return id;
  } catch (error) {
    console.error("Error deleting category:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting category: " + error.message);
    } else {
      throw new Error("Error deleting category: " + String(error));
    }
  }
};
