// models/paciente.ts
import { DataTypes } from "sequelize";
import { Anamnese } from "./anamnese.js";
import { PessoaFisica } from "./pessoafis.js";
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

export const Paciente = sequelize.define(
  "Paciente",
  {
    IDPACIENTE: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PESSOAFIS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    RGPACIENTE: DataTypes.STRING,
    ESTDORGPAC: DataTypes.STRING,
    STATUSPAC: DataTypes.BOOLEAN,
  },
  {
    tableName: "paciente",
    timestamps: false,
  }
);

// Relacionamentos:
Paciente.hasOne(Anamnese, {
  foreignKey: "ID_PACIENTE",
  sourceKey: "IDPACIENTE",
});

Paciente.belongsTo(PessoaFisica, {
  foreignKey: "ID_PESSOAFIS",
  targetKey: "IDPESSOAFIS",
});
