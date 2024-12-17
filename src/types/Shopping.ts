export interface Rating {
  rate: number;
  count?: number;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
  rating: Rating;
}

export interface CartItem {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
}
