import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Printer } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */
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
        ${readOnly ? "bg-gray-100 text-gray-600" : "bg-white"}
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
        px-2 py-[2px] h-[26px] text-[13px] bg-white
        ${className}
      `}
        >
            {children}
        </select>
    );
}

/* ================= Utils ================= */
// "dd/mm/yyyy" -> Date (meia-noite)
function brToDate(br) {
    if (!br) return null;
    const [dd, mm, yyyy] = br.split("/").map((x) => parseInt(x, 10));
    if (!dd || !mm || !yyyy) return null;
    return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
}

// Date -> "yyyy-mm-dd" (para input type="date")
function dateToISO(d) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// "yyyy-mm-dd" -> Date
function isoToDate(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 0, 0, 0, 0);
}

// money format simple (pt-BR)
function fmt(v) {
    const n = Number(v || 0);
    return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function clamp2(n) {
    return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
}

/* ================= Componente ================= */
export default function CreditoCombustivelHistorico({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    /* ================= MOCKS (coerentes) =================
       Regra: Frete Peso = Frete Original - Valor Desconto
       Tipo: C=Crédito, D=Débito
    */
    const registros = useMemo(
        () => [
            // Janeiro/2023
            { data: "03/01/2023", documento: "CTRC 052903", tipo: "D", valorDesconto: 3.0, freteOriginal: 180.74 },
            { data: "03/01/2023", documento: "CTRC 052904", tipo: "D", valorDesconto: 0.0, freteOriginal: 219.54 },
            { data: "03/01/2023", documento: "03/01/2023 CTRC 052905", tipo: "D", valorDesconto: 12.5, freteOriginal: 815.88 },
            { data: "05/01/2023", documento: "CTRC 052910", tipo: "C", valorDesconto: 0.0, freteOriginal: 363.62 },
            { data: "08/01/2023", documento: "CTRC 052912", tipo: "D", valorDesconto: 7.25, freteOriginal: 77.88 },

            // Novembro/2024
            { data: "01/11/2024", documento: "CTRC 061120", tipo: "D", valorDesconto: 5.0, freteOriginal: 1000.0 },
            { data: "12/11/2024", documento: "CTRC 061450", tipo: "C", valorDesconto: 0.0, freteOriginal: 550.0 },

            // Dezembro/2024
            { data: "02/12/2024", documento: "CTRC 062010", tipo: "D", valorDesconto: 15.0, freteOriginal: 850.0 },
            { data: "18/12/2024", documento: "CTRC 062420", tipo: "D", valorDesconto: 0.0, freteOriginal: 650.0 },

            // Janeiro/2025
            { data: "03/01/2025", documento: "CTRC 070011", tipo: "C", valorDesconto: 0.0, freteOriginal: 600.0 },
            { data: "17/01/2025", documento: "CTRC 070900", tipo: "D", valorDesconto: 20.0, freteOriginal: 900.01 },

            // Fevereiro/2025
            { data: "18/02/2025", documento: "CTRC 071150", tipo: "C", valorDesconto: 0.0, freteOriginal: 1150.0 },

            // Março/2025
            { data: "03/03/2025", documento: "CTRC 071200", tipo: "D", valorDesconto: 8.6, freteOriginal: 1200.81 },
            { data: "07/03/2025", documento: "CTRC 071260", tipo: "D", valorDesconto: 6.0, freteOriginal: 1126.4 },
            { data: "20/03/2025", documento: "CTRC 071400", tipo: "C", valorDesconto: 0.0, freteOriginal: 1000.0 },

            // Abril/2025
            { data: "04/04/2025", documento: "CTRC 071750", tipo: "D", valorDesconto: 0.0, freteOriginal: 750.0 },
        ],
        []
    );

    /* ================= STATES ================= */
    const [filtro, setFiltro] = useState({
        ultimos: "Todos", // Todos | 5 Dias | 10 Dias | 15 Dias | 30 Dias | 60 Dias
        dataIni: "", // yyyy-mm-dd
        dataFim: "", // yyyy-mm-dd
        tipo: "Todos", // Todos | C | D
    });

    /* ================= DATA BASE PARA "ÚLTIMOS" =================
       Aqui uso a maior data do mock como "hoje" do histórico (fica bem estável p/ teste).
       Se preferir data real: new Date()
    */
    const baseUltimos = useMemo(() => {
        const max = registros
            .map((r) => brToDate(r.data))
            .filter(Boolean)
            .reduce((acc, d) => (acc && acc > d ? acc : d), null);
        return max || new Date();
    }, [registros]);

    /* ================= FILTRO ================= */
    const listaFiltrada = useMemo(() => {
        const tipo = filtro.tipo;
        const ini = isoToDate(filtro.dataIni);
        const fim = isoToDate(filtro.dataFim);

        // aplica "Últimos"
        let diasUltimos = null;
        if (filtro.ultimos !== "Todos") {
            const n = parseInt(String(filtro.ultimos).replace(/\D/g, ""), 10);
            if (!Number.isNaN(n)) diasUltimos = n;
        }

        const limiteUltimos = (() => {
            if (!diasUltimos) return null;
            const d = new Date(baseUltimos);
            d.setDate(d.getDate() - diasUltimos);
            return d; // inclusive
        })();

        return registros.filter((r) => {
            const d = brToDate(r.data);
            if (!d) return false;

            // Tipo
            if (tipo !== "Todos" && r.tipo !== tipo) return false;

            // Últimos X dias (baseado na maior data do histórico)
            if (limiteUltimos && d < limiteUltimos) return false;

            // Data Inicial / Final
            if (ini && d < ini) return false;
            if (fim) {
                // inclui o dia final inteiro
                const fim2 = new Date(fim);
                fim2.setHours(23, 59, 59, 999);
                if (d > fim2) return false;
            }

            return true;
        });
    }, [filtro, registros, baseUltimos]);

    /* ================= FRETE PESO DERIVADO + TOTAIS ================= */
    const totais = useMemo(() => {
        return listaFiltrada.reduce(
            (acc, r) => {
                const desc = clamp2(r.valorDesconto);
                const orig = clamp2(r.freteOriginal);
                const peso = clamp2(orig - desc);

                acc.desconto += desc;
                acc.freteOriginal += orig;
                acc.fretePeso += peso;

                return acc;
            },
            { desconto: 0, freteOriginal: 0, fretePeso: 0 }
        );
    }, [listaFiltrada]);

    /* ================= CAMPOS TOPO (apenas mock visual) ================= */
    const totalCreditos = "69.204,44";
    const saldoDisponivel = "43,66";

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CRÉDITO DE COMBUSTÍVEL - HISTÓRICO
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                {/* ================= CARD 1 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Parâmetros
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel className="col-span-5 w-full">
                            <option>022 - AUTO CLEAN TRANSPORTES LTDA ME</option>
                        </Sel>

                        <Label className="col-span-1 col-start-10">Total Créditos</Label>
                        <Txt className="col-span-2 text-right" readOnly value={totalCreditos} />
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5 w-full">
                            <option>022 - AUTO CLEAN TRANSPORTES LTDA ME</option>
                        </Sel>

                        <Label className="col-span-1 col-start-10">Saldo Disponível</Label>
                        <Txt className="col-span-2 text-right" readOnly value={saldoDisponivel} />
                    </div>
                </fieldset>

                {/* ================= CARD 2 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Filtros
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Últimos</Label>
                        <Sel
                            className="col-span-2 w-full"
                            value={filtro.ultimos}
                            onChange={(e) => setFiltro({ ...filtro, ultimos: e.target.value })}
                        >
                            <option>Todos</option>
                            <option>5 Dias</option>
                            <option>10 Dias</option>
                            <option>15 Dias</option>
                            <option>30 Dias</option>
                            <option>60 Dias</option>
                        </Sel>

                        <Label className="col-span-1">Data Inicial</Label>
                        <Txt
                            type="date"
                            className="col-span-2"
                            value={filtro.dataIni}
                            onChange={(e) => setFiltro({ ...filtro, dataIni: e.target.value })}
                        />

                        <Label className="col-span-1">Data Final</Label>
                        <Txt
                            type="date"
                            className="col-span-2"
                            value={filtro.dataFim}
                            onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value })}
                        />

                        <Label className="col-span-1">Tipo</Label>
                        <Sel
                            className="col-span-2 w-full"
                            value={filtro.tipo}
                            onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
                        >
                            <option value="Todos">Todos</option>
                            <option value="D">Débito</option>
                            <option value="C">Crédito</option>
                        </Sel>
                    </div>
                </fieldset>

                {/* ================= CARD 3 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Histórico
                    </legend>

                    <div className="border border-gray-300 rounded max-h-[350px] overflow-y-auto">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1">Data Lançamento</th>
                                    <th className="border px-2 py-1">Documento</th>
                                    <th className="border px-2 py-1">Tipo</th>
                                    <th className="border px-2 py-1 text-right">Valor Desconto</th>
                                    <th className="border px-2 py-1 text-right">Frete Peso Original</th>
                                    <th className="border px-2 py-1 text-right">Frete Peso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listaFiltrada.map((r, idx) => {
                                    const desc = clamp2(r.valorDesconto);
                                    const orig = clamp2(r.freteOriginal);
                                    const peso = clamp2(orig - desc);
                                    return (
                                        <tr key={idx} className="hover:bg-red-100">
                                            <td className="border px-2 py-1">{r.data}</td>
                                            <td className="border px-2 py-1">{r.documento}</td>
                                            <td className="border px-2 py-1 text-center">{r.tipo}</td>
                                            <td className="border px-2 py-1 text-right">{fmt(desc)}</td>
                                            <td className="border px-2 py-1 text-right">{fmt(orig)}</td>
                                            <td className="border px-2 py-1 text-right">{fmt(peso)}</td>
                                        </tr>
                                    );
                                })}

                                {listaFiltrada.length === 0 && (
                                    <tr>
                                        <td className="border px-2 py-3 text-center text-gray-500" colSpan={6}>
                                            Nenhum registro encontrado para os filtros informados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* ================= RODAPÉ ================= */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center">

                {/* AÇÕES À ESQUERDA */}
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    <button
                        onClick={() => alert("PDF gerado (mock)")}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Printer size={20} />
                        <span>Imprimir</span>
                    </button>
                </div>

                {/* TOTAIS À DIREITA */}
                <div className="ml-auto flex gap-2 items-center">
                    <span className="text-[11px] text-gray-600">Totais:</span>

                    <Txt
                        readOnly
                        className="w-[150px] text-right"
                        value={fmt(totais.desconto)}
                    />
                    <Txt
                        readOnly
                        className="w-[150px] text-right"
                        value={fmt(totais.freteOriginal)}
                    />
                    <Txt
                        readOnly
                        className="w-[150px] text-right"
                        value={fmt(totais.fretePeso)}
                    />
                </div>
            </div>

        </div>
    );
}
