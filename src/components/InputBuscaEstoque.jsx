import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

// Mock de dados de Estoque (Combustíveis)
const estoqueMock = [
    { codigo: "000001", descricao: "Diesel" },
    { codigo: "000002", descricao: "Gasolina" },
    { codigo: "000003", descricao: "Alcool" },
];

const InputBuscaEstoque = ({
    value,
    onChange,
    onSelect,
    className = "",
    placeholder = "Código ou Descrição",
    label = "Estoque",
    tabIndex
}) => {
    const [showModal, setShowModal] = useState(false);
    const [resultados, setResultados] = useState([]);

    const buscarEstoque = (termo) => {
        if (!termo) return;

        const termoBusca = termo.toUpperCase();
        const filtrados = estoqueMock.filter((item) => {
            const matchesCodigo = item.codigo.includes(termoBusca);
            const matchesDescricao = item.descricao.toUpperCase().includes(termoBusca);
            return matchesCodigo || matchesDescricao;
        });

        if (filtrados.length === 1) {
            onSelect(filtrados[0]);
        } else if (filtrados.length > 1) {
            setResultados(filtrados);
            setShowModal(true);
        } else {
            alert("Nenhum item de estoque encontrado.");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (!value) {
                const next = document.querySelector(`[tabindex="${tabIndex + 1}"]`);
                if (next) next.focus();
                return;
            }
            buscarEstoque(value);
        }
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
                    className="w-full border border-gray-300 rounded px-2 pr-8 h-[24px] text-[12px] focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onKeyDown={handleKeyDown}
                    tabIndex={tabIndex}
                />
                <Search
                    size={14}
                    className="absolute right-2 text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => buscarEstoque(value)}
                />
            </div>

            {showModal && (
                <EstoqueSelecaoModal
                    open={showModal}
                    resultados={resultados}
                    onSelect={(item) => {
                        onSelect(item);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

function EstoqueSelecaoModal({ open, resultados, onSelect, onClose }) {
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[400px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-xl outline-none overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-red-700">Seleção de Estoque</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 border-b">Código</th>
                                <th className="px-4 py-2 border-b">Descrição</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((item, idx) => (
                                <tr
                                    key={item.codigo}
                                    className={`cursor-pointer border-b border-gray-100 last:border-0 ${selectedIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
                                    onClick={() => onSelect(item)}
                                >
                                    <td className="px-4 py-2">{item.codigo}</td>
                                    <td className="px-4 py-2 font-medium">{item.descricao}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default InputBuscaEstoque;
