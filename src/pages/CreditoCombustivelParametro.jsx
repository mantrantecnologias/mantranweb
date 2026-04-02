import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}
        >
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
        ${readOnly ? "bg-gray-100 text-gray-600" : "bg-white"}
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
        px-2 py-[2px] h-[26px] text-[13px] bg-white
        ${className}
      `}
        >
            {children}
        </select>
    );
}

/* ================= Componente ================= */
export default function CreditoCombustivelParametro({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [modalMsg, setModalMsg] = useState(false);

    const [dados, setDados] = useState({
        empresa: "001 - MANTRAN TRANSPORTES LTDA",
        filial: "001 - TESTE MANTRAN",
        simplesNacional: false,
        faturamento12m: "0,00",
        impostos: "18,00",
        descontoCTRC: "0,00",
        totalCreditos: "0,00",
        saldoDisponivel: "0,00",
    });

    /* ================= Ações ================= */
    const limpar = () => {
        setDados({
            ...dados,
            simplesNacional: false,
            faturamento12m: "",
            impostos: "",
            descontoCTRC: "",
            totalCreditos: "",
            saldoDisponivel: "",
        });
    };

    const assumirAliquota = () => {
        setDados({ ...dados, impostos: "12,00" });
    };

    const incluir = () => setModalMsg(true);
    const alterar = () => setModalMsg(true);
    const excluir = () => setModalMsg(true);

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CRÉDITO DE COMBUSTÍVEL - PARÂMETROS
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* ================= CARD ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros
                    </legend>

                    {/* Linha 1 - Empresa / Filial */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Empresa</Label>
                        <Sel className="col-span-4 w-full" readOnly>
                            <option>{dados.empresa}</option>
                        </Sel>

                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5 w-full" readOnly>
                            <option>{dados.filial}</option>
                        </Sel>
                    </div>

                    {/* Linha 2 - Simples Nacional */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <div className="col-span-10 col-start-3 flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={dados.simplesNacional}
                                onChange={(e) =>
                                    setDados({ ...dados, simplesNacional: e.target.checked })
                                }
                            />
                            <span className="text-[12px]">Empresa optante pelo Simples Nacional</span>
                        </div>
                    </div>

                    {/* Linha 3 - Faturamento 12 meses */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Faturamento Últimos 12 Meses</Label>
                        <Txt
                            className="col-span-4 text-right"
                            value={dados.faturamento12m}
                            onChange={(e) =>
                                setDados({ ...dados, faturamento12m: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 4 - % Impostos */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-2">% Impostos</Label>
                        <Txt
                            className="col-span-2 text-right"
                            value={dados.impostos}
                            onChange={(e) =>
                                setDados({ ...dados, impostos: e.target.value })
                            }
                        />
                        <button
                            onClick={assumirAliquota}
                            className="col-span-2 border border-gray-300 rounded px-2 py-[3px] bg-gray-50 hover:bg-gray-100 text-[12px]"
                        >
                            Assumir Alíquota
                        </button>
                    </div>

                    {/* Linha 5 - % Desconto CTRC */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">% Desconto CTRC</Label>
                        <Txt
                            className="col-span-2 text-right"
                            value={dados.descontoCTRC}
                            onChange={(e) =>
                                setDados({ ...dados, descontoCTRC: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 6 - Valor Total Créditos */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Valor Total dos Créditos</Label>
                        <Txt
                            className="col-span-2 text-right"
                            readOnly
                            value={dados.totalCreditos}
                        />
                    </div>

                    {/* Linha 7 - Saldo Disponível */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-2">Valor Saldo Disponível</Label>
                        <Txt
                            className="col-span-2 text-right"
                            readOnly
                            value={dados.saldoDisponivel}
                        />
                    </div>
                </fieldset>
            </div>

            {/* ================= Rodapé ================= */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={excluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>

            {/* === MODAL SUCESSO PADRÃO === */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Operação realizada com sucesso!
                        </p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
