import { Anamnese, sequelize } from "../models/anamnese.js";
import { Resposta } from "../models/resposta.js";
import { Pergunta } from "../models/pergunta.js";
import { Sequelize } from "sequelize";
import { development } from "../config/database.js";

export async function criarAnamneseService(anamneseData, respostas) {
  const transaction = await sequelize.transaction();

  try {
    const novaAnamnese = await Anamnese.create(
      {
        ...anamneseData,
        DATAANAM: new Date(),
      },
      { transaction }
    );

    const respostasFormatadas = respostas.map((res) => ({
      ID_ANAMNESE: novaAnamnese.IDANAMNESE,
      ID_PERGUNTA: res.ID_PERGUNTA,
      RESPSUBJET: res.RESPSUBJET || null,
      RESPOBJET: res.RESPOBJET ?? null,
    }));

    await Resposta.bulkCreate(respostasFormatadas, { transaction });
    await transaction.commit();

    return novaAnamnese;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export async function buscarAnamnesePorIdService(id) {
  const anamnese = await Anamnese.findByPk(id);
  if (!anamnese) return null;

  const respostas = await Resposta.findAll({
    where: { ID_ANAMNESE: id },
    include: [
      {
        model: Pergunta,
        as: "pergunta", // 👈 deve bater com o alias acima
        attributes: ["PERGUNTA", "TIPO"],
      },
    ],
  });

  return {
    ...anamnese.toJSON(),
    respostas: respostas.map((res) => ({
      IDRESPOSTA: res.IDRESPOSTA,
      ID_PERGUNTA: res.ID_PERGUNTA,
      PERGUNTA: res.pergunta?.PERGUNTA,
      TIPO: res.pergunta?.TIPO,
      RESPSUBJET: res.RESPSUBJET,
      RESPOBJET: res.RESPOBJET,
    })),
  };
}

export async function aprovarAnamneseService(id) {
  console.log("Tentando aprovar anamnese ID:", id); // 👈 log
  const anamnese = await Anamnese.findByPk(id);
  if (!anamnese) throw new Error("Anamnese não encontrada.");

  anamnese.STATUSANM = "APROVADO";
  await anamnese.save();

  return anamnese;
}

export async function reprovarAnamneseService(id, observacoes) {
  const anamnese = await Anamnese.findByPk(id);
  if (!anamnese) throw new Error("Anamnese não encontrada.");
  if (!observacoes) throw new Error("Observações obrigatórias.");

  anamnese.STATUSANM = "REPROVADO";
  anamnese.OBSERVACOES = observacoes;
  await anamnese.save();

  return anamnese;
}

export async function iniciarAnamneseService(idPaciente) {
  const ultima = await Anamnese.findOne({
    where: { ID_PACIENTE: idPaciente },
    order: [["DATAANAM", "DESC"]],
  });

  console.log("ULTIMA:", ultima);

  if (!ultima || ultima.STATUSANM === "APROVADO") {
    const nova = await Anamnese.create({
      ID_PACIENTE: idPaciente,
      ID_PROFISSIO: 1, // Fictício
      DATAANAM: new Date(),
      NOMERESP: null,
      CPFRESP: null,
      AUTVISIB: 1,
      STATUSANM: "CANCELADO",
      STATUSFUNC: 1,
      OBSERVACOES: null,
    });

    const perguntas = await Pergunta.findAll({
      order: [["IDPERGUNTA", "ASC"]],
    });

    return {
      nova: true,
      anamnese: nova,
      respostas: perguntas.map((p) => ({
        ID_PERGUNTA: p.IDPERGUNTA,
        PERGUNTA: p.PERGUNTA,
        RESPSUBJET: null,
        RESPOBJET: null,
      })),
    };
  } else {
    const respostas = await Resposta.findAll({
      where: { ID_ANAMNESE: ultima.IDANAMNESE },
      include: [{ model: Pergunta }],
    });

    return {
      nova: false,
      anamnese: ultima,
      respostas: respostas.map((r) => ({
        ID_PERGUNTA: r.ID_PERGUNTA,
        PERGUNTA: r.Pergunta?.PERGUNTA,
        RESPSUBJET: r.RESPSUBJET,
        RESPOBJET: r.RESPOBJET,
      })),
    };
  }
}

export async function buscarAnamnesePorPacienteService(idPaciente) {
  const ultima = await Anamnese.findOne({
    where: { ID_PACIENTE: idPaciente },
    order: [["DATAANAM", "DESC"]],
  });

  if (!ultima) return null;

  const respostas = await Resposta.findAll({
    where: { ID_ANAMNESE: ultima.IDANAMNESE },
    include: [
      {
        model: Pergunta,
        as: "pergunta", // 👈 deve bater com o alias acima
        attributes: ["PERGUNTA", "TIPO"],
      },
    ],
  });

  return {
    ...ultima.toJSON(),
    respostas: respostas.map((r) => ({
      ID_PERGUNTA: r.ID_PERGUNTA,
      PERGUNTA: r.pergunta?.PERGUNTA,
      TIPO: r.pergunta?.TIPO,
      RESPSUBJET: r.RESPSUBJET,
      RESPOBJET: r.RESPOBJET,
    })),
  };
}
