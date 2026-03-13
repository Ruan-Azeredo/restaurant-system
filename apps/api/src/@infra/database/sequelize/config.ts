import type { Options } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const config: { [configName: string]: Options } = {
  development: {
    dialect: "postgres",
    host: process.env.POSTGRES_HOST || "db",
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    username: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "postgres",
    database: process.env.POSTGRES_DB || "postgres",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
  },
  production: {
    dialect: "sqlite",
    storage: "./database.sqlite3",
  },
};

export default config;
