// src/pages/RelConsumoCombustivel.jsx
import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { XCircle, RotateCcw, Printer } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";

/* ========================= Helpers (padrão do projeto) ========================= */
function Label({ children, className = "" }) {
    return (
        <label className={`text-[12px] text-gray-700 flex items-center ${className}`}>
            {children}
        </label>
    );
}

function Txt({ className = "", readOnly = false, tabIndex, ...props }) {
    return (
        <input
            {...props}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : tabIndex}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]",
                "w-full",
                readOnly ? "bg-gray-200 text-gray-600" : "bg-white",
                className,
            ].join(" ")}
        />
    );
}

/* =========================================================
   DateInput (padrão inteligente solicitado)
   - Focus: preenche com data atual
   - Backspace: limpa tudo
========================================================= */
const nowYYYYMMDD = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
};

function DateInput({ campo, dados, setDados, tabIndex, onKeyDown, className = "" }) {
    const val = dados?.[campo] || "";

    return (
        <input
            type="date"
            value={val}
            tabIndex={tabIndex}
            onKeyDown={onKeyDown}
            onFocus={() => {
                if (!dados?.[campo]) setDados((p) => ({ ...p, [campo]: nowYYYYMMDD() }));
            }}
            onChange={(e) => setDados((p) => ({ ...p, [campo]: e.target.value }))}
            onKeyUp={(e) => {
                if (e.key === "Backspace") setDados((p) => ({ ...p, [campo]: "" }));
            }}
            className={[
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full bg-white",
                className,
            ].join(" ")}
        />
    );
}

/* ========================= Utils ========================= */
const onlyDigits = (s) => String(s || "").replace(/\D/g, "");

/* ========================= Mocks ========================= */
const veiculosCatalogoMock = [
    { codigo: "0003065", descricao: "EVO1623 - VOLVO/FH 440 4X2T - CAVALO TRUCADO - CUBATAO" },
    { codigo: "0035719", descricao: "RXW4156 - CAVALO MEC - CAVALO TRUCADO - ITAJAI" },
    { codigo: "0000123", descricao: "ABC1234 - CAMINHÃO TOCO - SP" },
];

