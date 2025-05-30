// src/services/respostaService.js
import db from "../models/index.js";
const { Resposta, Pergunta } = db;

async function listarRespostasPorAnamnese(idAnamnese) {
  return await Resposta.findAll({
    where: { ID_ANAMNESE: idAnamnese },
    include: [{ model: Pergunta, attributes: ["PERGUNTA"] }],
  });
}

async function criarRespostas(respostas, idAnamnese) {
  const formatadas = respostas.map((res) => ({
    ID_PERGUNTA: res.ID_PERGUNTA,
    ID_ANAMNESE: idAnamnese,
    RESPSUBJET: res.RESPSUBJET || null,
    RESPOBJET: res.RESPOBJET ?? null,
  }));
  return await Resposta.bulkCreate(formatadas);
}

export default {
  listarRespostasPorAnamnese,
  criarRespostas,
};
