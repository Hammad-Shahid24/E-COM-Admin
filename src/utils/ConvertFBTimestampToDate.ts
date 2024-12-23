import { Timestamp } from "firebase/firestore";

// Convert Firestore Timestamp to JavaScript Date
export const convertTimestampToDate = (timestamp: Timestamp | Date | string | undefined): Date | null => {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return timestamp;
  };