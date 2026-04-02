import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VeiculoTabelaLicenciamento from "./VeiculoTabelaLicenciamento";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Search
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */
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

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] 
      text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

/* ================= Componente Principal ================= */
export default function VeiculoClasse({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* === MOCK === */
    const mock = [
        { codigo: "01", descricao: "UTILITARIO", despesa: "0,00", tabela: "1", ref: "0", eixos: "0", capacidade: "0" },
        { codigo: "02", descricao: "VAN", despesa: "0,00", tabela: "1", ref: "0", eixos: "0", capacidade: "0" },
        { codigo: "03", descricao: "3/4", despesa: "0,00", tabela: "2", ref: "0", eixos: "0", capacidade: "0" },
        { codigo: "04", descricao: "TOCO", despesa: "0,00", tabela: "2", ref: "0", eixos: "0", capacidade: "0" }
    ];

    const mockTabelas = [
        { codigo: "1", descricao: "TABELA CARRO-REBOQUE" },
        { codigo: "2", descricao: "TABELA CAMINHAO" },
        { codigo: "3", descricao: "VEICULOS/CARRETA/REB" }
    ];

    const [lista, setLista] = useState(mock);
    const [editIndex, setEditIndex] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [dados, setDados] = useState({
        codigo: "",
        ref: "",
        capacidade: "",
        descricao: "",
        despesa: "",
        tabela: "",
        eixos: ""
    });

    /* ================= Funções ================= */

    const limpar = () => {
        setDados({
            codigo: "",
            ref: "",
            capacidade: "",
            descricao: "",
            despesa: "",
            tabela: "",
            eixos: ""
        });
        setEditIndex(null);
    };

    const incluir = () => {
        if (!dados.descricao) return alert("Informe a descrição da classe!");

        const novoCodigo =
            lista.length > 0
                ? String(Number(lista[lista.length - 1].codigo) + 1).padStart(2, "0")
                : "01";

        setLista([
            ...lista,
            {
                ...dados,
                codigo: novoCodigo
            }
        ]);

        limpar();
    };

    const alterar = () => {
        if (editIndex === null) return alert("Selecione um registro!");

        const nova = [...lista];
        nova[editIndex] = dados;
        setLista(nova);
        limpar();
    };

    const excluir = () => {
        if (editIndex === null) return alert("Selecione um registro!");

        setLista(lista.filter((_, i) => i !== editIndex));
        limpar();
    };

    const selecionar = (item, index) => {
        setDados(item);
        setEditIndex(index);
    };

    /* ================= Render ================= */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO CLASSE DE VEÍCULO
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* CARD GERAL */}
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* CARD 1 */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="text-red-700 px-2 text-[13px] font-semibold">Parâmetros</legend>

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2">Código Classe</Label>
                            <Txt className="col-span-2 bg-gray-200" readOnly value={dados.codigo} />

                            <Label className="col-span-2">Código Referência</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.ref}
                                onChange={(e) => setDados({ ...dados, ref: e.target.value })}
                            />
                        </div>

                        {/* Linha 2 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2">Capacidade Real</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.capacidade}
                                onChange={(e) => setDados({ ...dados, capacidade: e.target.value })}
                            />

                            <Label className="col-span-2">Descrição Classe</Label>
                            <Txt
                                className="col-span-6"
                                value={dados.descricao}
                                onChange={(e) => setDados({ ...dados, descricao: e.target.value })}
                            />
                        </div>

                        {/* Linha 3 */}
                        <div className="grid grid-cols-12 gap-2 mb-2">
                            <Label className="col-span-2">Despesa por KM Rodado</Label>
                            <Txt
                                className="col-span-2 text-center"
                                value={dados.despesa}
                                onChange={(e) => setDados({ ...dados, despesa: e.target.value })}
                            />

                            <Label className="col-span-2">Tabela Licenciamento</Label>
                            <Sel
                                className="col-span-4"
                                value={dados.tabela}
                                onChange={(e) => setDados({ ...dados, tabela: e.target.value })}
                            >
                                <option value=""></option>
                                {mockTabelas.map((t) => (
                                    <option key={t.codigo} value={t.codigo}>
                                        {t.codigo} - {t.descricao}
                                    </option>
                                ))}
                            </Sel>

                            <button
                                onClick={() => setShowModal(true)}
                                className="col-span-1 border border-gray-300 rounded flex items-center justify-center hover:bg-red-100"
                                title="Abrir Tabela de Licenciamento"
                            >
                                <Search size={18} className="text-red-700" />
                            </button>
                        </div>

                        {/* Linha 4 */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Nº Eixos</Label>
                            <Txt
                                className="col-span-2 text-center"
                                value={dados.eixos}
                                onChange={(e) => setDados({ ...dados, eixos: e.target.value })}
                            />
                        </div>
                    </fieldset>

                    {/* CARD 2 - GRID */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 text-[13px] font-semibold">Registros Cadastrados</legend>

                        <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Código</th>
                                        <th className="border px-2 py-1">Descrição</th>
                                        <th className="border px-2 py-1">Valor Despesa/KM</th>
                                        <th className="border px-2 py-1">Tabela Licenciamento</th>
                                        <th className="border px-2 py-1">Código Referência</th>
                                        <th className="border px-2 py-1">Eixos</th>
                                        <th className="border px-2 py-1">Capacidade</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lista.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-red-200" : ""
                                                }`}
                                            onClick={() => selecionar(item, idx)}
                                        >
                                            <td className="border px-2 py-1 text-center">{item.codigo}</td>
                                            <td className="border px-2 py-1">{item.descricao}</td>
                                            <td className="border px-2 py-1 text-center">{item.despesa}</td>
                                            <td className="border px-2 py-1 text-center">{item.tabela}</td>
                                            <td className="border px-2 py-1 text-center">{item.ref}</td>
                                            <td className="border px-2 py-1 text-center">{item.eixos}</td>
                                            <td className="border px-2 py-1 text-center">{item.capacidade}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </fieldset>
                </div>
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

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl w-[95vw] h-[95vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-50">
                                <h2 className="text-red-700 font-semibold text-sm">Tabela de Licenciamento</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-600 hover:text-red-700 font-bold text-xl"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <VeiculoTabelaLicenciamento open={false} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
