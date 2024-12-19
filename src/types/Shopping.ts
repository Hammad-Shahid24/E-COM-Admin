import { Timestamp } from "firebase/firestore";

export interface Category {
  id?: string;
  name: string;
  image: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface Product {
  id?: string; // Firestore document ID
  name: string;
  price: number;
  stock: number;
  description: string;
  images: string[]; // Array of image URLs
  categoryId: string; // Reference to the category document ID
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}
