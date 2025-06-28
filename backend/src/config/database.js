// src/config/database.js
import dotenv from "dotenv";
dotenv.config();

export const development = {
  host: "srvdb-dev",
  port: "3306",
  username: "aluno39",
  password: "LBEfu0MVZP8=",
  database: "fasiclin",
  dialect: "mysql",
};
