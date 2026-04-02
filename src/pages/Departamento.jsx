// src/pages/Departamento.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, tabIndex, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        />
    );
}

/* ========================= Mocks ========================= */
const departamentosMockBase = [
    { codigo: "001", descricao: "DIRETORIA" },
    { codigo: "002", descricao: "GERENCIAMENTO DE RISCOS" },
    { codigo: "003", descricao: "OPERACIONAL" },
    { codigo: "004", descricao: "FINANCEIRO" },
    { codigo: "005", descricao: "QUALIDADE/MANUTENCAO" },
    { codigo: "006", descricao: "TECNOLOGIA INFO" },
    { codigo: "007", descricao: "GERENTE" },
    { codigo: "008", descricao: "TESTE" },
];

export default function Departamento({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(departamentosMockBase);

    const [dados, setDados] = useState({
        codigo: "",
        descricao: "",
    });

    const [editIndex, setEditIndex] = useState(null);
    const [modalMsg, setModalMsg] = useState(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentTab = parseInt(e.target.getAttribute("tabindex"));
            const nextTab = currentTab + 1;
            const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    const limpar = () => {
        setDados({ codigo: "", descricao: "" });
        setEditIndex(null);
    };

    const incluir = () => {
        if (!dados.codigo || !dados.descricao) {
            setModalMsg({ tipo: "info", texto: "Informe todos os campos!" });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Confirma a Inclusão?",
            onYes: () => {
                setLista([...lista, dados]);
                limpar();
                setModalMsg({ tipo: "sucesso", texto: "Departamento incluído com sucesso!" });
            },
        });
    };

    const alterar = () => {
        if (editIndex === null) {
            setModalMsg({ tipo: "info", texto: "Selecione um registro!" });
            return;
        }
        const nova = [...lista];
        nova[editIndex] = dados;
        setLista(nova);
        limpar();
        setModalMsg({ tipo: "sucesso", texto: "Departamento alterado com sucesso!" });
    };

    const excluir = () => {
        if (editIndex === null) {
            setModalMsg({ tipo: "info", texto: "Selecione um registro!" });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir este departamento?",
            onYes: () => {
                setLista(lista.filter((_, i) => i !== editIndex));
                limpar();
                setModalMsg({ tipo: "sucesso", texto: "Departamento excluído com sucesso!" });
            },
        });
    };

    const selecionar = (item, index) => {
        setDados({ codigo: item.codigo, descricao: item.descricao });
        setEditIndex(index);
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
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO DE DEPARTAMENTO
            </h1>

            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Parâmetros
                        </legend>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2 justify-end">Código Departamento</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.codigo}
                                onChange={(e) => setDados({ ...dados, codigo: e.target.value })}
                                tabIndex={1}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2 justify-end">Nome Departamento</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.descricao}
                                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                                tabIndex={2}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Registros Cadastrados
                        </legend>

                        <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Código</th>
                                        <th className="border px-2 py-1">Descrição</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lista.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => selecionar(item, idx)}
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-orange-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1">{item.codigo}</td>
                                            <td className="border px-2 py-1">{item.descricao}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Rodapé */}
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
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Incluir"
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Alterar"
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={excluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Excluir"
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>

            {/* ModalMsg padrão */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p
                            className={`font-bold mb-4 ${modalMsg.tipo === "sucesso"
                                ? "text-green-700"
                                : modalMsg.tipo === "confirm"
                                    ? "text-gray-800"
                                    : "text-red-700"
                                }`}
                        >
                            {modalMsg.texto}
                        </p>

                        {modalMsg.tipo === "confirm" ? (
                            <div className="flex justify-center gap-2">
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setModalMsg(null)}>
                                    Não
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-700 text-white rounded"
                                    onClick={() => {
                                        const fn = modalMsg.onYes;
                                        setModalMsg(null);
                                        fn?.();
                                    }}
                                >
                                    Sim
                                </button>
                            </div>
                        ) : (
                            <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => setModalMsg(null)}>
                                OK
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
