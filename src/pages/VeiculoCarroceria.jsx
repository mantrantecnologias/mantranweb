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

export default function VeiculoCarroceria({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    // ---------------- MOCK
    const mock = [
        { codigo: "01", descricao: "BAU FECHADO" },
        { codigo: "02", descricao: "BAU SIDER" },
        { codigo: "03", descricao: "BAU FRIGORIFICO" },
        { codigo: "04", descricao: "SEM CARROCERIA" },
        { codigo: "05", descricao: "CARR ABERTA" },
        { codigo: "06", descricao: "PORTA CONTAINER" },
        { codigo: "07", descricao: "TRAC/CAV.TRATOR" },
        { codigo: "08", descricao: "BAU PLATAFORMA" },
    ];

    const [lista, setLista] = useState(mock);

    const [dados, setDados] = useState({
        codigo: "",
        descricao: "",
    });

    const [editIndex, setEditIndex] = useState(null);

    // ---------------- Funções CRUD
    const limpar = () => {
        setDados({ codigo: "", descricao: "" });
        setEditIndex(null);
    };

    const incluir = () => {
        if (!dados.codigo || !dados.descricao) {
            alert("Informe todos os campos!");
            return;
        }

        setLista([...lista, dados]);
        limpar();
    };

    const alterar = () => {
        if (editIndex === null) {
            alert("Selecione um registro!");
            return;
        }

        const nova = [...lista];
        nova[editIndex] = dados;
        setLista(nova);
        limpar();
    };

    const excluir = () => {
        if (editIndex === null) {
            alert("Selecione um registro!");
            return;
        }

        setLista(lista.filter((_, i) => i !== editIndex));
        limpar();
    };

    const selecionar = (item, index) => {
        setDados({
            codigo: item.codigo,
            descricao: item.descricao,
        });
        setEditIndex(index);
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO CARROCERIA DE VEÍCULO
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">

                {/* CARD GERAL */}
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* CARD 1 — Parâmetros */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Parâmetros
                        </legend>

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2">Código Carroceria</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.codigo}
                                onChange={(e) => setDados({ ...dados, codigo: e.target.value })}
                            />
                        </div>

                        {/* Linha 2 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2">Nome Carroceria</Label>
                            <Txt
                                className="col-span-6"
                                value={dados.descricao}
                                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                            />
                        </div>
                    </fieldset>

                    {/* CARD 2 — Grid */}
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
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-red-200" : ""
                                                }`}
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
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] 
            ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

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
