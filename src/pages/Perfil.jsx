import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Edit } from "lucide-react";
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
            tabIndex={readOnly ? -1 : undefined}
            className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-100 text-gray-600" : "bg-white"}
        ${className}
      `}
        />
    );
}

/* ================= COMPONENTE ================= */
export default function Perfil({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== MOCK DADOS USUÁRIO ===== */
    const [dados, setDados] = useState({
        nome: "Alan Robert",
        email: "alan@mantran.com.br",
        usuario: "Suporte.Mantran",
        senha: "",
        cargo: "Desenvolvedor Sênior",
    });

    const [modalMsg, setModalMsg] = useState(false);

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
                PERFIL
            </h1>

            {/* ================= CONTEÚDO ================= */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Dados do Usuário
                    </legend>

                    {/* Linha 1 - Nome */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Nome</Label>
                        <Txt
                            className="col-span-11"
                            value={dados.nome}
                            onChange={(e) =>
                                setDados({ ...dados, nome: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 2 - Email */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">E-mail</Label>
                        <Txt
                            className="col-span-11"
                            value={dados.email}
                            onChange={(e) =>
                                setDados({ ...dados, email: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 3 - Usuário (não editável) e Senha */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Usuário</Label>
                        <Txt
                            className="col-span-5"
                            readOnly
                            value={dados.usuario}
                        />

                        <Label className="col-span-1">Senha</Label>
                        <Txt
                            type="password"
                            className="col-span-5"
                            value={dados.senha}
                            onChange={(e) =>
                                setDados({ ...dados, senha: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 4 - Cargo */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Cargo</Label>
                        <Txt
                            className="col-span-11"
                            value={dados.cargo}
                            onChange={(e) =>
                                setDados({ ...dados, cargo: e.target.value })
                            }
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
                            Perfil atualizado com sucesso!
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
