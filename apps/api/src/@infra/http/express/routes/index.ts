import { Router } from "express";
import { buildClientsRoutes } from "@infra/http/express/routes/client";
import { buildProductsRoutes } from "@infra/http/express/routes/product";

export const buildRoutes = (): Router => {
  const rootRouter = Router({ mergeParams: true });

  rootRouter.get("/", (_req, res) => {
    return res.status(200).json({ result: "PONG - Heartbeat received" });
  });

  const v1Route = Router({ mergeParams: true });

  /**
   * Definitions of routes
   */
  v1Route.use("/client", buildClientsRoutes());
  v1Route.use("/product", buildProductsRoutes());

  rootRouter.use("/v1", v1Route);

  return rootRouter;
};
