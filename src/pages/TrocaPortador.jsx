import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Edit } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= HELPERS PADRÃO ================= */
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

/* ================= COMPONENTE ================= */
export default function TrocaPortador({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [dados, setDados] = useState({
        empresa: "001 - ELITE LOG TRANSPORTE",
        tipoFatura: "C",
        faturaInicial: "",
        faturaFinal: "",
        portador: "237 - BRADESCO",
    });

    const [modalMsg, setModalMsg] = useState(false);

    const limpar = () => {
        setDados({
            empresa: "001 - ELITE LOG TRANSPORTE",
            tipoFatura: "C",
            faturaInicial: "",
            faturaFinal: "",
            portador: "",
        });
    };

    const alterar = () => {
        setModalMsg(true);
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* ================= TÍTULO ================= */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                TROCAR PORTADOR
            </h1>

            {/* ================= CONTEÚDO ================= */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Trocar Banco
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel
                            className="col-span-11"
                            value={dados.empresa}
                            onChange={(e) => setDados({ ...dados, empresa: e.target.value })}
                        >
                            <option>001 - ELITE LOG TRANSPORTE</option>
                            <option>002 - MANTRAN TRANSPORTES</option>
                        </Sel>
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Tipo Fatura</Label>
                        <div className="col-span-11 flex items-center gap-6">
                            <label className="flex items-center gap-1 text-[12px]">
                                <input
                                    type="radio"
                                    name="tipoFatura"
                                    checked={dados.tipoFatura === "C"}
                                    onChange={() => setDados({ ...dados, tipoFatura: "C" })}
                                />
                                Correntista
                            </label>
                            <label className="flex items-center gap-1 text-[12px]">
                                <input
                                    type="radio"
                                    name="tipoFatura"
                                    checked={dados.tipoFatura === "E"}
                                    onChange={() => setDados({ ...dados, tipoFatura: "E" })}
                                />
                                Eventual
                            </label>
                        </div>
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Fatura Inicial</Label>
                        <Txt
                            className="col-span-5"
                            value={dados.faturaInicial}
                            onChange={(e) =>
                                setDados({ ...dados, faturaInicial: e.target.value })
                            }
                        />

                        <Label className="col-span-1">Fatura Final</Label>
                        <Txt
                            className="col-span-5"
                            value={dados.faturaFinal}
                            onChange={(e) =>
                                setDados({ ...dados, faturaFinal: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Portador</Label>
                        <Sel
                            className="col-span-11"
                            value={dados.portador}
                            onChange={(e) => setDados({ ...dados, portador: e.target.value })}
                        >
                            <option>237 - BRADESCO</option>
                            <option>001 - BANCO DO BRASIL</option>
                            <option>341 - ITAÚ</option>
                        </Sel>
                    </div>
                </fieldset>
            </div>

            {/* ================= RODAPÉ ================= */}
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
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>
            </div>

            {/* ================= MODAL SUCESSO ================= */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Portador alterado com sucesso!
                        </p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => {
                                setModalMsg(false);
                                navigate(-1);
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
