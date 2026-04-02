// src/pages/ExportacaoPlanilhaShopee.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, FileSpreadsheet } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */

function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                className
            }
        >
            {children}
        </select>
    );
}

/* ================= Modal ================= */

function MessageBox({ open, title, message, showCancel = false, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white border border-gray-300 rounded-md w-[380px] shadow-lg">

                <div className="px-3 py-2 bg-gray-100 border-b border-gray-300">
                    <span className="text-[13px] font-semibold">{title}</span>
                </div>

                <div className="px-4 py-3 text-[13px] whitespace-pre-line">
                    {message}
                </div>

                <div className="border-t border-gray-200 px-3 py-2 flex justify-end">
                    <button
                        className="px-3 py-1 text-[12px] rounded border border-red-600 bg-red-600 text-white hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ====================================================================== */

export default function ExportacaoPlanilhaShopee({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== ESTADO DOS CAMPOS ===== */

    const [processo, setProcesso] = useState("LAST MILE XPT");
    const [complementar, setComplementar] = useState(false);
    const [manifesto, setManifesto] = useState(false);

    const [quinzena, setQuinzena] = useState("1ª Quinzena");
    const [mes, setMes] = useState("Janeiro");

    const anoAtual = new Date().getFullYear();
    const [ano, setAno] = useState(anoAtual);

    /* ===== PROGRESSO ===== */

    const [exportando, setExportando] = useState(false);
    const [progress, setProgress] = useState(0);

    /* ===== MODAL ===== */

    const [msg, setMsg] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: () => { }
    });

    const mostrarMensagem = (title, message) => {
        setMsg({
            open: true,
            title,
            message,
            onConfirm: () => setMsg((p) => ({ ...p, open: false }))
        });
    };

    /* ====== Simulação de Exportação ====== */

    useEffect(() => {
        if (!exportando) return;

        let atual = 0;

        const interval = setInterval(() => {
            atual += 3;
            setProgress(atual);

            if (atual >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    mostrarMensagem(
                        "Exportação Finalizada",
                        "Arquivo exportado com sucesso!"
                    );
                    setExportando(false);
                }, 300);
            }
        }, 80);

        return () => clearInterval(interval);
    }, [exportando]);

    /* ===== Função Exportar ===== */

    const handleExportar = () => {
        setProgress(0);
        setExportando(true);
    };

    /* ===== Fechar ===== */

    const handleFechar = () => navigate(-1);

    /* =================================================================== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
                h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >

            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                EXPORTAÇÃO DE PLANILHA SHOPEE
            </h1>

            {/* CONTEÚDO PRINCIPAL */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* CARD PRINCIPAL */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Selecione o Processo
                    </legend>

                    <div className="space-y-2">

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Processo</Label>

                            <Sel className="col-span-4" value={processo} onChange={(e) => setProcesso(e.target.value)}>
                                <option>LAST MILE XPT</option>
                                <option>LINE HAUL XPT</option>
                            </Sel>

                            {/* Complementar */}
                            <label className="col-span-2 flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={complementar}
                                    onChange={(e) => setComplementar(e.target.checked)}
                                />
                                Complementar
                            </label>

                            {/* Manifesto */}
                            <label className="col-span-2 flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={manifesto}
                                    onChange={(e) => setManifesto(e.target.checked)}
                                />
                                Manifesto
                            </label>
                        </div>

                        {/* Linha 2 */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Quinzena</Label>

                            <Sel className="col-span-3" value={quinzena} onChange={(e) => setQuinzena(e.target.value)}>
                                <option>1ª Quinzena</option>
                                <option>2ª Quinzena</option>
                            </Sel>

                            <Label className="col-span-1 justify-end">Mês</Label>

                            <Sel className="col-span-3" value={mes} onChange={(e) => setMes(e.target.value)}>
                                {[
                                    "Janeiro",
                                    "Fevereiro",
                                    "Março",
                                    "Abril",
                                    "Maio",
                                    "Junho",
                                    "Julho",
                                    "Agosto",
                                    "Setembro",
                                    "Outubro",
                                    "Novembro",
                                    "Dezembro"
                                ].map((m) => (
                                    <option key={m}>{m}</option>
                                ))}
                            </Sel>
                        </div>

                        {/* Linha 3 */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Ano</Label>

                            <Sel className="col-span-3" value={ano} onChange={(e) => setAno(e.target.value)}>
                                <option>{anoAtual - 1}</option>
                                <option>{anoAtual}</option>
                                <option>{anoAtual + 1}</option>
                            </Sel>
                        </div>
                    </div>
                </fieldset>

                {/* CARD PROGRESSO */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Exportação
                    </legend>

                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-2">Progresso</Label>

                        <div className="col-span-10">
                            <div className="w-full h-4 border border-gray-300 rounded bg-gray-100 overflow-hidden">
                                <div
                                    className="h-full bg-green-600 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {progress > 0 && (
                                <div className="text-[11px] text-right mt-1">
                                    {progress}%
                                </div>
                            )}
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                {/* FECHAR */}
                <button
                    onClick={handleFechar}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                {/* EXCEL */}
                <button
                    onClick={handleExportar}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <FileSpreadsheet size={20} />
                    <span>Excel</span>
                </button>
            </div>

            {/* MODAL */}
            <MessageBox
                open={msg.open}
                title={msg.title}
                message={msg.message}
                onConfirm={msg.onConfirm}
            />
        </div>
    );
}
