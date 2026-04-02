// src/pages/LiberacaoNFSE.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, FileSpreadsheet, Search } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */

function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                className
            }
        >
            {children}
        </select>
    );
}

/* ================= MOCKS ================= */

const mockNFSE = [
    {
        cnpj: "50221019000136",
        nome: "HNK-ITU (1) MATRIZ",
        valor: "1.250,00",
        po: "PO-001",
        nfse: "15236",
        status: "Emitida",
        situacao: "Normal",
    },
    {
        cnpj: "40418328000147",
        nome: "A A TRANSPORTES",
        valor: "890,50",
        po: "PO-002",
        nfse: "15237",
        status: "Pendente",
        situacao: "Aguardando Liberação",
    },
];

/* =================================================================== */

export default function LiberacaoNFSE({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ANO */
    const anoAtual = new Date().getFullYear();
    const [ano, setAno] = useState(anoAtual);

    /* MÊS */
    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const mesAtual = meses[new Date().getMonth()];
    const [mes, setMes] = useState(mesAtual);

    const [quinzena, setQuinzena] = useState("1ª Quinzena");
    const [processo, setProcesso] = useState("Last Mile XPT");

    /* GRID */
    const [dados, setDados] = useState([]);

    /* PESQUISAR */
    const pesquisar = () => {
        setTimeout(() => setDados(mockNFSE), 500);
    };

    /* EXPORTAÇÃO */
    const exportarExcel = () => {
        alert("Exportação Excel (mock).");
    };

    /* FECHAR */
    const handleFechar = () => navigate(-1);

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
            h-[calc(100vh-56px)] flex flex-col
            ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                PO DE NOTA FISCAL DE SERVIÇO
            </h1>

            {/* ÁREA PRINCIPAL */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">

                {/* ----------------------- CARD 1 - PARÂMETROS ---------------------- */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros de Pesquisa
                    </legend>

                    <div className="grid grid-cols-12 gap-2 items-center">

                        {/* Ano */}
                        <Label className="col-span-1">Ano</Label>
                        <Sel className="col-span-1" value={ano} onChange={(e) => setAno(e.target.value)}>
                            <option>{anoAtual - 1}</option>
                            <option>{anoAtual}</option>
                            <option>{anoAtual + 1}</option>
                        </Sel>

                        {/* Mês */}
                        <Label className="col-span-1 justify-end">Mês</Label>
                        <Sel className="col-span-2" value={mes} onChange={(e) => setMes(e.target.value)}>
                            {meses.map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </Sel>

                        {/* Quinzena */}
                        <Label className="col-span-1 justify-end">Quinzena</Label>
                        <Sel className="col-span-2" value={quinzena} onChange={(e) => setQuinzena(e.target.value)}>
                            <option>1ª Quinzena</option>
                            <option>2ª Quinzena</option>
                        </Sel>

                        {/* Processo */}
                        <Label className="col-span-1 justify-end">Processo</Label>
                        <Sel className="col-span-2" value={processo} onChange={(e) => setProcesso(e.target.value)}>
                            <option>Last Mile XPT</option>
                            <option>Line Haul XPT</option>
                        </Sel>

                        {/* Botão Pesquisar */}
                        <div className="col-span-1 flex items-center">
                            <button
                                onClick={pesquisar}
                                className="h-[26px] w-full flex justify-center items-center
                                    border border-gray-300 rounded bg-gray-100 hover:bg-gray-200"
                            >
                                <Search size={17} />
                            </button>
                        </div>
                    </div>
                </fieldset>

                {/* ----------------------- CARD 2 - GRID ---------------------- */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white flex-1 flex flex-col">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Notas Fiscais de Serviço
                    </legend>

                    <div className="overflow-auto border border-gray-300 rounded h-full">
                        <table className="min-w-full text-[12px]">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="px-2 py-1 text-left">CNPJ/CPF Tomador</th>
                                    <th className="px-2 py-1 text-left">Nome Tomador</th>
                                    <th className="px-2 py-1 text-left">Valor Doctos</th>
                                    <th className="px-2 py-1 text-left">PO</th>
                                    <th className="px-2 py-1 text-left">Nº NFSe</th>
                                    <th className="px-2 py-1 text-left">Status</th>
                                    <th className="px-2 py-1 text-left">Situação</th>
                                </tr>
                            </thead>

                            <tbody>
                                {dados.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4 text-gray-500">
                                            Nenhum registro encontrado.
                                        </td>
                                    </tr>
                                )}

                                {dados.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-100 border-b">
                                        <td className="px-2 py-1">{item.cnpj}</td>
                                        <td className="px-2 py-1">{item.nome}</td>
                                        <td className="px-2 py-1">{item.valor}</td>
                                        <td className="px-2 py-1">{item.po}</td>
                                        <td className="px-2 py-1">{item.nfse}</td>
                                        <td className="px-2 py-1">{item.status}</td>
                                        <td className="px-2 py-1">{item.situacao}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* ----------------------- RODAPÉ ---------------------- */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                {/* FECHAR */}
                <button
                    onClick={handleFechar}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                {/* EXCEL */}
                <button
                    onClick={exportarExcel}
                    className={`flex flex-col items-center text-[11px] cursor-pointer ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <FileSpreadsheet size={20} />
                    <span>Excel</span>
                </button>
            </div>
        </div>
    );
}
