// routes/pacienteRoutes.ts
import { Router } from "express";
import { listarPacientesComStatusAnamnese } from "../controllers/pacienteController.js";

const router = Router();

router.get("/", listarPacientesComStatusAnamnese);

export default router;
