import { makeExpressApplication } from "@infra/http/express/app";
import dotenv from "dotenv";
import sequelize from "@infra/database/sequelize/connection";
import { startOrderWorker } from "@application/services/queue/OrderWorker";

// Load all Sequelize schemas so that model associations are registered
import "@infra/database/sequelize/schemas/clients.sequelize";
import "@infra/database/sequelize/schemas/products.sequelize";
import "@infra/database/sequelize/schemas/inputs.sequelize";
import "@infra/database/sequelize/schemas/products-inputs.sequelize";
import "@infra/database/sequelize/schemas/orders.sequelize";
import "@infra/database/sequelize/schemas/order-products.sequelize";

dotenv.config();

const PORT = process.env.PORT || 3030;

const app = makeExpressApplication();

sequelize.sync().then(() => {
  /**
   * Starting order worker to listen out of queue.
   */
  startOrderWorker();

  /**
   * Starting server.
   */
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
