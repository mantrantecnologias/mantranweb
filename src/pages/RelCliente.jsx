// src/pages/Relatorios/Cadastro/RelCliente.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, Search, FileSpreadsheet } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= HELPERS PADRÃO ================= */
function Label({ children, className = "" }) {
    return (
        <label
            className={`text-[12px] text-gray-600 flex items-center justify-end ${className}`}
        >
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            className={`
        border border-gray-300 rounded
        px-2 py-[2px] h-[26px] text-[13px]
        ${readOnly ? "bg-gray-200 text-gray-600" : "bg-white"}
        ${className}
      `}
        />
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
            <input
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            {label}
        </label>
    );
}

/* ================= TELA ================= */
export default function RelCliente({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== STATE ===== */
    const [dados, setDados] = useState({
        // Tipo: C = Correntistas | E = Eventuais | T = Todos
        tipo: "T",

        // Data Cadastro
        dataIni: "2025-01-01",
        dataFim: "2026-12-01",

        // Filial
        filial: "001",

        // Ordem Impressão
        ordemImpressao: "1",

        // Situação
        situacao: "A",
    });

    const handleChange = (campo) => (e) =>
        setDados((prev) => ({ ...prev, [campo]: e.target.value }));

    const limpar = () => {
        setDados((prev) => ({
            ...prev,
            tipo: "T",
            dataIni: "",
            dataFim: "",
            filial: "001",
            ordemImpressao: "1",
            situacao: "A",
        }));
    };

    const gerar = () => {
        navigate("/relatorios/cadastro/clientes/resultado", {
            state: {
                filtros: dados,
                periodo:
                    dados.dataIni && dados.dataFim ? `${dados.dataIni} até ${dados.dataFim}` : "",
                tipo: dados.tipo,
                situacao: dados.situacao,
            },
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
                RELATÓRIO DE CLIENTES
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Opções do Relatório
                    </legend>

                    {/* LINHA 1 - TIPO */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Tipo</Label>

                        <div className="col-span-10 border border-gray-300 rounded px-3 py-2">
                            <div className="flex items-center gap-10">
                                <Radio
                                    name="tipo"
                                    value="C"
                                    checked={dados.tipo === "C"}
                                    onChange={handleChange("tipo")}
                                    label="Correntistas"
                                />
                                <Radio
                                    name="tipo"
                                    value="E"
                                    checked={dados.tipo === "E"}
                                    onChange={handleChange("tipo")}
                                    label="Eventuais"
                                />
                                <Radio
                                    name="tipo"
                                    value="T"
                                    checked={dados.tipo === "T"}
                                    onChange={handleChange("tipo")}
                                    label="Todos"
                                />
                            </div>
                        </div>
                    </div>

                    {/* LINHA 2 - DATA CADASTRO */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Data Cadastro</Label>
                        <Txt
                            type="date"
                            className="col-span-3"
                            value={dados.dataIni}
                            onChange={handleChange("dataIni")}
                        />

                        <Label className="col-span-1 text-center">Até</Label>
                        <Txt
                            type="date"
                            className="col-span-3"
                            value={dados.dataFim}
                            onChange={handleChange("dataFim")}
                        />

                        <div className="col-span-3" />
                    </div>

                    {/* LINHA 3 - FILIAL */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Filial de Vínculo</Label>
                        <Sel
                            className="col-span-10"
                            value={dados.filial}
                            onChange={handleChange("filial")}
                        >
                            <option value="001">001 - TESTE MANTRAN</option>
                            <option value="002">002 - FILIAL 02</option>
                            <option value="003">003 - FILIAL 03</option>
                        </Sel>
                    </div>

                    {/* LINHA 4 - ORDEM */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Ordem Impressão</Label>
                        <Sel
                            className="col-span-10"
                            value={dados.ordemImpressao}
                            onChange={handleChange("ordemImpressao")}
                        >
                            <option value="1">1 - Razão Social, CGC/CPF</option>
                            <option value="2">2 - Fantasia, Razão Social</option>
                            <option value="3">3 - Cidade, Razão Social</option>
                            <option value="4">4 - UF, Cidade, Razão Social</option>
                            <option value="5">5 - Data Inclusão</option>
                        </Sel>
                    </div>

                    {/* LINHA 5 - SITUAÇÃO */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-2">Situação</Label>
                        <Sel
                            className="col-span-10"
                            value={dados.situacao}
                            onChange={handleChange("situacao")}
                        >
                            <option value="A">A - Ativo</option>
                            <option value="I">I - Inativo</option>
                            <option value="B">B - Bloqueado</option>
                            <option value="T">T - Todos</option>
                        </Sel>
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px]
          ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={limpar}
                    className={`flex flex-col items-center text-[11px]
          ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={gerar}
                    className={`flex flex-col items-center text-[11px]
          ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Search size={20} />
                    <span>Gerar</span>
                </button>

                <button
                    className={`flex flex-col items-center text-[11px]
          ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    title="(posteriormente) exportar direto da tela de filtro"
                >
                    <FileSpreadsheet size={20} />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );
}
