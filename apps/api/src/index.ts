import { makeExpressApplication } from "@infra/http/express/app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3030;

const app = makeExpressApplication();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
