import { CreateOrderController } from "@src/@infra/controllers/CreateOrder.controller";
import { ReadOrdersByClientController } from "@src/@infra/controllers/ReadOrdersByClient.controller";
import { ReadAllOrdersController } from "@src/@infra/controllers/ReadAllOrders.controller";
import { UpdateOrderStatusController } from "@src/@infra/controllers/UpdateOrderStatus.controller";
import { Router } from "express";
import { adaptRoute } from "../../adapters/expressRouteAdapter";

export const buildOrderRoutes = (): Router => {
  const orderRouter = Router({ mergeParams: true });

  orderRouter.get("/", adaptRoute(new ReadOrdersByClientController()));
  orderRouter.get("/all", adaptRoute(new ReadAllOrdersController()));
  orderRouter.post("/", adaptRoute(new CreateOrderController()));
  orderRouter.patch("/:id/status", adaptRoute(new UpdateOrderStatusController()));

  return orderRouter;
};
