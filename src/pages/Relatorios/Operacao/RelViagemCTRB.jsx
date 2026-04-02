// src/pages/Relatorios/Operacao/RelViagemCTRB.jsx
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DocumentoBase from "../base/DocumentoBase";

/* =========================================================
   Helpers
========================================================= */
const onlyDigits = (s) => String(s || "").replace(/\D/g, "");

const n2 = (v) =>
    Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

function hasField(visibleFieldIds, id) {
    return Array.isArray(visibleFieldIds) && visibleFieldIds.includes(id);
}

function pickObs(data) {
    return (
        data?.observacoesTexto ||
        data?.condicoes?.observacao ||
        data?.termos?.texto ||
        ""
    );
}

/* =========================================================
   Blocos compactos
========================================================= */
function F({
    id,
    visibleFieldIds,
    label,
    value,
    className = "",
    valueClass = "",
    noWrap = false,
}) {
    if (!hasField(visibleFieldIds, id)) return null;

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="text-[11px] font-bold whitespace-nowrap">{label}</div>
            <div
                className={`text-[11px] ${valueClass} ${noWrap ? "whitespace-nowrap overflow-hidden text-ellipsis" : ""
                    }`}
                title={noWrap ? value || "" : undefined}
            >
                {value || ""}
            </div>
        </div>
    );
}

/** Section SEM linha abaixo do título (ganha espaço) */
function Section({ title, children, className = "" }) {
    return (
        <div className={`border border-black ${className}`}>
            <div className="px-2 py-[3px] text-[13px] font-bold">{title}</div>
            <div className="px-2 pb-[6px]">{children}</div>
        </div>
    );
}

