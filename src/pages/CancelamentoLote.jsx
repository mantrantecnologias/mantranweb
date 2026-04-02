// src/pages/CancelamentoLote.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Trash2 } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==== COMPONENTES BÁSICOS ==== */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] flex items-center text-gray-700 ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", ...rest }) {
    return (
        <input
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        />
    );
}

function Sel({ className = "", children, ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

export default function CancelamentoLote({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    // ==========================
    // FILTROS
    // ==========================
    const [processo, setProcesso] = useState("LAST MILE XPT");

    const [filtroSelecionado, setFiltroSelecionado] = useState("shopee");

    const [filtros, setFiltros] = useState({
        dtShopeeIni: "",
        dtShopeeFim: "",
        dtEmissaoIni: "",
        dtEmissaoFim: "",
        ctrlIni: "",
        ctrlFim: "",
        impIni: "",
        impFim: "",
    });

    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalMsg, setModalMsg] = useState(false);

    const limpar = () => {
        setFiltros({
            dtShopeeIni: "",
            dtShopeeFim: "",
            dtEmissaoIni: "",
            dtEmissaoFim: "",
            ctrlIni: "",
            ctrlFim: "",
            impIni: "",
            impFim: "",
        });
        setFiltroSelecionado("shopee");
    };

    const gerarCancelamento = () => setModalConfirm(true);

    const confirmar = () => {
        setModalConfirm(false);
        setTimeout(() => {
            setModalMsg(true);
        }, 300);
    };

    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
                bg-gray-50 h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
            >
                {/* Título */}
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    CANCELAMENTO DE CTE EM LOTE
                </h1>

                {/* CONTEÚDO */}
                <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-4 overflow-y-auto">

                    <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-4">

                        {/* ===================== CARD 1 ===================== */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Selecione o Processo
                            </legend>

                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Processo</Label>
                                <Sel
                                    className="col-span-4"
                                    value={processo}
                                    onChange={(e) => setProcesso(e.target.value)}
                                >
                                    <option>LAST MILE XPT</option>
                                    <option>LAST MILE HUB</option>
                                    <option>LINE HAUL XPT</option>
                                </Sel>
                            </div>
                        </fieldset>

                        {/* ===================== CARD 2 ===================== */}
                        <fieldset className="border border-gray-300 rounded p-3">
                            <legend className="px-2 text-red-700 font-semibold text-[13px]">
                                Filtrar Por
                            </legend>

                            {/* Data Shopee */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filtro"
                                        checked={filtroSelecionado === "shopee"}
                                        onChange={() => setFiltroSelecionado("shopee")}
                                    />
                                    <Label>Data Shopee</Label>
                                </div>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "shopee"}
                                    value={filtros.dtShopeeIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtShopeeIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">Até</Label>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "shopee"}
                                    value={filtros.dtShopeeFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtShopeeFim: e.target.value })
                                    }
                                />
                            </div>

                            {/* Data Emissão */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filtro"
                                        checked={filtroSelecionado === "emissao"}
                                        onChange={() => setFiltroSelecionado("emissao")}
                                    />
                                    <Label>Data Emissão</Label>
                                </div>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "emissao"}
                                    value={filtros.dtEmissaoIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtEmissaoIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">Até</Label>

                                <Txt
                                    type="date"
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "emissao"}
                                    value={filtros.dtEmissaoFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, dtEmissaoFim: e.target.value })
                                    }
                                />
                            </div>

                            {/* Controle */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filtro"
                                        checked={filtroSelecionado === "controle"}
                                        onChange={() => setFiltroSelecionado("controle")}
                                    />
                                    <Label>Controle</Label>
                                </div>

                                <Txt
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "controle"}
                                    value={filtros.ctrlIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, ctrlIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">Até</Label>

                                <Txt
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "controle"}
                                    value={filtros.ctrlFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, ctrlFim: e.target.value })
                                    }
                                />
                            </div>

                            {/* Impresso */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <div className="col-span-2 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="filtro"
                                        checked={filtroSelecionado === "impresso"}
                                        onChange={() => setFiltroSelecionado("impresso")}
                                    />
                                    <Label>Impresso</Label>
                                </div>

                                <Txt
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "impresso"}
                                    value={filtros.impIni}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, impIni: e.target.value })
                                    }
                                />

                                <Label className="col-span-1 flex justify-center">Até</Label>

                                <Txt
                                    className="col-span-2"
                                    disabled={filtroSelecionado !== "impresso"}
                                    value={filtros.impFim}
                                    onChange={(e) =>
                                        setFiltros({ ...filtros, impFim: e.target.value })
                                    }
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* RODAPÉ */}
                <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    <button
                        onClick={gerarCancelamento}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Trash2 size={20} />
                        <span>Gerar Cancelamento</span>
                    </button>
                </div>
            </div>

            {/* MODAL CONFIRMAÇÃO */}
            {modalConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow border text-center w-[330px]">
                        <p className="font-semibold mb-4 text-gray-800">
                            Confirma o Cancelamento em Lote?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                className="px-4 py-1 bg-gray-300 rounded"
                                onClick={() => setModalConfirm(false)}
                            >
                                Não
                            </button>

                            <button
                                className="px-4 py-1 bg-red-700 text-white rounded"
                                onClick={confirmar}
                            >
                                Sim
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL SUCESSO */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Cancelamento em Lote Confirmado!
                            <br /> Aguarde o Final do Processamento.
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
        </>
    );
}
