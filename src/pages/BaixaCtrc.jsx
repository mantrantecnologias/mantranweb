// src/pages/BaixaCtrc.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RotateCcw, CheckCircle } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ==========================
   COMPONENTES BÁSICOS
========================== */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
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

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={`border border-gray-300 rounded px-1 h-[26px] text-[13px] w-full ${className}`}
        >
            {children}
        </select>
    );
}

/* ==========================
   HELPERS FORMATAÇÃO
========================== */
function formatarData(valor) {
    valor = valor.replace(/\D/g, "");

    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
    if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

    return valor.slice(0, 10);
}

function formatarHora(valor) {
    valor = valor.replace(/\D/g, "");
    if (valor.length > 2) {
        valor = valor.replace(/^(\d{2})(\d)/, "$1:$2");
    }
    return valor.slice(0, 5);
}

function completarHora(valor) {
    valor = valor.replace(/\D/g, "");

    if (valor.length === 0) return "";
    if (valor.length === 1) return `0${valor}:00`;
    if (valor.length === 2) return `${valor}:00`;
    if (valor.length === 3) return `${valor.slice(0, 2)}:${valor.slice(2).padEnd(2, "0")}`;
    if (valor.length === 4) return `${valor.slice(0, 2)}:${valor.slice(2)}`;

    return valor;
}

function getDataHoje() {
    const d = new Date();
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
}

function getHoraAgora() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
}

