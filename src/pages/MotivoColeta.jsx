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

/* ========= Componentes Utilitários ========= */

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
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] 
            text-[13px] w-full ${props.className || ""}`}
        />
    );
}

/* ========= Tela Principal ========= */

export default function MotivoColeta({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* MOCK inicial */
    const mock = [
        { codigo: "001", descricao: "TESTE COLETA" },
        { codigo: "002", descricao: "AGUARDAR CONTATO" },
        { codigo: "003", descricao: "CLIENTE AUSENTE" },
    ];

    const [lista, setLista] = useState(mock);
    const [editIndex, setEditIndex] = useState(null);

    const [dados, setDados] = useState({
        codigo: String(mock.length + 1).padStart(3, "0"),
        descricao: "",
    });

    /* =========== Funções CRUD =========== */

    const limpar = () => {
        setEditIndex(null);

        const novoCodigo = String(lista.length + 1).padStart(3, "0");
        setDados({ codigo: novoCodigo, descricao: "" });
    };

    const incluir = () => {
        if (!dados.descricao.trim()) {
            alert("Informe a descrição!");
            return;
        }

        const novo = {
            codigo: dados.codigo,
            descricao: dados.descricao.toUpperCase(),
        };

        setLista([...lista, novo]);
        limpar();
    };

    const alterar = () => {
        if (editIndex === null) return alert("Selecione um registro!");

        const nova = [...lista];
        nova[editIndex] = {
            ...dados,
            descricao: dados.descricao.toUpperCase(),
        };

        setLista(nova);
        limpar();
    };

    const excluir = () => {
        if (editIndex === null) return alert("Selecione um registro!");

        const nova = lista.filter((_, idx) => idx !== editIndex);
        setLista(nova);
        limpar();
    };

    const selecionar = (item, index) => {
        setEditIndex(index);
        setDados(item);
    };

    /* =========== RENDER =========== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
            bg-gray-50 h-[calc(100vh-56px)] flex flex-col 
            ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >

            {/* ======= TÍTULO ======= */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO DE MOTIVO DA COLETA
            </h1>

            {/* ======= CONTEÚDO ======= */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 
                rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* CARD GERAL */}
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* ---------- CARD 1 – PARÂMETROS ---------- */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Parâmetros
                        </legend>

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">

                            <Label className="col-span-2">Código Classe</Label>
                            <Txt
                                className="col-span-2 bg-gray-200"
                                readOnly
                                value={dados.codigo}
                            />

                            <Label className="col-span-2">Descrição</Label>
                            <Txt
                                className="col-span-6"
                                value={dados.descricao}
                                onChange={(e) =>
                                    setDados({ ...dados, descricao: e.target.value })
                                }
                            />
                        </div>
                    </fieldset>

                    {/* ---------- CARD 2 – GRID ---------- */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Motivos Cadastrados
                        </legend>

                        <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1 w-[120px] text-left">
                                            Código
                                        </th>
                                        <th className="border px-2 py-1 text-left">Descrição</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lista.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => selecionar(item, idx)}
                                            className={`cursor-pointer h-[28px] 
                                            ${editIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
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

            {/* ============= RODAPÉ ============= */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                {/* Fechar */}
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] 
                        ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                {/* Limpar */}
                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px] 
                        ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                {/* Incluir */}
                <button
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] 
                        ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                {/* Alterar */}
                <button
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] 
                        ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                {/* Excluir */}
                <button
                    onClick={excluir}
                    className={`flex flex-col items-center text-[11px] 
                        ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>
        </div>
    );
}
