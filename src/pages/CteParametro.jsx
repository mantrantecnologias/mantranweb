import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    XCircle,
    RotateCcw,
    PlusCircle,
    Edit,
} from "lucide-react";

import { useIconColor } from "../context/IconColorContext";

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

export default function CteParametro({ onClose }) {
    const isGlobalModal = !!onClose;
    const navigate = useNavigate();
    const { footerIconColorNormal, footerIconColorHover } = useIconColor();

    const mock = {
        empresa: "001 - MANTRAN TRANSPORTES LTDA",
        filial: "001 - TESTE MANTRAN",
        cnpj: "04284184000110",
        uf: "RIO GRANDE DO SUL",
        tipoEmit: "1 - Prestador de serviço de transporte",
        componente: "0fe4cd844b41c15f1420c9063112219d648b3c32be8d6273ba17248dd2322fee0bfdbf83fe448a6c67c06cb849a19aa7e26a567b8469d0e665d",
        emailRemetente: "difalux@difalux.com.br",
        senhaEmail: "difa02463",
        servidorSmtp: "smtp.difalux.com.br",
        porta: "587",
        usuario: "difalux@difalux.com.br",
        senhaAut: "*******",
        requerAut: true,
        autoEnvio: true,
        assunto: "Emissão CT-e Nº <CTe>",
        mensagem: "<html><head><title></title></head><body>TEXTO MODELO...</body></html>",
        certificado: "",
        senhaCert: "12345678",
        fuso: "-03:00 - Horário Normal",
        ambiente: "Homologação",
        versao: "4.00",
    };

    const [dados, setDados] = useState(mock);

    const limpar = () => setDados(mock);
    const incluir = () => alert("Inclusão simulada com sucesso!");
    const alterar = () => alert("Alterado com sucesso!");

    return (
        <div
            className={
                isGlobalModal
                    ? "fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    : "w-full h-full flex items-center justify-center"
            }
        >
            <div className="bg-white w-[1100px] rounded shadow p-4 border border-gray-300 max-h-[95vh] overflow-auto">

                {/* TÍTULO */}
                <h2 className="text-center text-red-700 font-bold mb-4 text-[18px] mt-2">
                    PARÂMETROS DE CT-e
                </h2>

                {/* CARD PRINCIPAL */}
                <fieldset className="border border-gray-300 rounded p-3 mb-4">
                    <legend className="px-2 text-red-700 font-semibold">Configurações CT-e</legend>

                    {/* Linha 1 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Código da Empresa</Label>
                        <Sel
                            className="col-span-4"
                            value={dados.empresa}
                            onChange={(e) => setDados({ ...dados, empresa: e.target.value })}
                        >
                            <option>{dados.empresa}</option>
                        </Sel>

                        <Label className="col-span-2">Código da Filial</Label>
                        <Sel
                            className="col-span-4"
                            value={dados.filial}
                            onChange={(e) => setDados({ ...dados, filial: e.target.value })}
                        >
                            <option>{dados.filial}</option>
                        </Sel>
                    </div>

                    {/* Linha 2 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">CNPJ Emitente</Label>
                        <Txt
                            className="col-span-3"
                            value={dados.cnpj}
                            onChange={(e) => setDados({ ...dados, cnpj: e.target.value })}
                        />

                        <Label className="col-span-1">UF Emitente</Label>
                        <Sel
                            className="col-span-2"
                            value={dados.uf}
                            onChange={(e) => setDados({ ...dados, uf: e.target.value })}
                        >
                            <option>{dados.uf}</option>
                        </Sel>

                        <Label className="col-span-1">Tipo Emitente</Label>
                        <Sel
                            className="col-span-3"
                            value={dados.tipoEmit}
                            onChange={(e) => setDados({ ...dados, tipoEmit: e.target.value })}
                        >
                            <option>{dados.tipoEmit}</option>
                        </Sel>
                    </div>

                    {/* Linha 3 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Chave Componente</Label>
                        <Txt
                            className="col-span-10"
                            value={dados.componente}
                            onChange={(e) => setDados({ ...dados, componente: e.target.value })}
                        />
                    </div>

                    {/* Linha 4 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">E-mail Remetente</Label>
                        <Txt
                            className="col-span-4"
                            value={dados.emailRemetente}
                            onChange={(e) => setDados({ ...dados, emailRemetente: e.target.value })}
                        />

                        <Label className="col-span-1">Senha e-mail</Label>
                        <Txt
                            className="col-span-2"
                            type="password"
                            value={dados.senhaEmail}
                            onChange={(e) => setDados({ ...dados, senhaEmail: e.target.value })}
                        />

                        <Label className="col-span-2">Envio Automático</Label>
                        <div className="col-span-1 flex items-center">
                            <input
                                type="checkbox"
                                checked={dados.autoEnvio}
                                onChange={(e) => setDados({ ...dados, autoEnvio: e.target.checked })}
                                className="h-[16px] w-[16px] cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Linha 5 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Servidor (smtp)</Label>
                        <Txt
                            className="col-span-4"
                            value={dados.servidorSmtp}
                            onChange={(e) => setDados({ ...dados, servidorSmtp: e.target.value })}
                        />

                        <Label className="col-span-1">Porta</Label>
                        <Txt
                            className="col-span-1"
                            value={dados.porta}
                            onChange={(e) => setDados({ ...dados, porta: e.target.value })}
                        />

                        <Label className="col-span-2 col-start-10">Requer Autenticação</Label>
                        <div className="col-span-1 flex items-center">
                            <input
                                type="checkbox"
                                checked={dados.requerAut}
                                onChange={(e) => setDados({ ...dados, requerAut: e.target.checked })}
                                className="h-[16px] w-[16px] cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Linha 6 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Usuário Autenticação</Label>
                        <Txt
                            className="col-span-4"
                            value={dados.usuario}
                            onChange={(e) => setDados({ ...dados, usuario: e.target.value })}
                        />

                        <Label className="col-span-2">Senha Autenticação</Label>
                        <Txt
                            className="col-span-4"
                            type="password"
                            value={dados.senhaAut}
                            onChange={(e) => setDados({ ...dados, senhaAut: e.target.value })}
                        />
                    </div>

                    {/* Linha 7 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Assunto E-mail</Label>
                        <Txt
                            className="col-span-10"
                            value={dados.assunto}
                            onChange={(e) => setDados({ ...dados, assunto: e.target.value })}
                        />
                    </div>

                    {/* Linha 8 */}
                    <div className="grid grid-cols-12 gap-2 mb-2">
                        <Label className="col-span-2">Mensagem E-mail</Label>
                        <textarea
                            className="col-span-10 border border-gray-300 rounded p-1 text-[13px] h-[80px]"
                            value={dados.mensagem}
                            onChange={(e) => setDados({ ...dados, mensagem: e.target.value })}
                        />
                    </div>

                    {/* Linha 9 - CERTIFICADO */}
                    <div className="grid grid-cols-12 gap-2 mb-2 items-center">
                        <Label className="col-span-2">Certificado</Label>

                        <div className="col-span-10 relative flex items-center">
                            <Txt
                                className="w-full"
                                value={dados.certificado}
                                readOnly
                            />

                            <label
                                htmlFor="certUpload"
                                className="absolute right-2 cursor-pointer text-red-700 hover:text-red-900"
                                title="Selecionar certificado (.pfx)"
                            >
                                📁
                            </label>

                            <input
                                id="certUpload"
                                type="file"
                                accept=".pfx"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setDados({
                                            ...dados,
                                            certificado: file.name,
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Linha 10 */}
                    <div className="grid grid-cols-12 gap-2">
                        <Label className="col-span-2">Senha Certificado</Label>
                        <Txt
                            className="col-span-2"
                            type="password"
                            value={dados.senhaCert}
                            onChange={(e) => setDados({ ...dados, senhaCert: e.target.value })}
                        />

                        <Label className="col-span-1">Fuso</Label>
                        <Sel
                            className="col-span-2"
                            value={dados.fuso}
                            onChange={(e) => setDados({ ...dados, fuso: e.target.value })}
                        >
                            <option>{dados.fuso}</option>
                        </Sel>

                        <Label className="col-span-1">Ambiente</Label>
                        <Sel
                            className="col-span-2"
                            value={dados.ambiente}
                            onChange={(e) => setDados({ ...dados, ambiente: e.target.value })}
                        >
                            <option>Homologação</option>
                            <option>Produção</option>
                        </Sel>

                        <Label className="col-span-1">Versão</Label>
                        <Txt
                            className="col-span-1"
                            value={dados.versao}
                            onChange={(e) => setDados({ ...dados, versao: e.target.value })}
                        />
                    </div>
                </fieldset>

                {/* RODAPÉ PADRÃO */}
                <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6 mt-4">

                    <button
                        onClick={() => (onClose ? onClose() : navigate("/"))}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <XCircle size={20} />
                        <span>Fechar</span>
                    </button>

                    <button
                        onClick={alterar}
                        className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
                    >
                        <Edit size={20} />
                        <span>Alterar</span>
                    </button>

                </div>
            </div>
        </div>
    );
}
