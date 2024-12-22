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
  tags?: string[];
  discountPercentage?: number;
  discountStartDate?: Date;
  discountExpiryDate?: Date;
  categoryId: string; // Reference to the category document ID
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface Tag {
  id?: string;
  name: string;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface Voucher {
  id?: string;
  code: string;
  discountPercentage: number;
  voucherStartDate: Date;
  voucherExpiryDate: Date;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface Order {
  id?: string;
  userId: string;
  shippingAddress: ShippingAddress;
  products: Product[]; // Array of products
  totalAmount: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  voucher?: Voucher;
  createdAt?: Timestamp | Date | string;
  updatedAt?: Timestamp | Date | string;
}

export interface ShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactName: string;
  contactPhone: string;
}
