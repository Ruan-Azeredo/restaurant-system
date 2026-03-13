import { makeExpressApplication } from "@infra/http/express/app";
import dotenv from "dotenv";
import sequelize from "@infra/database/sequelize/connection";
import "@infra/database/sequelize/schemas/clients.sequelize";

dotenv.config();

const PORT = process.env.PORT || 3030;

const app = makeExpressApplication();

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
