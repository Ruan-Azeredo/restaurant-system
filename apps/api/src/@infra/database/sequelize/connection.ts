import { Sequelize, Options } from "sequelize";
import dbConfig from "./config";
import dotenv from "dotenv";

dotenv.config();

const env = (process.env.NODE_ENV as keyof typeof dbConfig) || "development";
const config = dbConfig[env] as Options;

const sequelize = new Sequelize(config);

export default sequelize;
