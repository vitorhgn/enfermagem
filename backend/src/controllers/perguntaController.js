// controllers/perguntaController.ts
import express from "express";
const { Request, Response } = express;
import { listarPerguntas } from "../services/perguntaService.js";

export async function getPerguntasController(req, res) {
  try {
    const perguntas = await listarPerguntas();
    return res.json(perguntas);
  } catch (error) {
    console.error("Erro ao listar perguntas:", error);
    return res.status(500).json({ message: "Erro ao buscar perguntas" });
  }
}
