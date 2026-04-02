// src/pages/Agenda.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useAgenda } from "../context/AgendaContext";
import AgendaModal from "../components/AgendaModal";
import { useIconColor } from "../context/IconColorContext";
import { XCircle } from "lucide-react";

export default function Agenda({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const { getEventosVisiveis, criarEvento, atualizarEvento, removerEvento } =
        useAgenda();

    const [eventosFC, setEventosFC] = useState([]);
    const [modalAberto, setModalAberto] = useState(false);
    const [eventoEditando, setEventoEditando] = useState(null);
    const [dataPadrao, setDataPadrao] = useState(null);
    const [viewInicial, setViewInicial] = useState("dayGridMonth");

    // helper local
    function formatLocalDateTime(date) {
        const d = new Date(date);
        const pad = (n) => String(n).padStart(2, "0");
        return (
            d.getFullYear() +
            "-" +
            pad(d.getMonth() + 1) +
            "-" +
            pad(d.getDate()) +
            "T" +
            pad(d.getHours()) +
            ":" +
            pad(d.getMinutes())
        );
    }

    // Carregar última visualização
    useEffect(() => {
        const v = localStorage.getItem("agendaView");
        if (v) setViewInicial(v);
    }, []);

    // Atualizar lista de eventos
    useEffect(() => {
        const lista = getEventosVisiveis().map((ev) => ({
            id: ev.id,
            title: ev.titulo,
            start: ev.start,
            end: ev.end || ev.start,
            extendedProps: { ...ev },
        }));
        setEventosFC(lista);
    }, [getEventosVisiveis]);

    // CORRIGIDO → comportamento diferente:
    // DAY e WEEK → usa horário clicado
    // MONTH → usa horário atual
    function handleDateClick(info) {
        let start = "";
        let end = "";

        const tipoView = info.view.type;

        if (tipoView === "timeGridDay" || tipoView === "timeGridWeek") {
            // PEGAR O HORÁRIO QUE O USUÁRIO REALMENTE CLICOU
            start = info.dateStr.slice(0, 16);

            const d = new Date(info.dateStr);
            const dEnd = new Date(d.getTime() + 30 * 60000);
            end = formatLocalDateTime(dEnd);

        } else {
            // MONTH → horário atual
            const agora = new Date();
            agora.setSeconds(0);
            agora.setMilliseconds(0);

            start = formatLocalDateTime(agora);
            const fim = new Date(agora.getTime() + 30 * 60000);
            end = formatLocalDateTime(fim);
        }

        setDataPadrao({ start, end });
        setEventoEditando(null);
        setModalAberto(true);
    }

    function handleEventClick(info) {
        setEventoEditando(info.event.extendedProps);
        setModalAberto(true);
    }

    function handleSalvarEvento(form) {
        if (eventoEditando && eventoEditando.id) {
            atualizarEvento(eventoEditando.id, {
                titulo: form.titulo,
                start: form.start,
                end: form.end,
                tipo: form.tipo,
                visibilidade: form.visibilidade,
                lembreteMinutosAntes: Number(form.lembreteMinutosAntes) || 0,
            });
        } else {
            criarEvento({
                titulo: form.titulo,
                start: form.start || dataPadrao?.start || "",
                end: form.end || dataPadrao?.end || form.start,
                tipo: form.tipo,
                visibilidade: form.visibilidade,
                lembreteMinutosAntes: Number(form.lembreteMinutosAntes) || 0,
            });
        }

        setModalAberto(false);
        setEventoEditando(null);
        setDataPadrao(null);
    }

    return (
        <div
            className={`
                transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
                bg-gray-50 h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}
            `}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                AGENDA / CALENDÁRIO
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col">
                <div className="border border-gray-300 rounded p-3 bg-white">
                    <FullCalendar
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin
                        ]}
                        initialView={viewInicial}
                        locale="pt-br"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        buttonText={{
                            today: "Hoje",
                            month: "Mês",
                            week: "Semana",
                            day: "Dia",
                        }}
                        allDayText="Dia inteiro"
                        height={"calc(100vh - 220px)"}
                        expandRows={true}
                        slotMinTime="00:00:00"
                        slotMaxTime="24:00:00"
                        events={eventosFC}
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        selectable={true}
                        datesSet={(arg) =>
                            localStorage.setItem("agendaView", arg.view.type)
                        }
                    />
                </div>

                {/* MODAL */}
                <AgendaModal
                    isOpen={modalAberto}
                    onClose={() => {
                        setModalAberto(false);
                        setEventoEditando(null);
                        setDataPadrao(null);
                    }}
                    onSave={handleSalvarEvento}
                    initialData={
                        eventoEditando
                            ? eventoEditando
                            : dataPadrao
                                ? { start: dataPadrao.start, end: dataPadrao.end }
                                : null
                    }
                />
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>
            </div>
        </div>
    );
}
