import { http, HttpResponse } from "msw";

type Empresa = { id: number; nome: string; cnpj: string };

let db: Empresa[] = [
    { id: 1, nome: "EMPRESA TESTE 1", cnpj: "12345678000190" },
];

function nextId() {
    return db.length ? Math.max(...db.map((x) => x.id)) + 1 : 1;
}

export const empresaHandlers = [
    // LISTAR
    http.get("/api/empresas", () => {
        return HttpResponse.json({ items: db });
    }),

    // CRIAR
    http.post("/api/empresas", async ({ request }) => {
        const body = (await request.json()) as Partial<Empresa>;
        const created: Empresa = {
            id: nextId(),
            nome: String(body.nome || "").trim(),
            cnpj: String(body.cnpj || "").trim(),
        };
        db.push(created);
        return HttpResponse.json(created, { status: 201 });
    }),

    // ATUALIZAR
    http.put("/api/empresas/:id", async ({ params, request }) => {
        const id = Number(params.id);
        const body = (await request.json()) as Partial<Empresa>;
        const idx = db.findIndex((x) => x.id === id);
        if (idx < 0) return new HttpResponse(null, { status: 404 });

        db[idx] = {
            ...db[idx],
            nome: body.nome ?? db[idx].nome,
            cnpj: body.cnpj ?? db[idx].cnpj,
        };
        return HttpResponse.json(db[idx]);
    }),

    // EXCLUIR
    http.delete("/api/empresas/:id", ({ params }) => {
        const id = Number(params.id);
        db = db.filter((x) => x.id !== id);
        return new HttpResponse(null, { status: 204 });
    }),
];