export default function RelConsumoCombustivel({ open }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isOficina = location.pathname.includes("/modulo-oficina");
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const tituloTopo = useMemo(() => "RELATÓRIO CONSUMO DE COMBUSTÍVEL", []);

    /* ===== Dados (mock) ===== */
    const [dados, setDados] = useState({
        veiculoCod: "",
        veiculoDesc: "",
        dataIni: "",
        dataFim: "",
        calcularTanque: "N", // S | N
    });

    /* ===== Navigation Handler (ENTER avança por tabindex) ===== */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            const ti = e.target.getAttribute("tabindex");
            if (!ti) return;
            e.preventDefault();
            const currentTab = parseInt(ti, 10);
            const nextTab = currentTab + 1;
            const nextEl = document.querySelector(`[tabindex="${nextTab}"]`);
            if (nextEl) nextEl.focus();
        }
    };

    /* ===== Preencher descrição pelo código ===== */
    const preencherVeiculoPorCodigo = (codigo) => {
        const cod = String(codigo || "").trim();
        if (!cod) return "";
        const achou = veiculosCatalogoMock.find((x) => x.codigo === cod);
        return achou?.descricao || "";
    };

    /* ===== Limpar ===== */
    const limpar = () => {
        setDados({
            veiculoCod: "",
            veiculoDesc: "",
            dataIni: "",
            dataFim: "",
            calcularTanque: "N",
        });
    };

    /* ===== Imprimir: navega direto para Resultado (sem modal) ===== */
    const imprimir = () => {
        navigate("/modulo-oficina/relatorio-consumo-combustivel/resultado", {
            state: {
                filtros: dados,
                // você pode passar mais coisas depois (filial, usuário, etc.)
            },
        });
    };

    /* ===== Enter no último botão (Imprimir) ===== */
    const onKeyDownImprimir = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            imprimir();
        }
    };

    return (
        <div
            className={`transition-all duration-300 text-[13px] text-gray-700 
      bg-gray-50 flex flex-col
      ${isOficina
                    ? "mt-[-16px] ml-[-16px] h-[calc(100vh-48px)] w-[calc(100%+32px)]"
                    : `mt-[44px] h-[calc(100vh-56px)] ${open ? "ml-[192px]" : "ml-[56px]"}`
                }`}
        >
            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                {tituloTopo}
            </h1>

            {/* CONTEÚDO */}
            <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto flex flex-col gap-3">
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">Parâmetros</legend>

                    {/* LINHA 1 - Veículo (2 textbox) */}
                    {/* ✅ FIX do desalinhamento: min-w-0 nos itens (evita o grid “estourar” com texto grande) */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-1 justify-end min-w-0">Veículo</Label>

                        <div className="col-span-2">
                            <InputBuscaVeiculo
                                label={null}
                                placeholder="Código"
                                value={dados.veiculoCod}
                                onChange={(e) => {
                                    const v = e.target.value.toUpperCase(); // Permitir letras para Placa
                                    setDados((prev) => ({
                                        ...prev,
                                        veiculoCod: v,
                                        veiculoDesc: v ? prev.veiculoDesc : "",
                                    }));
                                }}
                                onSelect={(veiculo) => {
                                    setDados((prev) => ({
                                        ...prev,
                                        veiculoCod: veiculo.codigo,
                                        veiculoDesc: `${veiculo.placa} - ${veiculo.modelo} - ${veiculo.classe}`,
                                    }));
                                }}
                                tabIndex={1}
                            />
                        </div>

                        <Txt
                            className="col-span-9 bg-gray-200 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
                            value={dados.veiculoDesc}
                            readOnly
                            tabIndex={-1}
                            placeholder="Descrição (bloqueado)"
                        />
                    </div>

                    {/* LINHA 2 - Período */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-1 justify-end min-w-0">Período</Label>

                        <DateInput
                            campo="dataIni"
                            dados={dados}
                            setDados={setDados}
                            tabIndex={2}
                            onKeyDown={handleKeyDown}
                            className="col-span-2 min-w-0"
                        />

                        <Label className="col-span-1 justify-center min-w-0">Até</Label>

                        <DateInput
                            campo="dataFim"
                            dados={dados}
                            setDados={setDados}
                            tabIndex={3}
                            onKeyDown={handleKeyDown}
                            className="col-span-2 min-w-0"
                        />

                        <div className="col-span-6" />
                    </div>

                    {/* LINHA 3 - Calcular Tanque (Radio) */}
                    <div className="grid grid-cols-12 gap-2 items-center">
                        <Label className="col-span-2 justify-end min-w-0">Calcular Tanque?</Label>

                        <div className="col-span-10 flex items-center gap-6 min-w-0">
                            <label className="flex items-center gap-2 text-[12px] text-gray-700">
                                <input
                                    type="radio"
                                    name="calcularTanque"
                                    checked={dados.calcularTanque === "S"}
                                    onChange={() => setDados((p) => ({ ...p, calcularTanque: "S" }))}
                                    tabIndex={4}
                                    onKeyDown={handleKeyDown}
                                />
                                Sim
                            </label>

                            <label className="flex items-center gap-2 text-[12px] text-gray-700">
                                <input
                                    type="radio"
                                    name="calcularTanque"
                                    checked={dados.calcularTanque === "N"}
                                    onChange={() => setDados((p) => ({ ...p, calcularTanque: "N" }))}
                                    tabIndex={5}
                                    onKeyDown={handleKeyDown}
                                />
                                Não
                            </label>
                        </div>
                    </div>
                </fieldset>
            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
                <button
                    onClick={() => navigate(-1)}
                    className={`order-1 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Fechar"
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

                <button
                    onClick={limpar}
                    className={`order-2 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Limpar"
                >
                    <RotateCcw size={20} />
                    <span>Limpar</span>
                </button>

                {/* Imprimir por último no DOM (TAB/ENTER) */}
                <button
                    onClick={imprimir}
                    onKeyDown={onKeyDownImprimir}
                    tabIndex={6}
                    className={`order-3 flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover} transition`}
                    title="Imprimir"
                >
                    <Printer size={20} />
                    <span>Imprimir</span>
                </button>
            </div>
        </div>
    );
}
