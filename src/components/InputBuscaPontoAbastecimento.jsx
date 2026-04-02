import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

// Mock de Pontos de Abastecimento Requested by User
const pontosMock = [
    { cnpj: "10545575000143", fantasia: "POSTO MANTRAN" },
    { cnpj: "10598546529854", fantasia: "POSTO SHELL" },
    { cnpj: "10687234582153", fantasia: "POSTO IPIRANGA" },
];

const onlyDigits = (s) => String(s || "").replace(/\D/g, "");

function PontoAbastecimentoSelecaoModal({ open, resultados, onSelect, onClose }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        if (open) {
            setSelectedIndex(0);
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
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-red-700">Selecione o Ponto de Abastecimento</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 border-b">CNPJ</th>
                                <th className="px-4 py-2 border-b">Fantasia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((ponto, idx) => (
                                <tr
                                    key={idx}
                                    className={`cursor-pointer border-b border-gray-100 last:border-0 ${selectedIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
                                    onClick={() => onSelect(ponto)}
                                >
                                    <td className="px-4 py-2 font-medium">{ponto.cnpj}</td>
                                    <td className="px-4 py-2 text-gray-600">{ponto.fantasia}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default function InputBuscaPontoAbastecimento({
    label = "Ponto de Abastecimento",
    value = "",
    onChange,
    onSelect,
    className = "",
    placeholder = "CNPJ ou Fantasia",
    readOnly = false,
    required = false,
    tabIndex
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [resultados, setResultados] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key !== "Enter" || readOnly) return;
        e.preventDefault();

        const termo = value?.toString().trim();
        if (!termo) {
            const next = document.querySelector(`[tabindex="${tabIndex + 1}"]`);
            if (next) next.focus();
            return;
        }

        const termoLower = termo.toLowerCase();
        const termoDigits = onlyDigits(termo);

        const filtrados = pontosMock.filter((p) => {
            const cnpjDigits = onlyDigits(p.cnpj);
            const fantasiaLower = p.fantasia.toLowerCase();

            const matchCNPJ = termoDigits && cnpjDigits.includes(termoDigits);
            const matchFantasia = fantasiaLower.includes(termoLower);

            return matchCNPJ || matchFantasia;
        });

        if (filtrados.length === 0) {
            alert("Nenhum Ponto de Abastecimento encontrado.");
            return;
        }

        if (filtrados.length === 1) {
            if (onSelect) onSelect(filtrados[0]);
            // Attempt to move focus to next element if onSelect handled it
            setTimeout(() => {
                const next = document.querySelector(`[tabindex="${tabIndex + 1}"]`);
                if (next) next.focus();
            }, 10);
        } else {
            setResultados(filtrados);
            setModalOpen(true);
        }
    };

    const handleSelectModal = (ponto) => {
        if (onSelect) onSelect(ponto);
        setModalOpen(false);
        // Attempt to move focus to next element
        setTimeout(() => {
            const next = document.querySelector(`[tabindex="${tabIndex + 1}"]`);
            if (next) next.focus();
        }, 10);
    };

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label className="block text-[12px] font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative flex items-center">
                <input
                    type="text"
                    className={`w-full border border-gray-300 rounded px-2 pr-8 h-[26px] text-[13px] focus:outline-none focus:ring-1 focus:ring-blue-500 ${readOnly ? 'bg-gray-100' : 'bg-white'}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={tabIndex}
                    readOnly={readOnly}
                    required={required}
                />
                {!readOnly && (
                    <Search
                        size={14}
                        className="absolute right-2 text-gray-400 cursor-pointer hover:text-red-700"
                        onClick={() => handleKeyDown({ key: 'Enter', preventDefault: () => { } })}
                    />
                )}
            </div>

            <PontoAbastecimentoSelecaoModal
                open={modalOpen}
                resultados={resultados}
                onSelect={handleSelectModal}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
