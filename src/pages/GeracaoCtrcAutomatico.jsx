// src/pages/GeracaoCtrcAutomatico.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Play } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==== COMPONENTES PADRÃO MANTRAN ==== */
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

export default function GeracaoCtrcAutomatico({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    // MOCKS
    const mockEmpresa = "001 - MANTRAN TRANSPORTES LTDA";
    const mockFilial = "001 - MATRIZ";
    const mockCnpj = "50221019000136";
    const mockRazao = "HNK-ITU MATRIZ";

    const [filtros, setFiltros] = useState({
        empresa: mockEmpresa,
        filial: mockFilial,
        cnpjCliente: mockCnpj,
        razaoCliente: mockRazao,
        tabelaFrete: "",
        dtEmissaoIni: "",
        dtEmissaoFim: "",
        operador: "TODOS",
        tipoNota: "TODAS",
        classeVeiculo: "",
    });

    // PROGRESSÃO
    const [total, setTotal] = useState(0);
    const [atual, setAtual] = useState(0);
    const [processando, setProcessando] = useState(false);

    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalMsg, setModalMsg] = useState(false);
    const [qtdEncontrada, setQtdEncontrada] = useState(0);

    // GRID MOCK OCORRÊNCIAS
    const [ocorrencias, setOcorrencias] = useState([]);

    const localizarRegistros = () => 20; // MOCK

    const limpar = () => {
        setFiltros({
            empresa: mockEmpresa,
            filial: mockFilial,
            cnpjCliente: "",
            razaoCliente: "",
            tabelaFrete: "",
            dtEmissaoIni: "",
            dtEmissaoFim: "",
            operador: "TODOS",
            tipoNota: "TODAS",
            classeVeiculo: "",
        });
        setTotal(0);
        setAtual(0);
        setProcessando(false);
        setOcorrencias([]);
    };

    const handleGerarClick = () => {
        const qtd = localizarRegistros();
        setQtdEncontrada(qtd);
        setModalConfirm(true);
    };

    const confirmarGeracao = () => {
        setModalConfirm(false);
        setTotal(qtdEncontrada);
        setAtual(1);
        setProcessando(true);
    };

    useEffect(() => {
        if (processando && total > 0 && atual < total) {
            const timer = setTimeout(() => {
                setAtual((p) => p + 1);
            }, 250);
            return () => clearTimeout(timer);
        }

        if (processando && atual === total) {
            setProcessando(false);

            // MOCK OCORRÊNCIAS GERADAS
            setOcorrencias([
                {
                    ocorrencia: "Peso inválido",
                    cliente: "ACME LTDA",
                    nf: "12345",
                    serie: "01",
                    tabela: "TB001",
                    cepDest: "06000000",
                    cidade: "Osasco",
                    uf: "SP",
                    cepOrig: "18000000",
                    loja: "Filial 01",
                    contrato: "CTR-8899",
                },
            ]);

            setModalMsg(true);
        }
    }, [processando, atual, total]);

    const percentual =
        total > 0 ? Math.min((atual / total) * 100, 100) : 0;

    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
                bg-gray-50 h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
            >
                {/* TÍTULO */}
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    GERAÇÃO DE CTRC AUTOMÁTICO
                </h1>

                {/* CONTEÚDO */}
                <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md 
                    flex flex-col gap-3 overflow-y-auto">

                    <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

                        {/* ================= CARD 1 – PARÂMETROS ================= */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Parâmetros
                            </legend>

                            {/* Linha 1 */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Empresa</Label>
                                <Sel className="col-span-5" value={filtros.empresa}
                                    onChange={(e) => setFiltros({ ...filtros, empresa: e.target.value })}
                                >
                                    <option>{mockEmpresa}</option>
                                </Sel>

                                <Label className="col-span-1">Filial</Label>
                                <Sel className="col-span-5" value={filtros.filial}
                                    onChange={(e) => setFiltros({ ...filtros, filial: e.target.value })}
                                >
                                    <option>{mockFilial}</option>
                                </Sel>
                            </div>

                            {/* Linha 2 Cliente */}
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
                                <Label className="col-span-1 col-start-7">Dt. Emissão</Label>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    value={filtros.dtEmissaoIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtEmissaoIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">até</Label>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    value={filtros.dtEmissaoFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtEmissaoFim: e.target.value })
                                    }
                                />
                            </div>

                            {/* Linha 3 – Tabela / Data Emissão */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-1">Tab. Frete</Label>
                                <Sel
                                    className="col-span-2"
                                    value={filtros.tabelaFrete}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, tabelaFrete: e.target.value })
                                    }
                                >
                                    <option value="">Selecione</option>
                                    <option>TB001 - PADRÃO</option>
                                </Sel>
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
                                <Label className="col-span-1">Tipo Nota</Label>
                                <Sel
                                    className="col-span-2"
                                    value={filtros.tipoNota}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, tipoNota: e.target.value })
                                    }
                                >
                                    <option>TODAS</option>
                                    <option>NORMAL</option>
                                    <option>COMPLEMENTAR</option>
                                </Sel>
                                <Label className="col-span-1">Classe Veículo</Label>
                                <Sel
                                    className="col-span-2"
                                    value={filtros.classeVeiculo}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, classeVeiculo: e.target.value })
                                    }
                                >
                                    <option value="">Selecione</option>
                                    <option>3/4</option>
                                    <option>Toco</option>
                                    <option>Truck</option>
                                </Sel>
                            </div>



                        </fieldset>

                        {/* ================= CARD 2 – PROCESSAMENTO ================= */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Processamento
                            </legend>

                            <div className="flex flex-col gap-2">
                                <div className="w-full h-4 bg-gray-200 rounded">
                                    <div
                                        className="h-4 rounded bg-red-600 transition-all duration-300"
                                        style={{ width: `${percentual}%` }}
                                    />
                                </div>

                                <div className="text-[12px] text-gray-600">
                                    {total > 0
                                        ? `Gerando CTRC ${atual} de ${total}...`
                                        : "Aguardando geração..."}
                                </div>
                            </div>
                        </fieldset>

                        {/* ================= CARD 3 – RESULTADOS ================= */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Resultados do Processamento
                            </legend>

                            <div className="grid grid-cols-12 gap-3">
                                <Label className="col-span-3">Total de CTRC Gerados:</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={total} />

                                <Label className="col-span-3">Numeração Inicial:</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={total > 0 ? "000015" : ""} />

                                <Label className="col-span-3">Numeração Final:</Label>
                                <Txt className="col-span-2 bg-gray-200" readOnly value={total > 0 ? "000035" : ""} />

                                <Label className="col-span-3">Ocorrências:</Label>
                                <Txt className="col-span-4 bg-gray-200" readOnly value={ocorrencias.length} />
                            </div>
                        </fieldset>

                        {/* ================= CARD 4 – GRID ================= */}
                        <div className="border border-gray-300 rounded p-2">
                            <table className="w-full text-[12px]">
                                <thead>
                                    <tr className="bg-gray-100 border-b text-left">
                                        <th className="p-1">Ocorrência</th>
                                        <th className="p-1">Cliente</th>
                                        <th className="p-1">Nº NF</th>
                                        <th className="p-1">Série</th>
                                        <th className="p-1">Tabela</th>
                                        <th className="p-1">CEP Destino</th>
                                        <th className="p-1">Cidade</th>
                                        <th className="p-1">UF</th>
                                        <th className="p-1">CEP Origem</th>
                                        <th className="p-1">Loja</th>
                                        <th className="p-1">Contrato</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ocorrencias.length === 0 ? (
                                        <tr>
                                            <td className="p-2 text-center text-gray-500" colSpan={11}>
                                                Nenhuma ocorrência encontrada
                                            </td>
                                        </tr>
                                    ) : (
                                        ocorrencias.map((o, idx) => (
                                            <tr key={idx} className="border-b hover:bg-gray-50">
                                                <td className="p-1">{o.ocorrencia}</td>
                                                <td className="p-1">{o.cliente}</td>
                                                <td className="p-1">{o.nf}</td>
                                                <td className="p-1">{o.serie}</td>
                                                <td className="p-1">{o.tabela}</td>
                                                <td className="p-1">{o.cepDest}</td>
                                                <td className="p-1">{o.cidade}</td>
                                                <td className="p-1">{o.uf}</td>
                                                <td className="p-1">{o.cepOrig}</td>
                                                <td className="p-1">{o.loja}</td>
                                                <td className="p-1">{o.contrato}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* =================== RODAPÉ =================== */}
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
                        onClick={handleGerarClick}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Play size={20} />
                        <span>Gerar</span>
                    </button>
                </div>
            </div>

            {/* =================== MODAL CONFIRMAÇÃO =================== */}
            {modalConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[340px]">
                        <p className="text-gray-800 font-semibold mb-4 text-[14px]">
                            Foram localizados{" "}
                            <span className="text-red-700 font-bold">{qtdEncontrada}</span> registros.
                            Deseja gerar os CTRCs?
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
                                onClick={confirmarGeracao}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =================== MODAL SUCESSO =================== */}
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
        </>
    );
}
