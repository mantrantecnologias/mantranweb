// src/pages/EnvioSefaz.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Zap, Search, Settings } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";
import ConsultaSefazCte from "./ConsultaSefazCte";
import CteParametro from "./CteParametro";

/* ==== COMPONENTES BÁSICOS ==== */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] flex items-center text-gray-700 ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", ...rest }) {
    return (
        <input
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        />
    );
}

function Sel({ className = "", children, ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

export default function EnvioSefaz({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    // MOCK / ESTADO
    const mockEmpresa = "001 - MANTRAN TRANSPORTES LTDA";
    const mockFilial = "001 - TESTE MANTRAN";
    const mockCnpj = "50221019000136";
    const mockRazao = "HNK-ITU (1) MATRIZ";

    const [filtros, setFiltros] = useState({
        empresa: mockEmpresa,
        filial: mockFilial,
        cnpjCliente: mockCnpj,
        razaoCliente: mockRazao,
        operador: "TODOS",
        classificarPor: "Padrão",
        dtCadIni: "",
        dtCadFim: "",
        nrViagemIni: "",
        nrViagemFim: "",
        serieCtrc: "",
        ctrcCtrlIni: "",
        ctrcCtrlFim: "",
    });

    const [totalControles, setTotalControles] = useState(0);
    const [controleAtual, setControleAtual] = useState(0);
    const [envioEmAndamento, setEnvioEmAndamento] = useState(false);
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalMsg, setModalMsg] = useState(false);
    const [qtdEncontrada, setQtdEncontrada] = useState(0);
    const [showConsulta, setShowConsulta] = useState(false);
    const [showParametro, setShowParametro] = useState(false);

    const localizarControles = () => 20;

    const limpar = () => {
        setFiltros({
            empresa: mockEmpresa,
            filial: mockFilial,
            cnpjCliente: "",
            razaoCliente: "",
            operador: "TODOS",
            classificarPor: "Padrão",
            dtCadIni: "",
            dtCadFim: "",
            nrViagemIni: "",
            nrViagemFim: "",
            serieCtrc: "",
            ctrcCtrlIni: "",
            ctrcCtrlFim: "",
        });
        setTotalControles(0);
        setControleAtual(0);
        setEnvioEmAndamento(false);
    };

    const handleEnviarClick = () => {
        const qtd = localizarControles();
        setQtdEncontrada(qtd);
        if (qtd === 0) {
            setTotalControles(0);
            setControleAtual(0);
            setModalMsg(true);
            return;
        }
        setModalConfirm(true);
    };

    const confirmarEnvio = () => {
        setModalConfirm(false);
        if (qtdEncontrada > 0) {
            setTotalControles(qtdEncontrada);
            setControleAtual(1);
            setEnvioEmAndamento(true);
        }
    };

    useEffect(() => {
        if (envioEmAndamento && totalControles > 0 && controleAtual < totalControles) {
            const timer = setTimeout(() => {
                setControleAtual((p) => p + 1);
            }, 300);
            return () => clearTimeout(timer);
        }

        if (envioEmAndamento && controleAtual === totalControles) {
            setEnvioEmAndamento(false);
            setModalMsg(true);
        }
    }, [envioEmAndamento, controleAtual, totalControles]);

    const tituloCard2 =
        totalControles > 0
            ? `Impressão de Conhecimentos - ${controleAtual} / ${totalControles}`
            : "Impressão de Conhecimentos - 0 / 0";

    const percentual =
        totalControles > 0 ? Math.min((controleAtual / totalControles) * 100, 100) : 0;

    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
                bg-gray-50 h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
            >
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    IMPRESSÃO DE CONHECIMENTOS
                </h1>

                <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">

                    <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                        {/* CARD 1 */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Envio de CTe em Lote
                            </legend>

                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Empresa</Label>
                                <Sel
                                    className="col-span-5"
                                    value={filtros.empresa}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, empresa: e.target.value })
                                    }
                                >
                                    <option>{mockEmpresa}</option>
                                </Sel>

                                <Label className="col-span-1">Filial</Label>
                                <Sel
                                    className="col-span-5"
                                    value={filtros.filial}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, filial: e.target.value })
                                    }
                                >
                                    <option>{mockFilial}</option>
                                </Sel>
                            </div>

                            {/* Linha 2 - Cliente */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Cliente</Label>
                                <Txt
                                    className="col-span-2"
                                    value={filtros.cnpjCliente}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, cnpjCliente: e.target.value })
                                    }
                                />
                                <Txt
                                    className="col-span-3 bg-gray-200"
                                    readOnly
                                    value={filtros.razaoCliente}
                                />
                            </div>

                            {/* Linha 3 - Datas / Operador */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Data Cadastro</Label>

                                {/* CORRIGIDO → type="date" */}
                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    value={filtros.dtCadIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtCadIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">até</Label>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    value={filtros.dtCadFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtCadFim: e.target.value })
                                    }
                                />

                                <Label className="col-span-1">Operador</Label>
                                <Sel
                                    className="col-span-2"
                                    value={filtros.operador}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, operador: e.target.value })
                                    }
                                >
                                    <option>TODOS</option>
                                    <option>OPERADOR 1</option>
                                    <option>OPERADOR 2</option>
                                </Sel>

                                <Label className="col-span-1">Classificar por</Label>
                                <Sel
                                    className="col-span-2"
                                    value={filtros.classificarPor}
                                    onChange={(e) =>
                                        setFiltros({
                                            ...filtros,
                                            classificarPor: e.target.value,
                                        })
                                    }
                                >
                                    <option>Padrão</option>
                                    <option>Data Cadastro</option>
                                    <option>Cliente</option>
                                    <option>Nº CTRC</option>
                                </Sel>
                            </div>

                            {/* Linha 4 */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Série CTRC</Label>
                                <Txt
                                    className="col-span-1"
                                    value={filtros.serieCtrc}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, serieCtrc: e.target.value })
                                    }
                                />

                                <Label className="col-span-1">Nº CTRC Controle</Label>
                                <Txt
                                    className="col-span-1"
                                    value={filtros.ctrcCtrlIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, ctrcCtrlIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">até</Label>
                                <Txt
                                    className="col-span-1"
                                    value={filtros.ctrcCtrlFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, ctrcCtrlFim: e.target.value })
                                    }
                                />

                                <Label className="col-span-1">Nº Viagem de</Label>
                                <Txt
                                    className="col-span-2"
                                    value={filtros.nrViagemIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, nrViagemIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">até</Label>
                                <Txt
                                    className="col-span-2"
                                    value={filtros.nrViagemFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, nrViagemFim: e.target.value })
                                    }
                                />
                            </div>
                        </fieldset>

                        {/* CARD 2 – Progresso */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                {tituloCard2}
                            </legend>

                            <div className="flex flex-col gap-2">
                                <div className="w-full h-4 bg-gray-200 rounded">
                                    <div
                                        className="h-4 rounded bg-red-600 transition-all duration-300"
                                        style={{ width: `${percentual}%` }}
                                    />
                                </div>

                                <div className="text-[12px] text-gray-600">
                                    {totalControles > 0
                                        ? `Enviando controle ${controleAtual} de ${totalControles}...`
                                        : "Aguardando envio..."}
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* RODAPÉ */}
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
                        onClick={handleEnviarClick}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Zap size={20} />
                        <span>Enviar</span>
                    </button>

                    <button
                        onClick={() => setShowConsulta(true)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Search size={20} />
                        <span>Consulta</span>
                    </button>

                    <button
                        onClick={() => setShowParametro(true)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Settings size={20} />
                        <span>Parâmetro</span>
                    </button>
                </div>
            </div>

            {/* MODAL CONFIRMAÇÃO */}
            {modalConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[340px]">
                        <p className="text-gray-800 font-semibold mb-4 text-[14px]">
                            Foram localizados{" "}
                            <span className="text-red-700 font-bold">
                                {qtdEncontrada}
                            </span>{" "}
                            controles. Deseja enviar?
                        </p>

                        <div className="flex justify-center gap-4 mt-2">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded text-[13px]"
                                onClick={() => setModalConfirm(false)}
                            >
                                Não
                            </button>
                            <button
                                className="px-4 py-1 bg-red-700 text-white rounded text-[13px]"
                                onClick={confirmarEnvio}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUCESSO */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Gerado com Sucesso!
                        </p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {showConsulta && (
                <ConsultaSefazCte onClose={() => setShowConsulta(false)} />
            )}

            {showParametro && (
                <CteParametro onClose={() => setShowParametro(false)} />
            )}
        </>
    );
}
