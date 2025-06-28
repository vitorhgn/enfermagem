import express from "express";
const { Request, Response } = express;
import {
  criarAnamneseService,
  buscarAnamnesePorIdService,
  aprovarAnamneseService,
  reprovarAnamneseService,
  iniciarAnamneseService,
  buscarAnamnesePorPacienteService,
} from "../services/anamneseService.js";
import { Paciente } from "../models/paciente.js";
import { PessoaFisica } from "../models/pessoafis.js";
import { Anamnese } from "../models/anamnese.js";
import { Resposta } from "../models/resposta.js";

export async function criarAnamneseController(req, res) {
  try {
    const { respostas, ...anamneseData } = req.body;
    const anamneseCriada = await criarAnamneseService(anamneseData, respostas);
    return res
      .status(201)
      .json({ message: "Anamnese criada com sucesso!", anamneseCriada });
  } catch (error) {
    console.error("Erro ao criar anamnese:", error);
    return res.status(500).json({ message: "Erro ao criar anamnese." });
  }
}

export async function buscarAnamnesePorIdController(req, res) {
  const { id } = req.params;

  try {
    const resultado = await buscarAnamnesePorIdService(Number(id));
    if (!resultado) {
      return res.status(404).json({ message: "Anamnese não encontrada." });
    }
    return res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar anamnese:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

export async function aprovarAnamneseController(req, res) {
  const { id } = req.params;

  try {
    const result = await aprovarAnamneseService(Number(id));
    return res.json({ message: "Anamnese aprovada com sucesso!", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function reprovarAnamneseController(req, res) {
  const { id } = req.params;
  const { observacoes } = req.body;

  try {
    const result = await reprovarAnamneseService(Number(id), observacoes);
    return res.json({ message: "Anamnese reprovada com sucesso!", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function iniciarAnamneseController(req, res) {
  const { idPaciente } = req.params;

  try {
    const resultado = await iniciarAnamneseService(Number(idPaciente));
    return res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao iniciar anamnese:", error);
    return res.status(500).json({ message: "Erro ao iniciar anamnese." });
  }
}

export async function listarAnamnesesCompletas(req, res) {
  try {
    const pacientes = await Paciente.findAll({
      include: [
        {
          model: PessoaFisica,
          as: "pessoaFisica",
          attributes: ["NOME", "CPF"],
        },
        {
          model: Anamnese,
          as: "anamneses", // pode ser `anamnese` dependendo da relação
          required: false,
        },
      ],
    });

    const lista = pacientes.map((paciente) => {
      const anamnese = paciente.anamneses?.[0];

      return {
        id: paciente.IDPACIENTE,
        nome: paciente.pessoaFisica?.NOME || "Paciente sem nome",
        cpf: paciente.pessoaFisica?.CPF || "Não informado",
        anamnese: anamnese
          ? {
              id: anamnese.IDANAMNESE,
              status: anamnese.STATUSANM,
            }
          : null,
      };
    });

    res.json(lista);
  } catch (error) {
    console.error("Erro ao buscar lista completa:", error);
    res.status(500).json({ error: "Erro ao buscar lista completa" });
  }
}

export async function buscarAnamnesePorPacienteController(req, res) {
  try {
    const { idPaciente } = req.params;
    const result = await buscarAnamnesePorPacienteService(idPaciente);
    if (!result) {
      return res.status(404).json({ erro: "Anamnese não encontrada." });
    }
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar anamnese do paciente." });
  }
}

export async function atualizarAnamneseController(req, res) {
  try {
    const { id } = req.params;
    const { respostas } = req.body;

    const anamnese = await Anamnese.findByPk(id);
    if (!anamnese) return res.status(404).json({ erro: "Não encontrada" });

    // ⚠️ Resetar status para PENDENTE
    anamnese.STATUSANM = "CANCELADO";
    anamnese.OBSERVACOES = null;
    await anamnese.save();

    // Remove respostas anteriores
    await Resposta.destroy({ where: { ID_ANAMNESE: id } });

    // Cria novamente as respostas
    const novas = respostas.map((r) => ({
      ID_ANAMNESE: id,
      ID_PERGUNTA: r.ID_PERGUNTA,
      RESPSUBJET: r.RESPSUBJET || null,
      RESPOBJET: r.RESPOBJET ?? null,
    }));
    await Resposta.bulkCreate(novas);

    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    res.status(500).json({ erro: "Erro ao atualizar anamnese" });
  }
}
