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
import { Order } from "../../types/Shopping";

const db = getFirestore(app);

// Fetch paginated and sorted orders
export const fetchOrders = async (
  lastVisible: QueryDocumentSnapshot<Order> | null | string = null,
  pageSize: number = 1,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<{
  orders: Order[];
  lastVisible: QueryDocumentSnapshot<Order, DocumentData> | string | null;
  totalOrders: number;
}> => {
  try {
    const ordersCol = collection(db, "orders");
    let q;

    console.log(pageSize, sortField, sortOrder, lastVisible);

    if (lastVisible) {
      q = query(
        ordersCol,
        orderBy(sortField, sortOrder),
        startAfter(lastVisible),
        limit(pageSize)
      );
    } else {
      q = query(ordersCol, orderBy(sortField, sortOrder), limit(pageSize));
    }

    const orderSnapshot = await getDocs(q);

    const ordersList: Order[] = orderSnapshot.docs.map((doc) => {
      const data = doc.data() as Order;

      // Convert Timestamp to Date string (ISO format)
      data.createdAt = (data.createdAt as Timestamp).toDate().toISOString();
      data.updatedAt = (data.updatedAt as Timestamp).toDate().toISOString();

      return { ...data };
    });

    const lastVisibleDocRef = orderSnapshot.docs[orderSnapshot.docs.length - 1];

    const totalCountSnapshot = await getCountFromServer(ordersCol);
    const totalOrders = totalCountSnapshot.data().count;

    return {
      orders: ordersList,
      lastVisible: lastVisibleDocRef as QueryDocumentSnapshot<Order>,
      totalOrders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching orders: " + error.message);
    } else {
      throw new Error("Error fetching orders: " + String(error));
    }
  }
};

// Add a new order to Firestore
export const addOrder = async (order: Order): Promise<Order> => {
  try {
    const ordersCol = collection(db, "orders");

    const docRef = await addDoc(ordersCol, {
      ...order,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(docRef, { id: docRef.id });

    return { ...order, id: docRef.id };
  } catch (error) {
    console.error("Error adding order:", error);
    if (error instanceof Error) {
      throw new Error("Error adding order: " + error.message);
    } else {
      throw new Error("Error adding order: " + String(error));
    }
  }
};

// Update an order in Firestore
export const updateOrder = async (
  id: string,
  updatedOrder: Order
): Promise<Order> => {
  try {
    const orderRef = doc(db, "orders", id);

    await updateDoc(orderRef, {
      ...updatedOrder,
      updatedAt: serverTimestamp(),
    });

    return { ...updatedOrder, id };
  } catch (error) {
    console.error("Error updating order:", error);
    if (error instanceof Error) {
      throw new Error("Error updating order: " + error.message);
    } else {
      throw new Error("Error updating order: " + String(error));
    }
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<string> => {
  try {
    const orderRef = doc(db, "orders", id);
    await deleteDoc(orderRef);

    return id;
  } catch (error) {
    console.error("Error deleting order:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting order: " + error.message);
    } else {
      throw new Error("Error deleting order: " + String(error));
    }
  }
};
