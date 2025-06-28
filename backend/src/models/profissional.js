import { DataTypes } from "sequelize";
import { development } from "../config/database.js";
import { Sequelize } from "sequelize";
import { sequelize } from "./anamnese.js";
import { PessoaFisica } from "./pessoafis.js";

export const Profissional = sequelize.define(
  "PROFISSIONAL",
  {
    IDPROFISSIO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_PESSOAFIS: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    TIPOPROFI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ID_SUPPROFI: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    STATUSPROFI: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ID_CONSEPROFI: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "PROFISSIONAL",
    timestamps: false,
  }
);

Profissional.belongsTo(PessoaFisica, {
  foreignKey: "ID_PESSOAFIS",
  as: "pessoa",
});
