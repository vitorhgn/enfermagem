// models/paciente.ts
import { DataTypes } from "sequelize";
import { Anamnese, sequelize } from "./anamnese.js";
import { PessoaFisica } from "./pessoafis.js";
import { Sequelize } from "sequelize";
import { development } from "../config/database.js";

export const Paciente = sequelize.define(
  "PACIENTE",
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
    tableName: "PACIENTE",
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
