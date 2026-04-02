// src/pages/VeiculoIPVA.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    FileText,
    RotateCcw as UndoIcon,
    Search,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* =============== Helpers =============== */
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
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                (props.className || "")
            }
        />
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

/* =============== Mocks =============== */
const mockVeiculo = {
    codigo: "0000004",
    placaDescricao: "AAV2417 - SCANIA - UTILITARIO - CUBATAO",
    modelo: "AAV2417",
    cidade: "CUBATAO",
    uf: "SP",
};

const mockParcelasBase = [
    {
        tipoPagamento: "Cota Única SEM Desconto",
        dataVencto: "2025-02-21",
        valorParcela: 1000.0,
        dataPagto: "",
        valorPago: 0,
    },
    {
        tipoPagamento: "Cota Única COM Desconto",
        dataVencto: "2025-01-21",
        valorParcela: 960.0,
        dataPagto: "",
        valorPago: 0,
    },
    {
        tipoPagamento: "1ª Parcela",
        dataVencto: "2025-01-21",
        valorParcela: 200.0,
        dataPagto: "",
        valorPago: 0,
    },
    {
        tipoPagamento: "2ª Parcela",
        dataVencto: "2025-02-21",
        valorParcela: 200.0,
        dataPagto: "",
        valorPago: 0,
    },
];

const mockConsulta = [
    {
        veiculoDescricao: "ABH3806 / SCANIA",
        ano: "2025",
        codigoVeiculo: "0000005",
        tituloCP: "0000005124742",
        tipoPagamento: "CD",
    },
    {
        veiculoDescricao: "AFQ3856 / SCANIA",
        ano: "2026",
        codigoVeiculo: "0000034",
        tituloCP: "0000034174634",
        tipoPagamento: "PC",
    },
    {
        veiculoDescricao: "FGQ3Q2 / CAVALO TRUCADO",
        ano: "2025",
        codigoVeiculo: "0003441",
        tituloCP: "0003441105122",
        tipoPagamento: "PC",
    },
];

const mockCategorias = ["1 - IMPOSTOS SOBRE VENDAS", "2 - DESPESAS OPERACIONAIS"];
const mockSubCategorias = ["1 - ICMS", "2 - ICMS ANTECIPADO", "3 - OUTROS"];
const mockContas = [
    "502879-9 - BANCO DO BRASIL",
    "12345-0 - CAIXA ECONÔMICA",
    "98765-4 - ITAÚ",
];

