import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==== COMPONENTES BÁSICOS ==== */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] flex items-center text-gray-700 ${className}`}>
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

function Sel({ className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        />
    );
}

export default function VeiculoTabelaLicenciamento({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ==== MOCK ==== */
    const mock = [
        {
            tabela: "1",
            descricao: "TABELA CARRO-REBOQUE",
            meses: ["12", "04", "05", "06", "07", "10", "11", "11", "11", "12"]
        },
        {
            tabela: "2",
            descricao: "TABELA CAMINHAO",
            meses: ["12", "09", "09", "10", "10", "10", "11", "11", "11", "12"]
        },
        {
            tabela: "3",
            descricao: "VEICULOS/CARRETA/REB",
            meses: ["12", "04", "05", "06", "07", "10", "11", "11", "11", "12"]
        }
    ];

    const [lista, setLista] = useState(mock);

    const [dados, setDados] = useState({
        tabela: "",
        descricao: "",
        meses: Array(10).fill("")
    });

    const [editIndex, setEditIndex] = useState(null);

    /* ==== HANDLERS ==== */
    const limpar = () => {
        setDados({
            tabela: "",
            descricao: "",
            meses: Array(10).fill("")
        });
        setEditIndex(null);
    };

    const incluir = () => {
        if (!dados.tabela || !dados.descricao) {
            alert("Informe o Nº Tabela e a Descrição");
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
            tabela: item.tabela,
            descricao: item.descricao,
            meses: item.meses
        });
        setEditIndex(index);
    };

    const alteraMes = (i, valor) => {
        const copia = [...dados.meses];
        copia[i] = valor;
        setDados({ ...dados, meses: copia });
    };

    /* ==== RENDER ==== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO TABELA DE LICENCIAMENTO
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* CARD GERAL */}
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* ==== CARD 1 ==== */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="text-red-700 text-[13px] px-2 font-semibold">
                            Parâmetros
                        </legend>

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2 mb-3">
                            <Label className="col-span-1">Nº Tabela</Label>
                            <Txt
                                className="col-span-1"
                                value={dados.tabela}
                                onChange={(e) => setDados({ ...dados, tabela: e.target.value })}
                            />

                            <Label className="col-span-1 col-start-4">Descrição</Label>
                            <Txt
                                className="col-span-8"
                                value={dados.descricao}
                                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                            />
                        </div>

                        {/* Sub-Card Finais de Placa */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="text-red-700 text-[13px] px-2">
                                Mês de Licenciamento
                            </legend>

                            <div className="grid grid-cols-12 gap-2">

                                {[
                                    [0, 5],
                                    [1, 6],
                                    [2, 7],
                                    [3, 8],
                                    [4, 9]
                                ].map(([f1, f2], i) => (
                                    <div key={i} className="col-span-12 grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Placa com Final {f1}</Label>
                                        <Txt
                                            className="col-span-1 text-center"
                                            value={dados.meses[f1]}
                                            onChange={(e) => alteraMes(f1, e.target.value)}
                                        />

                                        <Label className="col-span-2">Placa com Final {f2}</Label>
                                        <Txt
                                            className="col-span-1 text-center"
                                            value={dados.meses[f2]}
                                            onChange={(e) => alteraMes(f2, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    </fieldset>

                    {/* ==== CARD 2 – GRID ==== */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="text-red-700 px-2 text-[13px] font-semibold">
                            Registros Cadastrados
                        </legend>

                        <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Tabela</th>
                                        <th className="border px-2 py-1">Descrição</th>
                                        {[...Array(10)].map((_, i) => (
                                            <th key={i} className="border px-2 py-1">
                                                Mês-Final {i}
                                            </th>
                                        ))}
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
                                            <td className="border px-2 py-1">{item.tabela}</td>
                                            <td className="border px-2 py-1">{item.descricao}</td>
                                            {item.meses.map((m, i) => (
                                                <td key={i} className="border px-2 py-1 text-center">
                                                    {m}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* ==== RODAPÉ ==== */}
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
        </div>
    );
}
