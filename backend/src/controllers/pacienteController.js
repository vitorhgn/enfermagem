// controllers/pacienteController.ts
import { Paciente } from "../models/paciente.js";
import { Anamnese, sequelize } from "../models/anamnese.js";
import { PessoaFisica } from "../models/pessoafis.js";

export async function listarPacientesComStatusAnamnese(req, res) {
  const { userType } = req.query;

  try {
    const [pacientes] = await sequelize.query(
      `SELECT 
	      PACIENTE.IDPACIENTE, 
        PACIENTE.ID_PESSOAFIS, 
        PACIENTE.RGPACIENTE, 
        PACIENTE.ESTDORGPAC, 
        PACIENTE.STATUSPAC, 
	      ANAMNESE.STATUSANM, 
        ANAMNESE.IDANAMNESE, 
        PESSOAFI.IDPESSOAFIS, 
        PESSOAFI.NOMEPESSOA 
      FROM PACIENTE 
      LEFT OUTER JOIN ANAMNESE AS ANAMNESE ON PACIENTE.IDPACIENTE = ANAMNESE.ID_PACIENTE 
      INNER JOIN PESSOAFIS AS PESSOAFI ON PACIENTE.ID_PESSOAFIS = PESSOAFI.IDPESSOAFIS`,
    );

    const lista = pacientes.map((pac) => {
      const temAnamnese = !!pac.IDANAMNESE;
      const status =
        pac.STATUSANM === "APROVADO"
          ? "Aprovado"
          : pac.STATUSANM === "REPROVADO"
          ? "Reprovado"
          : pac.STATUSANM === "PENDENTE"
          ? "Pendente"
          : "Pendente"; // fallback para estagiário

          return {
            IDPACIENTE: pac.IDPACIENTE,
            RGPACIENTE: pac.RGPACIENTE,
            ESTDORGPAC: pac.ESTDORGPAC,
            NOMEPESSOA: pac.NOMEPESSOA || "Sem nome",
            STATUSANM: status,
            TEM_ANAMNESE: temAnamnese,
            IDANAMNESE: pac.IDANAMNESE || null,
          };
        });

    const filtrados = lista.filter((pac) => {
      switch (userType) {
        case "estagiario":
          return !pac.TEM_ANAMNESE || pac.STATUSANM === "Reprovado";
        case "supervisor":
          return pac.TEM_ANAMNESE && pac.STATUSANM === "Pendente";
        case "coordenador":
          return pac.TEM_ANAMNESE && pac.STATUSANM === "Aprovado";
        default:
          return false;
      }
    });

    res.json(filtrados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar pacientes" });
  }
}
