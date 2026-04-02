import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    FileSpreadsheet,
    Search,
} from "lucide-react";
import InputBuscaCidade from "../components/InputBuscaCidade";

import { useIconColor } from "../context/IconColorContext";

/* ========================= Helpers (padrão do projeto) ========================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, tabIndex, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            tabIndex={tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        />
    );
}

function Sel({ className = "", ...props }) {
    return (
        <select
            {...props}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full bg-white",
                className,
            ].join(" ")}
        />
    );
}

/* ========================= Mocks ========================= */
const fornecedoresMockBase = [
    {
        id: 1,
        tipoDoc: "CNPJ",
        doc: "10.545.575/0001-43",
        ie: "",
        fantasia: "EDERSON GEDIR BREHM",
        razao: "EDERSON GEDIR BREHM D O NASCIME",
        cep: "13000-000",
        cidade: "TRES CACHOEIRAS",
        uf: "RS",
        bairro: "CENTRO",
        endereco: "RUA TESTE",
        numero: "123",
        ddd1: "51",
        fone1: "99999-9999",
        ddd2: "",
        fone2: "",
        banco: "033",
        agencia: "1234",
        agenciaDig: "5",
        conta: "98765",
        contaDig: "0",
        contato: "EDERSON",
        tipoConta: "Conta Corrente",
        contaReduzida: "123",
        contaContabil: "1.1.1.01",
        email: "teste@teste.com",
        catCod: "8",
        catDesc: "DESPESAS COM VEICULOS",
        subCod: "14",
        subDesc: "FINANCIAMENTO",
        chavePix: "10.545.575/0001-43",
        filial: "001",
    },
    {
        id: 2,
        tipoDoc: "CNPJ",
        doc: "00.452.956/0001-11",
        ie: "",
        fantasia: "WELLINGTON FERNANDES",
        razao: "WELLINGTON FERNANDES DE OLIVEIRA",
        cep: "",
        cidade: "SAO VICENTE",
        uf: "SP",
        bairro: "",
        endereco: "",
        numero: "",
        ddd1: "",
        fone1: "",
        ddd2: "",
        fone2: "",
        banco: "",
        agencia: "",
        agenciaDig: "",
        conta: "",
        contaDig: "",
        contato: "WELLINGTON",
        tipoConta: "Conta Corrente",
        contaReduzida: "",
        contaContabil: "",
        email: "",
        catCod: "",
        catDesc: "",
        subCod: "",
        subDesc: "",
        chavePix: "",
        filial: "001",
    },
];

const tipoDocOpts = ["CNPJ", "CPF", "Outros"];
const tipoContaOpts = ["Conta Corrente", "Poupança"];

