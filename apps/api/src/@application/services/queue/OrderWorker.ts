import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "@src/@infra/queue/redisConnection";
import { OrderJobPayload, ORDER_QUEUE_NAME } from "./orderQueue";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { OrderProductSequelizeRepository } from "@application/repositories/OrderProduct.sequelize";
import { InputSequelizeRepository } from "@application/repositories/Input.sequelize";
import { ProductInputSequelizeRepository } from "@application/repositories/ProductInput.sequelize";
import { VerifyIngredientsService } from "@application/services/VerifyIngredients.service";
import { CreateOrderUseCase } from "@application/usecases/order/CreateOrder.usecase";

const processOrderJob = async (job: Job<OrderJobPayload>) => {
  const { client_id, order_products } = job.data;

  console.log(`[OrderWorker] Processing job ${job.id} for client ${client_id}`);

  const orderRepository = new OrderSequelizeRepository();
  const orderProductRepository = new OrderProductSequelizeRepository();
  const inputRepository = new InputSequelizeRepository();
  const productInputRepository = new ProductInputSequelizeRepository();

  const verifyIngredientsService = new VerifyIngredientsService(
    inputRepository,
    productInputRepository
  );

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    orderProductRepository,
    verifyIngredientsService
  );

  try {
    const result = await createOrderUseCase.execute({ client_id, order_products });

    console.log(
      `[OrderWorker] Job ${job.id} completed. Order ID: ${result.order.id}`
    );
    console.log(
      `[OrderWorker] Ingredient summary:`,
      JSON.stringify(result.ingredient_verification, null, 2)
    );

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[OrderWorker] Job ${job.id} FAILED: ${message}`);
    throw error; // Re-throw so BullMQ marks the job as failed
  }
};

export const startOrderWorker = () => {
  const worker = new Worker<OrderJobPayload>(
    ORDER_QUEUE_NAME,
    processOrderJob,
    {
      connection: redisConnectionOptions,
      concurrency: 1, // CRITICAL: ensures sequential processing to prevent race conditions
    }
  );

  worker.on("completed", (job) => {
    console.log(`[OrderWorker] Job ${job.id} marked as completed.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[OrderWorker] Job ${job?.id} failed with error: ${err.message}`);
  });

  console.log("[OrderWorker] Worker started and listening on queue:", ORDER_QUEUE_NAME);

  return worker;
};
