// models/pergunta.ts
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import { development } from "../config/database.js";

export const sequelize = new Sequelize(
  development.database,
  development.username,
  development.password,
  {
    host: development.host,
    dialect: development.dialect,
  }
);

export const Pergunta = sequelize.define(
  "Pergunta",
  {
    IDPERGUNTA: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    PERGUNTA: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    TIPO: {
      type: DataTypes.ENUM("O", "S", "A"),
      allowNull: false,
    },
    MODULO: {
      type: DataTypes.ENUM("ENF", "FIS", "ODO"),
      allowNull: false,
    },
  },
  {
    tableName: "pergunta",
    timestamps: false,
  }
);
