import { CreateOrderController } from "@src/@infra/controllers/CreateOrder.controller";
import { Router } from "express";
import { adaptRoute } from "../../adapters/expressRouteAdapter";

export const buildOrderRoutes = (): Router => {
  const orderRouter = Router({ mergeParams: true });

  orderRouter.post("/", adaptRoute(new CreateOrderController()));

  return orderRouter;
};
