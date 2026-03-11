import { Express } from "express";
import cors from "cors";

export const registerCorsExpress = (app: Express) => {
  const CORS_SETTINGS = {
    origin: "*",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders:
      "Origin, Content-Type, Authorization, X-Requested-With, Accept, Restaurant-Request-Id",
    optionsSuccessStatus: 200,
  };

  app.use(cors(CORS_SETTINGS));
};
