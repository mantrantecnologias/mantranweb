// src/pages/Agencia.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
    Trash2,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ============= Helpers ============= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt(props) {
    return (
        <input
            {...props}
            className={
                "border border-gray-300 rounded px-2 py-[2px] h-[26px] text-[13px] " +
                (props.className || "")
            }
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-2 h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

/* ============= Mock inicial ============= */
const mockAgencias = [
    {
        banco: "001 - BANCO DO BRASIL S.A.",
        agencia: "264",
        digito: "0",
        nome: "BANCO DO BRASIL - DIFAULXLOG",
        endereco: "AV. SENADOR FLAQUER",
        cidade: "SANTO ANDRÉ",
        uf: "SP",
        cepRef: "09010-000",
        cepInicial: "09000-001",
        cepFinal: "09000-100"
    },
    {
        banco: "033 - SANTANDER",
        agencia: "0929",
        digito: "6",
        nome: "BANCO DO BRASIL",
        endereco: "INDAIATUBA",
        cidade: "INDAIATUBA",
        uf: "SP",
        cepRef: "00000-000",
        cepInicial: "00000-000",
        cepFinal: "00000-000"
    }
];

export default function Agencia({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const [lista, setLista] = useState(mockAgencias);
    const [selecionado, setSelecionado] = useState(null);
    const [showCompl, setShowCompl] = useState(true);

    const [dados, setDados] = useState({
        banco: "",
        agencia: "",
        digito: "",
        nome: "",
        endereco: "",
        cidade: "",
        uf: "",
        cepRef: "",
        cepInicial: "",
        cepFinal: ""
    });

    const [modalMsg, setModalMsg] = useState(null);
    const [modalConfirmExclusao, setModalConfirmExclusao] = useState(false);

    const handleChange = (campo) => (e) => {
        setDados((prev) => ({ ...prev, [campo]: e.target.value }));
    };

    const handleSelecionar = (item, idx) => {
        setSelecionado(idx);
        setDados({ ...item });
    };

    const handleLimpar = () => {
        setDados({
            banco: "",
            agencia: "",
            digito: "",
            nome: "",
            endereco: "",
            cidade: "",
            uf: "",
            cepRef: "",
            cepInicial: "",
            cepFinal: ""
        });
        setSelecionado(null);
    };

    const handleIncluir = () => {
        if (!dados.banco || !dados.agencia) {
            setModalMsg("Informe o Banco e a Agência.");
            return;
        }
        setLista((prev) => [...prev, dados]);
        setModalMsg("Agência incluída com sucesso!");
        handleLimpar();
    };

    const handleAlterar = () => {
        if (selecionado === null) {
            setModalMsg("Selecione um registro para alterar.");
            return;
        }
        setLista((prev) =>
            prev.map((item, idx) => (idx === selecionado ? dados : item))
        );
        setModalMsg("Agência alterada com sucesso!");
    };

    const confirmarExcluir = () => {
        if (selecionado === null) {
            setModalMsg("Selecione uma agência para excluir.");
            return;
        }
        setModalConfirmExclusao(true);
    };

    const handleExcluir = () => {
        setLista((prev) => prev.filter((_, idx) => idx !== selecionado));
        handleLimpar();
        setModalConfirmExclusao(false);
        setModalMsg("Agência excluída com sucesso!");
    };

    return (
        <div
            className={`
                transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
                h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}
            `}
        >
            {/* Título */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                CADASTRO - AGÊNCIA
            </h1>

            {/* Conteúdo */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">

                {/* Card 1 - Cadastro de Agência */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Cadastro de Agência
                    </legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1 justify-end">Banco</Label>
                        <Sel className="col-span-5" value={dados.banco} onChange={handleChange("banco")}>
                            <option></option>
                            <option>001 - BANCO DO BRASIL S.A.</option>
                            <option>033 - SANTANDER</option>
                            <option>104 - CAIXA ECONÔMICA</option>
                        </Sel>

                        <Label className="col-span-1 justify-end">Nº Agência</Label>
                        <Txt className="col-span-2" value={dados.agencia} onChange={handleChange("agencia")} />

                        <Txt
                            className="col-span-1"
                            placeholder="Dígito"
                            value={dados.digito}
                            onChange={handleChange("digito")}
                        />
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1 justify-end">Nome Agência</Label>
                        <Txt className="col-span-10" value={dados.nome} onChange={handleChange("nome")} />
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-1 justify-end">Endereço</Label>
                        <Txt className="col-span-10" value={dados.endereco} onChange={handleChange("endereco")} />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-1 justify-end">Cidade</Label>
                        <Txt className="col-span-4" value={dados.cidade} onChange={handleChange("cidade")} />

                        <Label className="col-span-1 justify-end">UF</Label>
                        <Txt className="col-span-1" value={dados.uf} onChange={handleChange("uf")} />

                        <Label className="col-span-1 justify-end">CEP REF</Label>
                        <Txt className="col-span-2" value={dados.cepRef} onChange={handleChange("cepRef")} />
                    </div>

                    {/* Linha 5 */}
                    <div className="grid grid-cols-12 gap-2 mt-2">
                        <Label className="col-span-1 justify-end">CEP Inicial Atend.</Label>
                        <Txt className="col-span-2" value={dados.cepInicial} onChange={handleChange("cepInicial")} />

                        <Label className="col-span-2 col-start-5 justify-end">CEP Final Atend.</Label>
                        <Txt className="col-span-2" value={dados.cepFinal} onChange={handleChange("cepFinal")} />
                    </div>
                </fieldset>

                {/* Card 2 - Grid */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white flex-1 flex flex-col">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Agências Cadastradas
                    </legend>

                    <div className="border border-gray-200 rounded overflow-y-auto max-h-[340px]">
                        <table className="w-full text-[12px] border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-2 py-1 text-left w-[120px]">Banco</th>
                                    <th className="border px-2 py-1 text-left w-[80px]">Agência</th>
                                    <th className="border px-2 py-1 text-left w-[50px]">Dig.</th>
                                    <th className="border px-2 py-1 text-left">Nome</th>
                                    <th className="border px-2 py-1 text-left">Endereço</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lista.map((item, idx) => (
                                    <tr
                                        key={idx}
                                        className={`cursor-pointer ${selecionado === idx ? "bg-green-100" : "hover:bg-gray-50"
                                            }`}
                                        onClick={() => handleSelecionar(item, idx)}
                                    >
                                        <td className="border px-2 py-[4px]">{item.banco}</td>
                                        <td className="border px-2 py-[4px]">{item.agencia}</td>
                                        <td className="border px-2 py-[4px]">{item.digito}</td>
                                        <td className="border px-2 py-[4px]">{item.nome}</td>
                                        <td className="border px-2 py-[4px]">{item.endereco}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </fieldset>
            </div>

            {/* Rodapé */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={handleLimpar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                <button
                    onClick={handleIncluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <PlusCircle size={20} />
                    <span>Incluir</span>
                </button>

                <button
                    onClick={handleAlterar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Edit size={20} />
                    <span>Alterar</span>
                </button>

                <button
                    onClick={confirmarExcluir}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <Trash2 size={20} />
                    <span>Excluir</span>
                </button>
            </div>

            {/* Modal mensagem */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">{modalMsg}</p>
                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={() => setModalMsg(null)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Modal confirmar exclusão */}
            {modalConfirmExclusao && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-red-700 font-bold mb-4">
                            Deseja realmente excluir esta agência?
                        </p>

                        <div className="flex justify-center gap-3">
                            <button
                                className="px-3 py-1 bg-gray-300 text-black rounded"
                                onClick={() => setModalConfirmExclusao(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                className="px-3 py-1 bg-red-700 text-white rounded"
                                onClick={handleExcluir}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
