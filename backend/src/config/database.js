// src/config/database.js
import dotenv from "dotenv";
dotenv.config();

export const development = {
  username: "root",
  password: "",
  database: "fasiclin",
  host: "127.0.0.1",
  dialect: "mysql",
};
