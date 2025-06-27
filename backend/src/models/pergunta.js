// models/pergunta.ts
import { DataTypes } from "sequelize";
import { Sequelize } from "sequelize";
import { development } from "../config/database.js";
import { sequelize } from "./anamnese.js";

export const Pergunta = sequelize.define(
  "PERGUNTA",
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
  },
  {
    tableName: "PERGUNTA",
    timestamps: false,
  }
);
