// services/perguntaService.ts
import { Pergunta } from "../models/pergunta.js";

export async function listarPerguntas() {
  return await Pergunta.findAll();
}