export default function Fornecedor({ open }) {
    const location = useLocation();
    const isOficina = location.pathname.startsWith("/modulo-oficina");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== Filial (SEM contexto por enquanto) ===== */
    const [filialSelecionada, setFilialSelecionada] = useState("001");

    // se você quiser depois trocar via combobox, já está pronto
    useEffect(() => {
        if (!filialSelecionada) setFilialSelecionada("001");
    }, [filialSelecionada]);

    /* ===== Abas ===== */
    const [activeTab, setActiveTab] = useState("cadastro"); // cadastro | consulta

    /* ===== Lista (mock) ===== */
    const [lista, setLista] = useState(fornecedoresMockBase);

    /* ===== Cadastro ===== */
    const [cad, setCad] = useState({
        id: null,
        tipoDoc: "CNPJ",
        doc: "",
        ie: "",
        fantasia: "",
        razao: "",

        cep: "",
        cidade: "",
        uf: "",
        bairro: "",

        endereco: "",
        numero: "",

        ddd1: "",
        fone1: "",
        ddd2: "",
        fone2: "",

        banco: "",
        agencia: "",
        agenciaDig: "",
        conta: "",
        contaDig: "",
        contato: "",

        tipoConta: "Conta Corrente",
        contaReduzida: "",
        contaContabil: "",

        email: "",

        catCod: "",
        catDesc: "",
        subCod: "",
        subDesc: "",

        chavePix: "",

        filial: "001",
    });

    const setF = (campo) => (e) => {
        setCad((p) => ({ ...p, [campo]: e.target.value }));
    };

    /* Cidade/UF bloqueados (serão preenchidos via busca) */
    const cidadeReadOnly = true;
    const ufReadOnly = true;

    /* ===== Consulta ===== */
    const [cons, setCons] = useState({
        tipoDoc: "CNPJ",
        doc: "",
        cidade: "",
        uf: "",
        contato: "",
        razao: "",
        fantasia: "",
    });

    const setC = (campo) => (e) =>
        setCons((p) => ({ ...p, [campo]: e.target.value }));

    const [resultado, setResultado] = useState([]);

    /* ===== Modais / mensagens ===== */
    const [modalMsg, setModalMsg] = useState(null);

    /* ===== Util ===== */
    const limparCadastro = () => {
        setCad((p) => ({
            ...p,
            id: null,
            tipoDoc: "CNPJ",
            doc: "",
            ie: "",
            fantasia: "",
            razao: "",
            cep: "",
            cidade: "",
            uf: "",
            bairro: "",
            endereco: "",
            numero: "",
            ddd1: "",
            fone1: "",
            ddd2: "",
            fone2: "",
            banco: "",
            agencia: "",
            agenciaDig: "",
            conta: "",
            contaDig: "",
            contato: "",
            tipoConta: "Conta Corrente",
            contaReduzida: "",
            contaContabil: "",
            email: "",
            catCod: "",
            catDesc: "",
            subCod: "",
            subDesc: "",
            chavePix: "",
            filial: filialSelecionada || p.filial || "001",
        }));
    };

    const limparConsulta = () => {
        setCons({
            tipoDoc: "CNPJ",
            doc: "",
            cidade: "",
            uf: "",
            contato: "",
            razao: "",
            fantasia: "",
        });
        setResultado([]);
    };

    /* ===== Ações ===== */
    const acaoIncluir = () => {
        const novo = {
            ...cad,
            id: Date.now(),
            filial: filialSelecionada || cad.filial || "001",
        };
        setLista((prev) => [novo, ...prev]);
        setModalMsg({ tipo: "sucesso", texto: "Fornecedor incluído com sucesso! (mock)" });
    };

    const acaoAlterar = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um fornecedor para alterar." });
            return;
        }
        setLista((prev) => prev.map((x) => (x.id === cad.id ? { ...cad } : x)));
        setModalMsg({ tipo: "sucesso", texto: "Fornecedor alterado com sucesso! (mock)" });
    };

    const acaoExcluir = () => {
        if (!cad.id) {
            setModalMsg({ tipo: "info", texto: "Selecione um fornecedor para excluir." });
            return;
        }
        setModalMsg({
            tipo: "confirm",
            texto: "Deseja excluir este fornecedor?",
            onYes: () => {
                setLista((prev) => prev.filter((x) => x.id !== cad.id));
                limparCadastro();
                setModalMsg({ tipo: "sucesso", texto: "Fornecedor excluído com sucesso! (mock)" });
            },
        });
    };

    const acaoExcel = () => {
        setModalMsg({ tipo: "sucesso", texto: "Exportação Excel gerada! (mock)" });
    };

    const acaoPesquisar = () => {
        const doc = (cons.doc || "").trim().toLowerCase();
        const cidade = (cons.cidade || "").trim().toLowerCase();
        const uf = (cons.uf || "").trim().toLowerCase();
        const contato = (cons.contato || "").trim().toLowerCase();
        const razao = (cons.razao || "").trim().toLowerCase();
        const fantasia = (cons.fantasia || "").trim().toLowerCase();

        const filtrado = lista.filter((x) => {
            const okTipo = cons.tipoDoc ? x.tipoDoc === cons.tipoDoc : true;
            const okDoc = doc ? String(x.doc || "").toLowerCase().includes(doc) : true;
            const okCidade = cidade ? String(x.cidade || "").toLowerCase().includes(cidade) : true;
            const okUf = uf ? String(x.uf || "").toLowerCase().includes(uf) : true;
            const okContato = contato ? String(x.contato || "").toLowerCase().includes(contato) : true;
            const okRazao = razao ? String(x.razao || "").toLowerCase().includes(razao) : true;
            const okFantasia = fantasia ? String(x.fantasia || "").toLowerCase().includes(fantasia) : true;
            return okTipo && okDoc && okCidade && okUf && okContato && okRazao && okFantasia;
        });

        setResultado(filtrado);
    };

    const abrirCadastro = (row) => {
        setCad({ ...row, filial: row.filial || filialSelecionada || "001" });
        setActiveTab("cadastro");
    };

    /* ===== Computed ===== */
    const tituloTopo = useMemo(() => "FORNECEDOR", []);

    return (
        <div
            className={`
        transition-all duration-300 text-[13px] text-gray-700 bg-gray-50
        flex flex-col
        ${isOficina
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }
      `}
        >
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                {tituloTopo}
            </h1>

            {/* Abas (padrão do projeto: barra + tab ativa branca) */}
            <div className="flex border-b border-gray-300 bg-white">
                {[
                    { key: "cadastro", label: "Cadastro" },
                    { key: "consulta", label: "Consulta" },
                ].map((t, idx) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${activeTab === t.key
                            ? "bg-white text-red-700 border-gray-300"
                            : "bg-gray-100 text-gray-600 border-transparent"
                            } ${idx > 0 ? "ml-1" : ""} `}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-2">
                {/* ========================= ABA CADASTRO ========================= */}
                {activeTab === "cadastro" && (
                    <fieldset className="border border-gray-300 rounded p-3 bg-white">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">
                            Fornecedor
                        </legend>

                        <div className="space-y-2">
                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Tipo Doc.</Label>
                                <Sel className="col-span-1" value={cad.tipoDoc} onChange={setF("tipoDoc")}>
                                    {tipoDocOpts.map((x) => (
                                        <option key={x} value={x}>
                                            {x}
                                        </option>
                                    ))}
                                </Sel>

                                <Label className="col-span-1 justify-end">{cad.tipoDoc}</Label>
                                <Txt className="col-span-3" value={cad.doc} onChange={setF("doc")} />

                                <Label className="col-span-1 justify-end">Inscr. Estadual</Label>
                                <Txt className="col-span-5" value={cad.ie} onChange={setF("ie")} />


                            </div>

                            {/* Linha 2 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Razão Social</Label>
                                <Txt className="col-span-5" value={cad.razao} onChange={setF("razao")} />

                                <Label className="col-span-1 justify-end">Fantasia</Label>
                                <Txt className="col-span-5" value={cad.fantasia} onChange={setF("fantasia")} />
                                <Txt className="col-span-0 hidden" readOnly tabIndex={-1} />
                            </div>

                            {/* Linha 3 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Cidade</Label>

                                <InputBuscaCidade
                                    className="col-span-1 text-center"
                                    label={null}
                                    value={cad.cep}
                                    onChange={setF("cep")}
                                    onSelect={(cid) => {
                                        setCad((p) => ({
                                            ...p,
                                            cidade: cid.nome,
                                            uf: cid.uf,
                                            cep: cid.cep,
                                        }));
                                    }}
                                />

                                <Txt
                                    className="col-span-3 bg-gray-200"
                                    value={cad.cidade}
                                    onChange={setF("cidade")}
                                    readOnly={cidadeReadOnly}
                                    tabIndex={-1}
                                />

                                <Txt
                                    className="col-span-1 text-center bg-gray-200"
                                    value={cad.uf}
                                    onChange={setF("uf")}
                                    readOnly={ufReadOnly}
                                    tabIndex={-1}
                                />

                                <Label className="col-span-1 justify-end">Bairro</Label>
                                <Txt className="col-span-5" value={cad.bairro} onChange={setF("bairro")} />
                            </div>

                            {/* Linha 4 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Endereço</Label>
                                <Txt className="col-span-9" value={cad.endereco} onChange={setF("endereco")} />

                                <Label className="col-span-1 justify-end">Nº</Label>
                                <Txt className="col-span-1" value={cad.numero} onChange={setF("numero")} />
                            </div>

                            {/* Linha 5 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Fone 1</Label>
                                <Txt className="col-span-1 text-center" placeholder="DDD" value={cad.ddd1} onChange={setF("ddd1")} />
                                <Txt className="col-span-3" placeholder="Telefone" value={cad.fone1} onChange={setF("fone1")} />

                                <Label className="col-span-1 justify-end">Fone 2</Label>
                                <Txt className="col-span-1 text-center" placeholder="DDD" value={cad.ddd2} onChange={setF("ddd2")} />
                                <Txt className="col-span-3" placeholder="Telefone" value={cad.fone2} onChange={setF("fone2")} />
                                <Label className="col-span-1 justify-end">Nome Contato</Label>
                                <Txt className="col-span-1" value={cad.contato} onChange={setF("contato")} />
                            </div>

                            {/* Linha 6 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Banco</Label>
                                <Txt className="col-span-1" value={cad.banco} onChange={setF("banco")} />

                                <Label className="col-span-1 justify-end">Agência</Label>
                                <Txt className="col-span-2" value={cad.agencia} onChange={setF("agencia")} />
                                <Txt className="col-span-1 text-center" placeholder="Dig" value={cad.agenciaDig} onChange={setF("agenciaDig")} />

                                <Label className="col-span-1 justify-end">Nº Conta</Label>
                                <Txt className="col-span-2" value={cad.conta} onChange={setF("conta")} />
                                <Txt className="col-span-1 text-center" placeholder="Dig" value={cad.contaDig} onChange={setF("contaDig")} />


                            </div>

                            {/* Linha 7 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Tipo Conta</Label>
                                <Sel className="col-span-3" value={cad.tipoConta} onChange={setF("tipoConta")}>
                                    {tipoContaOpts.map((x) => (
                                        <option key={x} value={x}>
                                            {x}
                                        </option>
                                    ))}
                                </Sel>

                                <Label className="col-span-2 justify-end">Conta Contábil Reduzida</Label>
                                <Txt className="col-span-2" value={cad.contaReduzida} onChange={setF("contaReduzida")} />

                                <Label className="col-span-2 justify-end">Conta Contábil</Label>
                                <Txt className="col-span-2" value={cad.contaContabil} onChange={setF("contaContabil")} />
                            </div>

                            {/* Linha 8 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">E-mail</Label>
                                <Txt className="col-span-11" value={cad.email} onChange={setF("email")} />
                            </div>

                            {/* Linha 9 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Categoria</Label>
                                <Txt className="col-span-1" value={cad.catCod} onChange={setF("catCod")} />
                                <Txt className="col-span-4 bg-gray-200" readOnly value={cad.catDesc} onChange={setF("catDesc")} />

                                <Label className="col-span-1 justify-end">Subcategoria</Label>
                                <Txt className="col-span-1" value={cad.subCod} onChange={setF("subCod")} />
                                <Txt className="col-span-4 bg-gray-200" readOnly value={cad.subDesc} onChange={setF("subDesc")} />
                            </div>

                            {/* Linha 10 */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                                <Label className="col-span-1 justify-end">Chave Pix</Label>
                                <Txt className="col-span-11" value={cad.chavePix} onChange={setF("chavePix")} />
                            </div>



                        </div>
                    </fieldset>
                )}

                {/* ========================= ABA CONSULTA ========================= */}
                {activeTab === "consulta" && (
                    <>
                        {/* Card 1 */}
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros de Pesquisa
                            </legend>

                            <div className="space-y-2">
                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Tipo Doc.</Label>
                                    <Sel className="col-span-2" value={cons.tipoDoc} onChange={setC("tipoDoc")}>
                                        <option value="CNPJ">CNPJ</option>
                                        <option value="CPF">CPF</option>
                                    </Sel>

                                    <Label className="col-span-1 justify-end">{cons.tipoDoc}</Label>
                                    <Txt className="col-span-2" value={cons.doc} onChange={setC("doc")} />

                                    <Label className="col-span-1 justify-end">Cidade</Label>
                                    <Txt className="col-span-3" value={cons.cidade} onChange={setC("cidade")} />

                                    <Label className="col-span-1 justify-end">UF</Label>
                                    <Txt className="col-span-1 text-center" value={cons.uf} onChange={setC("uf")} />

                                    <Label className="col-span-1 justify-end">Nome Contato</Label>
                                    <Txt className="col-span-0 hidden" />
                                </div>

                                {/* Linha Nome Contato */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Nome Contato</Label>
                                    <Txt className="col-span-3" value={cons.contato} onChange={setC("contato")} />
                                    <div className="col-span-8" />
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-1 justify-end">Razão Social</Label>
                                    <Txt className="col-span-7" value={cons.razao} onChange={setC("razao")} />

                                    <Label className="col-span-1 justify-end">Fantasia</Label>
                                    <Txt className="col-span-3" value={cons.fantasia} onChange={setC("fantasia")} />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <div className="col-span-12 flex justify-end gap-2">
                                        <button
                                            onClick={acaoPesquisar}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        >
                                            <Search size={14} className="text-red-700" />
                                            Pesquisar
                                        </button>
                                        <button
                                            onClick={limparConsulta}
                                            className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                        >
                                            <RotateCcw size={14} className="text-red-700" />
                                            Limpar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Card 2 Grid */}
                        <fieldset className="border border-gray-300 rounded p-2 bg-white">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultado (2 cliques abre no Cadastro)
                            </legend>

                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[900px] w-full text-[12px] border-collapse">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="border px-2 py-1">CNPJ/CPF</th>
                                            <th className="border px-2 py-1">Fantasia</th>
                                            <th className="border px-2 py-1">Razão Social</th>
                                            <th className="border px-2 py-1">Cidade</th>
                                            <th className="border px-2 py-1">UF</th>
                                            <th className="border px-2 py-1">Contato</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {(resultado.length ? resultado : []).map((r) => (
                                            <tr
                                                key={r.id}
                                                className="hover:bg-green-100 cursor-pointer"
                                                onDoubleClick={() => abrirCadastro(r)}
                                            >
                                                <td className="border px-2 py-1 text-center">{r.doc}</td>
                                                <td className="border px-2 py-1">{r.fantasia}</td>
                                                <td className="border px-2 py-1">{r.razao}</td>
                                                <td className="border px-2 py-1">{r.cidade}</td>
                                                <td className="border px-2 py-1 text-center">{r.uf}</td>
                                                <td className="border px-2 py-1">{r.contato}</td>
                                            </tr>
                                        ))}

                                        {resultado.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="border px-2 py-2 text-center text-gray-500">
                                                    Informe os filtros e clique em Pesquisar.
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

            {/* ========================= Rodapé padrão ========================= */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Fechar"
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={() => {
                        if (activeTab === "cadastro") limparCadastro();
                        else limparConsulta();
                    }}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Limpar"
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={acaoIncluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Incluir"
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={acaoAlterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Alterar"
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={acaoExcluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Excluir"
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>

                <button
                    onClick={acaoExcel}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Excel"
                >
                    <FileSpreadsheet size={20} />
                    <span>Excel</span>
                </button>
            </div>

            {/* ========================= ModalMsg padrão ========================= */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p
                            className={`font-bold mb-4 ${modalMsg.tipo === "sucesso"
                                ? "text-green-700"
                                : modalMsg.tipo === "confirm"
                                    ? "text-gray-800"
                                    : "text-red-700"
                                } `}
                        >
                            {modalMsg.texto}
                        </p>

                        {modalMsg.tipo === "confirm" ? (
                            <div className="flex justify-center gap-2">
                                <button
                                    className="px-3 py-1 bg-gray-300 rounded"
                                    onClick={() => setModalMsg(null)}
                                >
                                    Não
                                </button>
                                <button
                                    className="px-3 py-1 bg-red-700 text-white rounded"
                                    onClick={() => {
                                        const fn = modalMsg.onYes;
                                        setModalMsg(null);
                                        fn?.();
                                    }}
                                >
                                    Sim
                                </button>
                            </div>
                        ) : (
                            <button
                                className="px-3 py-1 bg-red-700 text-white rounded"
                                onClick={() => setModalMsg(null)}
                            >
                                OK
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
