import { Sequelize, Options } from "sequelize";
import configJson from "./config.json";
import dotenv from "dotenv";

dotenv.config();

const env = (process.env.NODE_ENV as keyof typeof configJson) || "development";
const config = configJson[env] as Options;

const sequelize = new Sequelize(config);

export default sequelize;
