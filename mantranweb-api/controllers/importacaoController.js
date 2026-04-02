import processarPlanilha from "../services/excelReader.js";
import { getPool } from "../config/db.js";
import {
    iniciarJob,
    obterProgresso
} from "../services/progressoService.js";
import fs from "fs";

export async function iniciarImportacao(req, res) {

    const file = req.file;

    if (!file) return res.status(400).json({ erro: "Nenhum arquivo enviado" });

    const jobId = Date.now().toString();

    const totalLinhasEstimado = 150000; // opcional — pode vir do front

    iniciarJob(jobId, totalLinhasEstimado);

    const pool = await getPool();

    processarPlanilha(file.path, jobId, totalLinhasEstimado, pool)
        .then(() => fs.unlinkSync(file.path))
        .catch((err) => console.error(err));

    return res.json({ jobId });
}

export function consultarProgresso(req, res) {
    const progresso = obterProgresso(req.params.id);

    if (!progresso) {
        return res.json({ status: "NÃO ENCONTRADO" });
    }

    return res.json(progresso);
}
