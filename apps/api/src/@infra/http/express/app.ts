import express, { Express } from "express";
import { buildRoutes } from "@infra/http/express/routes/index";
import { registerCorsExpress } from "@infra/http/express/cors";

export const makeExpressApplication = (): Express => {
  const app = express();

  registerCorsExpress(app);

  /**
   * Registering routes.
   */
  app.use(buildRoutes());

  return app;
};

export default { makeExpressApplication };
