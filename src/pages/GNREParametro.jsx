import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Save } from "lucide-react";
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
        px-2 py-[2px] h-[26px] text-[13px] bg-white
        ${className}
      `}
        >
            {children}
        </select>
    );
}

/* ================= Componente ================= */
export default function GNREParametro({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [modalMsg, setModalMsg] = useState(false);

    const [dados, setDados] = useState({
        ambiente: "HOMOLOGAÇÃO",
        diasVencimento: 10,
        tipoValor: "11",
        versao: "2.00",
        receita: "100030",
        detalhamento: "86",
        desconto: "10,00",
        convenio: "123 TESTE 456",
    });

    const limpar = () => {
        setDados({
            ambiente: "",
            diasVencimento: "",
            tipoValor: "",
            versao: "",
            receita: "",
            detalhamento: "",
            desconto: "",
            convenio: "",
        });
    };

    const salvar = () => {
        // Aqui entraria PUT/PATCH real
        setModalMsg(true);
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                PARÂMETROS GNRE
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* ================= CARD ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Configurações GNRE
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Ambiente</Label>
                        <Sel
                            className="col-span-4"
                            value={dados.ambiente}
                            onChange={(e) =>
                                setDados({ ...dados, ambiente: e.target.value })
                            }
                        >
                            <option>HOMOLOGAÇÃO</option>
                            <option>PRODUÇÃO</option>
                        </Sel>

                        <Label className="col-span-4">Dias para Vencimento</Label>
                        <Txt
                            type="number"
                            className="col-span-3 text-right"
                            value={dados.diasVencimento}
                            onChange={(e) =>
                                setDados({ ...dados, diasVencimento: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Tipo Valor</Label>
                        <Txt
                            className="col-span-4"
                            value={dados.tipoValor}
                            onChange={(e) =>
                                setDados({ ...dados, tipoValor: e.target.value })
                            }
                        />

                        <Label className="col-span-4">Versão</Label>
                        <Txt
                            className="col-span-3"
                            value={dados.versao}
                            onChange={(e) =>
                                setDados({ ...dados, versao: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Receita</Label>
                        <Txt
                            className="col-span-4"
                            value={dados.receita}
                            onChange={(e) =>
                                setDados({ ...dados, receita: e.target.value })
                            }
                        />

                        <Label className="col-span-4">Detalhamento Receita</Label>
                        <Txt
                            className="col-span-3"
                            value={dados.detalhamento}
                            onChange={(e) =>
                                setDados({ ...dados, detalhamento: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Desconto (%)</Label>
                        <Txt
                            className="col-span-4 text-right"
                            value={dados.desconto}
                            onChange={(e) =>
                                setDados({ ...dados, desconto: e.target.value })
                            }
                        />

                        <Label className="col-span-4">Convênio</Label>
                        <Txt
                            className="col-span-3"
                            value={dados.convenio}
                            onChange={(e) =>
                                setDados({ ...dados, convenio: e.target.value })
                            }
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
                    onClick={salvar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Save size={20} />
                    <span>Salvar</span>
                </button>
            </div>

            {/* === MODAL SUCESSO (PADRÃO) === */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Parâmetros GNRE salvos com sucesso!
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
