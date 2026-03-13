import { ReadAvailableProductsController } from "@src/@infra/controllers/ReadAvailableProducts.controller";
import { Router } from "express";
import { adaptRoute } from "../../adapters/expressRouteAdapter";

export const buildProductsRoutes = (): Router => {
  const productsRouter = Router({ mergeParams: true });

  productsRouter.get("/available", adaptRoute(new ReadAvailableProductsController()));

  return productsRouter;
};
