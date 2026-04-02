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
export default function TrocaCliente({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [dados, setDados] = useState({
        empresa: "001 - MANTRAN TECNOLOGIAS LTDA ME",
        filial: "001 - MANTRAN TECNOLOGIAS LTDA ME",
        serie: "",
        conhecimento: "",
        clienteAtual: "",
        valor: "",
        cnpjNovo: "",
        razaoNovo: "",
    });

    const [modalMsg, setModalMsg] = useState(false);

    /* ===== MOCK: ao informar Série + Conhecimento ===== */
    const carregarCTe = () => {
        if (dados.serie && dados.conhecimento) {
            setDados((prev) => ({
                ...prev,
                clienteAtual: "AUTO CLEAN TRANSPORTES LTDA ME",
                valor: "1.270,81",
            }));
        }
    };

    const limpar = () => {
        setDados({
            empresa: dados.empresa,
            filial: dados.filial,
            serie: "",
            conhecimento: "",
            clienteAtual: "",
            valor: "",
            cnpjNovo: "",
            razaoNovo: "",
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
                TROCAR TOMADOR / PAGADOR DO FRETE
            </h1>

            {/* ================= CONTEÚDO ================= */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Trocar Cliente
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel
                            className="col-span-5"
                            value={dados.empresa}
                            onChange={(e) => setDados({ ...dados, empresa: e.target.value })}
                        >
                            <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                        </Sel>

                        <Label className="col-span-1">Filial</Label>
                        <Sel
                            className="col-span-5"
                            value={dados.filial}
                            onChange={(e) => setDados({ ...dados, filial: e.target.value })}
                        >
                            <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
                        </Sel>
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Série</Label>
                        <Txt
                            className="col-span-1"
                            value={dados.serie}
                            onChange={(e) =>
                                setDados({ ...dados, serie: e.target.value })
                            }
                            onBlur={carregarCTe}
                        />

                        <Label className="col-span-1">Conhecimento</Label>
                        <Txt
                            className="col-span-3"
                            value={dados.conhecimento}
                            onChange={(e) =>
                                setDados({ ...dados, conhecimento: e.target.value })
                            }
                            onBlur={carregarCTe}
                        />
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Cliente</Label>
                        <Txt
                            className="col-span-11"
                            readOnly
                            value={dados.clienteAtual}
                        />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Valor</Label>
                        <Txt
                            className="col-span-3 text-right"
                            readOnly
                            value={dados.valor}
                        />
                    </div>

                    {/* Linha 5 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Cliente Fat.</Label>
                        <Txt
                            className="col-span-3"
                            placeholder="CNPJ"
                            value={dados.cnpjNovo}
                            onChange={(e) =>
                                setDados({ ...dados, cnpjNovo: e.target.value })
                            }
                        />
                        <Txt
                            className="col-span-8"
                            readOnly
                            value={dados.razaoNovo}
                            placeholder="Razão Social"
                        />
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
                            Cliente alterado com sucesso!
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