/* =============== Modal Gerar CP =============== */
function ModalGerarCP({ onClose }) {
    const [showSucesso, setShowSucesso] = useState(false);

    const [form, setForm] = useState({
        creditoCnpj: "00000000000000",
        creditoNome: "ALAN ROBERT",
        numeroTitulo: "360760212424",
        numeroParcela: "1",
        qtParcela: "1",
        valorPagar: "100,00",
        dtVencto: "2026-01-01",
        categoria: mockCategorias[0],
        subCategoria: mockSubCategorias[1],
        observacao: "",
        dtPagto: "2026-01-01",
        conta: mockContas[0],
        banco: "001",
        agencia: "0929-6",
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleGerar = () => {
        // Mock: apenas mostra modal de sucesso
        setShowSucesso(true);
    };

    const fecharSucesso = () => {
        setShowSucesso(false);
        onClose(); // Fecha modal principal também
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[1000px] rounded-md shadow-lg border border-gray-300">
                    <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                        IPVA - GERAR CONTAS A PAGAR
                    </h2>

                    <div className="p-3 space-y-3">
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 text-[13px]">
                                Dados para Contas a Pagar
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">A Crédito de</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={form.creditoCnpj}
                                        onChange={handleChange("creditoCnpj")}
                                    />
                                    <Txt
                                        className="col-span-8 bg-gray-200"
                                        readOnly
                                        value={form.creditoNome}
                                    />
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Nº Título</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={form.numeroTitulo}
                                        onChange={handleChange("numeroTitulo")}
                                    />

                                    <Label className="col-span-1">Nº Parcela</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.numeroParcela}
                                    />

                                    <Label className="col-span-1">QT Parcela</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.qtParcela}
                                    />

                                    <Label className="col-span-1">Valor a pagar</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200 text-right"
                                        readOnly
                                        value={form.valorPagar}
                                    />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">DT Vencto.</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={form.dtVencto}
                                        onChange={handleChange("dtVencto")}
                                    />

                                    <Label className="col-span-1">Categoria</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.categoria}
                                        onChange={handleChange("categoria")}
                                    >
                                        {mockCategorias.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1">Sub Categoria</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.subCategoria}
                                        onChange={handleChange("subCategoria")}
                                    >
                                        {mockSubCategorias.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>
                                </div>

                                {/* Linha 4 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Observação</Label>
                                    <Txt
                                        className="col-span-10"
                                        value={form.observacao}
                                        onChange={handleChange("observacao")}
                                    />
                                </div>

                                {/* Linha 5 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">DT Pagto.</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={form.dtPagto}
                                    />

                                    <Label className="col-span-1">Nº Conta</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.conta}
                                        onChange={handleChange("conta")}
                                    >
                                        {mockContas.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1">Banco</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.banco}
                                    />

                                    <Label className="col-span-1">Agência</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.agencia}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {/* Rodapé modal */}
                    <div className="flex justify-end gap-4 px-4 py-2 border-t border-gray-300 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        >
                            Fechar
                        </button>
                        <button
                            onClick={handleGerar}
                            className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                        >
                            Gerar CP
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Sucesso */}
            {showSucesso && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-md shadow-lg px-6 py-4 border border-gray-300">
                        <p className="text-sm text-gray-800 mb-3">
                            Título gerado com sucesso!
                        </p>
                        <div className="text-right">
                            <button
                                onClick={fecharSucesso}
                                className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* =============== Tela Principal =============== */
export default function VeiculoIPVA({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [abaAtiva, setAbaAtiva] = useState("parcelas"); // "parcelas" | "consulta"

    /* ======== Estado Aba Parcelas ======== */
    const [parcelas, setParcelas] = useState(mockParcelasBase);
    const [selectedParcela, setSelectedParcela] = useState(null);

    const [formParcela, setFormParcela] = useState({
        veiculoCodigo: mockVeiculo.codigo,
        veiculoPlacaDesc: mockVeiculo.placaDescricao,
        veiculoModelo: mockVeiculo.modelo,
        veiculoCidade: mockVeiculo.cidade,
        veiculoUF: mockVeiculo.uf,
        anoReferencia: "2025",
        tituloCP: "",
        valorSeguro: "0,00",
        tpPagamento: "COTA_COM_DESC", // COTA_COM_DESC | COTA_SEM_DESC | PARCELADO
        valor: "1000,00",
        aliquota: "4,00",
    });

    const handleCampoParcela = (field) => (e) => {
        setFormParcela((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleTipoPagamentoChange = (e) => {
        setFormParcela((prev) => ({ ...prev, tpPagamento: e.target.value }));
    };

    const handleLimparParcela = () => {
        setFormParcela((prev) => ({
            ...prev,
            anoReferencia: "",
            tituloCP: "",
            valorSeguro: "",
            tpPagamento: "COTA_COM_DESC",
            valor: "",
            aliquota: "",
        }));
        setSelectedParcela(null);
    };

    const handleIncluirParcela = () => {
        const novo = {
            tipoPagamento:
                formParcela.tpPagamento === "COTA_COM_DESC"
                    ? "Cota Única COM Desconto"
                    : formParcela.tpPagamento === "COTA_SEM_DESC"
                        ? "Cota Única SEM Desconto"
                        : "Parcelado",
            dataVencto: "2025-02-21",
            valorParcela: Number(formParcela.valor.replace(",", ".")) || 0,
            dataPagto: "",
            valorPago: 0,
        };
        setParcelas((prev) => [...prev, novo]);
    };

    const handleAlterarParcela = () => {
        if (selectedParcela === null) {
            alert("Selecione uma parcela na grade.");
            return;
        }
        setParcelas((prev) =>
            prev.map((p, idx) =>
                idx === selectedParcela
                    ? {
                        ...p,
                        valorParcela: Number(formParcela.valor.replace(",", ".")) || 0,
                    }
                    : p
            )
        );
    };

    const handleExcluirParcela = () => {
        if (selectedParcela === null) {
            alert("Selecione uma parcela na grade.");
            return;
        }
        if (!window.confirm("Deseja excluir esta parcela?")) return;
        setParcelas((prev) => prev.filter((_, idx) => idx !== selectedParcela));
        setSelectedParcela(null);
    };

    const handleSelecionarParcela = (parcela, idx) => {
        setSelectedParcela(idx);
        setFormParcela((prev) => ({
            ...prev,
            valor: parcela.valorParcela.toFixed(2).replace(".", ","),
        }));
    };

    /* ======== Estado Aba Consulta ======== */
    const [filtrosConsulta, setFiltrosConsulta] = useState({
        veiculoCod: "",
        veiculoDesc: "",
        ano: "",
        vencDe: "",
        vencAte: "",
        pagoDe: "",
        pagoAte: "",
        somenteCP: false,
    });

    const [resultadoConsulta, setResultadoConsulta] = useState(mockConsulta);

    const handleCampoConsulta = (field) => (e) => {
        const value =
            field === "somenteCP" ? e.target.checked : e.target.value;
        setFiltrosConsulta((prev) => ({ ...prev, [field]: value }));
    };

    const handlePesquisar = () => {
        let filtrado = [...mockConsulta];

        if (filtrosConsulta.veiculoCod) {
            filtrado = filtrado.filter((r) =>
                r.codigoVeiculo.includes(filtrosConsulta.veiculoCod)
            );
        }

        if (filtrosConsulta.ano) {
            filtrado = filtrado.filter((r) => r.ano === filtrosConsulta.ano);
        }

        // Somente mock – filtros de data não afetam o resultado,
        // apenas mantidos para futura integração.
        setResultadoConsulta(filtrado);
    };

    const handleSelecionarConsulta = (registro) => {
        // Quando clicar, troca pra aba Parcelas e "carrega" mock no card 1
        setFormParcela((prev) => ({
            ...prev,
            veiculoCodigo: registro.codigoVeiculo,
            veiculoPlacaDesc: registro.veiculoDescricao,
            anoReferencia: registro.ano,
            tituloCP: registro.tituloCP,
        }));
        setAbaAtiva("parcelas");
        setSelectedParcela(null);
    };

    /* ======== Gerar CP / Estorno ======== */
    const [showGerarCP, setShowGerarCP] = useState(false);

    const handleGerarCPClick = () => {
        if (selectedParcela === null) {
            alert("Selecione uma parcela para gerar o CP.");
            return;
        }
        setShowGerarCP(true);
    };

    const handleEstornar = () => {
        if (selectedParcela === null) {
            alert("Selecione uma parcela para estornar.");
            return;
        }
        alert("Estorno realizado (mock).");
    };

    /* =============== Render =============== */
    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                IPVA
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">
                {/* Abas */}
                <div className="border-b border-gray-200 mb-2 flex gap-2 text-[12px]">
                    <button
                        onClick={() => setAbaAtiva("parcelas")}
                        className={`px-3 py-1 rounded-t-md border-x border-t ${abaAtiva === "parcelas"
                            ? "border-gray-300 bg-white text-red-700 font-semibold"
                            : "border-transparent bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        Parcelas
                    </button>
                    <button
                        onClick={() => setAbaAtiva("consulta")}
                        className={`px-3 py-1 rounded-t-md border-x border-t ${abaAtiva === "consulta"
                            ? "border-gray-300 bg-white text-red-700 font-semibold"
                            : "border-transparent bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        Consulta
                    </button>
                </div>

                {/* ====== ABA PARCELAS ====== */}
                {abaAtiva === "parcelas" && (
                    <>
                        {/* CARD 1 */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Veículo</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={formParcela.veiculoCodigo}
                                        onChange={handleCampoParcela("veiculoCodigo")}
                                    />
                                    <Txt
                                        className="col-span-4 bg-gray-200"
                                        readOnly
                                        value={formParcela.veiculoPlacaDesc}
                                    />
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={formParcela.veiculoModelo}
                                    />
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={formParcela.veiculoCidade}
                                    />
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={formParcela.veiculoUF}
                                    />
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Ano Referência</Label>
                                    <Txt
                                        className="col-span-2"
                                        type="number"
                                        value={formParcela.anoReferencia}
                                        onChange={handleCampoParcela("anoReferencia")}
                                    />

                                    <Label className="col-span-2">Título CP</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={formParcela.tituloCP}
                                    />

                                    <Label className="col-span-2">Valor Seguro Obrigatório</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={formParcela.valorSeguro}
                                        onChange={handleCampoParcela("valorSeguro")}
                                    />
                                </div>

                                {/* Linha 3 - Tipo Pagamento */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Tp. Pagamento</Label>
                                    <div className="col-span-10 flex gap-6 text-[12px]">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="tpPagamento"
                                                value="COTA_COM_DESC"
                                                checked={formParcela.tpPagamento === "COTA_COM_DESC"}
                                                onChange={handleTipoPagamentoChange}
                                                className="accent-red-700"
                                            />
                                            Cota única com Desconto
                                        </label>

                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="tpPagamento"
                                                value="COTA_SEM_DESC"
                                                checked={formParcela.tpPagamento === "COTA_SEM_DESC"}
                                                onChange={handleTipoPagamentoChange}
                                                className="accent-red-700"
                                            />
                                            Cota única sem Desconto
                                        </label>

                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="tpPagamento"
                                                value="PARCELADO"
                                                checked={formParcela.tpPagamento === "PARCELADO"}
                                                onChange={handleTipoPagamentoChange}
                                                className="accent-red-700"
                                            />
                                            Parcelado
                                        </label>
                                    </div>
                                </div>

                                {/* Linha 4 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Valor</Label>
                                    <Txt
                                        className="col-span-2 text-right"
                                        value={formParcela.valor}
                                        onChange={handleCampoParcela("valor")}
                                    />

                                    <Label className="col-span-2">Alíquota</Label>
                                    <Txt
                                        className="col-span-2 text-right"
                                        value={formParcela.aliquota}
                                        onChange={handleCampoParcela("aliquota")}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - GRID PARCELAS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parcelas
                            </legend>

                            <div className="border border-gray-200 rounded max-h-[320px] overflow-y-auto">
                                <table className="w-full text-[12px]">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 text-left">
                                                Tipo Pagamento
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Vencto
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Parcela
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Pagto
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Pago
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parcelas.map((p, idx) => (
                                            <tr
                                                key={idx}
                                                className={`cursor-pointer hover:bg-red-100 ${selectedParcela === idx ? "bg-red-200" : ""
                                                    }`}
                                                onClick={() => handleSelecionarParcela(p, idx)}
                                            >
                                                <td className="border px-2 py-1">{p.tipoPagamento}</td>
                                                <td className="border px-2 py-1 text-center">
                                                    {p.dataVencto}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {p.valorParcela.toFixed(2)}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {p.dataPagto || ""}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {p.valorPago.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                        {parcelas.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="border px-2 py-2 text-center text-gray-500"
                                                >
                                                    Nenhuma parcela cadastrada.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </>
                )}

                {/* ====== ABA CONSULTA ====== */}
                {abaAtiva === "consulta" && (
                    <>
                        {/* CARD 1 - FILTROS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Consulta
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1">Veículo</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={filtrosConsulta.veiculoCod}
                                        onChange={handleCampoConsulta("veiculoCod")}
                                    />
                                    <Txt
                                        className="col-span-6 bg-gray-200"
                                        readOnly
                                        value={filtrosConsulta.veiculoDesc}
                                    />

                                    <Label className="col-span-1 justify-end">Ano</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={filtrosConsulta.ano}
                                        onChange={handleCampoConsulta("ano")}
                                    />
                                </div>

                                {/* Linha 2 - Vencimento / Pagos entre */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1">Vencimento entre</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtrosConsulta.vencDe}
                                        onChange={handleCampoConsulta("vencDe")}
                                    />
                                    <Label className="col-span-1 justify-center">e</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtrosConsulta.vencAte}
                                        onChange={handleCampoConsulta("vencAte")}
                                    />

                                    <Label className="col-span-1 justify-end">
                                        Pagos entre
                                    </Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtrosConsulta.pagoDe}
                                        onChange={handleCampoConsulta("pagoDe")}
                                    />
                                    <Label className="col-span-1 justify-center">e</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtrosConsulta.pagoAte}
                                        onChange={handleCampoConsulta("pagoAte")}
                                    />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <label className="col-span-2 flex items-center gap-1 text-[12px]">
                                        <input
                                            type="checkbox"
                                            checked={filtrosConsulta.somenteCP}
                                            onChange={handleCampoConsulta("somenteCP")}
                                            className="accent-red-700"
                                        />
                                        Somente CP Gerado
                                    </label>

                                    <div className="col-span-2">
                                        <button
                                            type="button"
                                            onClick={handlePesquisar}
                                            className="flex items-center gap-1 px-3 py-[3px] border border-gray-300 rounded text-[12px] bg-white hover:bg-gray-100"
                                        >
                                            <Search size={14} />
                                            Pesquisar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - GRID RESULTADO */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultados
                            </legend>

                            <div className="border border-gray-200 rounded max-h-[320px] overflow-y-auto">
                                <table className="w-full text-[12px]">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 text-left">Veículo</th>
                                            <th className="border px-2 py-1 text-center">Ano</th>
                                            <th className="border px-2 py-1 text-center">
                                                Cód. Veículo
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Título CP
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Tipo Pagamento
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultadoConsulta.map((r, idx) => (
                                            <tr
                                                key={idx}
                                                className="cursor-pointer hover:bg-red-100"
                                                onClick={() => handleSelecionarConsulta(r)}
                                            >
                                                <td className="border px-2 py-1">
                                                    {r.veiculoDescricao}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.ano}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.codigoVeiculo}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.tituloCP}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.tipoPagamento}
                                                </td>
                                            </tr>
                                        ))}
                                        {resultadoConsulta.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="border px-2 py-2 text-center text-gray-500"
                                                >
                                                    Nenhum registro encontrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </fieldset>
                    </>
                )}
            </div>

            {/* RODAPÉ PRINCIPAL */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={handleLimparParcela}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={handleIncluirParcela}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={handleAlterarParcela}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={handleExcluirParcela}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                {/* Gerar CP */}
                <button
                    onClick={handleGerarCPClick}
                    className={`flex flex-col items-center text-[11px] ${selectedParcela === null
                        ? "text-gray-400 cursor-not-allowed"
                        : `${footerIconColorNormal} hover:${footerIconColorHover}`
                        }`}
                    disabled={selectedParcela === null}
                >
                    <FileText size={20} />
                    <span>Gerar CP</span>
                </button>

                {/* Estornar */}
                <button
                    onClick={handleEstornar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <UndoIcon size={20} />
                    <span>Estornar</span>
                </button>
            </div>

            {showGerarCP && <ModalGerarCP onClose={() => setShowGerarCP(false)} />}
        </div>
    );
}
