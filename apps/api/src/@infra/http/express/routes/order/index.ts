import { CreateOrderController } from "@src/@infra/controllers/CreateOrder.controller";
import { ReadOrdersByClientController } from "@src/@infra/controllers/ReadOrdersByClient.controller";
import { Router } from "express";
import { adaptRoute } from "../../adapters/expressRouteAdapter";

export const buildOrderRoutes = (): Router => {
  const orderRouter = Router({ mergeParams: true });

  orderRouter.get("/", adaptRoute(new ReadOrdersByClientController()));
  orderRouter.post("/", adaptRoute(new CreateOrderController()));

  return orderRouter;
};
