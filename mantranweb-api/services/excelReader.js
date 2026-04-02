import Excel from "exceljs";
import {
    atualizarProgresso,
    finalizarJob
} from "./progressoService.js";
import bulkInsert from "./bulkInsertService.js";

export default async function processarPlanilha(
    caminho,
    jobId,
    totalLinhas,
    pool
) {
    const workbook = new Excel.stream.xlsx.WorkbookReader(caminho);
    let lote = [];
    const LOTE_MAX = 5000;

    let linhaAtual = 0;

    for await (const worksheet of workbook) {
        for await (const row of worksheet) {

            // IGNORA CABEÇALHO
            if (row.number === 1) continue;

            lote.push({
                pedido: row.getCell(1).value,
                cidade: row.getCell(2).value,
                valor: row.getCell(3).value,
            });

            linhaAtual++;

            atualizarProgresso(jobId, linhaAtual);

            if (lote.length >= LOTE_MAX) {
                await bulkInsert(pool, lote);
                lote = [];
            }
        }
    }

    if (lote.length > 0) {
        await bulkInsert(pool, lote);
    }

    finalizarJob(jobId);
}