/* ==========================
   PÁGINA PRINCIPAL
========================== */
export default function BaixaCtrc({ open }) {
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const mock = {
        empresa: "001 - MANTRAN TRANSPORTES LTDA",
        filial: "001 - TESTE MANTRAN",
        ctrc: "",
        ctrcControle: "",
        minuta: "",
        gerarCteCompl: false,
        ocorrencia: "001 - ENTREGA REALIZADA NORMALMENTE",

        dtChegada: "",
        hrChegada: "",
        dtEntrega: "",
        hrEntrega: "",

        dtBaixa: "",
        hrBaixa: "",

        recebidoPor: "",
        rg: ""
    };

    const [dados, setDados] = useState(mock);
    const [modalMsg, setModalMsg] = useState(false);

    /* ==========================
       HANDLERS DATA/HORA
    ========================== */

    const handleFocusData = (campo) => {
        if (!dados[campo]) {
            setDados(prev => ({ ...prev, [campo]: getDataHoje() }));
        }
    };

    const handleFocusHora = (campo) => {
        if (!dados[campo]) {
            setDados(prev => ({ ...prev, [campo]: getHoraAgora() }));
        }
    };

    const handleBackspace = (e, campo) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            setDados(prev => ({ ...prev, [campo]: "" }));
        }
    };

    /* ==========================
       FUNÇÕES
    ========================== */
    const limpar = () => setDados(mock);

    const baixar = () => {
        const dt = getDataHoje();
        const hr = getHoraAgora();

        setDados(prev => ({
            ...prev,
            dtBaixa: dt,
            hrBaixa: hr
        }));

        setModalMsg(true);
    };

    const fecharModalSucesso = () => {
        setModalMsg(false);
        limpar();
    };

    /* ==========================
       RENDER
    ========================== */
    return (
        <>
            <div
                className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 
                bg-gray-50 h-[calc(100vh-56px)] flex flex-col
                ${open ? "ml-[192px]" : "ml-[56px]"}`}
            >
                {/* TÍTULO PADRÃO */}
                <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                    BAIXAS DE CONHECIMENTO
                </h1>

                {/* CONTEÚDO CENTRAL */}
                <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3 overflow-y-auto">
                    <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-4">

                        {/* CARD 1 - PARÂMETROS */}
                        <fieldset className="border border-gray-300 rounded p-3 mb-2">
                            <legend className="px-2 text-red-700 font-semibold">
                                Parâmetros
                            </legend>

                            {/* Linha 1 - Empresa / Filial */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Empresa</Label>
                                <Sel
                                    className="col-span-6"
                                    value={dados.empresa}
                                    onChange={e =>
                                        setDados({ ...dados, empresa: e.target.value })
                                    }
                                >
                                    <option>{dados.empresa}</option>
                                </Sel>
                            </div>
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Filial</Label>
                                <Sel
                                    className="col-span-6"
                                    value={dados.filial}
                                    onChange={e =>
                                        setDados({ ...dados, filial: e.target.value })
                                    }
                                >
                                    <option>{dados.filial}</option>
                                </Sel>
                            </div>

                            {/* Linha 2 - Nº CTRC / CTRC Controle */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">N° CTRC</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.ctrc}
                                    onChange={e =>
                                        setDados({ ...dados, ctrc: e.target.value })
                                    }
                                />

                                <Label className="col-span-2">N° CTRC Controle</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.ctrcControle}
                                    onChange={e =>
                                        setDados({ ...dados, ctrcControle: e.target.value })
                                    }
                                />
                            </div>

                            {/* Linha 3 - Minuta / Gerar CT-e Complementar */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">N° Minuta</Label>
                                <Txt
                                    className="col-span-2"
                                    value={dados.minuta}
                                    onChange={e =>
                                        setDados({ ...dados, minuta: e.target.value })
                                    }
                                />

                                <div className="col-span-5 col-start-7 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={dados.gerarCteCompl}
                                        onChange={e =>
                                            setDados({
                                                ...dados,
                                                gerarCteCompl: e.target.checked
                                            })
                                        }
                                        className="h-[16px] w-[16px] cursor-pointer"
                                    />
                                    <Label>Gerar CT-e Complementar</Label>
                                </div>
                            </div>

                            {/* Linha 4 - Ocorrência */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Ocorrência</Label>
                                <Sel
                                    className="col-span-6"
                                    value={dados.ocorrencia}
                                    onChange={e =>
                                        setDados({ ...dados, ocorrencia: e.target.value })
                                    }
                                >
                                    <option>001 - ENTREGA REALIZADA NORMALMENTE</option>
                                    <option>002 - RECUSADO</option>
                                    <option>003 - ENDEREÇO NÃO LOCALIZADO</option>
                                </Sel>
                            </div>

                            {/* Linha 5 - Data/Hora Chegada */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Data Chegada</Label>
                                <Txt
                                    className="col-span-2"
                                    placeholder="dd/mm/aaaa"
                                    value={dados.dtChegada}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            dtChegada: formatarData(e.target.value)
                                        })
                                    }
                                    onFocus={() => handleFocusData("dtChegada")}
                                    onKeyDown={(e) => handleBackspace(e, "dtChegada")}
                                />

                                <Label className="col-span-2">Hora</Label>
                                <Txt
                                    className="col-span-2"
                                    placeholder="hh:mm"
                                    value={dados.hrChegada}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            hrChegada: formatarHora(e.target.value)
                                        })
                                    }
                                    onFocus={() => handleFocusHora("hrChegada")}
                                    onBlur={() =>
                                        setDados(prev => ({
                                            ...prev,
                                            hrChegada: completarHora(prev.hrChegada)
                                        }))
                                    }
                                    onKeyDown={(e) => handleBackspace(e, "hrChegada")}
                                />
                            </div>

                            {/* Linha 6 - Data/Hora Entrega */}
                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Data Entrega</Label>
                                <Txt
                                    className="col-span-2"
                                    placeholder="dd/mm/aaaa"
                                    value={dados.dtEntrega}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            dtEntrega: formatarData(e.target.value)
                                        })
                                    }
                                    onFocus={() => handleFocusData("dtEntrega")}
                                    onKeyDown={(e) => handleBackspace(e, "dtEntrega")}
                                />

                                <Label className="col-span-2">Hora</Label>
                                <Txt
                                    className="col-span-2"
                                    placeholder="hh:mm"
                                    value={dados.hrEntrega}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            hrEntrega: formatarHora(e.target.value)
                                        })
                                    }
                                    onFocus={() => handleFocusHora("hrEntrega")}
                                    onBlur={() =>
                                        setDados(prev => ({
                                            ...prev,
                                            hrEntrega: completarHora(prev.hrEntrega)
                                        }))
                                    }
                                    onKeyDown={(e) => handleBackspace(e, "hrEntrega")}
                                />
                            </div>

                            {/* Linha 7 - Data/Hora Baixa (somente após Baixar) */}
                            {dados.dtBaixa && (
                                <div className="grid grid-cols-12 gap-2 mb-2">
                                    <Label className="col-span-2">Data Baixa</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={dados.dtBaixa}
                                    />

                                    <Label className="col-span-1">Hora Baixa</Label>
                                    <Txt
                                        className="col-span-2 bg-gray-200"
                                        readOnly
                                        value={dados.hrBaixa}
                                    />
                                </div>
                            )}
                        </fieldset>

                        {/* CARD 2 - RECEBIMENTO */}
                        <fieldset className="border border-gray-300 rounded p-3 mb-2">
                            <legend className="px-2 text-red-700 font-semibold">
                                Recebimento
                            </legend>

                            <div className="grid grid-cols-12 gap-2 mb-2">
                                <Label className="col-span-2">Recebido por</Label>
                                <Txt
                                    className="col-span-6"
                                    value={dados.recebidoPor}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            recebidoPor: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-2">
                                <Label className="col-span-2">N° RG</Label>
                                <Txt
                                    className="col-span-3"
                                    value={dados.rg}
                                    onChange={e =>
                                        setDados({
                                            ...dados,
                                            rg: e.target.value
                                        })
                                    }
                                />
                            </div>
                        </fieldset>
                    </div>
                </div>

                {/* RODAPÉ PADRÃO */}
                <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                    {/* Fechar */}
                    <button
                        onClick={() => navigate(-1)}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    {/* Limpar */}
                    <button
                        onClick={limpar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <RotateCcw size={20} />
                        <span>Limpar</span>
                    </button>

                    {/* Baixar */}
                    <button
                        onClick={baixar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <CheckCircle size={20} />
                        <span>Baixar</span>
                    </button>
                </div>
            </div>

            {/* MODAL DE SUCESSO */}
            {modalMsg && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 shadow-lg rounded border text-center w-[300px]">
                        <p className="text-green-700 font-bold mb-4">
                            Baixa Realizada Com Sucesso!
                        </p>

                        <button
                            className="px-3 py-1 bg-red-700 text-white rounded"
                            onClick={fecharModalSucesso}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
