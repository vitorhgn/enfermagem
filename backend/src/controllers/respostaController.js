// src/controllers/respostaController.js
import respostaService from "../services/respostaService.js";

export async function getRespostasPorAnamnese(req, res) {
  const { id } = req.params;
  try {
    const respostas = await respostaService.listarRespostasPorAnamnese(id);
    console.log("RESPOSTAS", respostas);
    const formatadas = respostas.map((res) => ({
      IDRESPOSTA: res.IDRESPOSTA,
      ID_PERGUNTA: res.ID_PERGUNTA,
      PERGUNTA: res.Pergunta?.PERGUNTA,
      RESPSUBJET: res.RESPSUBJET,
      RESPOBJET: res.RESPOBJET,
    }));
    res.json(formatadas);
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    res.status(500).json({ message: "Erro ao buscar respostas." });
  }
}
