import { useState } from "react";
import GerarColetaModal from "./GerarColetaModal";
import ValoresCte from "./ValoresCte";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Search,
  FileSpreadsheet,
  Truck,
  CheckSquare,
  Square,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}
function Txt(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${props.className || ""}`}
    />
  );
}
function Sel({ children, ...rest }) {
  return (
    <select
      {...rest}
      className="border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px]"
    >
      {children}
    </select>
  );
}

export default function NotaFiscalEDI({ open }) {
  const navigate = useNavigate();
  const [showGerarColeta, setShowGerarColeta] = useState(false);
  const [showValoresCte, setShowValoresCte] = useState(false);
const [notas, setNotas] = useState(
  [...Array(8)].map((_, i) => ({
    id: i,
    filial: "001",
    nota: `1871005${i + 1}`,
    serie: "1",
    emissao:"12/10/2025",
    cnpjEmissor: "50763606001408",
    cliente: "50763606001408",
    remetente: "RAMUTH E RAMUTH LTDA - CD 2",
    destinatario: "RAMUTH E RAMUTH LTDA - UB",
    enderecoEntrega: "AV. VASCONCELOS COSTA",
    cidade: "UBERLANDIA",
    uf: "MG",
    cep: "38400450",
    peso: (Math.random() * 2800).toFixed(2),
    volume: "1",
    cubagem: "0,00",
    viagem: "039201",
    veiculo: "",
    transportador: "",
    integrado: "N",
    valor: (Math.random() * 1000).toFixed(2),
    rota: "",
    chave: `3525063026871002230550000000375${i}09398730`,
    tipoNF: "C",
    statusAutomatico: "",
    retornoAutomatico: "",
    romaneio: "",
    coleta: "",
    ctrcControle: "",
    selecionado: false,
  }))
);


  const [todosSelecionados, setTodosSelecionados] = useState(false);

  const handleSelecionarTodos = () => {
    const novo = !todosSelecionados;
    setTodosSelecionados(novo);
    setNotas((prev) => prev.map((n) => ({ ...n, selecionado: novo })));
  };

  const handleCancelarSelecao = () => {
    setTodosSelecionados(false);
    setNotas((prev) => prev.map((n) => ({ ...n, selecionado: false })));
  };

  const totalRegistros = notas.length;
  const totalSelecionados = notas.filter((n) => n.selecionado).length;
  const totalFrete = notas
    .filter((n) => n.selecionado)
    .reduce((acc, n) => acc + parseFloat(n.valor), 0)
    .toFixed(2);

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${
        open ? "ml-[192px]" : "ml-[56px]"
      }`}
    >
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        NOTA FISCAL EDI
      </h1>

      <div className="flex-1 p-3 bg-white border-x border-b border-gray-200 rounded-b-md overflow-y-auto flex flex-col gap-3">
       {/* === CARD 1 - PARÂMETROS === */}
<fieldset className="border border-gray-300 rounded p-3">
  <legend className="text-red-700 font-semibold px-2">Parâmetros</legend>

  {/* Linha 1 */}
  <div className="grid grid-cols-12 gap-2 items-center">
  <div className="col-span-6 flex items-center gap-12">
  <Label>Filial Nota</Label>
  <Sel className="w-[150px] ml-20">
    <option>001 - MANTRAN TECNOLOGIAS LTDA ME</option>
  </Sel>
</div>
    <div className="col-span-6 flex justify-end items-center gap-1">
      <Label>Cliente</Label>
      <Txt className="w-[150px]" placeholder="CNPJ" />
      <Txt className="w-[280px]" placeholder="Razão Social" />
    </div>
  </div>

  {/* Linha 2 */}
  <div className="grid grid-cols-12 gap-2 items-center mt-2">
    <div className="col-span-6 flex items-center gap-6">
      <Label>Nº Nota Fiscal</Label>
      <Txt className="w-[110px]" />
      <Label>Série</Label>
      <Txt className="w-[80px]" />
      <Label>NF Processada</Label>
      <Sel className="w-[140px]">
        <option>Sim</option>
        <option>Não</option>
      </Sel>
    </div>
    <div className="col-span-6 flex justify-end items-center gap-1">
      <Label>Remetente</Label>
      <Txt className="w-[150px]" placeholder="CNPJ" />
      <Txt className="w-[280px]" placeholder="Razão Social" />
    </div>
  </div>

  {/* Linha 3 */}
<div className="grid grid-cols-12 gap-2 items-center mt-2">
  <div className="col-span-6 flex items-center gap-3">
    <Label>DT Emissão</Label>
    <Txt type="date" className="w-[130px] ml-6" />
    <span className="text-[13px] text-gray-700">até</span>
    <Txt type="date" className="w-[130px]" />
    <Label className="ml-4">Romaneio</Label>
    <Txt className="w-[80px]" />
  </div>

  <div className="col-span-6 flex justify-end items-center gap-1">
    <Label>Destinatário</Label>
    <Txt className="w-[150px]" placeholder="CNPJ" />
    <Txt className="w-[280px]" placeholder="Razão Social" />
  </div>
