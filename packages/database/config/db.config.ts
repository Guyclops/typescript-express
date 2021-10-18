import dotenv from "dotenv";
dotenv.config();

export default {
  database: process.env.DATABASE_DATABASE,
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: "mysql",
  dialectOptions: {
    useUTC: false,
    dateStrings: true,
    typeCast: true,
  },
  port: 3306,
  pool: {
    min: 0,
    max: 20,
    idle: 10000,
  },
  operatorsAliases: false,
  logging: false,
};
