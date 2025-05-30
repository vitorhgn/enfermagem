import { DataTypes } from "sequelize";
import { Pergunta } from "./pergunta.js";
import { Anamnese } from "./anamnese.js";
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

export const Resposta = sequelize.define(
  "resposta",
  {
    IDRESPOSTA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PERGUNTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_ANAMNESE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RESPSUBJET: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    RESPOBJET: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "resposta",
    timestamps: false,
  }
);

Resposta.belongsTo(Pergunta, { foreignKey: "ID_PERGUNTA" });
Resposta.belongsTo(Anamnese, { foreignKey: "ID_ANAMNESE" });
