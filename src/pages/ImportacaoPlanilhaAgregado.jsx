// src/pages/ImportacaoPlanilhaAgregado.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, FolderOpen } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ================= Helpers ================= */

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
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                (props.className || "")
            }
        />
    );
}

function Sel({ children, className = "", ...rest }) {
    return (
        <select
            {...rest}
            className={
                "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full " +
                className
            }
        >
            {children}
        </select>
    );
}

/* ============ Modal Mensagem ============ */

function MessageBox({ open, title, message, showCancel = true, onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
            <div className="bg-white rounded-md shadow-lg border border-gray-300 w-[380px]">

                {/* TÍTULO */}
                <div className="border-b border-gray-300 px-3 py-2 bg-gray-100">
                    <span className="text-[13px] font-semibold text-gray-800">{title}</span>
                </div>

                {/* CONTEÚDO */}
                <div className="px-4 py-3 text-[13px] whitespace-pre-line">{message}</div>

                {/* BOTÕES */}
                <div className="border-t border-gray-200 px-3 py-2 flex justify-end gap-2">

                    {showCancel && (
                        <button
                            className="px-3 py-1 text-[12px] rounded border border-gray-300 bg-gray-100 hover:bg-gray-200"
                            onClick={onCancel}
                        >
                            Não
                        </button>
                    )}

                    <button
                        className="px-3 py-1 text-[12px] rounded border border-red-600 bg-red-600 text-white hover:bg-red-700"
                        onClick={onConfirm}
                    >
                        {showCancel ? "Sim" : "OK"}
                    </button>

                </div>
            </div>
        </div>
    );
}

/* ================= Mocks ================= */

const mockEmpresas = [
    "001 - MANTRAN TRANSPORTES LTDA",
    "002 - FILIAL TESTE"
];

const mockFiliais = [
    "001 - TESTE MANTRAN",
    "002 - FILIAL MATRIZ"
];

const mockTipos = ["LOGGI", "FLEET", "AGREGADO"];

const mockClientes = {
    "50221019000136": "HNK-ITU (1) MATRIZ",
    "12345678000190": "CLIENTE TESTE LTDA"
};

/* ===================================================================== */

