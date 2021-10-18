import dotenv from "dotenv";
dotenv.config();
export default {
  TYPE: process.env.NODE_ENV || "development",
};
