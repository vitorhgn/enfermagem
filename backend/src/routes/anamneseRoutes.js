import { Router } from "express";
import {
  criarAnamneseController,
  buscarAnamnesePorIdController,
  aprovarAnamneseController,
  reprovarAnamneseController,
  iniciarAnamneseController,
} from "../controllers/anamneseController.js";

const router = Router();

router.get("/anamnese/:id", buscarAnamnesePorIdController);
router.get("/anamnese/iniciar/:idPaciente", iniciarAnamneseController);
router.post("/anamnese", criarAnamneseController);
router.post("/anamnese/:id/aprovar", aprovarAnamneseController);
router.post("/anamnese/:id/reprovar", reprovarAnamneseController);

export default router;
