// src/pages/Banco.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight,
    FileText,
    FileSpreadsheet,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ============= Helpers ============= */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-700 flex items-center ${className}`}
        >
            {children}
        </label>
    );
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] " +
                (props.className || "")
            }
        />
    );
}

/* ============= Mock inicial ============= */
const mockBancos = [
    {
        numero: "001",
        razao: "BANCO DO BRASIL S.A.",
        fantasia: "BRASIL",
        carteira: "17",
        nossoNumero: "0000001",
        contaSIGA: "1234",
        remessa: "1",
        convenio: "123456",
        conta: "12345-6",
        retorno: "1",
        nrInicial: "1",
        nrFinal: "999999",
        nrAtual: "120",
        diasProtesto: "5",
    },
    {
        numero: "033",
        razao: "BANCO SANTANDER S.A.",
        fantasia: "SANTANDER",
        carteira: "101",
        nossoNumero: "0000100",
        contaSIGA: "5678",
        remessa: "2",
        convenio: "654321",
        conta: "98765-4",
        retorno: "1",
        nrInicial: "1",
        nrFinal: "999999",
        nrAtual: "80",
        diasProtesto: "3",
    },
];

export default function Banco({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(mockBancos);
    const [selecionado, setSelecionado] = useState(null);

    const [dados, setDados] = useState({
        numero: "",
        razao: "",
        fantasia: "",
        carteira: "",
        nossoNumero: "",
        contaSIGA: "",
        remessa: "",
        convenio: "",
        conta: "",
        retorno: "",
        nrInicial: "",
        nrFinal: "",
        nrAtual: "",
        diasProtesto: "",
    });

    // retráteis
    const [showCompl, setShowCompl] = useState(false);
    const [showNumeracao, setShowNumeracao] = useState(false);

    // modais
    const [modalMsg, setModalMsg] = useState(null);
    const [modalConfirmExclusao, setModalConfirmExclusao] = useState(false);

    /* ============= Handlers ============= */

    const handleChange = (campo) => (e) => {
        const value = e.target.value;
        setDados((prev) => ({ ...prev, [campo]: value }));
    };

    const handleSelecionarLinha = (item, idx) => {
        setSelecionado(idx);
        setDados({ ...item });
    };

    const handleLimpar = () => {
        setDados({
            numero: "",
            razao: "",
            fantasia: "",
            carteira: "",
            nossoNumero: "",
            contaSIGA: "",
            remessa: "",
            convenio: "",
            conta: "",
            retorno: "",
            nrInicial: "",
            nrFinal: "",
            nrAtual: "",
            diasProtesto: "",
        });
        setSelecionado(null);
    };

    const handleIncluir = () => {
        if (!dados.numero || !dados.razao) {
            setModalMsg("Informe Nº Banco e Razão Social.");
            return;
        }

        setLista((prev) => [...prev, { ...dados }]);
        setModalMsg("Banco incluído com sucesso!");
        handleLimpar();
    };

    const handleAlterar = () => {
        if (selecionado === null) {
            setModalMsg("Selecione um banco para alterar.");
            return;
        }

        setLista((prev) =>
            prev.map((item, idx) => (idx === selecionado ? { ...dados } : item))
        );
        setModalMsg("Banco alterado com sucesso!");
    };

    const confirmarExcluir = () => {
        if (selecionado === null) {
            setModalMsg("Selecione um banco para excluir.");
            return;
        }
        setModalConfirmExclusao(true);
    };

    const handleExcluir = () => {
        if (selecionado === null) return;
        setLista((prev) => prev.filter((_, idx) => idx !== selecionado));
        handleLimpar();
        setModalConfirmExclusao(false);
        setModalMsg("Banco excluído com sucesso!");
    };

    /* ============= Render ============= */

    return (
        <div
            className={`
        transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
        h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}
      `}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO - BANCO
            </h1>

            {/* Conteúdo principal */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                {/* Card 1 - Cadastro de Banco */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Cadastro de Banco
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-1 justify-end">Nº Banco</Label>
                        <Txt
                            className="col-span-2"
                            value={dados.numero}
                            onChange={handleChange("numero")}
                        />

                        <Label className="col-span-2 justify-end">Razão Social</Label>
                        <Txt
                            className="col-span-6"
                            value={dados.razao}
                            onChange={handleChange("razao")}
                        />
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <Label className="col-span-1 justify-end">Nome Fantasia</Label>
                        <Txt
                            className="col-span-10"
                            value={dados.fantasia}
                            onChange={handleChange("fantasia")}
                        />
                    </div>
                </fieldset>

                {/* Card 2 - Dados Complementares (retrátil) */}
                <fieldset className="border border-gray-300 rounded bg-white">
                    <legend
                        className="px-2 text-red-700 font-semibold text-[13px] flex items-center gap-1 cursor-pointer select-none"
                        onClick={() => setShowCompl((prev) => !prev)}
                    >
                        {showCompl ? (
                            <ChevronDown size={14} className="mr-1" />
                        ) : (
                            <ChevronRight size={14} className="mr-1" />
                        )}
                        Dados Complementares
                    </legend>

                    {showCompl && (
                        <div className="p-3 pt-1 space-y-2">
                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Nº Carteira</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.carteira}
                                    onChange={handleChange("carteira")}
                                />

                                <Label className="col-span-2 justify-end">Nosso Número</Label>
                                <Txt
                                    className="col-span-3"
                                    value={dados.nossoNumero}
                                    onChange={handleChange("nossoNumero")}
                                />

                                <Label className="col-span-1 justify-end">
                                    Nº Conta SIGA
                                </Label>
                                <Txt
                                    className="col-span-1"
                                    value={dados.contaSIGA}
                                    onChange={handleChange("contaSIGA")}
                                />
                                <Label className="col-span-1 justify-end">Nº Retorno</Label>
                                <Txt
                                    className="col-span-1"
                                    value={dados.retorno}
                                    onChange={handleChange("retorno")}
                                />
                            </div>

                            {/* Linha 2 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Nº Remessa</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.remessa}
                                    onChange={handleChange("remessa")}
                                />

                                <Label className="col-span-2 justify-end">Nº Convênio</Label>
                                <Txt
                                    className="col-span-3"
                                    value={dados.convenio}
                                    onChange={handleChange("convenio")}
                                />

                                {/* Nº Conta + Dígito */}
                                <Label className="col-span-1 justify-end">Nº Conta</Label>

                                {/* Conta */}
                                <Txt
                                    className="col-span-2"
                                    value={dados.conta}
                                    onChange={handleChange("conta")}
                                />

                                {/* Dígito */}
                                <Txt
                                    className="col-span-1"
                                    value={dados.contaDigito || ""}
                                    onChange={handleChange("contaDigito")}
                                />


                            </div>
                        </div>
                    )}
                </fieldset>

                {/* Card 3 - Numeração de Boleto (retrátil) */}
                <fieldset className="border border-gray-300 rounded bg-white">
                    <legend
                        className="px-2 text-red-700 font-semibold text-[13px] flex items-center gap-1 cursor-pointer select-none"
                        onClick={() => setShowNumeracao((prev) => !prev)}
                    >
                        {showNumeracao ? (
                            <ChevronDown size={14} className="mr-1" />
                        ) : (
                            <ChevronRight size={14} className="mr-1" />
                        )}
                        Numeração de Boleto
                    </legend>

                    {showNumeracao && (
                        <div className="p-3 pt-1 space-y-3">
                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Nº Inicial</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.nrInicial}
                                    onChange={handleChange("nrInicial")}
                                />

                                <Label className="col-span-2 justify-end">Nº Final</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.nrFinal}
                                    onChange={handleChange("nrFinal")}
                                />

                                <Label className="col-span-2 justify-end">Nº Atual</Label>
                                <Txt
                                    className="col-span-1"
                                    value={dados.nrAtual}
                                    onChange={handleChange("nrAtual")}
                                />

                                <Label className="col-span-1 justify-end">
                                    Dias Protesto
                                </Label>
                                <Txt
                                    className="col-span-1"
                                    value={dados.diasProtesto}
                                    onChange={handleChange("diasProtesto")}
                                />
                            </div>

                            {/* Botões de ação (Config. Boleto / Cobr-CNAB) */}
                            <div className="flex gap-3 mt-2 justify-end">
                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-[12px] hover:bg-gray-100"
                                >
                                    <FileText size={14} />
                                    Config. Boleto
                                </button>

                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded text-[12px] hover:bg-gray-100"
                                >
                                    <FileSpreadsheet size={14} />
                                    Cobr - CNAB
                                </button>
                            </div>
                        </div>
                    )}
                </fieldset>

                {/* Card 4 - Grid de bancos */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white flex-1 flex flex-col">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Bancos Cadastrados
                    </legend>

                    <div className="border border-gray-200 rounded overflow-y-auto max-h-[320px]">
                        <table className="w-full text-[12px] border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1 text-left w-[80px]">
                                        Banco
                                    </th>
                                    <th className="border px-2 py-1 text-left w-[200px]">
                                        Fantasia
                                    </th>
                                    <th className="border px-2 py-1 text-left">Razão Social</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((banco, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer ${selecionado === idx
                                            ? "bg-green-100"
                                            : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelecionarLinha(banco, idx)}
                                    >
                                        <td className="border px-2 py-[3px]">{banco.numero}</td>
                                        <td className="border px-2 py-[3px]">{banco.fantasia}</td>
                                        <td className="border px-2 py-[3px]">{banco.razao}</td>
                                    </tr>
                                ))}

                                {lista.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={3}
                                            className="border px-2 py-2 text-center text-gray-500"
                                        >
                                            Nenhum banco cadastrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* Rodapé */}
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
                    onClick={handleLimpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                {/* Incluir */}
                <button
                    onClick={handleIncluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                {/* Alterar */}
                <button
                    onClick={handleAlterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                {/* Excluir */}
                <button
                    onClick={confirmarExcluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>

            {/* Modal de sucesso / aviso simples */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[320px]">
                        <p className="text-green-700 font-bold mb-4">{modalMsg}</p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(null)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de confirmação de exclusão */}
            {modalConfirmExclusao && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[320px]">
                        <p className="text-red-700 font-bold mb-4">
                            Deseja realmente excluir este banco?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                                onClick={() => setModalConfirmExclusao(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-3 py-1 bg-red-700 text-white rounded"
                                onClick={handleExcluir}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
