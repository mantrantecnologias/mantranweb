import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

// Mock de Corretoras/Seguradoras
const corretorasMock = [
    { codigo: "000", nome: "POR CONTA DO CLIENTE" },
    { codigo: "001", nome: "SOMPO SEGUROS" },
    { codigo: "002", nome: "LIBERTY SEGUROS" },
];

function CorretoraSelecaoModal({ open, resultados, onSelect, onClose }) {
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[500px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-xl outline-none"
            >
                <div className="p-3 text-[13px]">
                    <h3 className="font-semibold text-red-700 mb-2 border-b pb-1">Selecione a Seguradora</h3>
                    <div className="border rounded overflow-y-auto max-h-[300px]">
                        <table className="w-full text-[12px]">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1 text-left w-20">Código</th>
                                    <th className="border px-2 py-1 text-left">Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resultados.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer ${selectedIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
                                        onClick={() => onSelect(item)}
                                    >
                                        <td className="border px-2 py-1">{item.codigo}</td>
                                        <td className="border px-2 py-1">{item.nome}</td>
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

export default function InputBuscaCorretora({
    label = "Seguradora",
    value = "",
    onChange,
    onSelect,
    className = "",
    placeholder = "Cód. ou Nome",
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

        const filtrados = corretorasMock.filter((item) => {
            return item.codigo.includes(termo) || item.nome.toLowerCase().includes(termoLower);
        });

        if (filtrados.length === 0) {
            alert("Nenhuma seguradora encontrada.");
            return;
        }

        if (filtrados.length === 1) {
            if (onSelect) onSelect(filtrados[0]);
        } else {
            setResultados(filtrados);
            setModalOpen(true);
        }
    };

    const handleSelectModal = (item) => {
        if (onSelect) onSelect(item);
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
                    className={`border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] w-full pr-7 ${readOnly ? 'bg-gray-100' : ''}`}
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

            <CorretoraSelecaoModal
                open={modalOpen}
                resultados={resultados}
                onSelect={handleSelectModal}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
