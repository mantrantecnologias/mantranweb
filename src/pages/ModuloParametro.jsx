import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Save } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px]
        text-[13px] w-full
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"}
        ${className}`}
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px]
        text-[13px] w-full bg-white ${className}`}
        >
            {children}
        </select>
    );
}

/* ================= Componente ================= */
export default function ModuloParametro({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== MOCK GRID ===== */
    const mock = [
        {
            empresa: "001",
            filial: "001",
            modulo: "Mantran.Servico.Geracao_Automatica",
            codModulo: "011",
            codParametro: "AGRUPAR_DT_EMISSAO_E_CD_VEICULO",
            tpValor: "Booleano",
            vrParametro: "N",
            vrExemplo: "N",
            vrPadrao: "N",
            descricao: "Agrupar emissão e veículo",
            nivelEmpresa: "N",
            nivelBase: "N",
        },
        {
            empresa: "001",
            filial: "001",
            modulo: "Mantran.Servico.Geracao_Automatica",
            codModulo: "011",
            codParametro: "BLOQUEAR_PROCESSAMENTO",
            tpValor: "Booleano",
            vrParametro: "N",
            vrExemplo: "N",
            vrPadrao: "N",
            descricao: "Bloqueia processamento",
            nivelEmpresa: "N",
            nivelBase: "N",
        },
        // exemplos extras pra você validar (como na imagem)
        {
            empresa: "001",
            filial: "001",
            modulo: "Mantran.Servico.Geracao_Automatica",
            codModulo: "011",
            codParametro: "HR_INICIAL",
            tpValor: "Hora",
            vrParametro: "02:15",
            vrExemplo: "02:15",
            vrPadrao: "00:00",
            descricao: "Horário que o serviço deverá iniciar o processamento, informar horário de relógio 24h.",
            nivelEmpresa: "N",
            nivelBase: "N",
        },
        {
            empresa: "001",
            filial: "001",
            modulo: "Mantran.Servico.Geracao_Automatica",
            codModulo: "011",
            codParametro: "INTERVALO_HORAS",
            tpValor: "Inteiro",
            vrParametro: "1",
            vrExemplo: "1",
            vrPadrao: "2",
            descricao: "Intervalo em horas para o serviço, exemplo de 1 em 1 hora.",
            nivelEmpresa: "N",
            nivelBase: "N",
        },
        {
            empresa: "001",
            filial: "001",
            modulo: "Mantran.Servico.Geracao_Automatica",
            codModulo: "011",
            codParametro: "PROCESSAR_DIA_INTEIRO",
            tpValor: "Texto",
            vrParametro: "30,31;01;14;15",
            vrExemplo: "30,31;01;14;15",
            vrPadrao: "",
            descricao: "Dias exceção para processar dia inteiro (ex.: dia de fechamento).",
            nivelEmpresa: "N",
            nivelBase: "N",
        },
    ];

    const [lista] = useState(mock);
    const [selecionado, setSelecionado] = useState(null);

    const [filtro, setFiltro] = useState({
        empresa: "001",
        filial: "TODAS",
        modulo: "",
        descricao: "",
    });

    // ✅ modalMsg padrão
    const [modalMsg, setModalMsg] = useState(false);

    const limpar = () => {
        setSelecionado(null);
        setFiltro({
            empresa: "",
            filial: "",
            modulo: "",
            descricao: "",
        });
    };

    // ✅ salvar sem alert, usando modalMsg padrão
    const salvar = () => {
        // aqui seria o PATCH/PUT real
        setModalMsg(true);
    };

    const listaFiltrada = lista.filter((r) =>
        r.codParametro.toLowerCase().includes(filtro.descricao.toLowerCase())
    );

    // ✅ render dinâmico SOMENTE do campo "Vr. Parâmetro" (col-span-5), sem mexer em mais nada
    const renderVrParametro = () => {
        const tp = selecionado?.tpValor || "";
        const valor = selecionado?.vrParametro || "";

        // sem seleção: mantém o input padrão vazio
        if (!selecionado) {
            return <Txt className="col-span-5" value="" readOnly />;
        }

        // Booleano: checkbox + texto
        if (tp === "Booleano") {
            const checked = String(valor).toUpperCase() === "S";
            return (
                <div className="col-span-5 flex items-center gap-2 border border-gray-300 rounded px-2 h-[26px] bg-white">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                            setSelecionado({
                                ...selecionado,
                                vrParametro: e.target.checked ? "S" : "N",
                            })
                        }
                    />
                    <span className="text-[12px] text-gray-700">Selecione para Ativar</span>
                </div>
            );
        }

        // Texto: input normal
        if (tp === "Texto") {
            return (
                <Txt
                    className="col-span-5"
                    value={valor}
                    onChange={(e) =>
                        setSelecionado({ ...selecionado, vrParametro: e.target.value })
                    }
                />
            );
        }

        // Hora: type time
        if (tp === "Hora") {
            // HTML time espera HH:MM
            const hhmm = String(valor || "").slice(0, 5);
            return (
                <Txt
                    type="time"
                    className="col-span-5"
                    value={hhmm}
                    onChange={(e) =>
                        setSelecionado({ ...selecionado, vrParametro: e.target.value })
                    }
                />
            );
        }

        // Inteiro: type number
        if (tp === "Inteiro") {
            return (
                <Txt
                    type="number"
                    className="col-span-5 text-right"
                    value={valor}
                    onChange={(e) =>
                        setSelecionado({ ...selecionado, vrParametro: e.target.value })
                    }
                />
            );
        }

        // fallback: mantém input padrão
        return (
            <Txt
                className="col-span-5"
                value={valor}
                onChange={(e) =>
                    setSelecionado({ ...selecionado, vrParametro: e.target.value })
                }
            />
        );
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                MÓDULO PARÂMETRO
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* ================= CARD 1 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="text-red-700 px-2 text-[13px] font-semibold">
                        Cadastro Parâmetro
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel className="col-span-5" disabled>
                            <option>TODAS</option>
                        </Sel>

                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5" disabled>
                            <option>TODAS</option>
                        </Sel>
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Cód. Parâmetro</Label>
                        <Txt className="col-span-5" readOnly value={selecionado?.codParametro || ""} />

                        <Label className="col-span-1 col-start-7">Nível</Label>
                        <Txt className="col-span-1" readOnly value="BASE" />

                        <Label className="col-span-1">Módulo</Label>
                        <Txt className="col-span-3" readOnly value={selecionado?.modulo || ""} />
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Vr. Parâmetro</Label>
                        {renderVrParametro()}

                        <Label className="col-span-1">Vr. Exemplo</Label>
                        <Txt className="col-span-2" readOnly value={selecionado?.vrExemplo || ""} />

                        <Label className="col-span-1">Vr. Padrão</Label>
                        <Txt className="col-span-2" readOnly value={selecionado?.vrPadrao || ""} />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Descrição</Label>
                        <Txt className="col-span-11" readOnly value={selecionado?.descricao || ""} />
                    </div>
                </fieldset>

                {/* ================= CARD 2 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 text-[13px] font-semibold">
                        Parâmetros
                    </legend>

                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel className="col-span-5">
                            <option>001 - MANTRAN</option>
                        </Sel>

                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5">
                            <option>TODAS</option>
                        </Sel>
                    </div>

                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Módulo</Label>
                        <Sel className="col-span-5">
                            <option>Mantran.Servico.Geracao_Automatica</option>
                        </Sel>

                        <Label className="col-span-1">Descrição</Label>
                        <Txt
                            className="col-span-5"
                            value={filtro.descricao}
                            onChange={(e) =>
                                setFiltro({ ...filtro, descricao: e.target.value })
                            }
                        />
                    </div>
                </fieldset>

                {/* ================= CARD 3 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 text-[13px] font-semibold">
                        Registros
                    </legend>

                    <div className="border border-gray-300 rounded max-h-[380px] overflow-y-auto">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    {[
                                        "Empresa", "Filial", "Módulo", "Cód Módulo", "Cód Parâmetro",
                                        "Tp Valor", "Vr Parâmetro", "Vr Exemplo", "Vr Padrão",
                                        "Descrição", "Nível Empresa", "Nível Base",
                                    ].map((h) => (
                                        <th key={h} className="border px-2 py-1">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {listaFiltrada.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer hover:bg-red-100 ${selecionado?.codParametro === item.codParametro ? "bg-red-50" : ""
                                            }`}
                                        onClick={() => setSelecionado(item)}
                                    >
                                        <td className="border px-2 py-1">{item.empresa}</td>
                                        <td className="border px-2 py-1">{item.filial}</td>
                                        <td className="border px-2 py-1">{item.modulo}</td>
                                        <td className="border px-2 py-1">{item.codModulo}</td>
                                        <td className="border px-2 py-1">{item.codParametro}</td>
                                        <td className="border px-2 py-1">{item.tpValor}</td>
                                        <td className="border px-2 py-1">{item.vrParametro}</td>
                                        <td className="border px-2 py-1">{item.vrExemplo}</td>
                                        <td className="border px-2 py-1">{item.vrPadrao}</td>
                                        <td className="border px-2 py-1">{item.descricao}</td>
                                        <td className="border px-2 py-1">{item.nivelEmpresa}</td>
                                        <td className="border px-2 py-1">{item.nivelBase}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* ================= Rodapé ================= */}
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
                    onClick={salvar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Save size={20} />
                    <span>Salvar</span>
                </button>
            </div>

            {/* SUCESSO — modelo exatamente igual ao solicitado */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Registro Alterado Com Sucesso!
                        </p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => {
                                setModalMsg(false);
                                // aqui NÃO fecho a tela pq você não pediu,
                                // mas se quiser fechar junto é só: navigate(-1)
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
