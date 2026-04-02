// src/pages/RelAnaliseProdutividade.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Search, FileSpreadsheet } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= HELPERS PADRÃO ================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"}
        ${className}
      `}
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px] bg-white w-full
        ${className}
      `}
        >
            {children}
        </select>
    );
}

function toISODate(d) {
    // dd/mm/aaaa -> aaaa-mm-dd
    if (!d) return "";
    if (d.includes("-")) return d;
    const [dd, mm, aa] = d.split("/");
    if (!dd || !mm || !aa) return "";
    return `${aa}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

/* ================= TELA ================= */
export default function RelAnaliseProdutividade({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [dados, setDados] = useState({
        // Empresa fixa (apenas 1 opção)
        empresa: "MANTRAN_TEC",

        // Filial
        filial: "999", // 999 = Todas

        // Período Emissão
        dtIni: "2026-01-01",
        dtFim: "2026-01-26",

        recalcularValores: false,
        relFretePeso: false,

        // Agrupar por: E=Emissão | V=Veículo | M=Motorista
        agruparPor: "V",

        // Veículo (filtro): T=Todos | A=Agregado | F=Frota
        veiculo: "T",
    });

    const handleChange = (campo) => (e) =>
        setDados((prev) => ({ ...prev, [campo]: e.target.value }));

    const handleCheck = (campo) => (e) =>
        setDados((prev) => ({ ...prev, [campo]: !!e.target.checked }));

    const limpar = () => {
        setDados({
            empresa: "MANTRAN_TEC",
            filial: "999",
            dtIni: "2026-01-01",
            dtFim: "2026-01-26",
            recalcularValores: false,
            relFretePeso: false,
            agruparPor: "V",
            veiculo: "T",
        });
    };

    const gerar = () => {
        navigate("/relatorios/operacao/analise-produtividade/resultado", {
            state: { filtros: dados },
        });
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                ANÁLISE DE PRODUTIVIDADE
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Opções do Relatório
                    </legend>

                    {/* LINHA 1 - EMPRESA */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Empresa</Label>
                        <Sel className="col-span-10" value={dados.empresa} onChange={handleChange("empresa")}>
                            <option value="MANTRAN_TEC">MANTRAN TECNOLOGIAS LTDA ME</option>
                        </Sel>
                    </div>

                    {/* LINHA 2 - FILIAL */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Filial</Label>
                        <Sel className="col-span-10" value={dados.filial} onChange={handleChange("filial")}>
                            <option value="999">Todas</option>
                            {/* mock pra ficar real no front; quando ligar WebApi vem do banco */}
                            <option value="001">001 - MATRIZ</option>
                            <option value="002">002 - FILIAL 02</option>
                            <option value="003">003 - FILIAL 03</option>
                        </Sel>
                    </div>

                    {/* LINHA 3 - EMISSÃO + CHECKS */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-2">Emissão</Label>

                        <div className="col-span-4 flex items-center gap-2">
                            <Txt
                                type="date"
                                className="w-full"
                                value={toISODate(dados.dtIni)}
                                onChange={handleChange("dtIni")}
                            />
                            <span className="text-[12px] text-gray-500">Até</span>
                            <Txt
                                type="date"
                                className="w-full"
                                value={toISODate(dados.dtFim)}
                                onChange={handleChange("dtFim")}
                            />
                        </div>

                        <div className="col-span-6 flex items-center justify-between gap-4">
                            <label className="flex items-center gap-2 text-[13px] text-gray-700 select-none">
                                <input
                                    type="checkbox"
                                    checked={dados.recalcularValores}
                                    onChange={handleCheck("recalcularValores")}
                                />
                                Recalcular valores
                            </label>

                            <label className="flex items-center gap-2 text-[13px] text-gray-700 select-none">
                                <input
                                    type="checkbox"
                                    checked={dados.relFretePeso}
                                    onChange={handleCheck("relFretePeso")}
                                />
                                Rel. por Frete Peso
                            </label>
                        </div>
                    </div>

                    {/* LINHA 4 - AGRUPAR POR (3 opções) */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Agrupar por</Label>
                        <Sel className="col-span-10" value={dados.agruparPor} onChange={handleChange("agruparPor")}>
                            <option value="E">Emissão</option>
                            <option value="V">Veículo</option>
                            <option value="M">Motorista</option>
                        </Sel>
                    </div>

                    {/* LINHA 5 - VEÍCULO (Filtro: Todos / Agregado / Frota) */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Veículo</Label>
                        <Sel className="col-span-10" value={dados.veiculo} onChange={handleChange("veiculo")}>
                            <option value="T">Todos</option>
                            <option value="A">Agregado</option>
                            <option value="F">Frota</option>
                        </Sel>
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px]
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px]
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={gerar}
                    className={`flex flex-col items-center text-[11px]
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Search size={20} />
                    <span>Gerar</span>
                </button>

                <button
                    className={`flex flex-col items-center text-[11px]
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    title="(posteriormente) exportar direto da tela de filtro"
                >
                    <FileSpreadsheet size={20} />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );
}
