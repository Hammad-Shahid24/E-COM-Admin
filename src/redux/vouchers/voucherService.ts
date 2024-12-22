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
} from "firebase/firestore";
import app from "../../config/firebase";
import { Voucher } from "../../types/Shopping";

const db = getFirestore(app);

// Fetch all vouchers from Firestore
export const fetchVouchers = async (): Promise<Voucher[]> => {
  try {
    const vouchersCol = collection(db, "vouchers");
    const voucherSnapshot = await getDocs(vouchersCol);

    // Map each document to the Voucher type with proper type assertion
    const vouchersList: Voucher[] = voucherSnapshot.docs;

    console.log(vouchersList);

    return vouchersList;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching vouchers: " + error.message);
    } else {
      throw new Error("Error fetching vouchers: " + String(error));
    }
  }
};

// Add a new voucher to Firestore
export const addVoucher = async (voucher: Voucher): Promise<Voucher> => {
  try {
    const vouchersCol = collection(db, "vouchers");

    // Check if a voucher with the same code already exists
    const q = query(vouchersCol, where("code", "==", voucher.code));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Voucher code must be unique.");
    }

    // Add a new voucher and get the docRef
    const docRef = await addDoc(vouchersCol, {
      ...voucher,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });

    // Return the added voucher along with its document ID
    return { ...voucher, id: docRef.id };
  } catch (error) {
    console.error("Error adding voucher:", error);
    if (error instanceof Error) {
      throw new Error("Error adding voucher: " + error.message);
    } else {
      throw new Error("Error adding voucher: " + String(error));
    }
  }
};

// Update a voucher in Firestore
export const updateVoucher = async (
  id: string,
  updatedVoucher: Voucher
): Promise<Voucher> => {
  try {
    const vouchersCol = collection(db, "vouchers");

    // Check if a voucher with the same code already exists (excluding the current voucher)
    const q = query(
      vouchersCol,
      where("code", "==", updatedVoucher.code),
      where("id", "!=", id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Voucher code must be unique.");
    }

    const voucherRef = doc(db, "vouchers", id);
    await updateDoc(voucherRef, {
      ...updatedVoucher,
      updatedAt: serverTimestamp(),
    });

    // Return the updated voucher, including its ID
    return { ...updatedVoucher, id };
  } catch (error) {
    console.error("Error updating voucher:", error);
    if (error instanceof Error) {
      throw new Error("Error updating voucher: " + error.message);
    } else {
      throw new Error("Error updating voucher: " + String(error));
    }
  }
};

// Delete a voucher
export const deleteVoucher = async (id: string): Promise<string> => {
  try {
    const voucherRef = doc(db, "vouchers", id);
    await deleteDoc(voucherRef);

    return id;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting voucher: " + error.message);
    } else {
      throw new Error("Error deleting voucher: " + String(error));
    }
  }
};
