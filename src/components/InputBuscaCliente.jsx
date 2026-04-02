import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { maskCNPJ, onlyDigits } from "../utils/masks";

// Mock de Empresas (simulando banco de dados)
const empresasMock = [
    { cnpj: "04086814000141", razao: "MANTRAN TRANSPORTES LTDA", cidade: "JUNDIAI", uf: "SP", cep: "13201000", end: "AV INTERLAGOS, 100", bairro: "ESTORIL", seguradoraCodigo: "001", seguradoraNome: "SOMPO SEGUROS", ie: "123456789" },
    { cnpj: "16464947000193", razao: "BEVANNI TRANSPORTES LTDA", cidade: "SAO PAULO", uf: "SP", cep: "01000000", end: "RUA AUGUSTA, 500", bairro: "CONSOLACAO", seguradoraCodigo: "002", seguradoraNome: "LIBERTY SEGUROS", ie: "987654321" },
    { cnpj: "12345678000199", razao: "AMBEV LOGISTICA LTDA", cidade: "RESENDE", uf: "RJ", cep: "27510000", end: "RODOVIA PRESIDENTE DUTRA, KM 10", bairro: "INDUSTRIAL", seguradoraCodigo: "000", seguradoraNome: "POR CONTA DO CLIENTE", ie: "112233445" },
    { cnpj: "98765432000100", razao: "BEV LOG TRANSPORTES", cidade: "SALVADOR", uf: "BA", cep: "40000990", end: "AV OCEANICA, 200", bairro: "ONDINA", seguradoraCodigo: "001", seguradoraNome: "SOMPO SEGUROS", ie: "554433221" },
    { cnpj: "50221019000136", razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA", cidade: "ITU", uf: "SP", cep: "13300003", end: "AV PRIMO SCHINCARIOL, 1000", bairro: "ITAIM", seguradoraCodigo: "001", seguradoraNome: "SOMPO SEGUROS", ie: "667788990" },
    { cnpj: "0525495700651", razao: "HNK BR LOGISTICA E DISTRIBUICAO LTDA", cidade: "SALVADOR", uf: "BA", cep: "40000990", end: "PORTO DE SALVADOR, SETOR B", bairro: "COMERCIO", seguradoraCodigo: "002", seguradoraNome: "LIBERTY SEGUROS", ie: "009988776" },
];

function EmpresaSelecaoModal({ open, resultados, onSelect, onClose }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        if (open) {
            setSelectedIndex(0);
            // Pequeno delay para garantir que o modal rendenizou
            setTimeout(() => modalRef.current?.focus(), 10);
        }
    }, [open]);

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < resultados.length - 1 ? prev + 1 : prev));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "Enter") {
            e.preventDefault();
            onSelect(resultados[selectedIndex]);
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 z-[200]"
                onClick={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            ></div>
            <div
                ref={modalRef}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[650px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-xl outline-none"
            >
                <div className="p-3 text-[13px]">
                    <h3 className="font-semibold text-red-700 mb-2 border-b pb-1">Selecione o Cliente</h3>
                    <div className="border rounded overflow-y-auto max-h-[350px]">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1 text-left">CNPJ</th>
                                    <th className="border px-2 py-1 text-left">Razão Social</th>
                                    <th className="border px-2 py-1 text-left">Cidade</th>
                                    <th className="border px-2 py-1 text-center">UF</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((emp, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer ${selectedIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
                                        onClick={() => onSelect(emp)}
                                    >
                                        <td className="border px-2 py-1">{maskCNPJ(emp.cnpj)}</td>
                                        <td className="border px-2 py-1">{emp.razao}</td>
                                        <td className="border px-2 py-1">{emp.cidade}</td>
                                        <td className="border px-2 py-1 text-center">{emp.uf}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={onClose}
                            className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function InputBuscaCliente({
    label = null,
    value = "",
    onChange,
    onSelect,
    className = "",
    placeholder = "CNPJ ou Nome",
    readOnly = false,
    required = false,
    tabIndex,
    inputClassName = ""
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [resultados, setResultados] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key !== "Enter" || readOnly) return;
        e.preventDefault();

        const termo = value?.toString().trim();
        if (!termo) {
            // Se vazio, pula para o próximo
            const next = document.querySelector(`[tabindex="${tabIndex + 1}"]`);
            if (next) next.focus();
            return;
        }

        const termoLower = termo.toLowerCase();
        const termoDigits = onlyDigits(termo);

        const filtrados = empresasMock.filter((emp) => {
            const cnpjDigits = onlyDigits(emp.cnpj);
            const razaoLower = emp.razao.toLowerCase();
            const matchCNPJ = termoDigits && cnpjDigits.includes(termoDigits);
            const matchRazao = razaoLower.includes(termoLower);
            return matchCNPJ || matchRazao;
        });

        if (filtrados.length === 0) {
            alert("Nenhum registro encontrado.");
            return;
        }

        if (filtrados.length === 1) {
            if (onSelect) onSelect(filtrados[0]);
        } else {
            setResultados(filtrados);
            setModalOpen(true);
        }
    };

    const handleSelectModal = (emp) => {
        if (onSelect) onSelect(emp);
        setModalOpen(false);
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {label && <label className="text-[12px] text-gray-700 mb-[2px]">{label}</label>}
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    required={required}
                    tabIndex={tabIndex}
                    className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full pr-7 ${readOnly ? 'bg-gray-100' : ''} ${inputClassName}`}
                />
                {!readOnly && (
                    <button
                        type="button"
                        onClick={(e) => handleKeyDown({ key: 'Enter', preventDefault: () => { } })}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700"
                        title="Pesquisar (Enter)"
                    >
                        <Search size={14} />
                    </button>
                )}

            </div>

            <EmpresaSelecaoModal
                open={modalOpen}
                resultados={resultados}
                onSelect={handleSelectModal}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
