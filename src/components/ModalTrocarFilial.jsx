import { X } from "lucide-react";
import { useFilial } from "../context/FilialContext";
import { useEffect, useState } from "react";

export default function ModalTrocarFilial({ open, onClose }) {
    const { setFilial } = useFilial();
    const [filiais, setFiliais] = useState([]);

    // 🔹 MOCK — depois você liga na API
    useEffect(() => {
        if (open) {
            setFiliais([
                {
                    id: 1,
                    codigo: "001",
                    nome: "MANTRAN TECNOLOGIAS - MATRIZ",
                    empresaCodigo: "001",
                    empresaNome: "MANTRAN TRANSPORTES",
                },
                {
                    id: 2,
                    codigo: "002",
                    nome: "MANTRAN TECNOLOGIAS - SANTOS",
                    empresaCodigo: "001",
                    empresaNome: "MANTRAN TRANSPORTES",
                },
                {
                    id: 3,
                    codigo: "003",
                    nome: "MANTRAN TECNOLOGIAS - VALINHOS",
                    empresaCodigo: "001",
                    empresaNome: "MANTRAN TRANSPORTES",
                },
            ]);
        }
    }, [open]);

    if (!open) return null;

    function selecionarFilial(filial) {
        setFilial(filial);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 z-[999] flex items-center justify-center">
            <div className="bg-white w-[900px] rounded shadow-lg border">

                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100">
                    <h2 className="font-semibold text-gray-700">
                        Selecionar Filial
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-black"
                    >
                        <X size={18} />
                    </button>
                </div>



                {/* TABELA */}
                <div className="max-h-[420px] overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-200 text-gray-700 sticky top-0">
                            <tr>
                                <th className="border px-2 py-1 text-left">Código Filial</th>
                                <th className="border px-2 py-1 text-left">Nome Filial</th>
                                <th className="border px-2 py-1 text-left">Código Empresa</th>
                                <th className="border px-2 py-1 text-left">Nome Empresa</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filiais.map((f) => (
                                <tr
                                    key={f.id}
                                    onDoubleClick={() => selecionarFilial(f)}
                                    className="cursor-pointer hover:bg-red-50"
                                >
                                    <td className="border px-2 py-1">{f.codigo}</td>
                                    <td className="border px-2 py-1">{f.nome}</td>
                                    <td className="border px-2 py-1">{f.empresaCodigo}</td>
                                    <td className="border px-2 py-1">{f.empresaNome}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-2 px-4 py-2 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
