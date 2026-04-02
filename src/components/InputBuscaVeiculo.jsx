import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

// Mock de dados de Veículos
const veiculosMock = [
    { codigo: "000001", placa: "ABC1234", modelo: "R 450 6X2", classe: "CAVALO MECÂNICO", tpUtilizacao: "T", km: "125000" },
    { codigo: "000002", placa: "AGD1234", modelo: "RC950 7X2", classe: "TRUCK", tpUtilizacao: "T", km: "85400" },
    { codigo: "000003", placa: "BCD1234", modelo: "XR3 BH", classe: "TOCO", tpUtilizacao: "T", km: "42100" },
    { codigo: "000004", placa: "FGT1234", modelo: "TRACKXY", classe: "CARRETA", tpUtilizacao: "R", km: "0" },
    { codigo: "000005", placa: "AGT1234", modelo: "TRACKXY", classe: "CARRETA", tpUtilizacao: "R", km: "0" },
];

const InputBuscaVeiculo = ({
    value,
    onChange,
    onSelect,
    className = "",
    placeholder = "Código ou Placa",
    label = "Veículo",
    tipoUtilizacao = "T", // 'T' para Tração, 'R' para Reboque
    tabIndex
}) => {
    const [showModal, setShowModal] = useState(false);
    const [resultados, setResultados] = useState([]);

    const formatarDescricao = (v) => `${v.placa} - ${v.modelo} - ${v.classe}`;

    const buscarVeiculo = (termo) => {
        if (!termo) return;

        const termoBusca = termo.toUpperCase();
        const filtrados = veiculosMock.filter((v) => {
            const matchesTermo = v.codigo.includes(termoBusca) || v.placa.includes(termoBusca);
            const matchesTipo = v.tpUtilizacao === tipoUtilizacao;
            return matchesTermo && matchesTipo;
        });

        if (filtrados.length === 1) {
            onSelect(filtrados[0]);
        } else if (filtrados.length > 1) {
            setResultados(filtrados);
            setShowModal(true);
        } else {
            alert("Nenhum veículo encontrado para este tipo.");
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
            buscarVeiculo(value);
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
                    onClick={() => buscarVeiculo(value)}
                />
            </div>

            {showModal && (
                <VeiculoSelecaoModal
                    open={showModal}
                    resultados={resultados}
                    tipoUtilizacao={tipoUtilizacao}
                    onSelect={(v) => {
                        onSelect(v);
                        setShowModal(false);
                    }}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

function VeiculoSelecaoModal({ open, resultados, tipoUtilizacao, onSelect, onClose }) {
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[650px] max-w-[95vw] bg-white border border-gray-300 rounded shadow-xl outline-none overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-red-700">Seleção de Veículo ({tipoUtilizacao === 'T' ? 'Tração' : 'Reboque'})</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>
                <div className="max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-[12px]">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-2 border-b">Código</th>
                                <th className="px-4 py-2 border-b">Placa</th>
                                <th className="px-4 py-2 border-b">Modelo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((v, idx) => (
                                <tr
                                    key={v.codigo}
                                    className={`cursor-pointer border-b border-gray-100 last:border-0 ${selectedIndex === idx ? "bg-red-200" : "hover:bg-red-100"}`}
                                    onClick={() => onSelect(v)}
                                >
                                    <td className="px-4 py-2">{v.codigo}</td>
                                    <td className="px-4 py-2 font-medium">{v.placa}</td>
                                    <td className="px-4 py-2 text-gray-600">{v.modelo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default InputBuscaVeiculo;
