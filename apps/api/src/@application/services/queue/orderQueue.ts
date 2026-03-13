import { Queue } from "bullmq";
import { redisConnectionOptions } from "@src/@infra/queue/redisConnection";

export interface OrderJobPayload {
  client_id: string;
  order_products: {
    product_id: string;
    quantity: number;
    observation?: string;
  }[];
}

export const ORDER_QUEUE_NAME = "orders";

export const orderQueue = new Queue<OrderJobPayload>(ORDER_QUEUE_NAME, {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: 100,  // Keep last 100 completed jobs
    removeOnFail: 200,      // Keep last 200 failed jobs
  },
});

export const enqueueOrder = async (
  payload: OrderJobPayload
): Promise<string> => {
  const job = await orderQueue.add("create-order", payload);
  return job.id!;
};
