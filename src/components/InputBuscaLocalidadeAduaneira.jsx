import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

// Mock de Localidades Aduaneiras
const localidadesMock = [
    { codigo: "001", nome: "LIBRA PORT" },
    { codigo: "002", nome: "SANTOS BRASIL PARTICIPAÇÕES" },
    { codigo: "003", nome: "RODIRMAR" },
    { codigo: "004", nome: "SATEL CUBATAO" },
    { codigo: "005", nome: "SANTOS" },
    { codigo: "006", nome: "GUARUJA" },
];

function LocalidadeSelecaoModal({ open, resultados, onSelect, onClose }) {
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
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                className="bg-white w-[450px] rounded shadow-xl border border-gray-300 outline-none overflow-hidden"
            >
                <div className="bg-gray-100 px-3 py-2 border-b border-gray-300 flex justify-between items-center">
                    <span className="font-semibold text-red-700 text-[13px]">Selecione a Localidade Aduaneira</span>
                    <button onClick={onClose} className="text-gray-500 hover:text-red-700">✕</button>
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-[12px] border-collapse">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="border-b px-3 py-2 text-left w-20">Código</th>
                                <th className="border-b px-3 py-2 text-left">Nome</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((loc, idx) => (
                                <tr
                                    key={loc.codigo}
                                    className={`cursor-pointer ${selectedIndex === idx ? "bg-red-100" : "hover:bg-gray-50"}`}
                                    onClick={() => onSelect(loc)}
                                >
                                    <td className="border-b px-3 py-1.5 font-mono">{loc.codigo}</td>
                                    <td className="border-b px-3 py-1.5">{loc.nome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-2 bg-gray-50 border-t border-gray-300 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-3 py-1 border border-gray-300 rounded text-[12px] hover:bg-white"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function InputBuscaLocalidadeAduaneira({
    label = null, // Default null to avoid extra space
    value = "",
    onChange,
    onSelect,
    className = "",
    placeholder = "",
    readOnly = false,
    required = false,
    tabIndex,
    inputClassName = "" // New prop for internal input styling
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [resultados, setResultados] = useState([]);

    const handleKeyDown = (e) => {
        if (e.key !== "Enter" || readOnly) return;

        const termo = e.target.value.trim().toLowerCase();
        if (!termo) return;

        e.preventDefault();

        const filtrados = localidadesMock.filter(loc =>
            loc.codigo.includes(termo) || loc.nome.toLowerCase().includes(termo)
        );

        if (filtrados.length === 0) {
            alert("Nenhuma localidade encontrada.");
        } else if (filtrados.length === 1) {
            onSelect(filtrados[0]);
        } else {
            setResultados(filtrados);
            setModalOpen(true);
        }
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
                    className={`border border-gray-300 rounded px-2 text-[13px] w-full pr-7 focus:outline-none focus:ring-1 focus:ring-red-500 ${readOnly ? 'bg-gray-100' : ''} ${inputClassName}`}
                />
                {!readOnly && (
                    <button
                        type="button"
                        onClick={() => handleKeyDown({ key: 'Enter', target: { value }, preventDefault: () => { } })}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-700"
                    >
                        <Search size={14} />
                    </button>
                )}
            </div>

            <LocalidadeSelecaoModal
                open={modalOpen}
                resultados={resultados}
                onSelect={(loc) => {
                    onSelect(loc);
                    setModalOpen(false);
                }}
                onClose={() => setModalOpen(false)}
            />
        </div>
    );
}
