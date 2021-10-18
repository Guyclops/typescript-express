import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/User.model";

const database = new Sequelize({
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: "mysql",
  dialectOptions: {
    // useUTC: false,
    // dateStrings: true,
    // typeCast: true,
  },
  // timezone: "+00:00",
  port: 3306,
  pool: {
    min: 0,
    max: 20,
    idle: 10000,
  },
  // operatorsAliases: false,
  logging: process.env.NODE_ENV === "production" ? false : console.log,
  models: [__dirname + "/models"],
});

export { database, User };
