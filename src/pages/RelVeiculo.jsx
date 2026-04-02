// src/pages/RelVeiculo.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Search, FileSpreadsheet } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= HELPERS PADRÃO ================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}>
            {children}
        </label>
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px] bg-white w-full
        ${className}
      `}
        >
            {children}
        </select>
    );
}

function Radio({ name, value, checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2 text-[13px] text-gray-700 select-none">
            <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
            {label}
        </label>
    );
}

/* ================= TELA ================= */
export default function RelVeiculo({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [dados, setDados] = useState({
        // Situação: A = Ativos | I = Inativos | T = Todos
        situacao: "A",

        // Tipo (TP_Utilizacao): T = Tração | R = Reboque | X = Todos
        tipoUtilizacao: "X",

        // Tipo do relatório (mantém como no legado)
        tipoRelatorio: "1",

        // Filial
        filial: "999", // 999 = Todas

        // Ordem impressão (mantém como no legado)
        ordemImpressao: "2", // 2 = Filial, Classe, Placa

        // Veículos agregados (✅ quando marcado: TP_Veiculo = 'A')
        incluirAgregados: false,
    });

    const handleChange = (campo) => (e) => setDados((prev) => ({ ...prev, [campo]: e.target.value }));

    const handleCheck = (campo) => (e) => setDados((prev) => ({ ...prev, [campo]: !!e.target.checked }));

    const limpar = () => {
        setDados({
            situacao: "A",
            tipoUtilizacao: "X",
            tipoRelatorio: "1",
            filial: "999",
            ordemImpressao: "2",
            incluirAgregados: false,
        });
    };

    const gerar = () => {
        // ✅ só navega e passa filtros (quem filtra é o Resultado)
        navigate("/relatorios/operacao/veiculos/resultado", {
            state: { filtros: dados },
        });
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                RELATÓRIO DE VEÍCULOS
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">Opções do Relatório</legend>

                    {/* LINHA 1 - SITUAÇÃO */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Situação</Label>

                        <div className="col-span-10 border border-gray-300 rounded px-3 py-2">
                            <div className="flex items-center gap-10">
                                <Radio
                                    name="situacao"
                                    value="A"
                                    checked={dados.situacao === "A"}
                                    onChange={handleChange("situacao")}
                                    label="Ativos"
                                />
                                <Radio
                                    name="situacao"
                                    value="I"
                                    checked={dados.situacao === "I"}
                                    onChange={handleChange("situacao")}
                                    label="Inativos"
                                />
                                <Radio
                                    name="situacao"
                                    value="T"
                                    checked={dados.situacao === "T"}
                                    onChange={handleChange("situacao")}
                                    label="Todos"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ✅ NOVO - TIPO (TP_Utilizacao) */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Tipo</Label>

                        <div className="col-span-10 border border-gray-300 rounded px-3 py-2">
                            <div className="flex items-center gap-10">
                                <Radio
                                    name="tipoUtilizacao"
                                    value="T"
                                    checked={dados.tipoUtilizacao === "T"}
                                    onChange={handleChange("tipoUtilizacao")}
                                    label="Tração"
                                />
                                <Radio
                                    name="tipoUtilizacao"
                                    value="R"
                                    checked={dados.tipoUtilizacao === "R"}
                                    onChange={handleChange("tipoUtilizacao")}
                                    label="Reboque"
                                />
                                <Radio
                                    name="tipoUtilizacao"
                                    value="X"
                                    checked={dados.tipoUtilizacao === "X"}
                                    onChange={handleChange("tipoUtilizacao")}
                                    label="Todos"
                                />
                            </div>
                        </div>
                    </div>

                    {/* LINHA 2 - TIPO RELATÓRIO */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Tipo do relatório</Label>
                        <Sel className="col-span-10" value={dados.tipoRelatorio} onChange={handleChange("tipoRelatorio")}>
                            <option value="1">1 - Relação veículos</option>
                        </Sel>
                    </div>

                    {/* LINHA 3 - FILIAL */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Filial</Label>
                        <Sel className="col-span-10" value={dados.filial} onChange={handleChange("filial")}>
                            <option value="999">999 - Todas</option>
                            <option value="001">001 - TRANSAFLA TRANSPORTES LTDA</option>
                            <option value="002">002 - FILIAL 02</option>
                            <option value="003">003 - FILIAL 03</option>
                        </Sel>
                    </div>

                    {/* LINHA 4 - ORDEM IMPRESSÃO */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Ordem Impressão</Label>
                        <Sel className="col-span-10" value={dados.ordemImpressao} onChange={handleChange("ordemImpressao")}>
                            <option value="1">1 - Placa</option>
                            <option value="2">2 - Filial de Vínculo, Classe, Placa</option>
                            <option value="3">3 - Classe, Placa</option>
                            <option value="4">4 - Cidade, Placa</option>
                        </Sel>
                    </div>

                    {/* LINHA 5 - CHECKBOXES */}
                    <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-2" />
                        <div className="col-span-10 flex flex-col gap-2">
                            <label className="flex items-center gap-2 text-[13px] text-gray-700 select-none">
                                <input
                                    type="checkbox"
                                    checked={dados.incluirAgregados}
                                    onChange={handleCheck("incluirAgregados")}
                                />
                                Veículos Agregados
                            </label>

                            {/* ✅ REMOVIDO: Gerar Impressão em Excel */}
                        </div>
                    </div>
                </fieldset>
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
                    onClick={gerar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Search size={20} />
                    <span>Gerar</span>
                </button>

                <button
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    title="(posteriormente) exportar direto da tela de filtro"
                >
                    <FileSpreadsheet size={20} />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );
}
