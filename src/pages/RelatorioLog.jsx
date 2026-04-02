// src/pages/RelatorioLog.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Search, Printer, FileSpreadsheet } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= HELPERS PADRÃO ================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}>
            {children}
        </label>
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] bg-white w-full ${className}`}
        >
            {children}
        </select>
    );
}

function Txt({ className = "", readOnly = false, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"} ${className}`}
        />
    );
}

/* ================= Mocks ================= */
const usuariosMock = [
    "", "ADMIN", "ALINE", "AMANDA", "BELMAR", "CARLOSCADU",
    "CASSIA", "CRISTIANO", "DAIANA", "DANIEL", "DAVI",
    "FERNANDA", "FILIPE", "GABRIEL", "GUILHERME",
];

const direitosMock = [
    { value: "", label: "Todos" },
    { value: "0001", label: "0001 - Acesso ao Módulo Segurança" },
    { value: "2222", label: "2222 - Acesso a Cadastro Cliente" },
    { value: "7264", label: "7264 - Acesso - Despesas Viagem Frotista" },
    { value: "8003", label: "8003 - Acesso Financeiro" },
    { value: "8005", label: "8005 - Acesso Módulo Operação" },
    { value: "8006", label: "8006 - Acesso Módulo EDI Proceda" },
    { value: "8007", label: "8007 - Acesso Módulo EDI XML" },
    { value: "8008", label: "8008 - Acesso Módulo EDI API" },
    { value: "8009", label: "8009 - Acesso Módulo Oficina" },
    { value: "8010", label: "8010 - Acesso Módulo Fiscal" },
    { value: "8013", label: "8013 - Acesso Módulo Comercial" },
    { value: "8017", label: "8017 - Acesso Módulo Localize Cargas" },
    { value: "8019", label: "8019 - Acesso Módulo Baixa XML" },
];

/* ================= TELA ================= */
export default function RelatorioLog({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [dados, setDados] = useState({
        usuario: "",
        direito: "",
        periodoIni: "",
        periodoFim: "",
    });

    const handleChange = (campo) => (e) =>
        setDados((prev) => ({ ...prev, [campo]: e.target.value }));

    const limpar = () => {
        setDados({ usuario: "", direito: "", periodoIni: "", periodoFim: "" });
    };

    const gerar = () => {
        navigate("/modulo-seguranca/relatorio-log/resultado", {
            state: {
                filtros: dados,
            },
        });
    };

    return (
        <div
            className={`transition-all duration-300 text-[13px] text-gray-700 
      bg-gray-50 flex flex-col
      ${isSeguranca
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                RELATÓRIO DE LOG
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros
                    </legend>

                    {/* LINHA 1 - USUÁRIO */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-1">Usuário</Label>
                        <Sel
                            className="col-span-8"
                            value={dados.usuario}
                            onChange={handleChange("usuario")}
                        >
                            <option value="">(Todos)</option>
                            {usuariosMock.filter(Boolean).map((u) => (
                                <option key={u} value={u}>{u}</option>
                            ))}
                        </Sel>
                    </div>

                    {/* LINHA 2 - DIREITO */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-1">Direito</Label>
                        <Sel
                            className="col-span-8"
                            value={dados.direito}
                            onChange={handleChange("direito")}
                        >
                            {direitosMock.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </Sel>
                    </div>

                    {/* LINHA 3 - PERÍODO */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <Label className="col-span-1">Período</Label>
                        <Txt
                            type="date"
                            className="col-span-3"
                            value={dados.periodoIni}
                            onChange={handleChange("periodoIni")}
                        />
                        <Label className="col-span-1 justify-center">Até</Label>
                        <Txt
                            type="date"
                            className="col-span-3"
                            value={dados.periodoFim}
                            onChange={handleChange("periodoFim")}
                        />
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Fechar"
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Limpar"
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={gerar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Gerar"
                >
                    <Search size={20} />
                    <span>Gerar</span>
                </button>

                <button
                    onClick={gerar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Imprimir"
                >
                    <Printer size={20} />
                    <span>Imprimir</span>
                </button>
            </div>
        </div>
    );
}
