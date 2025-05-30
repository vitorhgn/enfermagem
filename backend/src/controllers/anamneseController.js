import express from "express";
const { Request, Response } = express;
import {
  criarAnamneseService,
  buscarAnamnesePorIdService,
  aprovarAnamneseService,
  reprovarAnamneseService,
  iniciarAnamneseService,
} from "../services/anamneseService.js";

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
