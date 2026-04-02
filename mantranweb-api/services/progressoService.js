let progresso = {};

export function iniciarJob(id, totalLinhas) {
    progresso[id] = { total: totalLinhas, atual: 0, status: "Processando" };
}

export function atualizarProgresso(id, atual) {
    if (progresso[id]) progresso[id].atual = atual;
}

export function finalizarJob(id) {
    if (progresso[id]) progresso[id].status = "Concluído";
}

export function obterProgresso(id) {
    return progresso[id] || null;
}
