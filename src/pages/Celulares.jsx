// src/pages/Celulares.jsx
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
const celularesMockBase = [
    { licenca: "2", usuario: "ADMIN", cnh: "", motorista: "PAULO ARANHA", bloqueado: "N", minutos: "1", ddd: "", telefone: "" },
    { licenca: "3", usuario: "CARLOSCADU", cnh: "0023297806", motorista: "CARLOS ALBERTO D AVILA VALAU", bloqueado: "N", minutos: "1", ddd: "", telefone: "" },
    { licenca: "4", usuario: "TESTEBULOG", cnh: "05456457630", motorista: "LEANDRO CORDEIRO DOS SANTOS", bloqueado: "N", minutos: "1", ddd: "", telefone: "" },
    { licenca: "5", usuario: "Daniel Oliveira", cnh: "03701757797", motorista: "SAMUEL ANANIAS", bloqueado: "N", minutos: "1", ddd: "", telefone: "-" },
    { licenca: "6", usuario: "TESTETESTE", cnh: "0023297806", motorista: "CARLOS ALBERTO D AVILA VALAU", bloqueado: "N", minutos: "1", ddd: "", telefone: "" },
    { licenca: "7", usuario: "ALAN", cnh: "01628446760", motorista: "ALAN DA COSTA", bloqueado: "N", minutos: "0", ddd: "", telefone: "" },
    { licenca: "8", usuario: "TESTE", cnh: "977385714", motorista: "ALAN DA SILVA BARRETO", bloqueado: "N", minutos: "0", ddd: "", telefone: "" },
];