</div>

  {/* Linha 4 */}
  <div className="grid grid-cols-12 gap-2 items-center mt-2">
    <div className="col-span-5 flex items-center gap-1">
      <Label>Status Automático</Label>
      <Sel className="w-[120px]">
        <option>Sim</option>
        <option>Não</option>
      </Sel>
      <Label className="ml-10">Geração Coleta</Label>
      <Sel className="w-[120px]">
        <option>Sim</option>
        <option>Não</option>
      </Sel>
      <label className="flex items-center gap-1 ml-10">
        <input type="checkbox" /> Notas sem Rota
      </label>
    </div>
    <div className="col-span-7 flex justify-end items-center gap-1">
      <Label>Veículo</Label>
      <Txt className="w-[150px]" placeholder="Código" />
      <Txt className="w-[280px]" placeholder="Placa / Descrição" />
    </div>
  </div>

  {/* Linha 5 - Botões alinhados à direita */}
  <div className="flex justify-end items-center mt-3 gap-2">
    <button className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1">
      <Search size={14} /> Pesquisar
    </button>
    <button
  onClick={() => setShowGerarColeta(true)}
  className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1"
>
  <Truck size={14} /> Gerar Coleta
</button>
    <button
  onClick={() => setShowValoresCte(true)}
  className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1"
>
  <FileSpreadsheet size={14} /> Gerar CT-e
</button>

  </div>
</fieldset>


       {/* === CARD 2 - GRID DE NOTAS === */}
<fieldset className="border border-gray-300 rounded p-3 min-w-0">
  <legend className="text-red-700 font-semibold px-2">
    Notas Fiscais EDI
  </legend>

  {/* === GRID COM ROLAGEM INTERNA === */}
  <div className="block w-full min-w-0 border border-gray-300 rounded bg-white mt-2 max-h-[380px] overflow-auto">
    <table className="min-w-[2600px] text-[12px] border-collapse">
      <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
        <tr>
          <th className="border px-2 py-1 text-center w-8">Chk</th>
          {[
            "Filial",
            "Nota",
            "Série",
            "Loja",
            "Cabeçalho",
            "Data Emissão",
            "CNPJ Emissor",
            "Cliente",
            "Remetente",
            "Destinatário",
            "Endereço Entrega",
            "Cidade",
            "UF",
            "CEP",
            "Peso",
            "Volume",
            "Cubagem",
            "Viagem",
            "Veículo",
            "Transportador",
            "Integrado",
            "Valor",
            "Rota",
            "Chave",
            "TP NF",
            "Status Automático",
            "Retorno Automático",
            "Romaneio",
            "Coleta",
            "CTRC Controle",
          ].map((h) => (
            <th key={h} className="border px-2 py-1 whitespace-nowrap text-left">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {notas.map((n, i) => (
          <tr
            key={n.id}
            className={`${i % 2 === 0 ? "bg-orange-50" : "bg-white"} hover:bg-gray-100`}
          >
            {/* Checkbox */}
            <td className="border text-center">
              <input
                type="checkbox"
                checked={!!n.selecionado}
                onChange={() =>
                  setNotas((prev) =>
                    prev.map((x) =>
                      x.id === n.id ? { ...x, selecionado: !x.selecionado } : x
                    )
                  )
                }
              />
            </td>

            {/* Células */}
            {[
              "filial",
              "nota",
              "serie",
              "loja",
              "cabecalho",
              "emissao",
              "cnpjEmissor",
              "cliente",
              "remetente",
              "destinatario",
              "enderecoEntrega",
              "cidade",
              "uf",
              "cep",
              "peso",
              "volume",
              "cubagem",
              "viagem",
              "veiculo",
              "transportador",
              "integrado",
              "valor",
              "rota",
              "chave",
              "tipoNF",
              "statusAutomatico",
              "retornoAutomatico",
              "romaneio",
              "coleta",
              "ctrcControle",
            ].map((k) => (
              <td
                key={k}
                className={`border px-2 py-1 whitespace-nowrap ${
                  k === "valor" ? "text-right" : "text-left"
                }`}
              >
                {k === "valor" && n[k] != null
                  ? `R$ ${Number(n[k]).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : n[k] ?? ""}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</fieldset>


        {/* === CARD 3 - CONTROLE GRID === */}
        <fieldset className="border border-gray-300 rounded p-3">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={handleSelecionarTodos}
                className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1"
              >
                {todosSelecionados ? <CheckSquare size={14} /> : <Square size={14} />} Selecionar Todos
              </button>
              <button
                onClick={handleCancelarSelecao}
                className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100 flex items-center gap-1"
              >
                <RotateCcw size={14} /> Cancelar Seleção
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Label>Total Registros</Label>
              <Txt className="w-[60px] text-center bg-gray-100" value={totalRegistros} readOnly />
              <Label>Selecionados</Label>
              <Txt className="w-[60px] text-center bg-gray-100" value={totalSelecionados} readOnly />
              <Label>VR Frete</Label>
              <Txt
                className="w-[100px] text-right bg-gray-100"
                value={`R$ ${totalFrete}`}
                readOnly
              />
            </div>
          </div>
        </fieldset>
      </div>

      {/* === RODAPÉ === */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center justify-start text-red-700">
        {[
          { icon: XCircle, label: "Fechar", action: () => navigate(-1) },
          { icon: RotateCcw, label: "Limpar" },
          { icon: PlusCircle, label: "Incluir" },
          { icon: Edit, label: "Alterar" },
          { icon: Trash2, label: "Excluir" },
          { icon: Search, label: "Avançada" },
          { icon: FileSpreadsheet, label: "Exportar" },
          { icon: Truck, label: "Romaneio" },
        ].map(({ icon: Icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            className="flex flex-col items-center text-[11px] hover:text-red-800 transition mx-2"
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
        
        {/* === Gerar Coleta === */}
        {showGerarColeta && <GerarColetaModal onClose={() => setShowGerarColeta(false)} />}

        {/* === Gerar Cte === */}
        {showValoresCte && <ValoresCte onClose={() => setShowValoresCte(false)} />}
  

      </div>
    </div>
  );
}
