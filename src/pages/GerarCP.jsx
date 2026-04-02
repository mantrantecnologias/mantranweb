// src/components/GerarCP.jsx
import { useState } from "react";
import { XCircle } from "lucide-react";

// Mocks (iguais ao original)
const mockCategorias = ["1 - IMPOSTOS SOBRE VENDAS", "2 - DESPESAS OPERACIONAIS"];
const mockSubCategorias = ["1 - ICMS", "2 - ICMS ANTECIPADO", "3 - OUTROS"];
const mockContas = [
    "502879-9 - BANCO DO BRASIL",
    "12345-0 - CAIXA ECONÔMICA",
    "98765-4 - ITAÚ",
];

function Label({ children, className = "" }) {
    return <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>{children}</label>;
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                (props.className || "")
            }
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                className
            }
        >
            {children}
        </select>
    );
}

export default function GerarCP({ onClose }) {
    const [modalMsg, setModalMsg] = useState(false);

    const [form, setForm] = useState({
        creditoCnpj: "00000000000000",
        creditoNome: "ALAN ROBERT",
        numeroTitulo: "360760212424",
        numeroParcela: "1",
        qtParcela: "1",
        valorPagar: "100,00",
        dtVencto: "2026-01-01",
        categoria: mockCategorias[0],
        subCategoria: mockSubCategorias[1],
        observacao: "",
        dtPagto: "2026-01-01",
        conta: mockContas[0],
        banco: "001",
        agencia: "0929-6",
    });

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleGerar = () => {
        setModalMsg(true);
    };

    return (
        <>
            {/* MODAL PRINCIPAL */}
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-[1000px] rounded-md shadow-lg border border-gray-300">

                    <h2 className="text-center text-red-700 font-semibold py-2 text-sm border-b border-gray-300">
                        IPVA - GERAR CONTAS A PAGAR
                    </h2>

                    <div className="p-3 space-y-3">
                        <fieldset className="border border-gray-300 rounded p-3 bg-white">
                            <legend className="px-2 text-red-700 text-[13px]">
                                Dados para Contas a Pagar
                            </legend>

                            <div className="space-y-2">

                                {/* Linha 1 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">A Crédito de</Label>
                                    <Txt
                                        className="col-span-2"
                                        value={form.creditoCnpj}
                                        onChange={handleChange("creditoCnpj")}
                                    />
                                    <Txt
                                        className="col-span-8 bg-gray-200"
                                        readOnly
                                        value={form.creditoNome}
                                    />
                                </div>

                                {/* Linha 2 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Nº Título</Label>
                                    <Txt
                                        className="col-span-3"
                                        value={form.numeroTitulo}
                                        onChange={handleChange("numeroTitulo")}
                                    />

                                    <Label className="col-span-1">Nº Parcela</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.numeroParcela}
                                    />

                                    <Label className="col-span-1">QT Parcela</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.qtParcela}
                                    />

                                    <Label className="col-span-1">Valor a pagar</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200 text-right"
                                        readOnly
                                        value={form.valorPagar}
                                    />
                                </div>

                                {/* Linha 3 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">DT Vencto.</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2"
                                        value={form.dtVencto}
                                        onChange={handleChange("dtVencto")}
                                    />

                                    <Label className="col-span-1">Categoria</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.categoria}
                                        onChange={handleChange("categoria")}
                                    >
                                        {mockCategorias.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1">Sub Categoria</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.subCategoria}
                                        onChange={handleChange("subCategoria")}
                                    >
                                        {mockSubCategorias.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>
                                </div>

                                {/* Linha 4 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">Observação</Label>
                                    <Txt
                                        className="col-span-10"
                                        value={form.observacao}
                                        onChange={handleChange("observacao")}
                                    />
                                </div>

                                {/* Linha 5 */}
                                <div className="grid grid-cols-12 gap-2 items-center">
                                    <Label className="col-span-2">DT Pagto.</Label>
                                    <Txt
                                        type="date"
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={form.dtPagto}
                                    />

                                    <Label className="col-span-1">Nº Conta</Label>
                                    <Sel
                                        className="col-span-3"
                                        value={form.conta}
                                        onChange={handleChange("conta")}
                                    >
                                        {mockContas.map((c) => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </Sel>

                                    <Label className="col-span-1">Banco</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.banco}
                                    />

                                    <Label className="col-span-1">Agência</Label>
                                    <Txt
                                        className="col-span-1 bg-gray-200 text-center"
                                        readOnly
                                        value={form.agencia}
                                    />
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {/* RODAPÉ */}
                    <div className="flex justify-end gap-4 px-4 py-2 border-t border-gray-300 bg-gray-50">
                        <button
                            onClick={onClose}
                            className="px-4 py-1 text-[13px] rounded border border-gray-300 hover:bg-gray-100"
                        >
                            Fechar
                        </button>

                        <button
                            onClick={handleGerar}
                            className="px-4 py-1 text-[13px] rounded bg-red-700 text-white hover:bg-red-800"
                        >
                            Gerar CP
                        </button>
                    </div>
                </div>
            </div>

            {/* SUCESSO — modelo exatamente igual ao solicitado */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Título gerado com sucesso!
                        </p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => {
                                setModalMsg(false);
                                onClose();   // <-- FECHA A MODAL PRINCIPAL TAMBÉM
                            }}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

        </>
    );
}
