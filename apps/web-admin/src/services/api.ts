import type { Product, Client, OrderStatus } from "@/types/domain";

const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3031";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`API error ${res.status}: ${msg}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  /** Fetch all clients */
  getClients(): Promise<{ clients: Client[] }> {
    return apiFetch("/v1/client");
  },

  /** Fetch available products */
  getProducts(): Promise<{ products: Product[] }> {
    return apiFetch("/v1/product/available");
  },

  /** Fetch orders for a specific client */
  getOrdersByClient(clientId: string): Promise<
    {
      order_id: string;
      order_status: OrderStatus;
      order_createdAt: string;
      order_products: {
        product_id: string;
        product_name: string;
        product_quantity: number;
        product_description: string | null;
        product_observation: string | null;
        product_imgUrl: string | null;
      }[];
    }[]
  > {
    return apiFetch(`/v1/order?client_id=${clientId}`);
  },

  /** Fetch ALL orders (Admin) */
  getOrders(): Promise<
    {
      order_id: string;
      order_status: OrderStatus;
      order_createdAt: string;
      order_products: {
        product_id: string;
        product_name: string;
        product_quantity: number;
        product_description: string | null;
        product_observation: string | null;
        product_imgUrl: string | null;
      }[];
    }[]
  > {
    return apiFetch(`/v1/order/all`);
  },

  /** Update order status (Admin) */
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<any> {
    return apiFetch(`/v1/order/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /** Place a new order — returns a job_id for socket tracking */
  placeOrder(payload: {
    client_id: string;
    order_products: {
      product_id: string;
      quantity: number;
      observation?: string;
    }[];
  }): Promise<{ job_id: string; message: string }> {
    return apiFetch("/v1/order", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
