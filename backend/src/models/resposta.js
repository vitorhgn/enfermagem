import { DataTypes } from "sequelize";
import { Pergunta } from "./pergunta.js";
import { Anamnese, sequelize } from "./anamnese.js";
import { Sequelize } from "sequelize";
import { development } from "../config/database.js";

export const Resposta = sequelize.define(
  "RESPOSTA",
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
    tableName: "RESPOSTA",
    timestamps: false,
  }
);

Resposta.belongsTo(Pergunta, { foreignKey: "ID_PERGUNTA", as: "pergunta" });
Resposta.belongsTo(Anamnese, { foreignKey: "ID_ANAMNESE" });
