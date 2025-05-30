import { Router } from "express";
import {
  criarAnamneseController,
  buscarAnamnesePorIdController,
  aprovarAnamneseController,
  reprovarAnamneseController,
  iniciarAnamneseController,
  buscarAnamnesePorPacienteController,
  atualizarAnamneseController,
} from "../controllers/anamneseController.js";

const router = Router();

router.get("/:id", buscarAnamnesePorIdController);
router.get("/iniciar/:idPaciente", iniciarAnamneseController);
router.get("/paciente/:idPaciente", buscarAnamnesePorPacienteController); // 👈 nova rota
router.post("/", criarAnamneseController);
router.post("/:id/aprovar", aprovarAnamneseController);
router.post("/:id/reprovar", reprovarAnamneseController);
router.put("/:id", atualizarAnamneseController);

export default router;
