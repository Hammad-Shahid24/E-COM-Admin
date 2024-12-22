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
import { Tag } from "../../types/Shopping";

const db = getFirestore(app);

// Fetch all tags from Firestore
export const fetchTags = async (): Promise<Tag[]> => {
  try {
    const tagsCol = collection(db, "tags");
    const tagSnapshot = await getDocs(tagsCol);

    // Map each document to the Tag type with proper type assertion
    const tagsList: Tag[] = tagSnapshot.docs.map((doc) => {
      const data = doc.data() as Tag; // Explicitly cast Firestore data to Tag type
      return { ...data };
    });

    return tagsList;
  } catch (error) {
    console.error("Error fetching tags:", error);
    if (error instanceof Error) {
      throw new Error("Error fetching tags: " + error.message);
    } else {
      throw new Error("Error fetching tags: " + String(error));
    }
  }
};

// Add a new tag to Firestore
export const addTag = async (tag: Tag): Promise<Tag> => {
  try {
    const tagsCol = collection(db, "tags");

    // Check if a tag with the same name already exists
    const q = query(tagsCol, where("name", "==", tag.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Tag name must be unique.");
    }

    // Add a new tag and get the docRef
    const docRef = await addDoc(tagsCol, {
      ...tag,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update the document with its own ID
    await updateDoc(docRef, { id: docRef.id });

    // Return the added tag along with its document ID
    return { ...tag, id: docRef.id };
  } catch (error) {
    console.error("Error adding tag:", error);
    if (error instanceof Error) {
      throw new Error("Error adding tag: " + error.message);
    } else {
      throw new Error("Error adding tag: " + String(error));
    }
  }
};

// Update a tag in Firestore
export const updateTag = async (id: string, updatedTag: Tag): Promise<Tag> => {
  try {
    const tagsCol = collection(db, "tags");

    // Check if a tag with the same name already exists (excluding the current tag)
    const q = query(
      tagsCol,
      where("name", "==", updatedTag.name),
      where("id", "!=", id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error("Tag name must be unique.");
    }

    const tagRef = doc(db, "tags", id);
    await updateDoc(tagRef, {
      ...updatedTag,
      updatedAt: serverTimestamp(),
    });

    // Return the updated tag, including its ID
    return { ...updatedTag, id };
  } catch (error) {
    console.error("Error updating tag:", error);
    if (error instanceof Error) {
      throw new Error("Error updating tag: " + error.message);
    } else {
      throw new Error("Error updating tag: " + String(error));
    }
  }
};

// Delete a tag
export const deleteTag = async (id: string): Promise<string> => {
  try {
    const tagRef = doc(db, "tags", id);
    await deleteDoc(tagRef);

    return id;
  } catch (error) {
    console.error("Error deleting tag:", error);
    if (error instanceof Error) {
      throw new Error("Error deleting tag: " + error.message);
    } else {
      throw new Error("Error deleting tag: " + String(error));
    }
  }
};
