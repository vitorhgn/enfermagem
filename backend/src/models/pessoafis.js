// models/pessoafis.js
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

export const PessoaFisica = sequelize.define(
  "PessoaFisica",
  {
    IDPESSOAFIS: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PESSOA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CPFPESSOA: {
      type: DataTypes.CHAR(11),
      allowNull: false,
      unique: true,
    },
    NOMEPESSOA: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    DATANASCPES: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    SEXOPESSOA: {
      type: DataTypes.ENUM("M", "F"),
      allowNull: false,
    },
    DATACRIACAO: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pessoafis",
    timestamps: false,
  }
);
