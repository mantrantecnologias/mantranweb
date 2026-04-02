// src/pages/VeiculoLicenciamento.jsx
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

/* ================= Helpers ================= */

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

/* ================= Utils ================= */

function parseMoeda(valor) {
    if (!valor) return 0;
    return Number(
        valor.toString().replace(/\./g, "").replace(",", ".")
    ) || 0;
}

function formatMoeda(num) {
    return (num || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

/* ================= Mocks ================= */

const mockLicenciamento = [
    {
        id: "1",
        veiculoCodigo: "0000004",
        veiculoDescricao: "AAV2417 - SCANIA / UTILITARIO - CUBATAO",
        modelo: "SCANIA / UTILITARIO",
        cidade: "CUBATAO",
        uf: "SP",
        anoRef: "2025-01-01",
        tituloCP: "0000005124742",
        valorSeg: "350,00",
        dtVenc: "2025-07-21",
        licenciamento: "1.234,00",
        dtPagto: "2025-07-10",
        valorPago: "1.234,00",
    },
    {
        id: "2",
        veiculoCodigo: "FGQ3J02",
        veiculoDescricao: "FGQ3J02 - VOLVO / CAVALO TRUCADO",
        modelo: "VOLVO / CAVALO TRUCADO",
        cidade: "SANTOS",
        uf: "SP",
        anoRef: "2025-01-01",
        tituloCP: "0000002123456",
        valorSeg: "280,00",
        dtVenc: "2025-08-10",
        licenciamento: "980,00",
        dtPagto: "",
        valorPago: "0,00",
    },
];

const mockCategorias = [
    "1 - IMPOSTOS SOBRE VENDAS",
    "2 - DESPESAS OPERACIONAIS",
];
const mockSubCategorias = ["1 - ICMS", "2 - TAXAS", "3 - OUTROS"];
const mockContas = [
    "111111111 - CONTA CORRENTE PRINCIPAL",
    "502879-9 - BANCO DO BRASIL",
    "12345-0 - CAIXA ECONÔMICA",
];

const mockCP = {
    creditoCnpj: "50221019000136",
    creditoRazao: "HNK-ITU (1) MATRIZ",
    banco: "001",
    agencia: "0929-6",
};

/* ============== Modal Gerar CP ============== */

function ModalGerarCP({ onClose, dados }) {
    const [showSucesso, setShowSucesso] = useState(false);

    const [form, setForm] = useState({
        creditoCnpj: mockCP.creditoCnpj,
        creditoNome: mockCP.creditoRazao,
        numeroTitulo: dados.tituloCP || "",
        numeroParcela: "1",
        qtParcela: "1",
        valorPagar: dados.licenciamento || "0,00",
        dtVencto: dados.dtVenc || "",
        categoria: mockCategorias[0],
        subCategoria: mockSubCategorias[0],
        observacao: "",
        dtPagto: dados.dtPagto || "",
        conta: mockContas[0],
        banco: mockCP.banco,
        agencia: mockCP.agencia,
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleGerar = () => {
        // Mock: apenas exibe mensagem de sucesso
        setShowSucesso(true);
    };

    const fecharSucesso = () => {
        setShowSucesso(false);
        onClose();
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[1000px] rounded-md shadow-lg border border-gray-300">
                    <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                        LICENCIAMENTO - GERAR CONTAS A PAGAR
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

                                    <Label className="col-span-1">Subcategoria</Label>
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
                    <div className="bg-white rounded-md shadow-lg px-6 py-4 border border-gray-300 text-center">
                        <p className="text-sm text-gray-800 mb-3">
                            Título gerado com sucesso!
                        </p>
                        <button
                            onClick={fecharSucesso}
                            className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

/* ============== Tela Principal ============== */

export default function VeiculoLicenciamento({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [abaAtiva, setAbaAtiva] = useState("cadastro"); // "cadastro" | "consulta"

    // Cadastro
    const [lista, setLista] = useState(mockLicenciamento);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const [dados, setDados] = useState({
        veiculoCodigo: "",
        veiculoDescricao: "",
        modelo: "",
        cidade: "",
        uf: "",
        anoRef: "",
        tituloCP: "",
        valorSeg: "",
        dtVenc: "",
        licenciamento: "",
        dtPagto: "",
        valorPago: "",
    });

    const handleCampoCadastro = (field) => (e) => {
        setDados((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const limparCadastro = () => {
        setDados({
            veiculoCodigo: "",
            veiculoDescricao: "",
            modelo: "",
            cidade: "",
            uf: "",
            anoRef: "",
            tituloCP: "",
            valorSeg: "",
            dtVenc: "",
            licenciamento: "",
            dtPagto: "",
            valorPago: "",
        });
        setSelectedIndex(null);
    };

    const incluirCadastro = () => {
        if (!dados.veiculoCodigo) {
            alert("Informe o código do veículo.");
            return;
        }

        const novo = {
            id: Date.now().toString(),
            ...dados,
        };

        setLista((prev) => [...prev, novo]);
        setSelectedIndex(lista.length);
    };

    const alterarCadastro = () => {
        if (selectedIndex === null) {
            alert("Selecione um registro na grade para alterar.");
            return;
        }

        setLista((prev) =>
            prev.map((item, idx) =>
                idx === selectedIndex ? { ...item, ...dados } : item
            )
        );
    };

    const excluirCadastro = () => {
        if (selectedIndex === null) {
            alert("Selecione um registro na grade para excluir.");
            return;
        }
        if (!window.confirm("Deseja excluir este registro?")) return;

        setLista((prev) => prev.filter((_, idx) => idx !== selectedIndex));
        setSelectedIndex(null);
        limparCadastro();
    };

    const selecionarCadastro = (item, index) => {
        setSelectedIndex(index);
        setDados({
            veiculoCodigo: item.veiculoCodigo || "",
            veiculoDescricao: item.veiculoDescricao || "",
            modelo: item.modelo || "",
            cidade: item.cidade || "",
            uf: item.uf || "",
            anoRef: item.anoRef || "",
            tituloCP: item.tituloCP || "",
            valorSeg: item.valorSeg || "",
            dtVenc: item.dtVenc || "",
            licenciamento: item.licenciamento || "",
            dtPagto: item.dtPagto || "",
            valorPago: item.valorPago || "",
        });
    };

    const totalSemDesc = formatMoeda(
        lista.reduce((acc, item) => acc + parseMoeda(item.licenciamento), 0)
    );
    const totalComDesc = formatMoeda(
        lista.reduce((acc, item) => acc + parseMoeda(item.valorPago), 0)
    );

    // Consulta
    const [filtrosConsulta, setFiltrosConsulta] = useState({
        veiculoCod: "",
        veiculoDesc: "",
        ano: "",
        vencDe: "",
        vencAte: "",
        pagoDe: "",
        pagoAte: "",
    });

    const [resultadoConsulta, setResultadoConsulta] = useState(lista);

    const handleCampoConsulta = (field) => (e) => {
        setFiltrosConsulta((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handlePesquisar = () => {
        let filtrado = [...lista];

        if (filtrosConsulta.veiculoCod) {
            filtrado = filtrado.filter((r) =>
                r.veiculoCodigo
                    ?.toString()
                    .includes(filtrosConsulta.veiculoCod.toString())
            );
        }

        if (filtrosConsulta.ano) {
            filtrado = filtrado.filter(
                (r) => (r.anoRef || "").substring(0, 4) === filtrosConsulta.ano
            );
        }

        if (filtrosConsulta.vencDe) {
            filtrado = filtrado.filter(
                (r) => !r.dtVenc || r.dtVenc >= filtrosConsulta.vencDe
            );
        }
        if (filtrosConsulta.vencAte) {
            filtrado = filtrado.filter(
                (r) => !r.dtVenc || r.dtVenc <= filtrosConsulta.vencAte
            );
        }

        if (filtrosConsulta.pagoDe) {
            filtrado = filtrado.filter(
                (r) => !r.dtPagto || r.dtPagto >= filtrosConsulta.pagoDe
            );
        }
        if (filtrosConsulta.pagoAte) {
            filtrado = filtrado.filter(
                (r) => !r.dtPagto || r.dtPagto <= filtrosConsulta.pagoAte
            );
        }

        setResultadoConsulta(filtrado);
    };

    const handleSelecionarConsulta = (registro) => {
        // Preenche filtros visualmente
        setFiltrosConsulta((prev) => ({
            ...prev,
            veiculoCod: registro.veiculoCodigo || "",
            veiculoDesc: registro.veiculoDescricao || "",
            ano: (registro.anoRef || "").substring(0, 4),
        }));

        // Localiza índice na lista principal
        const idx = lista.findIndex((item) => item.id === registro.id);

        setSelectedIndex(idx === -1 ? null : idx);

        setDados({
            veiculoCodigo: registro.veiculoCodigo || "",
            veiculoDescricao: registro.veiculoDescricao || "",
            modelo: registro.modelo || "",
            cidade: registro.cidade || "",
            uf: registro.uf || "",
            anoRef: registro.anoRef || "",
            tituloCP: registro.tituloCP || "",
            valorSeg: registro.valorSeg || "",
            dtVenc: registro.dtVenc || "",
            licenciamento: registro.licenciamento || "",
            dtPagto: registro.dtPagto || "",
            valorPago: registro.valorPago || "",
        });

        // Volta para aba Cadastro
        setAbaAtiva("cadastro");
    };

    // CP / Estorno
    const [showGerarCP, setShowGerarCP] = useState(false);

    const handleGerarCPClick = () => {
        if (selectedIndex === null) {
            alert("Selecione um registro na aba Cadastro para gerar o CP.");
            return;
        }
        setShowGerarCP(true);
    };

    const handleEstornar = () => {
        if (selectedIndex === null) {
            alert("Selecione um registro para estornar.");
            return;
        }
        alert("Estorno realizado (mock).");
    };

    /* ============== Render ============== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                LICENCIAMENTO DE VEÍCULOS
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">
                {/* Abas */}
                <div className="border-b border-gray-200 mb-2 flex gap-2 text-[12px]">
                    <button
                        onClick={() => setAbaAtiva("cadastro")}
                        className={`px-3 py-1 rounded-t-md border-x border-t ${abaAtiva === "cadastro"
                            ? "border-gray-300 bg-white text-red-700 font-semibold"
                            : "border-transparent bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        Cadastro
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

                {/* ====== ABA CADASTRO ====== */}
                {abaAtiva === "cadastro" && (
                    <>
                        {/* CARD 1 - PARÂMETROS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 - Veículo */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Veículo</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={dados.veiculoCodigo}
                                        onChange={handleCampoCadastro("veiculoCodigo")}
                                    />
                                    <Txt
                                        className="col-span-4 bg-gray-200"
                                        readOnly
                                        value={dados.veiculoDescricao}
                                    />
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={dados.cidade}
                                    />
                                    <Txt
                                        className="col-span-2 bg-gray-200 text-center"
                                        readOnly
                                        value={dados.uf}
                                    />
                                </div>

                                {/* Linha 2 - Ano Ref, Título CP, Seguro */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Ano Referência</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.anoRef}
                                        onChange={handleCampoCadastro("anoRef")}
                                    />

                                    <Label className="col-span-2">Título CP</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={dados.tituloCP}
                                    />

                                    <Label className="col-span-2">
                                        Valor Seguro Obrigatório
                                    </Label>
                                    <Txt
                                        className="col-span-2"
                                        value={dados.valorSeg}
                                        onChange={handleCampoCadastro("valorSeg")}
                                    />
                                </div>

                                {/* Linha 3 - Vencimento / Licenciamento */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Data Vencimento</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dtVenc}
                                        onChange={handleCampoCadastro("dtVenc")}
                                    />

                                    <Label className="col-span-2">Valor Licenciamento</Label>
                                    <Txt
                                        className="col-span-2 text-right"
                                        value={dados.licenciamento}
                                        onChange={handleCampoCadastro("licenciamento")}
                                    />
                                </div>

                                {/* Linha 4 - Pagamento */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Data Pagamento</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dtPagto}
                                        onChange={handleCampoCadastro("dtPagto")}
                                    />

                                    <Label className="col-span-2">Valor Pago</Label>
                                    <Txt
                                        className="col-span-2 text-right"
                                        value={dados.valorPago}
                                        onChange={handleCampoCadastro("valorPago")}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 2 - GRID */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Registros
                            </legend>

                            <div className="border border-gray-200 rounded max-h-[320px] overflow-y-auto">
                                <table className="w-full text-[12px]">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 text-left">Veículo</th>
                                            <th className="border px-2 py-1 text-center">
                                                Ano Referência
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Vencimento
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Licenciamento
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Pagamento
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Pago
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((item, index) => (
                                            <tr
                                                key={item.id || index}
                                                className={`cursor-pointer hover:bg-red-100 ${selectedIndex === index ? "bg-red-200" : ""
                                                    }`}
                                                onClick={() => selecionarCadastro(item, index)}
                                            >
                                                <td className="border px-2 py-1">
                                                    {item.veiculoDescricao}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {(item.anoRef || "").substring(0, 4)}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {item.dtVenc}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {item.licenciamento}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {item.dtPagto}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {item.valorPago}
                                                </td>
                                            </tr>
                                        ))}
                                        {lista.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="border px-2 py-2 text-center text-gray-500"
                                                >
                                                    Nenhum registro cadastrado.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totais */}
                            <div className="grid grid-cols-12 gap-4 mt-2 text-[12px]">


                                <Label className="col-span-2">Valor Total COM Desconto</Label>
                                <Txt
                                    className="col-span-2 bg-gray-200 text-right"
                                    readOnly
                                    value={totalComDesc}
                                />


                                <Label className="col-span-2 col-start-7">Valor Total SEM Desconto</Label>
                                <Txt
                                    className="col-span-2 bg-gray-200 text-right"
                                    readOnly
                                    value={totalSemDesc}
                                />


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

                                {/* Linha 3 - Botão Pesquisar */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-9" />
                                    <div className="col-span-3 flex justify-end">
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

                        {/* CARD 2 - GRID RESULTADOS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultados
                            </legend>

                            <div className="border border-gray-200 rounded max-h-[320px] overflow-y-auto">
                                <table className="w-full text-[12px]">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1 text-left">Veículo</th>
                                            <th className="border px-2 py-1 text-center">
                                                Ano Referência
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Vencimento
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Licenciamento
                                            </th>
                                            <th className="border px-2 py-1 text-center">
                                                Data Pagamento
                                            </th>
                                            <th className="border px-2 py-1 text-right">
                                                Valor Pago
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultadoConsulta.map((r, idx) => (
                                            <tr
                                                key={r.id || idx}
                                                className="cursor-pointer hover:bg-red-100"
                                                onClick={() => handleSelecionarConsulta(r)}
                                            >
                                                <td className="border px-2 py-1">
                                                    {r.veiculoDescricao}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {(r.anoRef || "").substring(0, 4)}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.dtVenc}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {r.licenciamento}
                                                </td>
                                                <td className="border px-2 py-1 text-center">
                                                    {r.dtPagto}
                                                </td>
                                                <td className="border px-2 py-1 text-right">
                                                    {r.valorPago}
                                                </td>
                                            </tr>
                                        ))}
                                        {resultadoConsulta.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
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
                    onClick={limparCadastro}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                {/* Incluir */}
                <button
                    onClick={incluirCadastro}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                {/* Alterar */}
                <button
                    onClick={alterarCadastro}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                {/* Excluir */}
                <button
                    onClick={excluirCadastro}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                {/* Gerar CP */}
                <button
                    onClick={handleGerarCPClick}
                    className={`flex flex-col items-center text-[11px] ${selectedIndex === null
                        ? "text-gray-400 cursor-not-allowed"
                        : `${footerIconColorNormal} hover:${footerIconColorHover}`
                        }`}
                    disabled={selectedIndex === null}
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

            {showGerarCP && (
                <ModalGerarCP onClose={() => setShowGerarCP(false)} dados={dados} />
            )}
        </div>
    );
}
