// src/components/AgendaModal.jsx
import { useEffect, useState } from "react";

export default function AgendaModal({
    isOpen,
    onClose,
    onSave,
    initialData = null,
}) {
    // ===== FUNÇÕES AUXILIARES (HORÁRIO LOCAL) ===== //

    function formatLocalDateTime(date) {
        const d = new Date(date);
        const pad = (n) => String(n).padStart(2, "0");
        const year = d.getFullYear();
        const month = pad(d.getMonth() + 1);
        const day = pad(d.getDate());
        const hours = pad(d.getHours());
        const minutes = pad(d.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    // Horário atual em formato datetime-local (LOCAL, não UTC)
    function gerarHorarioAtual() {
        const d = new Date();
        d.setSeconds(0);
        d.setMilliseconds(0);
        return formatLocalDateTime(d);
    }

    // Soma minutos a um datetime-local (tratando como horário local)
    function adicionarMinutos(isoString, minutos) {
        const d = new Date(isoString); // "YYYY-MM-DDTHH:MM" é interpretado como local
        d.setMinutes(d.getMinutes() + minutos);
        return formatLocalDateTime(d);
    }

    // ===== ESTADOS ===== //

    const horarioInicial = initialData?.start || gerarHorarioAtual();
    const horarioFinal =
        initialData?.end || adicionarMinutos(horarioInicial, 30);

    const [form, setForm] = useState({
        titulo: initialData?.titulo || "",
        start: horarioInicial,
        end: horarioFinal,
        tipo: initialData?.tipo || "Geral",
        visibilidade: initialData?.visibilidade || "usuario",
        lembreteMinutosAntes: initialData?.lembreteMinutosAntes ?? 60,
    });

    // Atualiza dados quando abrir o modal ou ao editar evento
    useEffect(() => {
        if (initialData) {
            const ini = initialData.start || gerarHorarioAtual();
            setForm({
                titulo: initialData.titulo || "",
                start: ini,
                end: initialData.end || adicionarMinutos(ini, 30),
                tipo: initialData.tipo || "Geral",
                visibilidade: initialData.visibilidade || "usuario",
                lembreteMinutosAntes: initialData.lembreteMinutosAntes ?? 60,
            });
        } else {
            // Criando novo evento → usa horários automáticos (agora local)
            const ini = gerarHorarioAtual();
            setForm((prev) => ({
                ...prev,
                start: ini,
                end: adicionarMinutos(ini, 30),
            }));
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // ===== HANDLERS ===== //

    function handleChange(e) {
        const { name, value } = e.target;

        // Se usuário alterou o início, ajusta automaticamente o fim (somente em novo evento)
        if (name === "start") {
            setForm((prev) => ({
                ...prev,
                start: value,
                end: adicionarMinutos(value, 30), // sempre atualiza
            }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }

    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.titulo || !form.start) return;
        onSave(form);
    }

    // ===== RENDER ===== //

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-4">
                <h2 className="text-lg font-semibold mb-4 text-red-700">
                    {initialData ? "Editar Evento" : "Novo Evento"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-700">Título</label>
                        <input
                            name="titulo"
                            className="border border-gray-300 rounded w-full h-8 px-2 text-sm"
                            value={form.titulo}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-700">Início</label>
                            <input
                                type="datetime-local"
                                name="start"
                                className="border border-gray-300 rounded w-full h-8 px-2 text-sm"
                                value={form.start}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-700">Fim</label>
                            <input
                                type="datetime-local"
                                name="end"
                                className="border border-gray-300 rounded w-full h-8 px-2 text-sm"
                                value={form.end}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-gray-700">Tipo</label>
                            <select
                                name="tipo"
                                className="border border-gray-300 rounded w-full h-8 px-2 text-sm"
                                value={form.tipo}
                                onChange={handleChange}
                            >
                                <option>Geral</option>
                                <option>Revisão Veículo</option>
                                <option>Licenciamento</option>
                                <option>IPVA</option>
                                <option>CNH Motorista</option>
                                <option>Reunião</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-gray-700">Notificar antes (min)</label>
                            <input
                                type="number"
                                name="lembreteMinutosAntes"
                                className="border border-gray-300 rounded w-full h-8 px-2 text-sm text-right"
                                value={form.lembreteMinutosAntes}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-700 block">Visibilidade</label>
                        <div className="flex gap-4 text-sm mt-1">
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="visibilidade"
                                    value="usuario"
                                    checked={form.visibilidade === "usuario"}
                                    onChange={handleChange}
                                />
                                Só eu
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="visibilidade"
                                    value="grupo"
                                    checked={form.visibilidade === "grupo"}
                                    onChange={handleChange}
                                />
                                Meu grupo
                            </label>
                            <label className="flex items-center gap-1">
                                <input
                                    type="radio"
                                    name="visibilidade"
                                    value="empresa"
                                    checked={form.visibilidade === "empresa"}
                                    onChange={handleChange}
                                />
                                Empresa inteira
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            className="px-3 py-1 rounded text-sm bg-gray-300 text-gray-800"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-3 py-1 rounded text-sm bg-red-700 text-white"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