export default function Celulares({ open }) {
    const location = useLocation();
    const isSeguranca = location.pathname.startsWith("/modulo-seguranca");
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(celularesMockBase);
    const [resultado, setResultado] = useState(celularesMockBase);

    const [dados, setDados] = useState({
        licenca: "",
        nomeUsuario: "",
        senha: "",
        bloqueado: false,
        motorista: "",
        ddcCelular: "",
        minRastreador: "",
    });

    const [showSenha, setShowSenha] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [modalMsg, setModalMsg] = useState(null);

    const licencasDisponiveis = 10;
    const licencasUsadas = resultado.length;

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
            licenca: "", nomeUsuario: "", senha: "", bloqueado: false,
            motorista: "", ddcCelular: "", minRastreador: "",
        });
        setEditIndex(null);
    };

    const pesquisar = () => {
        const fLic = (dados.licenca || "").trim().toLowerCase();
        const fNome = (dados.nomeUsuario || "").trim().toLowerCase();
        const fMot = (dados.motorista || "").trim().toLowerCase();

        const filtrado = lista.filter((x) => {
            const okLic = fLic ? x.licenca.toLowerCase().includes(fLic) : true;
            const okNome = fNome ? x.usuario.toLowerCase().includes(fNome) : true;
            const okMot = fMot ? x.motorista.toLowerCase().includes(fMot) : true;
            return okLic && okNome && okMot;
        });

        setResultado(filtrado);
    };

    const incluir = () => {
        if (!dados.licenca || !dados.nomeUsuario) {
            setModalMsg({ tipo: "info", texto: "Informe Licença e Nome Usuário!" }); return;
        }
        setModalMsg({
            tipo: "confirm", texto: "Confirma a Inclusão?",
            onYes: () => {
                const novo = {
                    licenca: dados.licenca, usuario: dados.nomeUsuario, cnh: "",
                    motorista: dados.motorista, bloqueado: dados.bloqueado ? "S" : "N",
                    minutos: dados.minRastreador || "0", ddd: dados.ddcCelular, telefone: "",
                };
                setLista((prev) => [...prev, novo]);
                setResultado((prev) => [...prev, novo]);
                limpar();
                setModalMsg({ tipo: "sucesso", texto: "Celular incluído com sucesso!" });
            },
        });
    };

    const alterar = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        const atualizado = {
            ...lista[editIndex],
            licenca: dados.licenca, usuario: dados.nomeUsuario,
            motorista: dados.motorista, bloqueado: dados.bloqueado ? "S" : "N",
            minutos: dados.minRastreador || lista[editIndex].minutos,
            ddd: dados.ddcCelular,
        };
        const nova = [...lista]; nova[editIndex] = atualizado; setLista(nova); setResultado(nova); limpar();
        setModalMsg({ tipo: "sucesso", texto: "Celular alterado com sucesso!" });
    };

    const excluir = () => {
        if (editIndex === null) { setModalMsg({ tipo: "info", texto: "Selecione um registro!" }); return; }
        setModalMsg({
            tipo: "confirm", texto: "Deseja excluir este registro?",
            onYes: () => {
                const nova = lista.filter((_, i) => i !== editIndex);
                setLista(nova); setResultado(nova); limpar();
                setModalMsg({ tipo: "sucesso", texto: "Celular excluído com sucesso!" });
            },
        });
    };

    const selecionar = (item, index) => {
        setDados({
            licenca: item.licenca, nomeUsuario: item.usuario, senha: "",
            bloqueado: item.bloqueado === "S", motorista: item.motorista,
            ddcCelular: item.ddd || "", minRastreador: item.minutos || "",
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
                CADASTRO MOBILE
            </h1>

            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                    <span className="text-[12px] text-gray-600 font-medium">Licença Mobile</span>

                    {/* Parâmetros */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros</legend>

                        {/* Linha 1 - Licença | Motorista */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Licença</Label>
                            <Txt
                                className="col-span-2"
                                value={dados.licenca}
                                onChange={(e) => setDados({ ...dados, licenca: e.target.value })}
                                tabIndex={1}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-2" />
                            <Label className="col-span-1 justify-end">Motorista</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.motorista}
                                onChange={(e) => setDados({ ...dados, motorista: e.target.value })}
                                tabIndex={5}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Linha 2 - Nome Usuário | DDD/Celular */}
                        <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                            <Label className="col-span-1 justify-end">Nome Usuário</Label>
                            <Txt
                                className="col-span-4"
                                value={dados.nomeUsuario}
                                onChange={(e) => setDados({ ...dados, nomeUsuario: e.target.value })}
                                tabIndex={2}
                                onKeyDown={handleKeyDown}
                            />
                            <Label className="col-span-1 justify-end">DDD/Celular</Label>
                            <Txt
                                className="col-span-5"
                                value={dados.ddcCelular}
                                onChange={(e) => setDados({ ...dados, ddcCelular: e.target.value })}
                                tabIndex={6}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        {/* Linha 3 - Senha | Min. Rastreador + Pesquisar */}
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
                            <Label className="col-span-1 justify-end">Min. Rastreador</Label>
                            <Txt
                                className="col-span-3"
                                value={dados.minRastreador}
                                onChange={(e) => setDados({ ...dados, minRastreador: e.target.value })}
                                tabIndex={7}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="col-span-2 flex justify-end">
                                <button
                                    onClick={pesquisar}
                                    tabIndex={8}
                                    className="border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px] flex items-center gap-1"
                                    title="Pesquisar"
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); pesquisar(); } }}
                                >
                                    <Search size={14} className="text-red-700" />
                                    Pesquisar
                                </button>
                            </div>
                        </div>

                        {/* Linha 4 - Bloqueado */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-1" />
                            <div className="col-span-4">
                                <label className="flex items-center gap-1 text-[12px]">
                                    <Chk
                                        checked={dados.bloqueado}
                                        onChange={(e) => setDados({ ...dados, bloqueado: e.target.checked })}
                                        tabIndex={4}
                                    />
                                    Bloqueado
                                </label>
                            </div>
                        </div>
                    </fieldset>

                    {/* Grid */}
                    <fieldset className="border border-gray-300 rounded p-3">
                        <legend className="px-2 text-red-700 font-semibold text-[13px]">Lista de Licenças</legend>

                        <div className="border border-gray-300 rounded max-h-[320px] overflow-y-auto">
                            <table className="w-full text-[12px]">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">Licenças</th>
                                        <th className="border px-2 py-1">Usuário</th>
                                        <th className="border px-2 py-1">CNH</th>
                                        <th className="border px-2 py-1">Motorista</th>
                                        <th className="border px-2 py-1">Bloqueado</th>
                                        <th className="border px-2 py-1">Minutos</th>
                                        <th className="border px-2 py-1">DDD</th>
                                        <th className="border px-2 py-1">Telefone</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.map((item, idx) => (
                                        <tr
                                            key={idx}
                                            onClick={() => selecionar(item, idx)}
                                            className={`cursor-pointer hover:bg-red-100 ${editIndex === idx ? "bg-orange-100" : ""}`}
                                        >
                                            <td className="border px-2 py-1 text-center">{item.licenca}</td>
                                            <td className="border px-2 py-1">{item.usuario}</td>
                                            <td className="border px-2 py-1">{item.cnh}</td>
                                            <td className="border px-2 py-1">{item.motorista}</td>
                                            <td className="border px-2 py-1 text-center">{item.bloqueado}</td>
                                            <td className="border px-2 py-1 text-center">{item.minutos}</td>
                                            <td className="border px-2 py-1 text-center">{item.ddd}</td>
                                            <td className="border px-2 py-1">{item.telefone}</td>
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

                        <div className="flex justify-end mt-2 gap-6">
                            <span className="text-[12px] text-red-700 font-medium">
                                Licenças Disponíveis: {licencasDisponiveis}
                            </span>
                            <span className="text-[12px] text-red-700 font-medium">
                                Licenças Usadas: {licencasUsadas}
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
