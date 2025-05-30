// controllers/pacienteController.ts
import { Paciente } from "../models/paciente.js";
import { Anamnese } from "../models/anamnese.js";
import { PessoaFisica } from "../models/pessoafis.js";

export async function listarPacientesComStatusAnamnese(req, res) {
  const { userType } = req.query;

  try {
    const pacientes = await Paciente.findAll({
      include: [
        {
          model: Anamnese,
          required: false,
          attributes: ["STATUSANM", "IDANAMNESE"],
        },
        {
          model: PessoaFisica,
          required: true,
          attributes: ["NOMEPESSOA"],
        },
      ],
    });

    const lista = pacientes.map((pac) => {
      const temAnamnese = !!pac.Anamnese;
      const status =
        pac.Anamnese?.STATUSANM === "APROVADO"
          ? "Aprovado"
          : pac.Anamnese?.STATUSANM === "REPROVADO"
          ? "Reprovado"
          : pac.Anamnese?.STATUSANM === "PENDENTE"
          ? "Pendente"
          : "Pendente"; // fallback para estagiário

      return {
        IDPACIENTE: pac.IDPACIENTE,
        RGPACIENTE: pac.RGPACIENTE,
        ESTDORGPAC: pac.ESTDORGPAC,
        NOMEPESSOA: pac.PessoaFisica?.NOMEPESSOA || "Sem nome",
        STATUSANM: status,
        TEM_ANAMNESE: temAnamnese,
        IDANAMNESE: pac.Anamnese?.IDANAMNESE || null,
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
