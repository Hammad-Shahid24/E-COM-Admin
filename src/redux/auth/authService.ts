// src/services/authService.ts

import { auth } from "../../config/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "../../config/firebase";

const db = getFirestore(app);

// Interface for user data
interface UserData {
  isAdmin: boolean;
  [key: string]: any; // Add other user data properties as needed
}

// Fetch user data from Firestore
export const fetchUserData = async (uid: string): Promise<UserData> => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      if (userData.isAdmin) {
        return userData;
      } else {
        throw new Error("User is not an admin.");
      }
    } else {
      throw new Error("User data not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Sign in with email and password
export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return await fetchUserData(user.uid);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
};

// Sign out the user
export const logOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Initialize auth state (check persistence on reload)
export const initializeAuthState = () => {
  return new Promise<any>((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await fetchUserData(user.uid);
        resolve(userData);
      } else {
        resolve(null);
      }
    });
  });
};
