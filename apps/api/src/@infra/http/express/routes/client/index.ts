import { ReadClientController } from "@src/@infra/controllers/ReadClient.controller";
import { Router } from "express";
import { adaptRoute } from "../../adapters/expressRouteAdapter";

export const buildClientsRoutes = (): Router => {
  const clientsRouter = Router({ mergeParams: true });

  clientsRouter.get("/", adaptRoute(new ReadClientController()));

  return clientsRouter;
};
