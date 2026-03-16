// Domain types for the restaurant web-client

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  imgUrl?: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  observation?: string;
}

export interface OrderProduct {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  observation: string | null;
  product?: Product;
}

export type OrderStatus =
  | "client-order"
  | "confirm-order"
  | "failed"
  | "production"
  | "delivery"
  | "delivered";

export interface Order {
  id: string;
  client_id: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  order_products?: OrderProduct[];
}

export interface Client {
  id: string;
  name: string;
  email?: string;
}
