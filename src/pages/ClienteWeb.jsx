// src/pages/ClienteWeb.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    Search,
    Eye,
    EyeOff,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

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
            tabIndex={readOnly ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        />
    );
}

function Chk({ className = "", tabIndex, ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            tabIndex={props.disabled ? -1 : tabIndex}
            className={["h-[16px] w-[16px]", className].join(" ")}
        />
    );
}

/* ========================= Mocks ========================= */
const clientesMockBase = [
    { codigo: "16", cnpj: "03007331001161", usuario: "BEFIT COMERCIO E", empresa: "BEFIT COMERCIO E EXPORTACAO LTDA", dataCadastro: "24/06/2021 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "03431255000105", usuario: "CERVEJARIA BADEN BAD", empresa: "CERVEJARIA BADEN BADEN LTDA", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "19500000000842", usuario: "CERVEJARIAS KAISER B", empresa: "CERVEJARIAS KAISER BRASIL S.A", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "19800000001733", usuario: "CERVEJARIAS KAISER B", empresa: "CERVEJARIAS KAISER BRASIL S.A.", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "916", cnpj: "34327498000113", usuario: "Cooperativa", empresa: "COOPERATIVA TRAN R C L COOFERTO LTDA", dataCadastro: "06/08/2024 00:00:00", dataDesativacao: "", tipoCliente: "C", permiteCancelar: "N" },
    { codigo: "16", cnpj: "12636651000145", usuario: "FERMAC", empresa: "FERMAC INTERNATIONAL TRANSP NAC INT LTDA", dataCadastro: "16/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "916", cnpj: "03564417001176", usuario: "HNK BR BEBIDAS LTDA", empresa: "HNK BR BEBIDAS LTDA", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "916", cnpj: "50221015000136", usuario: "HNK ITU", empresa: "HNK ITU", dataCadastro: "28/11/2025 12:07:25", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "916", cnpj: "50221015005752", usuario: "HNK PARAMIRIM", empresa: "HNK PARAMIRIM", dataCadastro: "28/11/2025 10:19:23", dataDesativacao: "28/11/2050 10:19:06", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "16854465000105", usuario: "KINUGAWA FABRICACAO", empresa: "KINUGAWA FABRICACAO IMPORTACAO", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "03853895000301", usuario: "MARFRIG GLOBAL FOODS", empresa: "MARFRIG GLOBAL FOODS S.A", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "03853895000573", usuario: "MARFRIG GLOBAL FOODS", empresa: "MARFRIG GLOBAL FOODS S.A", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "03853895000816", usuario: "MARFRIG GLOBAL FOODS", empresa: "MARFRIG GLOBAL FOODS S.A", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
    { codigo: "16", cnpj: "03853895001426", usuario: "MARFRIG GLOBAL FOODS", empresa: "MARFRIG GLOBAL FOODS S.A", dataCadastro: "05/07/2016 00:00:00", dataDesativacao: "", tipoCliente: "R", permiteCancelar: "N" },
];

export default function ClienteWeb({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(clientesMockBase);
    const [resultado, setResultado] = useState(clientesMockBase);

    const [dados, setDados] = useState({
        codigoEmpresa: "",
        nomeUsuario: "",
        senha: "",
        confirmaSenha: "",
        desativarEm: "",
        cliente: "",
        empresa: "",
        tipoCliente: "",
        permiteCancelamento: false,
    });

    const [showSenha, setShowSenha] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [modalMsg, setModalMsg] = useState(null);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const currentTab = parseInt(e.target.getAttribute("tabindex"));
            const nextEl = document.querySelector(`[tabindex="${currentTab + 1}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    const limpar = () => {
        setDados({
            codigoEmpresa: "", nomeUsuario: "", senha: "", confirmaSenha: "",
            desativarEm: "", cliente: "", empresa: "", tipoCliente: "",
            permiteCancelamento: false,
        });
        setEditIndex(null);
    };

    const pesquisar = () => {
        const fc = (dados.codigoEmpresa || "").trim().toLowerCase();
        const fn = (dados.nomeUsuario || "").trim().toLowerCase();
        const fCli = (dados.cliente || "").trim().toLowerCase();

        const filtrado = lista.filter((x) => {
            const okCod = fc ? x.codigo.toLowerCase().includes(fc) : true;
            const okNome = fn ? x.usuario.toLowerCase().includes(fn) : true;
            const okCli = fCli ? x.cnpj.toLowerCase().includes(fCli) : true;
            return okCod && okNome && okCli;
        });

        setResultado(filtrado);
    };

    const incluir = () => {
        if (!dados.codigoEmpresa || !dados.nomeUsuario) {
            setModalMsg({ tipo: "info", texto: "Informe Código Empresa e Nome Usuário!" }); return;
        }
        if (dados.senha !== dados.confirmaSenha) {
            setModalMsg({ tipo: "info", texto: "Senhas não conferem." }); return;
        }
        setModalMsg({
            tipo: "confirm", texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = {
                    codigo: dados.codigoEmpresa, cnpj: dados.cliente, usuario: dados.nomeUsuario,
                    empresa: dados.empresa, dataCadastro: new Date().toLocaleString("pt-BR"),
                    dataDesativacao: "", tipoCliente: dados.tipoCliente,
                    permiteCancelar: dados.permiteCancelamento ? "S" : "N",
                };
                setLista((prev) => [...prev, novo]);
                setResultado((prev) => [...prev, novo]);
                limpar();
                setModalMsg({ tipo: "sucesso", texto: "Cliente Web incluído com sucesso!" });
            },
        });
    };

    const alterar = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        if (dados.senha !== dados.confirmaSenha) {
            setModalMsg({ tipo: "info", texto: "Senhas não conferem." }); return;
        }
        const atualizado = {
            codigo: dados.codigoEmpresa, cnpj: dados.cliente, usuario: dados.nomeUsuario,
            empresa: dados.empresa, dataCadastro: lista[editIndex]?.dataCadastro || "",
            dataDesativacao: lista[editIndex]?.dataDesativacao || "",
            tipoCliente: dados.tipoCliente, permiteCancelar: dados.permiteCancelamento ? "S" : "N",
        };
        const nova = [...lista]; nova[editIndex] = atualizado; setLista(nova); setResultado(nova); limpar();
        setModalMsg({ tipo: "sucesso", texto: "Cliente Web alterado com sucesso!" });
    };

    const excluir = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        setModalMsg({
            tipo: "confirm", texto: "Deseja excluir este cliente?",
            onYes: () => {
                const nova = lista.filter((_, i) => i !== editIndex);
                setLista(nova); setResultado(nova); limpar();
                setModalMsg({ tipo: "sucesso", texto: "Cliente Web excluído com sucesso!" });
            },
        });
    };

    const selecionar = (item, index) => {
        setDados({
            codigoEmpresa: item.codigo, nomeUsuario: item.usuario, senha: "",
            confirmaSenha: "", desativarEm: "", cliente: item.cnpj,
            empresa: item.empresa, tipoCliente: item.tipoCliente,
            permiteCancelamento: item.permiteCancelar === "S",
        });
        setEditIndex(index);
    };

    return (
        <div
            className={`transition-all duration-300 text-[13px] text-gray-700 
      bg-gray-50 flex flex-col
      ${isSeguranca
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }`}
        >
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO LOCALIZE CARGAS
            </h1>

            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    {/* Subtítulo */}
                    <span className="text-[12px] text-gray-600 font-medium">Cliente Localize Cargas</span>

                    {/* Parâmetros */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros</legend>

                        {/* Linha 1 - Código Empresa | Cliente */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Código Empresa</Label>
                            <Txt
                                className="col-span-3"
                                value={dados.codigoEmpresa}
                                onChange={(e) => setDados({ ...dados, codigoEmpresa: e.target.value })}
                                tabIndex={1}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-1" />
                            <Label className="col-span-1 justify-end">Cliente</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.cliente}
                                onChange={(e) => setDados({ ...dados, cliente: e.target.value })}
                                tabIndex={5}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Linha 2 - Nome Usuário | Empresa */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Nome Usuário</Label>
                            <Txt
                                className="col-span-3"
                                value={dados.nomeUsuario}
                                onChange={(e) => setDados({ ...dados, nomeUsuario: e.target.value })}
                                tabIndex={2}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-1" />
                            <Label className="col-span-1 justify-end">Empresa</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.empresa}
                                onChange={(e) => setDados({ ...dados, empresa: e.target.value })}
                                tabIndex={6}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Linha 3 - Senha | Tipo Cliente */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Senha</Label>
                            <div className="col-span-3 relative">
                                <Txt
                                    type={showSenha ? "text" : "password"}
                                    value={dados.senha}
                                    onChange={(e) => setDados({ ...dados, senha: e.target.value })}
                                    tabIndex={3}
                                    onKeyDown={handleKeyDown}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSenha(!showSenha)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    tabIndex={-1}
                                >
                                    {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <div className="col-span-1" />
                            <Label className="col-span-1 justify-end">Tipo Cliente</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.tipoCliente}
                                onChange={(e) => setDados({ ...dados, tipoCliente: e.target.value })}
                                tabIndex={7}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Linha 4 - Confirma Senha | Permite Cancelamento + Pesquisar */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Confirma Senha</Label>
                            <Txt
                                className="col-span-3"
                                type="password"
                                value={dados.confirmaSenha}
                                onChange={(e) => setDados({ ...dados, confirmaSenha: e.target.value })}
                                tabIndex={4}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-1" />
                            <div className="col-span-4">
                                <label className="flex items-center gap-1 text-[12px]">
                                    <Chk
                                        checked={dados.permiteCancelamento}
                                        onChange={(e) => setDados({ ...dados, permiteCancelamento: e.target.checked })}
                                        tabIndex={8}
                                    />
                                    Permite Cancelamento de Entrega
                                </label>
                            </div>
                            <div className="col-span-3 flex justify-end">
                                <button
                                    onClick={pesquisar}
                                    tabIndex={10}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                    title="Pesquisar"
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pesquisar(); } }}
                                >
                                    <Search size={14} className="text-red-700" />
                                    Pesquisar
                                </button>
                            </div>
                        </div>

                        {/* Linha 5 - Desativar em */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Desativar em</Label>
                            <Txt
                                className="col-span-2"
                                type="date"
                                value={dados.desativarEm}
                                onChange={(e) => setDados({ ...dados, desativarEm: e.target.value })}
                                tabIndex={9}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                    </fieldset>

                    {/* Grid */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Lista de Clientes</legend>

                        <div className="border border-gray-300 rounded max-h-[320px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Código</th>
                                        <th className="border px-2 py-1">CNPJ Cliente</th>
                                        <th className="border px-2 py-1">Usuário</th>
                                        <th className="border px-2 py-1">Empresa</th>
                                        <th className="border px-2 py-1">Data Cadastro</th>
                                        <th className="border px-2 py-1">Data Desativação</th>
                                        <th className="border px-2 py-1">Tipo Cliente</th>
                                        <th className="border px-2 py-1">Permite Cancelar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => selecionar(item, idx)}
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-orange-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1 text-center">{item.codigo}</td>
                                            <td className="border px-2 py-1">{item.cnpj}</td>
                                            <td className="border px-2 py-1">{item.usuario}</td>
                                            <td className="border px-2 py-1">{item.empresa}</td>
                                            <td className="border px-2 py-1 text-center">{item.dataCadastro}</td>
                                            <td className="border px-2 py-1 text-center">{item.dataDesativacao}</td>
                                            <td className="border px-2 py-1 text-center">{item.tipoCliente}</td>
                                            <td className="border px-2 py-1 text-center">{item.permiteCancelar}</td>
                                        </tr>
                                    ))}
                                    {resultado.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="border px-2 py-2 text-center text-gray-500">
                                                Nenhum registro encontrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end mt-2">
                            <span className="text-[12px] text-red-700 font-medium">
                                Total de Clientes: {resultado.length}
                            </span>
                        </div>
                    </fieldset>
                </div>
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button onClick={() => navigate(-1)} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Fechar">
                    <XCircle size={20} /><span>Fechar</span>
                </button>
                <button onClick={() => { limpar(); setResultado(lista); }} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Limpar">
                    <RotateCcw size={20} /><span>Limpar</span>
                </button>
                <button onClick={incluir} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Incluir">
                    <PlusCircle size={20} /><span>Incluir</span>
                </button>
                <button onClick={alterar} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Alterar">
                    <Edit size={20} /><span>Alterar</span>
                </button>
                <button onClick={excluir} className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`} title="Excluir">
                    <Trash2 size={20} /><span>Excluir</span>
                </button>
            </div>

            {/* ModalMsg padrão */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className={`font-bold mb-4 ${modalMsg.tipo === "sucesso" ? "text-green-700" : modalMsg.tipo === "confirm" ? "text-gray-800" : "text-red-700"}`}>
                            {modalMsg.texto}
                        </p>
                        {modalMsg.tipo === "confirm" ? (
                            <div className="flex justify-center gap-2">
                                <button className="px-3 py-1 bg-gray-300 rounded" onClick={() => setModalMsg(null)}>Não</button>
                                <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => { const fn = modalMsg.onYes; setModalMsg(null); fn?.(); }}>Sim</button>
                            </div>
                        ) : (
                            <button className="px-3 py-1 bg-red-700 text-white rounded" onClick={() => setModalMsg(null)}>OK</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
