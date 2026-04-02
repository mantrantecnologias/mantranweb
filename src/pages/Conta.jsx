// src/pages/Conta.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Settings2,
    Save,
    Upload,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* =============== HELPERS =============== */
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
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""
                }`}
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

/* =============== MOCK =============== */
const mockContas = [
    {
        empresa: "001",
        filial: "004",
        banco: "033",
        nomeBanco: "BANCO SANTANDER SA",
        agencia: "0264",
        conta: "13008960-9",
        descricaoConta: "CONTA PRINCIPAL",
        convenio: "767786-5",
        descConvenio: "CONVÊNIO BANCO SANTANDER SA",
        nossoNumero: "0000000000779",
        nrRemessa: "1323",
        contaContabil: "1.1.01.01",
        contaReduzida: "110101",
        especieTitulo: "DM",
        layoutCnab: "FEBRABAN240",
        codTransmissao: "00000011000006767865",
        carteira: "175",
        idConta: "1",
        idConvenio: "212321",
        nrConvenioMultipag: "0",
        usaBoletoNet: true,
        contaAcertoViagem: false,
        padraoFaturamento: true,
        // Config adicionais
        config: {
            parametros: {
                diasProtesto: "0",
                tipoProtesto: "1 - Protestar Dias Corridos",
                diasBaixaDevol: "0",
                tipoBaixaDevol: "1 - Baixar/Devolver",
                valorMulta: "0,00",
                tipoMulta: "0 - Não registra multa",
                diasMulta: "0",
                valorJuros: "0,00",
                tipoJuros: "1 - Valor por dia",
                diasJuros: "0",
                especieDoc: "",
                postoBeneficiario: "",
            },
            integracao: {
                certificado: "",
                senhaCertificado: "",
                codIntegracao: "016 - BANCO INTER",
                usuario: "",
                senha: "",
                ambiente: "Homologação",
            },
        },
    },
    {
        empresa: "001",
        filial: "004",
        banco: "001",
        nomeBanco: "BANCO DO BRASIL S.A.",
        agencia: "0001",
        conta: "00012345-6",
        descricaoConta: "CONTA SECUNDÁRIA",
        convenio: "123456",
        descConvenio: "CONVÊNIO BANCO DO BRASIL",
        nossoNumero: "0000000000123",
        nrRemessa: "1",
        contaContabil: "1.1.01.02",
        contaReduzida: "110102",
        especieTitulo: "DM",
        layoutCnab: "CNAB400",
        codTransmissao: "0000001100000123456",
        carteira: "109",
        idConta: "2",
        idConvenio: "98765",
        nrConvenioMultipag: "0",
        usaBoletoNet: false,
        contaAcertoViagem: true,
        padraoFaturamento: false,
        config: {
            parametros: {
                diasProtesto: "5",
                tipoProtesto: "2 - Não protestar",
                diasBaixaDevol: "30",
                tipoBaixaDevol: "2 - Somente baixar",
                valorMulta: "2,00",
                tipoMulta: "2 - Percentual",
                diasMulta: "5",
                valorJuros: "0,10",
                tipoJuros: "2 - Percentual ao mês",
                diasJuros: "1",
                especieDoc: "DM",
                postoBeneficiario: "",
            },
            integracao: {
                certificado: "",
                senhaCertificado: "",
                codIntegracao: "001 - BANCO DO BRASIL",
                usuario: "",
                senha: "",
                ambiente: "Produção",
            },
        },
    },
];

/* =============== COMPONENTE PRINCIPAL =============== */

export default function Conta({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(mockContas);
    const [selecionado, setSelecionado] = useState(null);

    const [dados, setDados] = useState({
        empresa: "",
        filial: "",
        banco: "",
        nomeBanco: "",
        agencia: "",
        conta: "",
        descricaoConta: "",
        convenio: "",
        descConvenio: "",
        nossoNumero: "",
        nrRemessa: "",
        contaContabil: "",
        contaReduzida: "",
        especieTitulo: "",
        layoutCnab: "",
        codTransmissao: "",
        carteira: "",
        idConta: "",
        idConvenio: "",
        nrConvenioMultipag: "",
        usaBoletoNet: false,
        contaAcertoViagem: false,
        padraoFaturamento: false,
    });

    // Configurações adicionais (ligadas ao registro selecionado)
    const [configParametros, setConfigParametros] = useState({
        diasProtesto: "",
        tipoProtesto: "",
        diasBaixaDevol: "",
        tipoBaixaDevol: "",
        valorMulta: "",
        tipoMulta: "",
        diasMulta: "",
        valorJuros: "",
        tipoJuros: "",
        diasJuros: "",
        especieDoc: "",
        postoBeneficiario: "",
    });

    const [configIntegracao, setConfigIntegracao] = useState({
        certificado: "",
        senhaCertificado: "",
        codIntegracao: "",
        usuario: "",
        senha: "",
        ambiente: "",
    });

    const [showConfigModal, setShowConfigModal] = useState(false);
    const [configTab, setConfigTab] = useState("parametros"); // 'parametros' | 'integracao'
    const [modalMsg, setModalMsg] = useState(false);
    const [showDetalhes, setShowDetalhes] = useState(false);

    /* =============== HANDLERS BÁSICOS =============== */

    const handleChange = (campo) => (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDados((prev) => ({ ...prev, [campo]: value }));
    };

    const handleSelectLinha = (item, idx) => {
        setSelecionado(idx);

        setDados({
            empresa: item.empresa,
            filial: item.filial,
            banco: item.banco,
            nomeBanco: item.nomeBanco,
            agencia: item.agencia,
            conta: item.conta,
            descricaoConta: item.descricaoConta,
            convenio: item.convenio,
            descConvenio: item.descConvenio,
            nossoNumero: item.nossoNumero,
            nrRemessa: item.nrRemessa,
            contaContabil: item.contaContabil,
            contaReduzida: item.contaReduzida,
            especieTitulo: item.especieTitulo,
            layoutCnab: item.layoutCnab,
            codTransmissao: item.codTransmissao,
            carteira: item.carteira,
            idConta: item.idConta,
            idConvenio: item.idConvenio,
            nrConvenioMultipag: item.nrConvenioMultipag,
            usaBoletoNet: item.usaBoletoNet,
            contaAcertoViagem: item.contaAcertoViagem,
            padraoFaturamento: item.padraoFaturamento,
        });

        if (item.config) {
            setConfigParametros(item.config.parametros || configParametros);
            setConfigIntegracao(item.config.integracao || configIntegracao);
        } else {
            // limpa configs se não existir
            setConfigParametros({
                diasProtesto: "",
                tipoProtesto: "",
                diasBaixaDevol: "",
                tipoBaixaDevol: "",
                valorMulta: "",
                tipoMulta: "",
                diasMulta: "",
                valorJuros: "",
                tipoJuros: "",
                diasJuros: "",
                especieDoc: "",
                postoBeneficiario: "",
            });
            setConfigIntegracao({
                certificado: "",
                senhaCertificado: "",
                codIntegracao: "",
                usuario: "",
                senha: "",
                ambiente: "",
            });
        }
    };

    const handleLimpar = () => {
        setDados({
            empresa: "",
            filial: "",
            banco: "",
            nomeBanco: "",
            agencia: "",
            conta: "",
            descricaoConta: "",
            convenio: "",
            descConvenio: "",
            nossoNumero: "",
            nrRemessa: "",
            contaContabil: "",
            contaReduzida: "",
            especieTitulo: "",
            layoutCnab: "",
            codTransmissao: "",
            carteira: "",
            idConta: "",
            idConvenio: "",
            nrConvenioMultipag: "",
            usaBoletoNet: false,
            contaAcertoViagem: false,
            padraoFaturamento: false,
        });
        setSelecionado(null);
    };

    const handleIncluir = () => {
        if (!dados.empresa || !dados.banco || !dados.conta) {
            alert("Informe Empresa, Banco e Nº Conta.");
            return;
        }

        const novo = {
            ...dados,
            config: {
                parametros: { ...configParametros },
                integracao: { ...configIntegracao },
            },
        };

        setLista((prev) => [...prev, novo]);
        handleLimpar();
    };

    const handleAlterar = () => {
        if (selecionado === null) {
            alert("Selecione um registro na grid.");
            return;
        }

        setLista((prev) =>
            prev.map((item, idx) =>
                idx === selecionado
                    ? {
                        ...dados,
                        config: {
                            parametros: { ...configParametros },
                            integracao: { ...configIntegracao },
                        },
                    }
                    : item
            )
        );
    };

    const handleExcluir = () => {
        if (selecionado === null) {
            alert("Selecione um registro na grid.");
            return;
        }

        if (!window.confirm("Deseja excluir esta conta?")) return;

        setLista((prev) => prev.filter((_, idx) => idx !== selecionado));
        handleLimpar();
    };

    const abrirConfigAdicionais = () => {
        if (selecionado === null) {
            alert("Selecione uma conta na grid para configurar.");
            return;
        }
        setConfigTab("parametros");
        setShowConfigModal(true);
    };

    /* =============== HANDLERS CONFIG ADICIONAIS =============== */

    const handleConfigParamChange = (campo) => (e) => {
        setConfigParametros((prev) => ({ ...prev, [campo]: e.target.value }));
    };

    const handleConfigIntChange = (campo) => (e) => {
        setConfigIntegracao((prev) => ({ ...prev, [campo]: e.target.value }));
    };

    const salvarConfigParametros = () => {
        if (selecionado === null) return;

        setLista((prev) =>
            prev.map((item, idx) =>
                idx === selecionado
                    ? {
                        ...item,
                        config: {
                            parametros: { ...configParametros },
                            integracao: item.config?.integracao || { ...configIntegracao },
                        },
                    }
                    : item
            )
        );

        setModalMsg(true);
    };

    const salvarConfigIntegracao = () => {
        if (selecionado === null) return;

        setLista((prev) =>
            prev.map((item, idx) =>
                idx === selecionado
                    ? {
                        ...item,
                        config: {
                            parametros: item.config?.parametros || { ...configParametros },
                            integracao: { ...configIntegracao },
                        },
                    }
                    : item
            )
        );

        setModalMsg(true);
    };

    /* =============== RENDER =============== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO DE CONTA CORRENTE
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                {/* CARD 1 - DADOS PRINCIPAIS */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Dados da Conta
                    </legend>

                    <div className="space-y-2">

                        {/* Linha 1 */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-1 justify-end">Empresa</Label>
                            <Sel
                                className="col-span-5"
                                value={dados.empresa}
                                onChange={handleChange("empresa")}
                            >
                                <option value="">Selecione</option>
                                <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                            </Sel>

                            <Label className="col-span-1 justify-end">Filial</Label>
                            <Sel
                                className="col-span-5"
                                value={dados.filial}
                                onChange={handleChange("filial")}
                            >
                                <option value="">Selecione</option>
                                <option value="004">004 - TESTE MANTRAN</option>
                            </Sel>
                        </div>

                        {/* Linha 2 */}
                        <div className="grid grid-cols-12 gap-2">

                            <Label className="col-span-1 justify-end">Banco</Label>
                            <Sel
                                className="col-span-3"
                                value={dados.banco}
                                onChange={handleChange("banco")}
                            >
                                <option value="">Selecione</option>
                                <option value="033">033 - BANCO SANTANDER SA</option>
                                <option value="001">001 - BANCO DO BRASIL S.A.</option>
                            </Sel>

                            <Label className="col-span-1 justify-end">Agência</Label>
                            <Sel
                                className="col-span-1"
                                value={dados.agencia}
                                onChange={handleChange("agencia")}
                            >
                                <option value="">Selecione</option>
                                <option value="0264">0264</option>
                                <option value="0001">0001</option>
                                <option value="1234">1234</option>
                                <option value="0456">0456</option>
                            </Sel>

                            <Label className="col-span-1 justify-end">Nº Conta</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.conta}
                                onChange={handleChange("conta")}
                            />

                            <Label className="col-span-1 justify-end">Descrição</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.descricaoConta}
                                onChange={handleChange("descricaoConta")}
                            />
                        </div>

                        {/* Linha divisória */}
                        <div className="border-b border-gray-300 my-3"></div>

                        {/* FIELDSET RETRÁTIL – PARÂMETROS DE BOLETO */}
                        <fieldset className="border border-gray-300 rounded">

                            <legend
                                onClick={() => setShowDetalhes(prev => !prev)}
                                className="px-2 text-red-700 font-semibold text-[13px] cursor-pointer select-none flex items-center gap-2"
                            >
                                {showDetalhes ? "▼" : "▶"} Parâmetros para Emissão de Boleto
                            </legend>

                            <div
                                className={`transition-all duration-300 overflow-hidden bg-gray-50 px-3 
                ${showDetalhes ? "max-h-[2000px] py-3" : "max-h-0 py-0"}`}
                            >
                                <div className="space-y-2">

                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-1 justify-end">Nosso Número</Label>
                                        <Txt className="col-span-2" value={dados.nossoNumero} onChange={handleChange("nossoNumero")} />

                                        <Label className="col-span-1 justify-end">Nº Remessa</Label>
                                        <Txt className="col-span-2" value={dados.nrRemessa} onChange={handleChange("nrRemessa")} />

                                        <Label className="col-span-1 justify-end">Nº Convênio</Label>
                                        <Txt className="col-span-1" value={dados.convenio} onChange={handleChange("convenio")} />

                                        <Label className="col-span-1 justify-end">Descrição</Label>
                                        <Txt className="col-span-3" value={dados.descConvenio} onChange={handleChange("descConvenio")} />
                                    </div>

                                    {/* Linha 4 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-1 justify-end">Conta Contábil</Label>
                                        <Txt className="col-span-2" value={dados.contaContabil} onChange={handleChange("contaContabil")} />

                                        <Label className="col-span-1 justify-end">Conta Reduzida</Label>
                                        <Txt className="col-span-2" value={dados.contaReduzida} onChange={handleChange("contaReduzida")} />

                                        <Label className="col-span-1 justify-end">Espécie Título</Label>
                                        <Txt className="col-span-1" value={dados.especieTitulo} onChange={handleChange("especieTitulo")} />

                                        <Label className="col-span-1 justify-end">Layout CNAB</Label>
                                        <Txt className="col-span-1" value={dados.layoutCnab} onChange={handleChange("layoutCnab")} />

                                        <Label className="col-span-1 justify-end">Nº Carteira</Label>
                                        <Txt className="col-span-1" value={dados.carteira} onChange={handleChange("carteira")} />
                                    </div>

                                    {/* Linha 5 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-1 justify-end">ID Convênio</Label>
                                        <Txt className="col-span-2" value={dados.idConvenio} onChange={handleChange("idConvenio")} />

                                        <Label className="col-span-1 justify-end">ID Conta</Label>
                                        <Txt className="col-span-2" value={dados.idConta} onChange={handleChange("idConta")} />

                                        <Label className="col-span-1 justify-end">MultiPag</Label>
                                        <Txt className="col-span-1" value={dados.nrConvenioMultipag} onChange={handleChange("nrConvenioMultipag")} />

                                        <Label className="col-span-1 justify-end">CD Transmissão</Label>
                                        <Txt className="col-span-3" value={dados.codTransmissao} onChange={handleChange("codTransmissao")} />
                                    </div>

                                    {/* Linha 6 */}
                                    <div className="grid grid-cols-12 gap-4 mt-2">

                                        <label className="col-span-3 flex items-center gap-1 text-[12px]">
                                            <input
                                                type="checkbox"
                                                checked={dados.usaBoletoNet}
                                                onChange={handleChange("usaBoletoNet")}
                                                className="accent-red-700"
                                            />
                                            Utiliza BoletoNet
                                        </label>

                                        <label className="col-span-4 flex items-center gap-1 text-[12px]">
                                            <input
                                                type="checkbox"
                                                checked={dados.contaAcertoViagem}
                                                onChange={handleChange("contaAcertoViagem")}
                                                className="accent-red-700"
                                            />
                                            Conta acerto de despesas de viagem
                                        </label>

                                        <label className="col-span-3 flex items-center gap-1 text-[12px]">
                                            <input
                                                type="checkbox"
                                                checked={dados.padraoFaturamento}
                                                onChange={handleChange("padraoFaturamento")}
                                                className="accent-red-700"
                                            />
                                            Padrão de Faturamento
                                        </label>

                                        <div className="col-span-2 flex justify-end">
                                            <button
                                                type="button"
                                                onClick={abrirConfigAdicionais}
                                                className="flex items-center gap-1 text-[12px] px-2 py-1 border border-red-700 rounded text-red-700 hover:bg-red-50"
                                            >
                                                <Settings2 size={16} />
                                                Configurações Adicionais
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </fieldset>

                    </div>
                </fieldset>


                {/* CARD 2 - GRID */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white flex-1 min-h-[240px]">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Contas Cadastradas
                    </legend>

                    <div className="border border-gray-200 rounded overflow-y-auto max-h-[360px]">
                        <table className="w-full text-[12px] border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1 text-left">Empresa</th>
                                    <th className="border px-2 py-1 text-left">Filial</th>
                                    <th className="border px-2 py-1 text-left">Banco</th>
                                    <th className="border px-2 py-1 text-left">Nome da Conta</th>
                                    <th className="border px-2 py-1 text-left">Agência</th>
                                    <th className="border px-2 py-1 text-left">Nº Conta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer ${selecionado === idx ? "bg-red-100" : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelectLinha(item, idx)}
                                    >
                                        <td className="border px-2 py-[3px]">{item.empresa}</td>
                                        <td className="border px-2 py-[3px]">{item.filial}</td>
                                        <td className="border px-2 py-[3px]">
                                            {item.banco} - {item.nomeBanco}
                                        </td>
                                        <td className="border px-2 py-[3px]">
                                            {item.descricaoConta}
                                        </td>
                                        <td className="border px-2 py-[3px]">{item.agencia}</td>
                                        <td className="border px-2 py-[3px]">{item.conta}</td>
                                    </tr>
                                ))}

                                {lista.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="border px-2 py-2 text-center text-gray-500"
                                        >
                                            Nenhuma conta cadastrada.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ PADRÃO */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={handleLimpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={handleIncluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={handleAlterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={handleExcluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>

            {/* MODAL CONFIGURAÇÕES ADICIONAIS */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-40">
                    <div className="bg-white w-[820px] rounded shadow-lg border border-gray-300 p-4">
                        <h2 className="text-center text-red-700 font-semibold mb-3">
                            CONFIGURAÇÕES ADICIONAIS DE BOLETO
                        </h2>

                        {/* Abas */}
                        <div className="flex border-b border-gray-300 mb-3 text-[13px]">
                            <button
                                className={`px-3 py-1 ${configTab === "parametros"
                                    ? "border-t border-l border-r border-gray-300 rounded-t bg-white text-red-700 font-semibold"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                                onClick={() => setConfigTab("parametros")}
                            >
                                Parâmetros
                            </button>
                            <button
                                className={`px-3 py-1 ml-1 ${configTab === "integracao"
                                    ? "border-t border-l border-r border-gray-300 rounded-t bg-white text-red-700 font-semibold"
                                    : "bg-gray-100 text-gray-600"
                                    }`}
                                onClick={() => setConfigTab("integracao")}
                            >
                                Integração
                            </button>
                        </div>

                        {/* Conteúdo das abas */}
                        {configTab === "parametros" && (
                            <fieldset className="border border-gray-300 rounded p-3 mb-3">
                                <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                    Config. Boleto
                                </legend>

                                <div className="space-y-2">
                                    {/* Linha 1 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Dias Protesto</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.diasProtesto}
                                            onChange={handleConfigParamChange("diasProtesto")}
                                        />

                                        <Label className="col-span-2">Tipo Protesto</Label>
                                        <Sel
                                            className="col-span-6"
                                            value={configParametros.tipoProtesto}
                                            onChange={handleConfigParamChange("tipoProtesto")}
                                        >
                                            <option value="">Selecione</option>
                                            <option>1 - Protestar Dias Corridos</option>
                                            <option>2 - Não protestar</option>
                                        </Sel>
                                    </div>

                                    {/* Linha 2 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Dias Baixa Devol.</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.diasBaixaDevol}
                                            onChange={handleConfigParamChange("diasBaixaDevol")}
                                        />

                                        <Label className="col-span-2">Tipo Baixa Devolução</Label>
                                        <Sel
                                            className="col-span-6"
                                            value={configParametros.tipoBaixaDevol}
                                            onChange={handleConfigParamChange("tipoBaixaDevol")}
                                        >
                                            <option value="">Selecione</option>
                                            <option>1 - Baixar/Devolver</option>
                                            <option>2 - Somente Baixar</option>
                                        </Sel>
                                    </div>

                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Valor Multa</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.valorMulta}
                                            onChange={handleConfigParamChange("valorMulta")}
                                        />

                                        <Label className="col-span-2">Tipo Multa</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={configParametros.tipoMulta}
                                            onChange={handleConfigParamChange("tipoMulta")}
                                        >
                                            <option value="">Selecione</option>
                                            <option>0 - Não registra a multa</option>
                                            <option>1 - Valor fixo</option>
                                            <option>2 - Percentual</option>
                                        </Sel>

                                        <Label className="col-span-1">Dias Multa</Label>
                                        <Txt
                                            className="col-span-1"
                                            value={configParametros.diasMulta}
                                            onChange={handleConfigParamChange("diasMulta")}
                                        />
                                    </div>

                                    {/* Linha 4 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Valor Juros</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.valorJuros}
                                            onChange={handleConfigParamChange("valorJuros")}
                                        />

                                        <Label className="col-span-2">Tipo Juros</Label>
                                        <Sel
                                            className="col-span-4"
                                            value={configParametros.tipoJuros}
                                            onChange={handleConfigParamChange("tipoJuros")}
                                        >
                                            <option value="">Selecione</option>
                                            <option>1 - Valor por dia</option>
                                            <option>2 - Percentual ao mês</option>
                                        </Sel>

                                        <Label className="col-span-1">Dias Juros</Label>
                                        <Txt
                                            className="col-span-1"
                                            value={configParametros.diasJuros}
                                            onChange={handleConfigParamChange("diasJuros")}
                                        />
                                    </div>

                                    {/* Linha 5 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Espécie Docum.</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.especieDoc}
                                            onChange={handleConfigParamChange("especieDoc")}
                                        />

                                        <Label className="col-span-2">Posto Beneficiário</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={configParametros.postoBeneficiario}
                                            onChange={handleConfigParamChange("postoBeneficiario")}
                                        />
                                    </div>
                                </div>
                            </fieldset>
                        )}

                        {configTab === "integracao" && (
                            <div className="space-y-3">
                                {/* CARD CERTIFICADO */}
                                <fieldset className="border border-gray-300 rounded p-3">
                                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                        Certificado
                                    </legend>

                                    <div className="grid grid-cols-12 gap-2 mb-2">
                                        <Label className="col-span-2">Certificado</Label>
                                        <Txt
                                            className="col-span-9"
                                            value={configIntegracao.certificado}
                                            onChange={handleConfigIntChange("certificado")}
                                        />
                                        <button
                                            type="button"
                                            className="col-span-1 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                                            title="Selecionar certificado"
                                        >
                                            <Upload size={18} />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Senha Certificado</Label>
                                        <Txt
                                            className="col-span-4"
                                            type="password"
                                            value={configIntegracao.senhaCertificado}
                                            onChange={handleConfigIntChange("senhaCertificado")}
                                        />
                                        <div className="col-span-2 flex items-center">
                                            <button
                                                type="button"
                                                className="flex items-center gap-1 px-3 py-1 border border-red-700 rounded text-red-700 text-[12px] hover:bg-red-50"
                                                onClick={salvarConfigIntegracao}
                                            >
                                                <Save size={16} />
                                                Gravar
                                            </button>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* CARD LOGIN */}
                                <fieldset className="border border-gray-300 rounded p-3">
                                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                        Login
                                    </legend>

                                    <div className="space-y-2">
                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-3">
                                                Código da Integração
                                            </Label>
                                            <Sel
                                                className="col-span-9"
                                                value={configIntegracao.codIntegracao}
                                                onChange={handleConfigIntChange("codIntegracao")}
                                            >
                                                <option value="">Selecione</option>
                                                <option>016 - BANCO INTER</option>
                                                <option>001 - BANCO DO BRASIL</option>
                                            </Sel>
                                        </div>

                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-3">Usuário (client_id)</Label>
                                            <Txt
                                                className="col-span-9"
                                                value={configIntegracao.usuario}
                                                onChange={handleConfigIntChange("usuario")}
                                            />
                                        </div>

                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-3">
                                                Senha (client_secret)
                                            </Label>
                                            <Txt
                                                className="col-span-9"
                                                type="password"
                                                value={configIntegracao.senha}
                                                onChange={handleConfigIntChange("senha")}
                                            />
                                        </div>

                                        <div className="grid grid-cols-12 gap-2">
                                            <Label className="col-span-3">Ambiente</Label>
                                            <Sel
                                                className="col-span-6"
                                                value={configIntegracao.ambiente}
                                                onChange={handleConfigIntChange("ambiente")}
                                            >
                                                <option value="">Selecione</option>
                                                <option>Homologação</option>
                                                <option>Produção</option>
                                            </Sel>

                                            <div className="col-span-3 flex items-center justify-end">
                                                <button
                                                    type="button"
                                                    className="flex items-center gap-1 px-3 py-1 border border-red-700 rounded text-red-700 text-[12px] hover:bg-red-50"
                                                    onClick={salvarConfigIntegracao}
                                                >
                                                    <Save size={16} />
                                                    Gravar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        )}

                        {/* Rodapé da modal */}
                        <div className="flex justify-end gap-3 mt-4">
                            {configTab === "parametros" && (
                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-3 py-1 border border-red-700 rounded text-red-700 text-[12px] hover:bg-red-50"
                                    onClick={salvarConfigParametros}
                                >
                                    <Save size={16} />
                                    Gravar Parâmetros
                                </button>
                            )}

                            <button
                                type="button"
                                className="flex items-center gap-1 px-3 py-1 border border-gray-400 rounded text-[12px] hover:bg-gray-100"
                                onClick={() => setShowConfigModal(false)}
                            >
                                <XCircle size={16} />
                                Fechar
                            </button>
                        </div>
                    </div>

                    {/* MODAL MSG SUCESSO */}
                    {modalMsg && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                                <p className="text-green-700 font-bold mb-4">
                                    Configurações gravadas com sucesso!
                                </p>
                                <button
                                    className="px-3 py-1 bg-red-700 text-white rounded"
                                    onClick={() => {
                                        setModalMsg(false);
                                        setShowConfigModal(false);
                                    }}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
