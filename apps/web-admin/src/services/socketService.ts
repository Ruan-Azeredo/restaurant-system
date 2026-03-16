import { io, Socket } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3031";

// Typed events the server can emit to the client
export interface OrderResultPayload {
  status: "confirm-order" | "failed";
  // Populated on "confirmed"
  order?: {
    id: string;
    client_id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  order_products?: {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    observation: string | null;
  }[];
  ingredient_verification?: {
    input_id: string;
    input_name: string;
    required_quantity: number;
    stock_quantity_before: number;
    stock_quantity_after: number;
    is_sufficient: boolean;
  }[];
  // Populated on "rejected"
  reason?: string;
}

class SocketService {
  private socket: Socket | null = null;

  /**
   * Opens the WebSocket connection to the API.
   * Safe to call multiple times — will reuse existing connection.
   */
  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(API_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("[Socket] Connected:", this.socket?.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    this.socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return this.socket;
  }

  /**
   * Subscribes to updates for a specific order job.
   * The server will emit "order-result" to this room once processed.
   *
   * @param jobId - The job_id returned from POST /order
   * @param onResult - Callback that receives the final order result
   * @returns A cleanup function to unsubscribe
   */
  subscribeToOrder(
    jobId: string,
    onResult: (data: OrderResultPayload) => void
  ): () => void {
    const socket = this.connect();

    // Tell the server to put this client in the room for this job
    socket.emit("subscribe-order", { job_id: jobId });

    // Listen for the result
    socket.on("order-result", onResult);

    // Return a cleanup function to remove the listener when done
    return () => {
      socket.off("order-result", onResult);
    };
  }

  /**
   * Subscribes to ALL status updates (Admin Dashboard).
   */
  subscribeToAllStatusUpdates(
    onUpdate: (data: { order_id: string; status: string }) => void
  ): () => void {
    const socket = this.connect();
    socket.on("order-status-updated", onUpdate);
    return () => {
      socket.off("order-status-updated", onUpdate);
    };
  }

  /**
   * Subscribes to NEW order notifications.
   */
  subscribeToNewOrders(
    onCreated: (order: any) => void
  ): () => void {
    const socket = this.connect();
    socket.on("order-created", onCreated);
    return () => {
      socket.off("order-created", onCreated);
    };
  }

  /**
   * Closes the WebSocket connection.
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

// Export singleton
export const socketService = new SocketService();
