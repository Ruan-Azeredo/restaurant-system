import { Worker, Job } from "bullmq";
import { redisConnectionOptions } from "@src/@infra/queue/redisConnection";
import { OrderJobPayload, ORDER_QUEUE_NAME } from "./orderQueue";
import { OrderSequelizeRepository } from "@application/repositories/Order.sequelize";
import { OrderProductSequelizeRepository } from "@application/repositories/OrderProduct.sequelize";
import { InputSequelizeRepository } from "@application/repositories/Input.sequelize";
import { ProductInputSequelizeRepository } from "@application/repositories/ProductInput.sequelize";
import { VerifyIngredientsService } from "@application/services/VerifyIngredients.service";
import { CreateOrderUseCase } from "@application/usecases/order/CreateOrder.usecase";
import { ProductSequelizeRepository } from "@application/repositories/Product.sequelize";
import { getIo } from "@src/@infra/http/socket/socketServer";
import { OrderResponse, OrderProductResponse } from "@application/usecases/order/ReadOrdersByClient.usecase";

const processOrderJob = async (job: Job<OrderJobPayload>) => {
  const { client_id, order_products } = job.data;

  console.log(`[OrderWorker] Processing job ${job.id} for client ${client_id}`);

  const orderRepository = new OrderSequelizeRepository();
  const orderProductRepository = new OrderProductSequelizeRepository();
  const inputRepository = new InputSequelizeRepository();
  const productInputRepository = new ProductInputSequelizeRepository();

  const verifyIngredientsService = new VerifyIngredientsService(
    inputRepository,
    productInputRepository,
  );

  const createOrderUseCase = new CreateOrderUseCase(
    orderRepository,
    orderProductRepository,
    verifyIngredientsService,
  );

  const io = getIo();
  const room = `order:${job.id}`;

  try {
    const result = await createOrderUseCase.execute({
      client_id,
      order_products,
    });

    console.log(
      `[OrderWorker] Job ${job.id} completed. Order ID: ${result.order.id}`,
    );

    io.to(room).emit("order-result", {
      status: "confirm-order",
      order: result.order,
      order_products: result.order_products,
      ingredient_verification: result.ingredient_verification,
    });

    // --- BROADCAST TO ADMINS ---
    try {
      const productRepository = new ProductSequelizeRepository();
      const productIds = result.order_products.map((op) => op.product_id);
      const products = await productRepository.findByIds(productIds);

      const mappedProducts: OrderProductResponse[] = result.order_products.map((op) => {
        const product = products.find((p) => p.id === op.product_id);
        return {
          product_id: op.product_id,
          product_name: product?.name || "Unknown Product",
          product_quantity: op.quantity,
          product_description: product?.description || null,
          product_observation: op.observation,
          product_imgUrl: product?.imgUrl || null,
        };
      });

      const fullOrderResponse: OrderResponse = {
        order_id: result.order.id,
        order_status: result.order.status,
        order_createdAt: result.order.createdAt,
        order_products: mappedProducts,
      };

      io.emit("order-created", fullOrderResponse);
      console.log(`[OrderWorker] Broadcasted order-created for ${result.order.id}`);
    } catch (broadcastError) {
      console.error("[OrderWorker] Failed to broadcast order-created:", broadcastError);
    }
    // ----------------------------

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[OrderWorker] Job ${job.id} FAILED: ${message}`);

    const result = {
      status: "failed",
      reason: message,
      ingredient_verification:
        error instanceof Error &&
        error.cause &&
        Array.isArray(error.cause)
          ? error.cause
          : undefined,
    };

    io.to(room).emit("order-result", result);

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
    },
  );

  worker.on("completed", (job) => {
    console.log(`[OrderWorker] Job ${job.id} marked as completed.`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[OrderWorker] Job ${job?.id} failed with error: ${err.message}`,
    );
  });

  console.log(
    "[OrderWorker] Worker started and listening on queue:",
    ORDER_QUEUE_NAME,
  );

  return worker;
};
