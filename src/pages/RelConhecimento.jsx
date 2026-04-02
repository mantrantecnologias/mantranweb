import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    Search,
    FileSpreadsheet,
} from "lucide-react";
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

/* ================= TELA ================= */
export default function RelConhecimento({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ===== MOCK ===== */
    const [dados, setDados] = useState({
        empresa: "001",
        filial: "001",
        grupoEconomico: "01 - HEINEKEN",
        statusCte: "1",
        tipoData: "1",
        modeloRelatorio: "1",

        clienteCod: "5022101900136",
        clienteNome: "HNK-ITU (1) MATRIZ",

        remetenteCod: "5022101900136",
        remetenteNome: "HNK-ITU (1) MATRIZ",

        destinatarioCod: "5022101900136",
        destinatarioNome: "HNK-ITU (1) MATRIZ",

        cidadeCod: "1310000",
        cidadeNome: "CAMPINAS",
        uf: "SP",

        dataIni: "2025-12-01",
        dataFim: "2025-12-16",
    });

    const handleChange = (campo) => (e) =>
        setDados({ ...dados, [campo]: e.target.value });

    const limpar = () => {
        setDados((prev) => ({
            ...prev,
            clienteCod: "",
            clienteNome: "",
            remetenteCod: "",
            remetenteNome: "",
            destinatarioCod: "",
            destinatarioNome: "",
            cidadeCod: "",
            cidadeNome: "",
            uf: "",
            dataIni: "",
            dataFim: "",
        }));
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
      bg-gray-50 h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                RELATÓRIO DE CONHECIMENTOS
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros do Relatório
                    </legend>

                    {/* LINHA 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel className="col-span-5" value={dados.empresa}>
                            <option value="001">001 - MANTRAN TRANSPORTES LTDA</option>
                        </Sel>

                        <Label className="col-span-1">Cliente</Label>
                        <Txt className="col-span-2" value={dados.clienteCod} />
                        <Txt className="col-span-3" value={dados.clienteNome} readOnly />
                    </div>

                    {/* LINHA 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5" value={dados.filial}>
                            <option value="001">001 - TESTE MANTRAN</option>
                        </Sel>

                        <Label className="col-span-1">Remetente</Label>
                        <Txt className="col-span-2" value={dados.remetenteCod} />
                        <Txt className="col-span-3" value={dados.remetenteNome} readOnly />
                    </div>

                    {/* LINHA 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Grupo Econ.</Label>
                        <Txt className="col-span-5" value={dados.grupoEconomico} readOnly />

                        <Label className="col-span-1">Destinatário</Label>
                        <Txt className="col-span-2" value={dados.destinatarioCod} />
                        <Txt
                            className="col-span-3"
                            value={dados.destinatarioNome}
                            readOnly
                        />
                    </div>

                    {/* LINHA 4 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Status CT-e</Label>
                        <Sel
                            className="col-span-2"
                            value={dados.statusCte}
                            onChange={handleChange("statusCte")}
                        >
                            <option value="1">1 - Impresso</option>
                            <option value="2">2 - Autorizado</option>
                            <option value="3">3 - Cancelado</option>
                        </Sel>

                        <Label className="col-span-1">Tipo Data</Label>
                        <Sel
                            className="col-span-2"
                            value={dados.tipoData}
                            onChange={handleChange("tipoData")}
                        >
                            <option value="1">1 - Data Emissão</option>
                            <option value="2">2 - Data Autorização</option>
                        </Sel>

                        <Label className="col-span-1">Cidade Dest</Label>
                        <Txt className="col-span-2" value={dados.cidadeCod} />
                        <Txt className="col-span-2" value={dados.cidadeNome} readOnly />
                        <Txt className="col-span-1" value={dados.uf} readOnly />
                    </div>

                    {/* LINHA 5 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Modelo Rel.</Label>
                        <Sel
                            className="col-span-5"
                            value={dados.modeloRelatorio}
                            onChange={handleChange("modeloRelatorio")}
                        >
                            <option value="1">1 - Conhecimentos Emitidos</option>
                        </Sel>

                        <Label className="col-span-1">Período</Label>
                        <Txt
                            type="date"
                            className="col-span-2"
                            value={dados.dataIni}
                            onChange={handleChange("dataIni")}
                        />
                        <Label className="col-span-1 text-center">Até</Label>
                        <Txt
                            type="date"
                            className="col-span-2"
                            value={dados.dataFim}
                            onChange={handleChange("dataFim")}
                        />
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
                    onClick={() =>
                        navigate("/relatorios/operacao/conhecimento/resultado", {
                            state: {
                                cliente: dados.clienteNome,
                                periodo: `${dados.dataIni} até ${dados.dataFim}`,
                                status: dados.statusCte,
                                tipoData: dados.tipoData,
                                filtros: dados, // opcional: passa tudo
                            },
                        })
                    }
                    className={`flex flex-col items-center text-[11px] 
    ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Search size={20} />
                    <span>Gerar</span>
                </button>


                <button
                    className={`flex flex-col items-center text-[11px] 
      ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <FileSpreadsheet size={20} />
                    <span>Exportar</span>
                </button>

            </div>


        </div>
    );
}
