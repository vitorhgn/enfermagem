// routes/perguntaRoutes.ts
import { Router } from "express";
import { getPerguntasController } from "../controllers/perguntaController.js";

const router = Router();

router.get("/", getPerguntasController);

export default router;
