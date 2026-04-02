import { useState } from "react";
import ViagemDespesa from "./ViagemDespesa";
import {
  XCircle,
  PlusCircle,
  Trash2,
  RotateCcw,
  DollarSign, 
} from "lucide-react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        (props.className || "")
      }
    />
  );
}

export default function ViagemCustosOperacionais({ isOpen, onClose }) {
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({
    evento: "027",
    descricao: "ABASTECIMENTO",
    categoria: "2",
    categoriaDesc: "DESPESAS OPERACIONAIS",
    sub: "33",
    subDesc: "COMBUSTÍVEL",
    tipoPagto: "5",
    tipoPagtoDesc: "DÉBITO OU CRÉDITO",
    valor: "250,00",
    cidadeOrigem: "CAMPINAS",
    ufOrigem: "SP",
    cidadeDestino: "SANTOS",
    ufDestino: "SP",
  });

  if (!isOpen) return null;

  // Adiciona item na grid
  const handleAdd = () => {
    setItens([...itens, { id: Date.now(), ...novoItem }]);
  };

  // Remove item selecionado
  const handleRemove = (id) => {
    setItens(itens.filter((i) => i.id !== id));
  };

  const [modalDespesaOpen, setModalDespesaOpen] = useState(false);


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[90%] max-w-[1100px] rounded shadow-lg border border-gray-300 p-4 max-h-[90vh] overflow-auto">
        <h2 className="text-red-700 font-semibold text-[14px] mb-3 border-b pb-1">
          VIAGEM - CUSTOS OPERACIONAIS
        </h2>

        {/* === CARD 1 - DESPESAS DIVERSAS === */}
<fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">
  <legend className="text-red-700 font-semibold px-2">Despesas Diversas</legend>

  <div className="space-y-2">

    {/* ===== LINHA 1 ===== */}
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2 w-[70%]">
        <Label>Empresa</Label>
        <Txt className="w-[8%] text-center" defaultValue="001" />
        <Label className="ml-[30px]"> Filial</Label>
        <Txt className="w-[8%] text-center" defaultValue="001" />
        <Label className="ml-[85px]">Viagem</Label>
        <Txt className="w-[15%] text-center" defaultValue="079032" />
        <Txt className="w-[6%] text-center" defaultValue="1" />
      </div>
      <div className="flex items-center gap-2 w-[70%] justify-end">
        <Label>DT Acerto Conta</Label>
        <Txt className="w-[30%]" />
        <Label>Saldo Ficha</Label>
        <Txt className="w-[25%] text-right bg-gray-100" defaultValue="-300" />
      </div>
    </div>

    {/* ===== LINHA 2 ===== */}
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2 w-[50%]">
        <Label>Data Lançamento</Label>
        <Txt type="date" className="w-[34%]" defaultValue="2025-10-29" />
        <Label>Hora Lançamento</Label>
        <Txt type="time" className="w-[15%]" defaultValue="10:41" />
      </div>
      <div className="flex items-center gap-2 w-[50%] justify-end">
        <Label>DT Acerto Conta</Label>
        <Txt className="w-[30%]" />
        <Label>Saldo Ficha</Label>
        <Txt className="w-[25%] text-right bg-gray-100" defaultValue="-300" />
      </div>
    </div>

    {/* ===== LINHA 3 ===== */}
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2 w-[50%]">
        <Label>Cidade Origem</Label>
        <Txt className="w-[54%] ml-[40px]" defaultValue="CAMPINAS" />
        <Txt className="w-[11%] text-center" defaultValue="SP" />
      </div>
      <div className="flex items-center gap-2 w-[50%] justify-end">
        <Label>Cidade Destino</Label>
        <Txt className="w-[53%]" defaultValue="SANTOS" />
        <Txt className="w-[15%] text-center" defaultValue="SP" />
      </div>
    </div>

    {/* ===== LINHA 4 ===== */}
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2 w-[60%]">
        <Label>Evento</Label>
        <Txt className="w-[10%] text-center ml-[20px]" defaultValue="027" />
        <Txt className="w-[49%]" defaultValue="ABASTECIMENTO" />
        <Txt className="w-[10%] text-center" defaultValue="D" />
      </div>
      <div className="flex items-center gap-2 w-[50%] justify-end">
        <Label>Complemento</Label>
        <Txt className="w-[77%]" defaultValue="Praça de Pedágio" />
      </div>
    </div>

    {/* ===== LINHA 5 ===== */}
<div className="flex justify-between w-full">
  <div className="flex items-center gap-2 w-[60%]">
    <Label>Categoria</Label>
    <Txt className="w-[10%] text-center ml-[5px]" defaultValue="2" />
    {/* diminuído de 75% para 60% */}
    <Txt className="w-[60%]" defaultValue="DESPESAS OPERACIONAIS" />
  </div>
  <div className="flex items-center gap-2 w-[50%] justify-end">
    <Label>Sub Categoria</Label>
    <Txt className="w-[10%] text-center" defaultValue="33" />
    <Txt className="w-[65%]" defaultValue="COMBUSTÍVEL" />
  </div>
</div>

{/* ===== LINHA 6 ===== */}
<div className="flex justify-between w-full">
  <div className="flex items-center gap-2 w-[60%]">
    <Label>Tipo Pagto</Label>
    <Txt className="w-[10%] text-center" defaultValue="5" />
    {/* diminuído de 75% para 60% */}
    <Txt className="w-[60%]" defaultValue="DÉBITO OU CRÉDITO" />
  </div>
  <div className="flex items-center gap-2 w-[50%] justify-end">
    <Label>Status Viagem</Label>
    <Txt className="w-[77%]" defaultValue="ATIVA" />
  </div>
</div>


    {/* ===== LINHA 7 ===== */}
    <div className="flex justify-between w-full">
      <div className="flex items-center gap-2 w-[60%]">
        <Label>Valor </Label>
        <Txt className="w-[25%] text-right ml-[30px]" defaultValue="0,00" />
        <Label className="ml-[75px]">Quantidade</Label>
        <Txt className="w-[15%] text-center" defaultValue="1,00" />
      </div>
      <div className="flex items-center gap-2 w-[40%] justify-end">
        
        <button
  onClick={() => setModalDespesaOpen(true)}
  className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 text-green-700"
>
  <DollarSign size={14} /> Pagamento
</button>

        <button className="border border-gray-300 rounded px-3 py-[4px] text-[12px] flex items-center gap-1 text-red-600">
          <RotateCcw size={14} /> Estornar
        </button>
      </div>
    </div>

    {/* ===== LINHA 8 ===== */}
    <div className="flex items-center gap-2 w-full">
      <Label>Histórico</Label>
      <Txt className="flex-1 ml-[10px]" placeholder="Digite aqui o histórico da despesa..." />
    </div>
  </div>
</fieldset>


        {/* === CARD 2 - GRID === */}
        <fieldset className="border border-gray-300 rounded p-3 bg-white mb-3">
          <legend className="text-red-700 font-semibold px-2">Histórico de Lançamentos</legend>

          <div className="block border border-gray-300 rounded bg-white mt-2 max-h-[250px] overflow-x-auto overflow-y-auto min-w-0">
            <table className="min-w-[1000px] text-[12px] border-collapse">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  {[
                    "✓",
                    "Evento",
                    "Descrição",
                    "Categoria",
                    "Sub",
                    "Tipo Pagto",
                    "Valor",
                    "Origem",
                    "Destino",
                    "UF",
                  ].map((h) => (
                    <th key={h} className="border px-2 py-1 whitespace-nowrap text-center">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {itens.map((i) => (
                  <tr
                    key={i.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onDoubleClick={() => handleRemove(i.id)}
                  >
                    <td className="border text-center">
                      <input type="checkbox" />
                    </td>
                    <td className="border text-center">{i.evento}</td>
                    <td className="border px-2">{i.descricao}</td>
                    <td className="border text-center">{i.categoria}</td>
                    <td className="border text-center">{i.sub}</td>
                    <td className="border text-center">{i.tipoPagto}</td>
                    <td className="border text-right">{i.valor}</td>
                    <td className="border text-center">{i.cidadeOrigem}</td>
                    <td className="border text-center">{i.cidadeDestino}</td>
                    <td className="border text-center">{i.ufDestino}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>

       {/* === CARD 3 - ÍCONES RODAPÉ === */}
<div className="flex justify-start gap-3 mt-3 ml-1">
  <button
    onClick={onClose}
    className="border border-gray-300 bg-white hover:bg-gray-100 rounded-full p-2"
    title="Fechar"
  >
    <XCircle className="text-red-700" size={20} />
  </button>

  <button
    onClick={() =>
      setNovoItem({
        evento: "",
        descricao: "",
        categoria: "",
        categoriaDesc: "",
        sub: "",
        subDesc: "",
        tipoPagto: "",
        tipoPagtoDesc: "",
        valor: "",
      })
    }
    className="border border-gray-300 bg-white hover:bg-gray-100 rounded-full p-2"
    title="Limpar"
  >
    <RotateCcw className="text-red-700" size={20} />
  </button>

  <button
    onClick={handleAdd}
    className="border border-gray-300 bg-white hover:bg-gray-100 rounded-full p-2"
    title="Incluir"
  >
    <PlusCircle className="text-red-700" size={20} />
  </button>

  <button
    onClick={() => itens.length > 0 && handleRemove(itens[itens.length - 1].id)}
    className="border border-gray-300 bg-white hover:bg-gray-100 rounded-full p-2"
    title="Excluir"
  >
    <Trash2 className="text-red-700" size={20} />
  </button>
</div>

      </div>
 {/* === MODAL VIAGEM DESPESA (fora do conteúdo, mas dentro do return principal) === */}
      {modalDespesaOpen && (
        <ViagemDespesa
          isOpen={modalDespesaOpen}
          onClose={() => setModalDespesaOpen(false)}
        />
      )}

    </div>
         
  );
}