export default function ImportacaoPlanilhaAgregado({ open }) {

    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();
    const fileInputRef = useRef(null);

    /* ESTADOS */

    const [empresa, setEmpresa] = useState(mockEmpresas[0]);
    const [filial, setFilial] = useState(mockFiliais[0]);
    const [tipoImportacao, setTipoImportacao] = useState("LOGGI");

    const [cliente, setCliente] = useState({
        cnpj: "",
        razao: ""
    });

    const [servicoAutomatico, setServicoAutomatico] = useState(false);

    const [arquivo, setArquivo] = useState("");
    const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

    const [progress, setProgress] = useState(0);
    const [totalLinhas, setTotalLinhas] = useState(0);
    const [importando, setImportando] = useState(false);

    /* ================= Modal ================= */

    const [msgConfig, setMsgConfig] = useState({
        open: false,
        title: "",
        message: "",
        showCancel: true,
        onConfirm: () => { },
        onCancel: () => { }
    });

    const abrirMensagem = (cfg) => {
        setMsgConfig({
            open: true,
            title: cfg.title,
            message: cfg.message,
            showCancel: cfg.showCancel ?? true,
            onConfirm: () => {
                setMsgConfig((p) => ({ ...p, open: false }));
                cfg.onConfirm && cfg.onConfirm();
            },
            onCancel: () => {
                setMsgConfig((p) => ({ ...p, open: false }));
                cfg.onCancel && cfg.onCancel();
            }
        });
    };

    /* ========== Cliente - preenchimento automático ========== */

    const handleClienteBlur = () => {
        const limpo = cliente.cnpj.replace(/\D/g, "");
        const razao = mockClientes[limpo] || "";
        setCliente((p) => ({ ...p, razao }));
    };

    /* ================= Seleção de Arquivo ================= */

    const abrirSelecaoArquivo = () => fileInputRef.current?.click();

    const handleArquivoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setArquivoSelecionado(file);
        setArquivo(file.name);

        // Simulação realista
        const tamanhoKB = Math.floor(file.size / 1024);
        const linhasEstimadas = Math.floor(tamanhoKB / 4); // ~4 KB por linha CSV/XLSX
        const ajustado = Math.min(Math.max(linhasEstimadas, 10), 250000);

        setTotalLinhas(ajustado);
        setProgress(0);

        abrirMensagem({
            title: "Confirmar Importação",
            message: `A planilha parece conter aproximadamente ${ajustado} linhas.\nDeseja iniciar a importação?`,
            showCancel: true,
            onConfirm: () => setImportando(true),
            onCancel: () => {
                setArquivoSelecionado(null);
                setArquivo("");
                fileInputRef.current.value = "";
            }
        });
    };

    /* ================= Progressão simulada ================= */

    useEffect(() => {
        if (!importando) return;

        let atual = 0;

        const interval = setInterval(() => {
            atual += Math.ceil(totalLinhas / 200); // sobe proporcional
            const perc = Math.min(100, Math.floor((atual / totalLinhas) * 100));
            setProgress(perc);

            if (perc >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    abrirMensagem({
                        title: "Importação Finalizada",
                        message: "Planilha importada com sucesso!",
                        showCancel: false
                    });
                }, 400);
            }
        }, 40);

        return () => clearInterval(interval);
    }, [importando, totalLinhas]);

    /* ================= Rodapé ================= */

    const handleFechar = () => navigate(-1);

    /* ===================================================================== */

    return (
        <div
            className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
            h-[calc(100vh-56px)] flex flex-col
            ${open ? "ml-[192px]" : "ml-[56px]"}`}
        >

            {/* TÍTULO */}
            <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
                IMPORTAÇÃO PLANILHA AGREGADO
            </h1>

            <div className="flex-1 p-3 overflow-y-auto bg-white border-x border-b border-gray-300 rounded-b-md flex flex-col gap-3">

                {/* CARD 1 */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Dados da Importação
                    </legend>

                    <div className="space-y-2">

                        {/* Empresa */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Cód. Empresa</Label>
                            <Sel
                                className="col-span-4"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                            >
                                {mockEmpresas.map((e) => (
                                    <option key={e}>{e}</option>
                                ))}
                            </Sel>
                        </div>

                        {/* Filial */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Cód. Filial</Label>
                            <Sel
                                className="col-span-4"
                                value={filial}
                                onChange={(e) => setFilial(e.target.value)}
                            >
                                {mockFiliais.map((f) => (
                                    <option key={f}>{f}</option>
                                ))}
                            </Sel>
                        </div>

                        {/* Tipo Importação */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Tp. Importação</Label>
                            <Sel
                                className="col-span-4"
                                value={tipoImportacao}
                                onChange={(e) => setTipoImportacao(e.target.value)}
                            >
                                {mockTipos.map((t) => (
                                    <option key={t}>{t}</option>
                                ))}
                            </Sel>
                        </div>

                        {/* Cliente */}
                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Cliente</Label>

                            <Txt
                                className="col-span-3"
                                value={cliente.cnpj}
                                onChange={(e) =>
                                    setCliente((p) => ({ ...p, cnpj: e.target.value }))
                                }
                                onBlur={handleClienteBlur}
                            />

                            <Txt
                                className="col-span-5 bg-gray-200"
                                value={cliente.razao}
                                readOnly
                            />
                        </div>

                        {/* Caminho Arquivo */}
                        <div className="grid grid-cols-12 gap-2 items-center">
                            <Label className="col-span-2">Caminho Arquivo</Label>

                            <Txt
                                className="col-span-9 bg-gray-200"
                                readOnly
                                value={arquivo}
                                placeholder="Selecione o arquivo..."
                            />

                            <button
                                onClick={abrirSelecaoArquivo}
                                className="col-span-1 h-[26px] flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                            >
                                <FolderOpen size={18} color="#eab308" />
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".xlsx"
                                className="hidden"
                                onChange={handleArquivoChange}
                            />
                        </div>

                        {/* Serviço Automático */}
                        <div className="grid grid-cols-12 gap-2">
                            <div className="col-span-12 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={servicoAutomatico}
                                    onChange={(e) => setServicoAutomatico(e.target.checked)}
                                />
                                <span className="text-[12px]">Serviço automático</span>
                            </div>
                        </div>
                    </div>
                </fieldset>

                {/* CARD – PROGRESSO */}
                <fieldset className="border border-gray-300 rounded p-3 bg-white">
                    <legend className="px-2 text-red-700 font-semibold text-[13px]">
                        Importação
                    </legend>

                    <div className="space-y-2">

                        <div className="grid grid-cols-12 gap-2">
                            <Label className="col-span-2">Progresso</Label>

                            <div className="col-span-10">
                                <div className="w-full h-4 border border-gray-300 rounded bg-gray-100 overflow-hidden">
                                    <div
                                        className="h-full bg-green-600 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>

                                {totalLinhas > 0 && (
                                    <div className="text-[11px] text-right mt-1">
                                        {progress}% • {totalLinhas} linhas
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </fieldset>

            </div>

            {/* RODAPÉ */}
            <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">

                <button
                    onClick={handleFechar}
                    className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                >
                    <XCircle size={20} />
                    <span>Fechar</span>
                </button>

            </div>

            {/* MODAL */}
            <MessageBox
                open={msgConfig.open}
                title={msgConfig.title}
                message={msgConfig.message}
                showCancel={msgConfig.showCancel}
                onConfirm={msgConfig.onConfirm}
                onCancel={msgConfig.onCancel}
            />
        </div>
    );
}
