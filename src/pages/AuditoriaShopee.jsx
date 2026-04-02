// src/pages/AuditoriaShopee.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, FileSpreadsheet, Search } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */

function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] w-full text-[13px] " +
                (props.className || "")
            }
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] w-full text-[13px] " +
                className
            }
        >
            {children}
        </select>
    );
}

/* ================= MOCK ================= */

const mockResultado = {
    q1: { plano: 585341, prefat: 0, dif: 585341, status: "DIVERGENTE" },
    q2: { plano: 0, prefat: 0, dif: 0, status: "OK" },
};

/* =================================================================== */

export default function AuditoriaShopee({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ANO */
    const anoAtual = new Date().getFullYear();
    const [ano, setAno] = useState(anoAtual);

    /* MESES */
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const mesAtual = meses[new Date().getMonth()];
    const [mes, setMes] = useState(mesAtual);

    /* PROCESSO */
    const [processo, setProcesso] = useState("Last Mile XPT");

    /* RESULTADOS */
    const [valores, setValores] = useState(null);

    /* PESQUISAR */
    const pesquisar = () => {
        setTimeout(() => {
            setValores(mockResultado);
        }, 500);
    };

    /* EXPORTAR */
    const exportarExcel = () => {
        alert("Exportação Excel (mock).");
    };

    const handleFechar = () => navigate(-1);

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
            h-[calc(100vh-56px)] flex flex-col
            ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                AUDITORIA TRACKING NUMBER
            </h1>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">

                {/* ===================== CARD 1 ===================== */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Pesquisa
                    </legend>

                    <div className="grid grid-cols-12 gap-2 items-center">

                        {/* ANO */}
                        <Label className="col-span-1">Ano</Label>
                        <Sel className="col-span-2" value={ano} onChange={(e) => setAno(e.target.value)}>
                            <option>{anoAtual - 1}</option>
                            <option>{anoAtual}</option>
                            <option>{anoAtual + 1}</option>
                        </Sel>

                        {/* MÊS */}
                        <Label className="col-span-1 justify-end">Mês</Label>
                        <Sel className="col-span-2" value={mes} onChange={(e) => setMes(e.target.value)}>
                            {meses.map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </Sel>

                        {/* PROCESSO */}
                        <Label className="col-span-1 justify-end">Processo</Label>
                        <Sel className="col-span-3" value={processo} onChange={(e) => setProcesso(e.target.value)}>
                            <option>Last Mile XPT</option>
                            <option>Line Haul XPT</option>
                        </Sel>

                        {/* PESQUISAR */}
                        <div className="col-span-2 flex items-center">
                            <button
                                onClick={pesquisar}
                                className="h-[26px] w-full flex justify-center items-center
                                    border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
                            >
                                <Search size={17} />
                            </button>
                        </div>
                    </div>
                </fieldset>

                {/* ===================== CARD 2 ===================== */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Valores
                    </legend>

                    {/* ========= 1ª QUINZENA ========= */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">

                        <Label className="col-span-2">1ª Quinzena</Label>

                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q1.plano || ""} />
                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q1.prefat || ""} />
                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q1.dif || ""} />
                        <Txt className="col-span-2 bg-gray-200" readOnly value={valores?.q1.status || ""} />

                        {/* ICONE EXCEL */}
                        <div className="col-span-1 flex items-center justify-center">
                            <button
                                onClick={exportarExcel}
                                className="border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 p-1"
                            >
                                <FileSpreadsheet size={18} />
                            </button>
                        </div>
                    </div>

                    {/* ========= 2ª QUINZENA ========= */}
                    <div className="grid grid-cols-12 gap-2 items-center">

                        <Label className="col-span-2">2ª Quinzena</Label>

                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q2.plano || ""} />
                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q2.prefat || ""} />
                        <Txt className="col-span-2 bg-gray-200 text-right" readOnly value={valores?.q2.dif || ""} />
                        <Txt className="col-span-2 bg-gray-200" readOnly value={valores?.q2.status || ""} />

                        {/* ICONE EXCEL */}
                        <div className="col-span-1 flex items-center justify-center">
                            <button
                                onClick={exportarExcel}
                                className="border border-gray-300 rounded bg-gray-100 hover:bg-gray-200 p-1"
                            >
                                <FileSpreadsheet size={18} />
                            </button>
                        </div>
                    </div>

                </fieldset>
            </div>

            {/* ===================== RODAPÉ ===================== */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                {/* FECHAR */}
                <button
                    onClick={handleFechar}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

            </div>
        </div>
    );
}
