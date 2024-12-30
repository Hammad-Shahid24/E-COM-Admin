import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  getCountFromServer,
  DocumentData,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import app from "../../config/firebase";
import { Order } from "../../types/Shopping";
import { convertTimestampToDate } from "../../utils/ConvertFBTimestampToDate";

const db = getFirestore(app);

export const listenToOrdersCollection = (
  callback: (orders: Order[]) => void
) => {
  const ordersCol = collection(db, "orders");

  const q = query(ordersCol, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const ordersList: Order[] = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Order;

      // Convert Firestore Timestamps to native Date objects
      data.createdAt = convertTimestampToDate(data.createdAt) as Date;
      data.updatedAt = convertTimestampToDate(data.updatedAt) as Date;

      return { ...data, id: doc.id }; // Include Firestore doc ID
    });

    callback(ordersList);
  });

  return unsubscribe;
}

export const fetchOrders = async (
  lastVisible: QueryDocumentSnapshot<Order> | null | string = null,
  pageSize: number = 1,
  sortField: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc",
): Promise<{
  orders: Order[];
  lastVisible: QueryDocumentSnapshot<Order, DocumentData> | string | null;
  totalOrders: number;
}> => {
  try {
    const ordersCol = collection(db, "orders");
    let q;

    // Add pagination (startAfter)
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

    // Execute query
    const orderSnapshot = await getDocs(q);

    // Process orders
    const ordersList: Order[] = orderSnapshot.docs.map((doc) => {
      const data = doc.data() as Order;

      // Convert Firestore Timestamps to native Date objects
      data.createdAt = convertTimestampToDate(data.createdAt) as Date;
      data.updatedAt = convertTimestampToDate(data.updatedAt) as Date;

      return { ...data, id: doc.id }; // Include Firestore doc ID
    });

    // Determine the last visible document for pagination
    const lastVisibleDocRef =
      orderSnapshot.docs.length > 0
        ? orderSnapshot.docs[orderSnapshot.docs.length - 1]
        : null;

    // Fetch total count of documents (useful for UI/UX)
    const totalCountSnapshot = await getCountFromServer(ordersCol);
    const totalOrders = totalCountSnapshot.data().count;

    // Return paginated data
    return {
      orders: ordersList,
      lastVisible: lastVisibleDocRef as QueryDocumentSnapshot<Order>,
      totalOrders,
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Error(
      "Error fetching orders: " +
      (error instanceof Error ? error.message : String(error))
    );
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
