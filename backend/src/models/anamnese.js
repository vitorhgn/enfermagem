// models/anamnese.ts
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

export const Anamnese = sequelize.define(
  "Anamnese",
  {
    IDANAMNESE: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PACIENTE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_PROFISSIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    DATAANAM: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    NOMERESP: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    CPFRESP: {
      type: DataTypes.CHAR(11),
      allowNull: true,
    },
    AUTVISIB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    STATUSANM: {
      type: DataTypes.ENUM("APROVADO", "REPROVADO", "CANCELADO"),
      allowNull: false,
    },
    STATUSFUNC: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    OBSERVACOES: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "anamnese",
    timestamps: false,
  }
);
