import { Router } from "express";
import { getRespostasPorAnamnese } from "../controllers/respostaController.js";

const router = Router();

router.get("/por-anamnese/:id", getRespostasPorAnamnese);

export default router;
