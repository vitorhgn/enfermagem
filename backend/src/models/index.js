// src/models/index.js
import Sequelize from "sequelize";
import path from "path";
import { fileURLToPath } from "url";
import { Anamnese, sequelize } from "./anamnese.js";
import { Resposta } from "./resposta.js";
import { Pergunta } from "./pergunta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialize os modelos já definidos
Anamnese.sequelize = sequelize;
Resposta.sequelize = sequelize;
Pergunta.sequelize = sequelize;

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Anamnese = Anamnese;
db.Resposta = Resposta;
db.Pergunta = Pergunta;

// Relacionamentos
db.Anamnese.hasMany(db.Resposta, { foreignKey: "ID_ANAMNESE" });
db.Resposta.belongsTo(db.Anamnese, { foreignKey: "ID_ANAMNESE" });

db.Pergunta.hasMany(db.Resposta, { foreignKey: "ID_PERGUNTA" });
db.Resposta.belongsTo(db.Pergunta, { foreignKey: "ID_PERGUNTA" });

export default db;
