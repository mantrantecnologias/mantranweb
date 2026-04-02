import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, PlusCircle } from "lucide-react";
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

/* ================= Componente ================= */
export default function CreditoCombustivelLancamento({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [modalMsg, setModalMsg] = useState(false);

    /* ===== FORM ===== */
    const [form, setForm] = useState({
        empresa: "022 - AUTO CLEAN TRANSPORTES LTDA ME",
        filial: "022 - AUTO CLEAN TRANSPORTES LTDA ME",
        data: new Date().toISOString().slice(0, 10),
        tipo: "C",
        valor: "",
        saldo: 69204.44,
        saldoCalculado: 83334.06,
    });

    /* ===== GRID ===== */
    const [lista, setLista] = useState([
        { data: "01/11/2024", tipo: "C", valor: 1000 },
        { data: "18/11/2024", tipo: "C", valor: 550 },
        { data: "02/12/2024", tipo: "C", valor: 850 },
        { data: "18/12/2024", tipo: "C", valor: 650 },
        { data: "03/01/2025", tipo: "C", valor: 600 },
    ]);

    /* ================= Ações ================= */
    const limpar = () => {
        setForm({
            ...form,
            data: new Date().toISOString().slice(0, 10),
            tipo: "C",
            valor: "",
        });
    };

    const incluir = () => {
        if (!form.valor) return;

        const valorNum = Number(form.valor);

        const novoSaldo =
            form.tipo === "C"
                ? form.saldo + valorNum
                : form.saldo - valorNum;

        const novoSaldoCalculado =
            form.tipo === "C"
                ? form.saldoCalculado + valorNum
                : form.saldoCalculado - valorNum;

        setLista([
            ...lista,
            {
                data: form.data.split("-").reverse().join("/"),
                tipo: form.tipo,
                valor: valorNum,
            },
        ]);

        setForm({
            ...form,
            saldo: novoSaldo,
            saldoCalculado: novoSaldoCalculado,
            valor: "",
        });

        setModalMsg(true);
    };

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700
        bg-gray-50 h-[calc(100vh-56px)] flex flex-col
        ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CRÉDITO DE COMBUSTÍVEL - LANÇAMENTOS
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">

                {/* ================= CARD 1 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Lançamento
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Empresa</Label>
                        <Sel className="col-span-5 w-full" readOnly>
                            <option>{form.empresa}</option>
                        </Sel>

                        <Label className="col-span-1">Filial</Label>
                        <Sel className="col-span-5 w-full" readOnly>
                            <option>{form.filial}</option>
                        </Sel>
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1">Data</Label>
                        <Txt
                            type="date"
                            className="col-span-2"
                            value={form.data}
                            onChange={(e) =>
                                setForm({ ...form, data: e.target.value })
                            }
                        />

                        <Label className="col-span-1">Tipo</Label>
                        <Sel
                            className="col-span-2"
                            value={form.tipo}
                            onChange={(e) =>
                                setForm({ ...form, tipo: e.target.value })
                            }
                        >
                            <option value="C">Crédito</option>
                            <option value="D">Débito</option>
                        </Sel>

                        <Label className="col-span-1">Valor</Label>
                        <Txt
                            className="col-span-2 text-right"
                            value={form.valor}
                            onChange={(e) =>
                                setForm({ ...form, valor: e.target.value })
                            }
                        />
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1">Saldo</Label>
                        <Txt
                            className="col-span-2 text-right"
                            readOnly
                            value={form.saldo.toFixed(2)}
                        />

                        <Label className="col-span-1">Saldo Calculado</Label>
                        <Txt
                            className="col-span-2 text-right"
                            readOnly
                            value={form.saldoCalculado.toFixed(2)}
                        />
                    </div>
                </fieldset>

                {/* ================= CARD 2 ================= */}
                <fieldset className="border border-gray-300 rounded p-3">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Lançamentos
                    </legend>

                    <div className="border border-gray-300 rounded max-h-[300px] overflow-y-auto">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1">Data</th>
                                    <th className="border px-2 py-1">Tipo</th>
                                    <th className="border px-2 py-1 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-red-100">
                                        <td className="border px-2 py-1">{item.data}</td>
                                        <td className="border px-2 py-1 text-center">{item.tipo}</td>
                                        <td className="border px-2 py-1 text-right">
                                            {item.valor.toFixed(2)}
                                        </td>
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
                    onClick={incluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>
            </div>

            {/* === MODAL SUCESSO PADRÃO === */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Lançamento realizado com sucesso!
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
        </div>
    );
}
