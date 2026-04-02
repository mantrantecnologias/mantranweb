import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    ArrowLeftRight,
    ChevronDown,
    ChevronRight,
    Search,
    FileText,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";
import GerarCP from "./GerarCP";

/* COMPONENT HELPERS */
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

/* MOCK DATA */
const mockMultas = [
    {
        id: 1,
        atuacaoTipo: "multa",
        dataInclusao: "2025-08-06",
        dataInfracao: "2025-08-01",
        horaInfracao: "14:48",
        grupo: "ABCD",
        nrAtuacao: "111",
        orgaoAutuacao: "DETRAN",
        veiculoCodigo: "0000001",
        veiculoDescricao: "RENSJ17 - VW 24280 CRM 6X2 - BITRUCK",
        cidade: "BRASILIA",
        uf: "DF",

        cepOrigem: "13100000",
        cepOrigemCidade: "CAMPINAS",
        cepOrigemUF: "SP",

        cepDestino: "13170001",
        cepDestinoCidade: "SUMARE",
        cepDestinoUF: "SP",

        infracao: "ABCD",
        local: "AABB",

        velPermitida: "100,00",
        velConstatada: "120,00",
        pontuacao: "10",
        tituloCP: "0",

        dataRecurso: "",
        indeferido: false,
        alegacao: "",

        motoristaCNH: "01268446760",
        motoristaNome: "ALAN DA COSTA",

        vencComDescData: "2025-08-06",
        vencComDescValor: "100,00",

        vencSemDescData: "2025-08-16",
        vencSemDescValor: "200,00",

        cobrarMotorista: false,
        dataDescMotorista: "",

        pagtoData: "",
        pagtoValor: "",
    },
];