/* =========================================================
   Página Única (CTR B2 - 1 folha)
========================================================= */
function CTRBOnePage({ data, visibleFieldIds, logo }) {
    const emp = data?.empresaContratante || {};
    const agg = data?.agregado || {};
    const mot = data?.motorista || {};
    const vei = data?.veiculo || {};
    const ban = data?.banco || {};
    const srv = data?.servicos || {};
    const cond = data?.condicoes || {};

    const docsStr =
        srv?.documentosStr ||
        (Array.isArray(data?.documentos) && data.documentos.length
            ? data.documentos
                .map((d) => d?.numero || d?.ctrc || d?.documento || "")
                .filter(Boolean)
                .join(" - ")
            : srv?.documentos || "");

    const obsTexto = pickObs(data);

    const valoresFrete = cond?.valoresFrete || {};
    const contribuicoes = cond?.contribuicoes || {};
    const lancamentos = cond?.lancamentos || {};
    const totais = cond?.totais || {};

    const assinaturaContratante =
        data?.assinaturaContratante || emp?.razao || "EMPRESA CONTRATANTE";
    const assinaturaAgregado =
        data?.assinaturaAgregado || agg?.razao || mot?.nome || "AGREGADO";

    return (
        <div className="w-full h-full text-black">
            <style>{`
        @media print{
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { height: auto !important; }
          .no-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

            {/* miolo 1 folha */}
            <div className="absolute left-[40px] top-[22px] right-[40px] bottom-[18px]">
                {/* Cabeçalho compacto */}
                <div className="flex items-start justify-between">
                    <div className="w-[140px] h-[44px] flex items-center justify-start">
                        {logo ? (
                            <img
                                src={logo}
                                alt="logo"
                                className="max-h-[42px] max-w-[140px] object-contain"
                            />
                        ) : (
                            <div className="w-[140px] h-[42px]" />
                        )}
                    </div>

                    <div className="flex-1 text-center px-1 max-w-[460px]">
                        {/* 1 LINHA (fonte menor para caber) */}
                        <div className="text-[16px] leading-[16px] font-bold whitespace-nowrap">
                            CONTRATO DE TRANSPORTE RODOVIÁRIO DE BENS E MERCADORIAS
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-10 text-[12px]">
                            <div className="flex items-center gap-2">
                                <div className="font-bold">Nº Viagem</div>
                                <div className="font-bold">
                                    {hasField(visibleFieldIds, "emp.viagemNumero")
                                        ? data?.viagemNumero || ""
                                        : ""}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="font-bold">CIOT</div>
                                <div className="font-bold">
                                    {hasField(visibleFieldIds, "emp.ciot") ? data?.ciot || "" : ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-[190px] text-right pt-[18px] pr-[2px]">
                        <div className="text-[10px] whitespace-nowrap">
                            {hasField(visibleFieldIds, "emp.emissao")
                                ? `Emissão : ${data?.emissao || data?.dataHoraEmissao || ""}`
                                : ""}
                        </div>
                    </div>


                </div>

                {/* Linha 001-... DISPONÍVEL mas NÃO no padrão */}
                {hasField(visibleFieldIds, "emp.seqLinha") ? (
                    <div className="mt-1 text-[12px] font-bold">
                        {(data?.seq || "001") + "-" + (emp?.razao || "")}
                    </div>
                ) : null}

                {/* Empresa Contratante */}
                <Section title="Empresa Contratante" className="mt-2">
                    <div className="grid grid-cols-12 gap-y-[2px]">
                        <F
                            id="emp.razao"
                            visibleFieldIds={visibleFieldIds}
                            label="Razão Social"
                            value={emp?.razao}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="emp.cnpj"
                            visibleFieldIds={visibleFieldIds}
                            label="CNPJ"
                            value={onlyDigits(emp?.cnpj)}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="emp.ie"
                            visibleFieldIds={visibleFieldIds}
                            label="I.E."
                            value={emp?.ie}
                            className="col-span-3"
                            noWrap
                        />

                        <F
                            id="emp.endereco"
                            visibleFieldIds={visibleFieldIds}
                            label="Endereço"
                            value={emp?.endereco}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="emp.bairro"
                            visibleFieldIds={visibleFieldIds}
                            label="Bairro"
                            value={emp?.bairro}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="emp.cidade"
                            visibleFieldIds={visibleFieldIds}
                            label="Cidade"
                            value={`${emp?.cidade || ""}${emp?.uf ? " / " + emp.uf : ""}`}
                            className="col-span-3"
                            noWrap
                        />
                    </div>
                </Section>

                {/* Agregado (CNPJ/CPF e IE ao lado da Razão Social; PIS disponível mas não padrão) */}
                <Section title="Agregado" className="mt-[5px]">
                    <div className="grid grid-cols-12 gap-y-[2px]">
                        {/* Linha 1: Razão + CNPJ/CPF + IE */}
                        <F
                            id="agg.razao"
                            visibleFieldIds={visibleFieldIds}
                            label="Razão Social"
                            value={agg?.razao}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="agg.cnpjcpf"
                            visibleFieldIds={visibleFieldIds}
                            label="CNPJ/CPF"
                            value={onlyDigits(agg?.cnpjcpf)}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="agg.ie"
                            visibleFieldIds={visibleFieldIds}
                            label="I.E."
                            value={agg?.ie}
                            className="col-span-3"
                            noWrap
                        />

                        {/* Linha 2: Endereço + Bairro + Cidade */}
                        <F
                            id="agg.endereco"
                            visibleFieldIds={visibleFieldIds}
                            label="Endereço"
                            value={agg?.endereco}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="agg.bairro"
                            visibleFieldIds={visibleFieldIds}
                            label="Bairro"
                            value={agg?.bairro}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="agg.cidade"
                            visibleFieldIds={visibleFieldIds}
                            label="Cidade"
                            value={`${agg?.cidade || ""}${agg?.uf ? " / " + agg.uf : ""}`}
                            className="col-span-3"
                            noWrap
                        />

                        {/* PIS (DISPONÍVEL, mas não no padrão) */}
                        <F
                            id="agg.pis"
                            visibleFieldIds={visibleFieldIds}
                            label="N° PIS"
                            value={agg?.pis}
                            className="col-span-12"
                            noWrap
                        />
                    </div>
                </Section>

                {/* Motorista (linhas mais juntas; Cidade na linha 3 após CPF) */}
                <Section title="Dados do Motorista" className="mt-[5px]">
                    <div className="grid grid-cols-12 gap-y-[2px]">
                        <F
                            id="mot.nome"
                            visibleFieldIds={visibleFieldIds}
                            label="Nome"
                            value={mot?.nome}
                            className="col-span-12"
                            noWrap
                        />

                        {/* Linha 2 */}
                        <F
                            id="mot.endereco"
                            visibleFieldIds={visibleFieldIds}
                            label="Endereço"
                            value={mot?.endereco}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="mot.bairro"
                            visibleFieldIds={visibleFieldIds}
                            label="Bairro"
                            value={mot?.bairro}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="mot.cnh"
                            visibleFieldIds={visibleFieldIds}
                            label="CNH"
                            value={mot?.cnh}
                            className="col-span-3"
                            noWrap
                        />

                        {/* Linha 3: CPF + Cidade (evita quebra) */}
                        <F
                            id="mot.cpf"
                            visibleFieldIds={visibleFieldIds}
                            label="CPF"
                            value={onlyDigits(mot?.cpf)}
                            className="col-span-4"
                            noWrap
                        />
                        <F
                            id="mot.cidade"
                            visibleFieldIds={visibleFieldIds}
                            label="Cidade"
                            value={`${mot?.cidade || ""}${mot?.uf ? " / " + mot.uf : ""}`}
                            className="col-span-8"
                            noWrap
                        />
                    </div>
                </Section>

                {/* Veículo (EXATAMENTE 2 linhas) */}
                <Section title="Dados do Veículo" className="mt-[5px]">
                    <div className="grid grid-cols-12 gap-y-[2px]">
                        {/* Linha 1: Placa - Marca - Classe - Ano Fabr */}
                        <F
                            id="vei.placa"
                            visibleFieldIds={visibleFieldIds}
                            label="Placa"
                            value={vei?.placa}
                            className="col-span-3"
                            valueClass="font-bold"
                            noWrap
                        />
                        <F
                            id="vei.marca"
                            visibleFieldIds={visibleFieldIds}
                            label="Marca"
                            value={vei?.marca}
                            className="col-span-5"
                            noWrap
                        />
                        <F
                            id="vei.classe"
                            visibleFieldIds={visibleFieldIds}
                            label="Classe"
                            value={vei?.classe}
                            className="col-span-2"
                            noWrap
                        />
                        <F
                            id="vei.anofab"
                            visibleFieldIds={visibleFieldIds}
                            label="Ano Fabr"
                            value={vei?.anofab}
                            className="col-span-2"
                            noWrap
                        />

                        {/* Linha 2: Chassi - Renavan - Cidade */}
                        <F
                            id="vei.chassi"
                            visibleFieldIds={visibleFieldIds}
                            label="N° Chassi"
                            value={vei?.chassi}
                            className="col-span-6"
                            noWrap
                        />
                        <F
                            id="vei.renavan"
                            visibleFieldIds={visibleFieldIds}
                            label="Renavan"
                            value={vei?.renavan}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="vei.cidade"
                            visibleFieldIds={visibleFieldIds}
                            label="Cidade"
                            value={`${vei?.cidade || ""}${vei?.uf ? " / " + vei.uf : ""}`}
                            className="col-span-3"
                            noWrap
                        />
                    </div>
                </Section>

                {/* Bancário (1 linha sem quebrar) */}
                <Section title="Dados Bancário para Pagamento do Saldo" className="mt-[5px]">
                    <div className="grid grid-cols-12 gap-y-[2px]">
                        <F
                            id="ban.banco"
                            visibleFieldIds={visibleFieldIds}
                            label="Banco"
                            value={ban?.banco}
                            className="col-span-2"
                            noWrap
                        />
                        <F
                            id="ban.agencia"
                            visibleFieldIds={visibleFieldIds}
                            label="Agência"
                            value={ban?.agencia}
                            className="col-span-2"
                            noWrap
                        />
                        <F
                            id="ban.conta"
                            visibleFieldIds={visibleFieldIds}
                            label="Conta"
                            value={ban?.conta}
                            className="col-span-3"
                            noWrap
                        />
                        <F
                            id="ban.favorecido"
                            visibleFieldIds={visibleFieldIds}
                            label="Favorecido"
                            value={`${onlyDigits(ban?.favorecidoDoc || "")} ${ban?.favorecido || ""}`.trim()}
                            className="col-span-5"
                            noWrap
                        />
                    </div>
                </Section>

                {/* Serviços Contratado (caixa mais baixa) */}
                <div className="border border-black mt-[5px]">
                    <div className="px-2 py-[3px] text-[13px] font-bold">
                        Serviços Contratado
                    </div>

                    <div className="px-2 pb-[5px] pt-[1px]">
                        <div className="grid grid-cols-12 gap-y-[2px]">
                            <div className="col-span-8 text-[11px] leading-[13px]">
                                {hasField(visibleFieldIds, "srv.textoBase") ? (
                                    <span>
                                        Transporte dos Bens descrito(s) no(s) conhecimento(s)
                                        relacionado(s):
                                    </span>
                                ) : null}
                                <div className="mt-[2px] text-[12px]">
                                    {hasField(visibleFieldIds, "srv.documentos") ? docsStr : ""}
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="grid grid-cols-12 gap-y-[2px]">
                                    {/* Linha 1: Local Carga + Container */}
                                    <div className="col-span-8 flex items-center gap-1">
                                        <div className="text-[11px] font-bold whitespace-nowrap">Local Carga</div>
                                        <div className="text-[11px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {hasField(visibleFieldIds, "srv.localCarga") ? (srv?.localCarga || "") : ""}
                                        </div>
                                    </div>

                                    <div className="col-span-4 flex items-center justify-end gap-1">
                                        <div className="text-[11px] font-bold whitespace-nowrap"></div>
                                        <div className="text-[11px] font-bold whitespace-nowrap">
                                            {hasField(visibleFieldIds, "srv.tipo") ? (srv?.tipo || "") : ""}
                                        </div>
                                    </div>

                                    {/* Linha 2: Local Descarga */}
                                    <div className="col-span-12 flex items-center gap-1">
                                        <div className="text-[11px] font-bold whitespace-nowrap">Local Descarga</div>
                                        <div className="text-[11px] whitespace-nowrap overflow-hidden text-ellipsis">
                                            {hasField(visibleFieldIds, "srv.localDescarga") ? (srv?.localDescarga || "") : ""}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Condições Contratuais (mais compacto; sem “faixas” altas; sem linha extra sob títulos de seção) */}
                <div className="border border-black mt-[5px]">
                    <div className="grid grid-cols-12">
                        <div className="col-span-8 px-2 py-[3px] text-[13px] font-bold border-b border-black">
                            Condições Contratuais
                        </div>
                        <div className="col-span-2 px-2 py-[3px] text-[11px] font-bold border-l border-b border-black text-center">
                            CRÉDITOS
                        </div>
                        <div className="col-span-2 px-2 py-[3px] text-[11px] font-bold border-l border-b border-black text-center">
                            DÉBITOS
                        </div>


                        {[
                            { id: "cond.vf.titulo", type: "title", label: "VALORES DO FRETE" },
                            {
                                id: "cond.vf.valorFrete",
                                label: "VALOR FRETE CONTRATADO",
                                cred: valoresFrete?.valorFrete,
                                deb: "",
                            },
                            { id: "cond.vf.pedagio", label: "VALE PEDÁGIO", cred: valoresFrete?.pedagio, deb: "" },
                            { id: "cond.vf.descarga", label: "DESCARGA", cred: valoresFrete?.descarga, deb: "" },
                            {
                                id: "cond.vf.adicionalEntrega",
                                label: "ADICIONAL DE ENTREGA",
                                cred: valoresFrete?.adicionalEntrega,
                                deb: "",
                            },

                            { id: "cond.contrib.titulo", type: "title", label: "CONTRIBUIÇÕES" },
                            { id: "cond.contrib.sestSenat", label: "SEST / SENAT", cred: "", deb: contribuicoes?.sestSenat },
                            { id: "cond.contrib.inss", label: "INSS", cred: "", deb: contribuicoes?.inss },
                            {
                                id: "cond.contrib.cooperativa",
                                label: "COOPERATIVA",
                                cred: "",
                                deb: contribuicoes?.cooperativa,
                            },

                            { id: "cond.lanc.titulo", type: "title", label: "LANÇAMENTOS DIVERSOS" },
                            { id: "cond.lanc.adiantamento", label: "ADIANTAMENTO SALDO", cred: "", deb: lancamentos?.adiantamento },
                            { id: "cond.lanc.saldoFrete", label: "SALDO DE FRETE", cred: "", deb: lancamentos?.saldoFrete },

                            { id: "cond.tot.titulo", type: "title", label: "TOTAL GERAL" },
                            { id: "cond.tot.creditos", label: "TOTAL CRÉDITOS R$", cred: totais?.totalCreditos, deb: "", bold: true },
                            { id: "cond.tot.debitos", label: "TOTAL DÉBITOS R$", cred: "", deb: totais?.totalDebitos, bold: true },
                            {
                                id: "cond.tot.liquido",
                                label: "VALOR LÍQUIDO A RECEBER NA ENTREGA R$",
                                cred: totais?.liquido,
                                deb: "",
                                bold: true,
                            },
                        ].map((r) => {
                            if (r.type === "title") {
                                if (!hasField(visibleFieldIds, r.id)) return null;

                                return (
                                    <div key={r.id} className="col-span-12 grid grid-cols-12">
                                        <div className="col-span-8 px-2 py-[2px] text-[11px] font-bold border-b border-black">
                                            {r.label}
                                        </div>
                                        <div className="col-span-2 border-l border-b border-black" />
                                        <div className="col-span-2 border-l border-b border-black" />
                                    </div>
                                );
                            }


                            if (!hasField(visibleFieldIds, r.id)) return null;

                            return (
                                <div key={r.id} className="col-span-12 grid grid-cols-12">
                                    <div className="col-span-8 px-2 py-[1px] text-[10.5px]">
                                        <span className={r.bold ? "font-bold" : ""}>{r.label}</span>
                                    </div>
                                    <div
                                        className={`col-span-2 px-2 py-[1px] text-[10.5px] border-l border-black text-right text-blue-700 ${r.bold ? "font-bold" : ""}`}
                                    >
                                        {r.cred === "" || r.cred === null || r.cred === undefined
                                            ? ""
                                            : n2(r.cred)}
                                    </div>
                                    <div
                                        className={`col-span-2 px-2 py-[1px] text-[10.5px] border-l border-black text-right text-red-700 ${r.bold ? "font-bold" : ""}`}
                                    >
                                        {r.deb === "" || r.deb === null || r.deb === undefined
                                            ? ""
                                            : n2(r.deb)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Observações (AGORA ABAIXO de Condições, não ao lado) */}
                <div className="border border-black mt-[3px]">
                    <div className="px-2 py-[4px] text-[9.2px] leading-[11px] whitespace-pre-wrap">
                        {hasField(visibleFieldIds, "obs.texto") ? obsTexto : ""}
                    </div>
                </div>


                {/* Assinaturas (compactas no final) */}
                <div className="mt-[16px] flex items-end justify-between gap-[40px]">
                    <div className="w-[360px] text-center">
                        <div className="h-[16px] border-b border-black" />
                        <div className="text-[12px] mt-[4px]">
                            {hasField(visibleFieldIds, "obs.assinContratante") ? assinaturaContratante : ""}
                        </div>
                    </div>

                    <div className="w-[360px] text-center">
                        <div className="h-[16px] border-b border-black" />
                        <div className="text-[12px] mt-[4px]">
                            {hasField(visibleFieldIds, "obs.assinAgregado") ? assinaturaAgregado : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* =========================================================
   Wrapper DocumentoBase
========================================================= */
export default function RelViagemCTRB({ open }) {
    const navigate = useNavigate();
    const { state } = useLocation();

    const logo = localStorage.getItem("param_logoBg") || "";

    const data = useMemo(() => {
        const incoming = state?.data;
        if (incoming) return incoming;

        // MOCK
        return {
            seq: "001",
            viagemNumero: "027038",
            ciot: "281038734324/7063",
            emissao: "05/02/2026 11:20:38",

            empresaContratante: {
                razao: "AMA TRANSPORTES SA",
                cnpj: "29551937000137",
                ie: "633789815113",
                endereco: "AVENIDA ANA COSTA - SALA 33, 151",
                bairro: "GONZAGA",
                cidade: "SANTOS",
                uf: "SP",
            },

            agregado: {
                razao: "GUSTAVO HENRIQUE ANDRADE MORAIS PENA",
                pis: "11111111111",
                cnpjcpf: "11305245660",
                ie: "ISENTO",
                endereco: "IDELFONSO FERNANDES DA SILVA",
                bairro: "VENEZA",
                cidade: "RIBEIRAO DAS NEVES",
                uf: "MG",
            },

            motorista: {
                nome: "GUSTAVO HENRIQUE ANDRADE MORAIS PENA",
                endereco: "IDELFONSO FERNANDES DA SILVA",
                bairro: "VENEZA",
                cidade: "RIBEIRAO DAS NEVES",
                uf: "MG",
                cnh: "05897277858",
                cpf: "11305245660",
            },

            veiculo: {
                placa: "FFE8613",
                marca: "M.BENS",
                classe: "13",
                cidade: "CONSELHEIRO LAFAIETE",
                uf: "MG",
                chassi: "8AC906655CE063063",
                renavan: "00484921932",
                anofab: "2012",
            },

            banco: {
                banco: "",
                agencia: "",
                conta: "",
                favorecidoDoc: "11305245660",
                favorecido: "GUSTAVO HENRIQUE ANDRADE MORAIS PENA",
            },

            servicos: {
                tipo: "Container",
                localCarga: "CHAPECO",
                localDescarga: "ITAJAI",
                documentosStr: "136917 - 136919 - 137133 -",
            },

            condicoes: {
                valoresFrete: {
                    valorFrete: 3266.33,
                    pedagio: 0,
                    descarga: 0,
                    adicionalEntrega: 0,
                },
                contribuicoes: {
                    sestSenat: 16.33,
                    inss: 0,
                    cooperativa: 0,
                },
                lancamentos: {
                    adiantamento: 2275.0,
                    saldoFrete: 975.0,
                },
                totais: {
                    totalCreditos: 3266.33,
                    totalDebitos: 3266.33,
                    liquido: 0.0,
                },
            },

            observacoesTexto:
                "Declaro ter recebido a documentação e a carga especificada nesse documento, bem como o valor de R$ 3.250,00  como forma de adiantamento.\n\nNão há saldo a receber na entrega da(s) mercadoria(s).\n\nDeclaro haver recebido o valor da descarga, sendo de minha total responsabilidade o pagamento da descarga no cliente ou a contratação de ajudantes para fazer a descarga. Se houver problemas com a descarga por falta de pagamento, por parte do Motorista, implicará na retenção do saldo do frete. O mesmo ocorrerá se forem contratados ajudantes embriagados, drogados ou sem condições de exercer o trabalho de descarga.\n\nResponsabilidade civil, criminal e trabalhista do motorista e ajudante(s) contratado(s) são de inteira responsabilidade do Cooperado / Agregado, acima identificado, bem como do seguro do veículo e de terceiros.\n\nSr. Cooperado:\nNão usamos carta frete, O pedágio é pelo sistema Pamcard e os pagamentos são por depósito em conta corrente.\nÉ de sua inteira responsabilidade cumprir a lei 12.619/12.",

            assinaturaContratante: "AMA TRANSPORTES SA",
            assinaturaAgregado: "GUSTAVO HENRIQUE ANDRADE MORAIS PENA",
        };
    }, [state]);

    /* =========================================================
       Catálogo (+Campos) - grupos conforme PDF (como você pediu)
       - emp.seqLinha e agg.pis: disponíveis mas NÃO entram no padrão
       - todo o resto vem por padrão
    ========================================================= */
    const fieldsCatalog = useMemo(() => {
        return [
            // ============ Empresa Contratante ============
            { id: "emp.viagemNumero", label: "Nº Viagem", group: "Empresa Contratante" },
            { id: "emp.ciot", label: "CIOT", group: "Empresa Contratante" },
            { id: "emp.emissao", label: "Emissão", group: "Empresa Contratante" },
            { id: "emp.seqLinha", label: "Linha 001-Contratante (opcional)", group: "Empresa Contratante" },

            { id: "emp.razao", label: "Razão Social", group: "Empresa Contratante" },
            { id: "emp.cnpj", label: "CNPJ", group: "Empresa Contratante" },
            { id: "emp.ie", label: "I.E.", group: "Empresa Contratante" },
            { id: "emp.endereco", label: "Endereço", group: "Empresa Contratante" },
            { id: "emp.bairro", label: "Bairro", group: "Empresa Contratante" },
            { id: "emp.cidade", label: "Cidade/UF", group: "Empresa Contratante" },

            // ============ Agregado ============
            { id: "agg.razao", label: "Razão Social", group: "Agregado" },
            { id: "agg.cnpjcpf", label: "CNPJ/CPF", group: "Agregado" },
            { id: "agg.ie", label: "I.E.", group: "Agregado" },
            { id: "agg.endereco", label: "Endereço", group: "Agregado" },
            { id: "agg.bairro", label: "Bairro", group: "Agregado" },
            { id: "agg.cidade", label: "Cidade/UF", group: "Agregado" },
            { id: "agg.pis", label: "Nº PIS (opcional)", group: "Agregado" },

            // ============ Dados do Motorista ============
            { id: "mot.nome", label: "Nome", group: "Dados do Motorista" },
            { id: "mot.endereco", label: "Endereço", group: "Dados do Motorista" },
            { id: "mot.bairro", label: "Bairro", group: "Dados do Motorista" },
            { id: "mot.cnh", label: "CNH", group: "Dados do Motorista" },
            { id: "mot.cpf", label: "CPF", group: "Dados do Motorista" },
            { id: "mot.cidade", label: "Cidade/UF", group: "Dados do Motorista" },

            // ============ Dados do Veiculo ============
            { id: "vei.placa", label: "Placa", group: "Dados do Veiculo" },
            { id: "vei.marca", label: "Marca", group: "Dados do Veiculo" },
            { id: "vei.classe", label: "Classe", group: "Dados do Veiculo" },
            { id: "vei.anofab", label: "Ano Fabr", group: "Dados do Veiculo" },
            { id: "vei.chassi", label: "Nº Chassi", group: "Dados do Veiculo" },
            { id: "vei.renavan", label: "Renavan", group: "Dados do Veiculo" },
            { id: "vei.cidade", label: "Cidade/UF", group: "Dados do Veiculo" },

            // ============ Dados Bancário ============
            { id: "ban.banco", label: "Banco", group: "Dados Bancário" },
            { id: "ban.agencia", label: "Agência", group: "Dados Bancário" },
            { id: "ban.conta", label: "Conta", group: "Dados Bancário" },
            { id: "ban.favorecido", label: "Favorecido", group: "Dados Bancário" },

            // ============ Serviços Contratado ============
            { id: "srv.textoBase", label: "Texto Base Serviços", group: "Serviços Contratado" },
            { id: "srv.documentos", label: "Documentos Vinculados", group: "Serviços Contratado" },
            { id: "srv.localCarga", label: "Local Carga", group: "Serviços Contratado" },
            { id: "srv.localDescarga", label: "Local Descarga", group: "Serviços Contratado" },
            { id: "srv.tipo", label: "Tipo (ex: Container)", group: "Serviços Contratado" },

            // ============ Condições Contratuais ============
            { id: "cond.vf.titulo", label: "Título: Valores do Frete", group: "Condições Contratuais" },
            { id: "cond.vf.valorFrete", label: "Valor Frete Contratado", group: "Condições Contratuais" },
            { id: "cond.vf.pedagio", label: "Vale Pedágio", group: "Condições Contratuais" },
            { id: "cond.vf.descarga", label: "Descarga", group: "Condições Contratuais" },
            { id: "cond.vf.adicionalEntrega", label: "Adicional de Entrega", group: "Condições Contratuais" },

            { id: "cond.contrib.titulo", label: "Título: Contribuições", group: "Condições Contratuais" },
            { id: "cond.contrib.sestSenat", label: "SEST/SENAT", group: "Condições Contratuais" },
            { id: "cond.contrib.inss", label: "INSS", group: "Condições Contratuais" },
            { id: "cond.contrib.cooperativa", label: "Cooperativa", group: "Condições Contratuais" },

            { id: "cond.lanc.titulo", label: "Título: Lançamentos Diversos", group: "Condições Contratuais" },
            { id: "cond.lanc.adiantamento", label: "Adiantamento Saldo", group: "Condições Contratuais" },
            { id: "cond.lanc.saldoFrete", label: "Saldo de Frete", group: "Condições Contratuais" },

            { id: "cond.tot.titulo", label: "Título: Total Geral", group: "Condições Contratuais" },
            { id: "cond.tot.creditos", label: "Total Créditos", group: "Condições Contratuais" },
            { id: "cond.tot.debitos", label: "Total Débitos", group: "Condições Contratuais" },
            { id: "cond.tot.liquido", label: "Valor Líquido", group: "Condições Contratuais" },

            // ============ Observações ============
            { id: "obs.texto", label: "Texto (Declaro... até Lei 12.619/12)", group: "Observações" },
            { id: "obs.assinContratante", label: "Assinatura Contratante", group: "Observações" },
            { id: "obs.assinAgregado", label: "Assinatura Agregado", group: "Observações" },
        ];
    }, []);

    // padrão: tudo, EXCETO emp.seqLinha e agg.pis
    const defaultVisibleFieldIds = useMemo(() => {
        const all = fieldsCatalog.map((f) => f.id);
        return all.filter((id) => id !== "emp.seqLinha" && id !== "agg.pis");
    }, [fieldsCatalog]);

    const template = useMemo(() => {
        return {
            fieldsCatalog,
            defaultVisibleFieldIds,
            defaultOptions: { templateVariant: "padrao", copies: 1 },
            pages: [
                {
                    id: "p1",
                    render: ({ data, visibleFieldIds, logo }) => (
                        <CTRBOnePage data={data} visibleFieldIds={visibleFieldIds} logo={logo} />
                    ),
                },
            ],
        };
    }, [fieldsCatalog, defaultVisibleFieldIds]);

    return (
        <DocumentoBase
            sidebarOpen={open}
            reportKey="operacao.viagem_ctrb"
            title="Relatório CTRB"
            templateId="default"
            logo={logo}
            orientation="portrait"
            data={data}
            template={template}
            onClose={() => navigate(-1)}
        />
    );
}
