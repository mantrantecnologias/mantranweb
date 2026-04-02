import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getNotificacoes,
    marcarComoLida,
} from "../services/notificacaoService";

import { useNotificacao } from "../context/NotificacaoContext";

export default function NotificacaoDropdown({ modulo }) {
    const navigate = useNavigate();

    // 🔔 Notificações vindas da Agenda
    const {
        notificacoes: notificacoesAgenda,
        marcarComoLido: marcarAgendaComoLida,
    } = useNotificacao();

    const [aberto, setAberto] = useState(false);
    const [notificacoes, setNotificacoes] = useState([]);

    // Carrega notificações (Agenda + Sistema)
    useEffect(() => {
        carregarNotificacoes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modulo, notificacoesAgenda]);

    function carregarNotificacoes() {
        getNotificacoes({
            modulo,
            notificacoesAgenda,
        }).then(setNotificacoes);
    }

    function handleMarcarComoLida(n) {
        // ✔️ Agenda → contexto
        if (n.origem === "agenda") {
            marcarAgendaComoLida(n.id);
            return;
        }

        // ✔️ Sistema → service
        marcarComoLida(n.id, modulo).then(() => {
            carregarNotificacoes();
        });
    }

    const naoLidas = notificacoes.filter((n) => !n.lido);

    return (
        <div className="relative">
            {/* 🔔 ÍCONE DO SININHO */}
            <button
                onClick={() => setAberto(!aberto)}
                className="relative focus:outline-none"
            >
                <Bell size={20} />

                {naoLidas.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {naoLidas.length}
                    </span>
                )}
            </button>

            {/* 📋 DROPDOWN */}
            {aberto && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-lg z-50">
                    <div className="px-3 py-2 border-b text-sm font-semibold text-gray-700">
                        Notificações
                    </div>

                    {notificacoes.length === 0 && (
                        <div className="px-3 py-3 text-sm text-gray-500">
                            Nenhuma notificação no momento.
                        </div>
                    )}

                    <ul className="max-h-80 overflow-auto">
                        {notificacoes.map((n) => (
                            <li
                                key={n.id}
                                className={`px-3 py-2 text-sm border-b ${!n.lido ? "bg-red-50" : ""
                                    }`}
                            >
                                <div className="flex justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">
                                            {n.titulo}
                                        </div>

                                        {n.start && (
                                            <div className="text-xs text-gray-500 mb-1">
                                                {new Date(n.start).toLocaleString()}
                                            </div>
                                        )}

                                        {/* 🔗 SOMENTE PARA AGENDA */}
                                        {n.origem === "agenda" && n.start && (
                                            <button
                                                className="text-xs text-blue-600 hover:underline"
                                                onClick={() => {
                                                    navigate(`/agenda?data=${n.start}`);
                                                    setAberto(false);
                                                }}
                                            >
                                                Ver no calendário
                                            </button>
                                        )}
                                    </div>

                                    {/* ✔️ MARCAR COMO LIDA (CHECK PEQUENO) */}
                                    {!n.lido && (
                                        <button
                                            title="Marcar como lida"
                                            onClick={() => handleMarcarComoLida(n)}
                                            className="
    w-6 h-6
    flex items-center justify-center
    rounded
    bg-green-600
    hover:bg-green-700
    transition
  "
                                        >
                                            <Check size={14} className="text-white" />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