/* MAIN COMPONENT */
export default function VeiculoMulta({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [aba, setAba] = useState("cadastro");
    const [lista, setLista] = useState(mockMultas);
    const [editIndex, setEditIndex] = useState(null);

    /* Retráteis */
    const [localOpen, setLocalOpen] = useState(false);
    const [recursoOpen, setRecursoOpen] = useState(false);
    const [motoristaOpen, setMotoristaOpen] = useState(false);
    const [valoresOpen, setValoresOpen] = useState(false);

    const toggle = (fn) => fn((prev) => !prev);

    /* Dados */
    const [dados, setDados] = useState({
        atuacaoTipo: "notificacao",
        dataInclusao: "",
        dataInfracao: "",
        horaInfracao: "",
        grupo: "",
        nrAtuacao: "",
        orgaoAutuacao: "",
        veiculoCodigo: "",
        veiculoDescricao: "",
        cidade: "",
        uf: "",

        cepOrigem: "",
        cepOrigemCidade: "",
        cepOrigemUF: "",

        cepDestino: "",
        cepDestinoCidade: "",
        cepDestinoUF: "",

        infracao: "",
        local: "",

        velPermitida: "",
        velConstatada: "",
        pontuacao: "",
        tituloCP: "",

        dataRecurso: "",
        indeferido: false,
        alegacao: "",

        motoristaCNH: "",
        motoristaNome: "",

        vencComDescData: "",
        vencComDescValor: "",
        vencSemDescData: "",
        vencSemDescValor: "",
        cobrarMotorista: false,
        dataDescMotorista: "",

        pagtoData: "",
        pagtoValor: "",
    });

    const handle = (field) => (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setDados((prev) => ({ ...prev, [field]: value }));
    };

    /* Filtros Consulta */
    const [filtros, setFiltros] = useState({
        veiculo: "",
        motorista: "",
        infracao: "",
        vencDe: "",
        vencAte: "",
        pagosDe: "",
        pagosAte: "",
        tipo: "todos",
    });

    const handleFiltro = (field) => (e) => {
        setFiltros((prev) => ({ ...prev, [field]: e.target.value }));
    };

    /* Funções */
    const limpar = () => {
        setEditIndex(null);
        setDados({
            atuacaoTipo: "notificacao",
            dataInclusao: "",
            dataInfracao: "",
            horaInfracao: "",
            grupo: "",
            nrAtuacao: "",
            orgaoAutuacao: "",
            veiculoCodigo: "",
            veiculoDescricao: "",
            cidade: "",
            uf: "",

            cepOrigem: "",
            cepOrigemCidade: "",
            cepOrigemUF: "",

            cepDestino: "",
            cepDestinoCidade: "",
            cepDestinoUF: "",

            infracao: "",
            local: "",

            velPermitida: "",
            velConstatada: "",
            pontuacao: "",
            tituloCP: "",

            dataRecurso: "",
            indeferido: false,
            alegacao: "",

            motoristaCNH: "",
            motoristaNome: "",

            vencComDescData: "",
            vencComDescValor: "",
            vencSemDescData: "",
            vencSemDescValor: "",
            cobrarMotorista: false,
            dataDescMotorista: "",

            pagtoData: "",
            pagtoValor: "",
        });
    };

    const incluir = () => {
        setLista([...lista, dados]);
        limpar();
    };

    const alterar = () => {
        if (editIndex === null) return;
        const nova = [...lista];
        nova[editIndex] = dados;
        setLista(nova);
    };

    const excluir = () => {
        if (editIndex === null) return;
        setLista(lista.filter((_, i) => i !== editIndex));
        limpar();
    };

    const selecionar = (item, index) => {
        setDados(item);
        setEditIndex(index);
        setAba("cadastro");
    };

    /* MODAL */
    const [modalCP, setModalCP] = useState(false);

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                MULTAS / INFRAÇÕES
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">
                {/* ABAS */}
                <div className="border-b border-gray-200 mb-2 flex gap-2 text-[12px]">
                    <button
                        onClick={() => setAba("cadastro")}
                        className={`px-3 py-1 rounded-t-md border-x border-t ${aba === "cadastro"
                            ? "border-gray-300 bg-white text-red-700 font-semibold"
                            : "border-transparent bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        Cadastro
                    </button>

                    <button
                        onClick={() => setAba("consulta")}
                        className={`px-3 py-1 rounded-t-md border-x border-t ${aba === "consulta"
                            ? "border-gray-300 bg-white text-red-700 font-semibold"
                            : "border-transparent bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        Consulta
                    </button>
                </div>

                {/* ===========================================================
           ABA CADASTRO
        =========================================================== */}
                {aba === "cadastro" && (
                    <>
                        {/* CARD 1 - ATUAÇÃO */}
                        <div className="border border-gray-300 rounded p-3 bg-white">
                            <Label className="col-span-12 font-semibold">Atuação</Label>
                            {/* CARD 1 - ATUAÇÃO */}
                            <div className="border border-gray-300 rounded p-3 bg-white">
                                <Label className="col-span-12 font-semibold">Atuação</Label>

                                {/* Linha 1 - Radio + Data Inclusão */}
                                <div className="grid grid-cols-12 gap-2 mt-2 ml-4 items-center">

                                    {/* RADIO BUTTONS - ficam no começo (col-span-4) */}
                                    <div className="col-span-4 flex gap-4">
                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="atuacao"
                                                value="notificacao"
                                                checked={dados.atuacaoTipo === "notificacao"}
                                                onChange={handle("atuacaoTipo")}
                                            />
                                            Notificação
                                        </label>

                                        <label className="flex items-center gap-1">
                                            <input
                                                type="radio"
                                                name="atuacao"
                                                value="multa"
                                                checked={dados.atuacaoTipo === "multa"}
                                                onChange={handle("atuacaoTipo")}
                                            />
                                            Multa
                                        </label>
                                    </div>

                                    {/* LABEL - alinhado à direita */}
                                    <Label className="col-span-3 col-start-8 flex justify-end">
                                        Data Inclusão
                                    </Label>

                                    {/* INPUT - não editável, bg-gray, alinhado à direita */}
                                    <Txt
                                        readOnly
                                        type="date"
                                        className="col-span-2 bg-gray-200 text-right"
                                        value={dados.dataInclusao}
                                    />
                                </div>
                            </div>

                        </div>


                        {/* CARD 2 - IDENTIFICAÇÃO DA AUTUAÇÃO */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold">
                                Identificação da Autuação
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}


                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-2">Data Infração</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={dados.dataInfracao}
                                        onChange={handle("dataInfracao")}
                                    />

                                    <Label className="col-span-1">Hora</Label>
                                    <Txt
                                        type="time"
                                        className="col-span-2"
                                        value={dados.horaInfracao}
                                        onChange={handle("horaInfracao")}
                                    />

                                    <Label className="col-span-1">Grupo</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={dados.grupo}
                                        onChange={handle("grupo")}
                                    />

                                    <Label className="col-span-1">Nº Atuação</Label>
                                    <Txt
                                        className="col-span-1"
                                        value={dados.nrAtuacao}
                                        onChange={handle("nrAtuacao")}
                                    />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2">
                                    <Label className="col-span-2">Órgão Autuação</Label>
                                    <Txt
                                        className="col-span-4"
                                        value={dados.orgaoAutuacao}
                                        onChange={handle("orgaoAutuacao")}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* CARD 3 - IDENTIFICAÇÃO DO VEÍCULO */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold">
                                Identificação do Veículo
                            </legend>

                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-2">Veículo</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.veiculoCodigo}
                                    onChange={handle("veiculoCodigo")}
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
                        </fieldset>

                        {/* CARD 4 - LOCAL DA INFRAÇÃO (RETRÁTIL) */}
                        <fieldset className="border border-gray-300 rounded bg-white">
                            <legend
                                className="px-2 text-red-700 font-semibold flex items-center cursor-pointer"
                                onClick={() => toggle(setLocalOpen)}
                            >
                                {localOpen ? (
                                    <ChevronDown className="mr-1" size={16} />
                                ) : (
                                    <ChevronRight className="mr-1" size={16} />
                                )}
                                Identificação do Local da Infração
                            </legend>

                            {localOpen && (
                                <div className="p-3 space-y-2">
                                    {/* CEP Origem */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">CEP Origem</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.cepOrigem}
                                            onChange={handle("cepOrigem")}
                                        />
                                        <Txt
                                            className="col-span-7 bg-gray-200"
                                            readOnly
                                            value={dados.cepOrigemCidade}
                                        />
                                        <Txt
                                            className="col-span-1 bg-gray-200 text-center"
                                            readOnly
                                            value={dados.cepOrigemUF}
                                        />
                                    </div>

                                    {/* CEP destino */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">CEP Destino</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.cepDestino}
                                            onChange={handle("cepDestino")}
                                        />
                                        <Txt
                                            className="col-span-7 bg-gray-200"
                                            readOnly
                                            value={dados.cepDestinoCidade}
                                        />
                                        <Txt
                                            className="col-span-1 bg-gray-200 text-center"
                                            readOnly
                                            value={dados.cepDestinoUF}
                                        />
                                    </div>

                                    {/* Infração */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Infração</Label>
                                        <Txt
                                            className="col-span-10"
                                            value={dados.infracao}
                                            onChange={handle("infracao")}
                                        />
                                    </div>

                                    {/* Local */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Local</Label>
                                        <Txt
                                            className="col-span-10"
                                            value={dados.local}
                                            onChange={handle("local")}
                                        />
                                    </div>

                                    {/* Velocidades */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Vel. Permitida</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.velPermitida}
                                            onChange={handle("velPermitida")}
                                        />

                                        <Label className="col-span-1">Vel. Constatada</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.velConstatada}
                                            onChange={handle("velConstatada")}
                                        />

                                        <Label className="col-span-1">Pontuação</Label>
                                        <Txt
                                            className="col-span-1"
                                            value={dados.pontuacao}
                                            onChange={handle("pontuacao")}
                                        />

                                        <Label className="col-span-1">Título CP</Label>
                                        <Txt
                                            className="col-span-2 bg-gray-200"
                                            readOnly
                                            value={dados.tituloCP}
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>

                        {/* CARD 5 - RECURSO (RETRÁTIL) */}
                        <fieldset className="border border-gray-300 rounded bg-white">
                            <legend
                                className="px-2 text-red-700 font-semibold flex items-center cursor-pointer"
                                onClick={() => toggle(setRecursoOpen)}
                            >
                                {recursoOpen ? (
                                    <ChevronDown className="mr-1" size={16} />
                                ) : (
                                    <ChevronRight className="mr-1" size={16} />
                                )}
                                Recurso
                            </legend>

                            {recursoOpen && (
                                <div className="p-3 space-y-2">
                                    {/* Data Recurso */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Data Recurso</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={dados.dataRecurso}
                                            onChange={handle("dataRecurso")}
                                        />

                                        <label className="col-span-3 flex items-center gap-2 text-[12px]">
                                            <input
                                                type="checkbox"
                                                checked={dados.indeferido}
                                                onChange={handle("indeferido")}
                                            />
                                            Recurso Indeferido
                                        </label>
                                    </div>

                                    {/* Alegação */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Alegação</Label>
                                        <Txt
                                            className="col-span-10"
                                            value={dados.alegacao}
                                            onChange={handle("alegacao")}
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>

                        {/* CARD 6 - MOTORISTA (RETRÁTIL) */}
                        <fieldset className="border border-gray-300 rounded bg-white">
                            <legend
                                className="px-2 text-red-700 font-semibold flex items-center cursor-pointer"
                                onClick={() => toggle(setMotoristaOpen)}
                            >
                                {motoristaOpen ? (
                                    <ChevronDown className="mr-1" size={16} />
                                ) : (
                                    <ChevronRight className="mr-1" size={16} />
                                )}
                                Identificação do Motorista
                            </legend>

                            {motoristaOpen && (
                                <div className="p-3">
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Motorista</Label>
                                        <Txt
                                            className="col-span-2"
                                            value={dados.motoristaCNH}
                                            onChange={handle("motoristaCNH")}
                                        />

                                        <Txt
                                            className="col-span-8 bg-gray-200"
                                            readOnly
                                            value={dados.motoristaNome}
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>

                        {/* CARD 7 - VALORES (RETRÁTIL) */}
                        <fieldset className="border border-gray-300 rounded bg-white">
                            <legend
                                className="px-2 text-red-700 font-semibold flex items-center cursor-pointer"
                                onClick={() => toggle(setValoresOpen)}
                            >
                                {valoresOpen ? (
                                    <ChevronDown className="mr-1" size={16} />
                                ) : (
                                    <ChevronRight className="mr-1" size={16} />
                                )}
                                Valores
                            </legend>

                            {valoresOpen && (
                                <div className="p-3 space-y-3">
                                    {/* Linha 1 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Com Desconto</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={dados.vencComDescData}
                                            onChange={handle("vencComDescData")}
                                        />

                                        <Label className="col-span-1 flex justify-end">Valor</Label>
                                        <Txt
                                            className="col-span-2 text-right"
                                            value={dados.vencComDescValor}
                                            onChange={handle("vencComDescValor")}
                                        />
                                    </div>

                                    {/* Linha 2 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Sem Desconto</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={dados.vencSemDescData}
                                            onChange={handle("vencSemDescData")}
                                        />

                                        <Label className="col-span-1 flex justify-end">Valor</Label>
                                        <Txt
                                            className="col-span-2 text-right"
                                            value={dados.vencSemDescValor}
                                            onChange={handle("vencSemDescValor")}
                                        />
                                    </div>

                                    {/* Linha 3 */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-3 flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={dados.cobrarMotorista}
                                                onChange={handle("cobrarMotorista")}
                                            />
                                            Cobrar do Motorista
                                        </Label>

                                        <Label className="col-span-2">Data Desconto</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={dados.dataDescMotorista}
                                            onChange={handle("dataDescMotorista")}
                                        />
                                    </div>

                                    {/* Linha 4 - Pagamento */}
                                    <div className="grid grid-cols-12 gap-2">
                                        <Label className="col-span-2">Pagamento</Label>
                                        <Txt
                                            type="date"
                                            className="col-span-2"
                                            value={dados.pagtoData}
                                            onChange={handle("pagtoData")}
                                        />

                                        <Label className="col-span-1 flex justify-end">Valor</Label>
                                        <Txt
                                            className="col-span-2 text-right"
                                            value={dados.pagtoValor}
                                            onChange={handle("pagtoValor")}
                                        />
                                    </div>
                                </div>
                            )}
                        </fieldset>
                    </>
                )}

                {/* ===========================================================
           ABA CONSULTA
        =========================================================== */}
                {aba === "consulta" && (
                    <>
                        {/* FILTROS */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Filtros de Consulta
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1">Veículo</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={filtros.veiculo}
                                        onChange={handleFiltro("veiculo")}
                                    />
                                    <Txt className="col-span-4 bg-gray-200" readOnly />

                                    <Label className="col-span-1 justify-end">Motorista</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={filtros.motorista}
                                        onChange={handleFiltro("motorista")}
                                    />
                                    <Txt className="col-span-2 bg-gray-200" readOnly />
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1">Infração</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={filtros.infracao}
                                        onChange={handleFiltro("infracao")}
                                    />
                                    <Txt className="col-span-9 bg-gray-200" readOnly />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1">Vencimento</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtros.vencDe}
                                        onChange={handleFiltro("vencDe")}
                                    />
                                    <span className="text-center col-span-1">a</span>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtros.vencAte}
                                        onChange={handleFiltro("vencAte")}
                                    />

                                    <Label className="col-span-1 justify-end">Pagos</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtros.pagosDe}
                                        onChange={handleFiltro("pagosDe")}
                                    />
                                    <span className="text-center col-span-1">a</span>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={filtros.pagosAte}
                                        onChange={handleFiltro("pagosAte")}
                                    />
                                </div>

                                {/* Linha 4 - Radio Buttons */}
                                <div className="flex gap-4 mt-2 items-center">
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="filtroTipo"
                                            value="todos"
                                            checked={filtros.tipo === "todos"}
                                            onChange={handleFiltro("tipo")}
                                        />
                                        Todos
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="filtroTipo"
                                            value="notificacao"
                                            checked={filtros.tipo === "notificacao"}
                                            onChange={handleFiltro("tipo")}
                                        />
                                        Notificação
                                    </label>
                                    <label className="flex items-center gap-1">
                                        <input
                                            type="radio"
                                            name="filtroTipo"
                                            value="multa"
                                            checked={filtros.tipo === "multa"}
                                            onChange={handleFiltro("tipo")}
                                        />
                                        Multa
                                    </label>

                                    <button className="ml-auto px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                                        <Search size={14} /> Pesquisar
                                    </button>
                                </div>
                            </div>
                        </fieldset>

                        {/* GRID RESULTADOS */}
                        <div className="border border-gray-300 rounded bg-white mt-2 flex-1 overflow-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Placa / Veículo</th>
                                        <th className="border px-2 py-1">Venc. c/ Desconto</th>
                                        <th className="border px-2 py-1">Valor c/ Desc</th>
                                        <th className="border px-2 py-1">Venc. s/ Desc</th>
                                        <th className="border px-2 py-1">Valor s/ Desc</th>
                                        <th className="border px-2 py-1">Data Pagto</th>
                                        <th className="border px-2 py-1">Motorista</th>
                                        <th className="border px-2 py-1">Data Multa</th>
                                        <th className="border px-2 py-1">Hora</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {lista.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="cursor-pointer hover:bg-red-100"
                                            onClick={() => selecionar(item, index)}
                                        >
                                            <td className="border px-2 py-1">
                                                {item.veiculoDescricao}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {item.vencComDescData}
                                            </td>
                                            <td className="border px-2 py-1 text-right">
                                                {item.vencComDescValor}
                                            </td>
                                            <td className="border px-2 py-1">
                                                {item.vencSemDescData}
                                            </td>
                                            <td className="border px-2 py-1 text-right">
                                                {item.vencSemDescValor}
                                            </td>
                                            <td className="border px-2 py-1">{item.pagtoData}</td>
                                            <td className="border px-2 py-1">{item.motoristaNome}</td>
                                            <td className="border px-2 py-1">{item.dataInfracao}</td>
                                            <td className="border px-2 py-1">
                                                {item.horaInfracao}
                                            </td>
                                        </tr>
                                    ))}

                                    {lista.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={9}
                                                className="text-center text-gray-500 py-3"
                                            >
                                                Nenhum registro encontrado
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* ===========================================================
         RODAPÉ
      =========================================================== */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                {/* FECHAR */}
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                {/* LIMPAR */}
                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                {/* INCLUIR */}
                <button
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                {/* ALTERAR */}
                <button
                    onClick={alterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                {/* EXCLUIR */}
                <button
                    onClick={excluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                {/* GERAR CP */}
                <button
                    onClick={() => setModalCP(true)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <FileText size={20} />
                    <span>Gerar CP</span>
                </button>

                {/* ESTORNAR */}
                <button
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <ArrowLeftRight size={20} />
                    <span>Estornar</span>
                </button>
            </div>

            {/* MODAL GERAR CP */}
            {modalCP && <GerarCP onClose={() => setModalCP(false)} />}
        </div>
    );
}
