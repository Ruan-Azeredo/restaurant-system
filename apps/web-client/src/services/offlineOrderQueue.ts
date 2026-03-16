import { api } from "./api";
import { toast } from "sonner";

interface QueuedOrder {
  id: string;
  client_id: string;
  order_products: {
    product_id: string;
    quantity: number;
    observation?: string;
  }[];
  timestamp: number;
}

const STORAGE_KEY = "restaurant_system_offline_orders";

type OnSuccessCallback = (jobId: string) => void;

class OfflineOrderQueue {
  private queue: QueuedOrder[] = [];
  private processing = false;
  private onSuccessCallbacks: Set<OnSuccessCallback> = new Set();

  constructor() {
    this.loadQueue();
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        console.log("[OfflineQueue] Network restored. Processing queue...");
        this.processQueue();
      });
    }
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (e) {
      console.error("[OfflineQueue] Failed to load queue", e);
      this.queue = [];
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (e) {
      console.error("[OfflineQueue] Failed to save queue", e);
    }
  }

  addOrder(order: Omit<QueuedOrder, "id" | "timestamp">) {
    const newOrder: QueuedOrder = {
      ...order,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    this.queue.push(newOrder);
    this.saveQueue();
    console.log("[OfflineQueue] Order added to offline queue", newOrder.id);
    toast.info("Order queued. We will retry as soon as you're back online.");
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const ordersToProcess = [...this.queue];
    
    for (const order of ordersToProcess) {
      try {
        const { job_id } = await api.placeOrder({
          client_id: order.client_id,
          order_products: order.order_products,
        });

        // Remove from queue
        this.queue = this.queue.filter((q) => q.id !== order.id);
        this.saveQueue();

        console.log(`[OfflineQueue] Order ${order.id} sent successfully. Job ID: ${job_id}`);
        toast.success("An offline order was just sent successfully!");
        
        // Notify listeners (UI)
        this.onSuccessCallbacks.forEach((cb) => cb(job_id));
      } catch (e) {
        console.warn(`[OfflineQueue] Failed to process order ${order.id}, will retry later`, e);
        // Break loop if it's likely a network issue again
        if (!window.navigator.onLine) break;
      }
    }

    this.processing = false;
  }

  onOrderSent(callback: OnSuccessCallback) {
    this.onSuccessCallbacks.add(callback);
    return () => this.onSuccessCallbacks.delete(callback);
  }

  getQueueLength() {
    return this.queue.length;
  }
}

export const offlineOrderQueue = new OfflineOrderQueue();
