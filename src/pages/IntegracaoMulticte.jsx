// src/pages/IntegracaoMulticte.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    CheckCircle2,
    Settings,
    PlusCircle,
    Edit,
    Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==========================
   COMPONENTES BÁSICOS
   ========================== */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-700 flex items-center ${className}`}
        >
            {children}
        </label>
    );
}

function Txt({ className = "", ...rest }) {
    return (
        <input
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        />
    );
}

function Sel({ className = "", children, ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

/* ==========================
   HELPERS DATA / HORA
   ========================== */
function formatarData(valor) {
    let v = valor.replace(/\D/g, "");
    if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
    if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
    return v.slice(0, 10);
}

function getDataAtualBR() {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

/* ==========================
   INPUTS INTELIGENTES
   ========================== */

function DateInput({ campo, dados, setDados, className = "" }) {
    const handleFocus = () => {
        if (!dados[campo]) {
            setDados((prev) => ({ ...prev, [campo]: getDataAtualBR() }));
        }
    };

    const handleChange = (e) => {
        const valor = e.target.value;
        setDados((prev) => ({ ...prev, [campo]: formatarData(valor) }));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            setDados((prev) => ({ ...prev, [campo]: "" }));
        }
    };

    return (
        <Txt
            className={className}
            placeholder="dd/mm/aaaa"
            value={dados[campo] || ""}
            onFocus={handleFocus}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
        />
    );
}

/* ==========================
   MODAL PARAMETROS MULTICTE
   ========================== */

function IntegracaoMulticteParametroModal({ isOpen, onClose }) {
    const [form, setForm] = useState({
        token: "",
        url: "",
        bloquearSemViagem: false,
    });

    const [lista, setLista] = useState([
        {
            id: 1,
            token: "fe00341504184f089ce28498acf837e5",
            url: "http://danone.multembarcardor.com.br/SGT.WebService/CTe.svc?wsdl",
            bloquearSemViagem: false,
        },
        {
            id: 2,
            token: "4baa541c30fa47ab25826e.7fb58067ea",
            url: "https://marfrig.multembarcardor.com.br/sgt.webservice/cte.svc?wsdl",
            bloquearSemViagem: false,
        },
    ]);

    const [selecionadoId, setSelecionadoId] = useState(null);
    const [modalMsg, setModalMsg] = useState(false);
    const [msgTexto, setMsgTexto] = useState("");

    const limpar = () => {
        setForm({
            token: "",
            url: "",
            bloquearSemViagem: false,
        });
        setSelecionadoId(null);
    };

    const preencherFormulario = (item) => {
        setForm({
            token: item.token,
            url: item.url,
            bloquearSemViagem: item.bloquearSemViagem,
        });
    };

    const incluir = () => {
        if (!form.token || !form.url) {
            setMsgTexto("Preencha Token e URL Web Service para incluir.");
            setModalMsg(true);
            return;
        }
        const novo = {
            id: lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1,
            token: form.token,
            url: form.url,
            bloquearSemViagem: form.bloquearSemViagem,
        };
        setLista((prev) => [...prev, novo]);
        setMsgTexto("Registro incluído com sucesso!");
        setModalMsg(true);
        limpar();
    };

    const alterar = () => {
        if (!selecionadoId) return;
        setLista((prev) =>
            prev.map((item) =>
                item.id === selecionadoId
                    ? {
                        ...item,
                        token: form.token,
                        url: form.url,
                        bloquearSemViagem: form.bloquearSemViagem,
                    }
                    : item
            )
        );
        setMsgTexto("Registro alterado com sucesso!");
        setModalMsg(true);
    };

    const excluir = () => {
        if (!selecionadoId) return;
        setLista((prev) => prev.filter((i) => i.id !== selecionadoId));
        setMsgTexto("Registro excluído com sucesso!");
        setModalMsg(true);
        limpar();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white w-[900px] max-h-[80vh] rounded shadow-lg border border-gray-300 flex flex-col">
                    {/* Título */}
                    <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                        INTEGRAÇÃO MULTICTE - CADASTRO DE USUÁRIO
                    </h1>

                    {/* Conteúdo */}
                    <div className="p-3 flex-1 flex flex-col gap-3 overflow-y-auto">
                        {/* CARD 1 - PARÂMETROS */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros
                            </legend>

                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Token</Label>
                                <Txt
                                    className="col-span-10"
                                    value={form.token}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, token: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">URL Web Service</Label>
                                <Txt
                                    className="col-span-10"
                                    value={form.url}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, url: e.target.value }))
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2">
                                <div className="col-span-3 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        checked={form.bloquearSemViagem}
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                bloquearSemViagem: e.target.checked,
                                            }))
                                        }
                                    />
                                    <Label>Bloquear CTe sem viagem</Label>
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - GRID */}
                        <fieldset className="border border-gray-300 rounded p-3 flex-1 flex flex-col">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Naveios Cadastradas
                            </legend>

                            <div className="border border-gray-300 rounded overflow-auto flex-1">
                                <table className="min-w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100 border-b border-gray-300 text-gray-700">
                                        <tr>
                                            <th className="px-2 py-1 border-r text-left">Token</th>
                                            <th className="px-2 py-1 text-left">URL Web Service</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((item) => (
                                            <tr
                                                key={item.id}
                                                className={`cursor-pointer ${selecionadoId === item.id
                                                        ? "bg-blue-50"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                                onClick={() => {
                                                    setSelecionadoId(item.id);
                                                    preencherFormulario(item);
                                                }}
                                            >
                                                <td className="border-t border-gray-200 px-2 py-[3px]">
                                                    {item.token}
                                                </td>
                                                <td className="border-t border-gray-200 px-2 py-[3px]">
                                                    {item.url}
                                                </td>
                                            </tr>
                                        ))}

                                        {lista.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={2}
                                                    className="text-center text-gray-500 py-2 border-t border-gray-200"
                                                >
                                                    Nenhum registro cadastrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </div>

                    {/* Rodapé da modal */}
                    <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                        <button
                            onClick={onClose}
                            className="flex flex-col items-center text-[11px] text-gray-700 hover:text-red-700"
                        >
                            <XCircle size={18} />
                            <span>Fechar</span>
                        </button>

                        <button
                            onClick={limpar}
                            className="flex flex-col items-center text-[11px] text-gray-700 hover:text-red-700"
                        >
                            <RotateCcw size={18} />
                            <span>Limpar</span>
                        </button>

                        <button
                            onClick={incluir}
                            className="flex flex-col items-center text-[11px] text-gray-700 hover:text-red-700"
                        >
                            <PlusCircle size={18} />
                            <span>Incluir</span>
                        </button>

                        <button
                            onClick={alterar}
                            className="flex flex-col items-center text-[11px] text-gray-700 hover:text-red-700"
                        >
                            <Edit size={18} />
                            <span>Alterar</span>
                        </button>

                        <button
                            onClick={excluir}
                            className="flex flex-col items-center text-[11px] text-gray-700 hover:text-red-700"
                        >
                            <Trash2 size={18} />
                            <span>Excluir</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL MSG (padrão) */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">{msgTexto}</p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

/* ==========================
   PÁGINA PRINCIPAL
   ========================== */

export default function IntegracaoMulticte({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [filtros, setFiltros] = useState({
        dtIni: "",
        dtFim: "",
        cte: true,
        nfse: false,
    });

    const [log, setLog] = useState("");
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalMsg, setModalMsg] = useState(false);
    const [msgTexto, setMsgTexto] = useState("");
    const [showParametro, setShowParametro] = useState(false);

    const limpar = () => {
        setFiltros({
            dtIni: "",
            dtFim: "",
            cte: true,
            nfse: false,
        });
        setLog("");
    };

    const handleBaixarClick = () => {
        setModalConfirm(true);
    };

    const confirmarBaixa = () => {
        setModalConfirm(false);
        // Simula processamento
        setLog((prev) =>
            prev +
            `[${new Date().toLocaleString()}] Baixa Multicte iniciada para o período ${filtros.dtIni || "N/I"
            } até ${filtros.dtFim || "N/I"}.\n`
        );
        setMsgTexto("Baixa realizada com sucesso!");
        setModalMsg(true);
    };

    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
            >
                {/* TÍTULO */}
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    INTEGRAÇÃO MULTICTE - BAIXA DE CTE
                </h1>

                {/* CONTEÚDO CENTRAL */}
                <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                    <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">
                        {/* CARD 1 - PARÂMETROS */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Informe o período desejado
                            </legend>

                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Período</Label>
                                <DateInput
                                    campo="dtIni"
                                    dados={filtros}
                                    setDados={setFiltros}
                                    className="col-span-2"
                                />
                                <Label className="col-span-1 flex justify-center">Até</Label>
                                <DateInput
                                    campo="dtFim"
                                    dados={filtros}
                                    setDados={setFiltros}
                                    className="col-span-2"
                                />

                                <div className="col-span-2 flex items-center gap-2 ml-4">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        checked={filtros.cte}
                                        onChange={(e) =>
                                            setFiltros((prev) => ({ ...prev, cte: e.target.checked }))
                                        }
                                    />
                                    <Label>CT-e</Label>
                                </div>

                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4"
                                        checked={filtros.nfse}
                                        onChange={(e) =>
                                            setFiltros((prev) => ({ ...prev, nfse: e.target.checked }))
                                        }
                                    />
                                    <Label>NFSe</Label>
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - LOG / RESULTADO */}
                        <fieldset className="border border-gray-300 rounded p-3 flex-1 flex flex-col">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultado da Baixa
                            </legend>

                            <textarea
                                className="border border-gray-300 rounded text-[12px] flex-1 resize-none p-2 font-mono bg-white"
                                value={log}
                                onChange={(e) => setLog(e.target.value)}
                            />
                        </fieldset>
                    </div>
                </div>

                {/* RODAPÉ PADRÃO */}
                <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                    {/* Fechar */}
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    {/* Limpar */}
                    <button
                        onClick={limpar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <RotateCcw size={20} />
                        <span>Limpar</span>
                    </button>

                    {/* Baixar */}
                    <button
                        onClick={handleBaixarClick}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <CheckCircle2 size={20} />
                        <span>Baixar</span>
                    </button>

                    {/* Parâmetro */}
                    <button
                        onClick={() => setShowParametro(true)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Settings size={20} />
                        <span>Parâmetro</span>
                    </button>
                </div>
            </div>

            {/* MODAL CONFIRMAÇÃO BAIXA */}
            {modalConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[340px]">
                        <p className="text-gray-800 font-semibold mb-4 text-[14px]">
                            Confirma a Baixa Multicte no período informado?
                        </p>
                        <div className="flex justify-center gap-4 mt-2">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded text-[13px]"
                                onClick={() => setModalConfirm(false)}
                            >
                                Não
                            </button>
                            <button
                                className="px-4 py-1 bg-red-700 text-white rounded text-[13px]"
                                onClick={confirmarBaixa}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUCESSO BAIXA */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">{msgTexto}</p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL PARAMETRO */}
            <IntegracaoMulticteParametroModal
                isOpen={showParametro}
                onClose={() => setShowParametro(false)}
            />
        </>
    );
}
