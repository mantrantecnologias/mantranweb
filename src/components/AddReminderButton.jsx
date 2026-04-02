// src/components/AddReminderButton.jsx
import { useState } from "react";
import { useAgenda } from "../context/AgendaContext";
import AgendaModal from "./AgendaModal";

export default function AddReminderButton({
    tituloPadrao,
    tipoPadrao = "Geral",
    origem = null,
    referenciaId = null,
    className = "",
}) {
    const { criarEvento } = useAgenda();
    const [abrir, setAbrir] = useState(false);

    function handleSave(form) {
        criarEvento({
            titulo: form.titulo || tituloPadrao,
            start: form.start,
            end: form.end || form.start,
            tipo: form.tipo || tipoPadrao,
            visibilidade: form.visibilidade,
            lembreteMinutosAntes: Number(form.lembreteMinutosAntes) || 60,
            origem,
            referenciaId,
        });
        setAbrir(false);
    }

    return (
        <>
            <button
                type="button"
                className={
                    "px-3 py-1 text-sm rounded bg-red-700 text-white hover:bg-red-800 " +
                    className
                }
                onClick={() => setAbrir(true)}
            >
                + Adicionar Lembrete
            </button>

            <AgendaModal
                isOpen={abrir}
                onClose={() => setAbrir(false)}
                onSave={handleSave}
                initialData={{
                    titulo: tituloPadrao || "",
                    tipo: tipoPadrao,
                }}
            />
        </>
    );
}
