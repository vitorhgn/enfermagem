import express from "express";
import anamneseRoutes from "./routes/anamneseRoutes.js";
import perguntaRoutes from "./routes/perguntaRoutes.js";
import respostaRoutes from "./routes/respostaRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();

app.use(express.json());
app.use("/anamnese", anamneseRoutes);
app.use("/perguntas", perguntaRoutes);
app.use("/respostas", respostaRoutes);
app.use("/pacientes", pacienteRoutes);

export default app;
