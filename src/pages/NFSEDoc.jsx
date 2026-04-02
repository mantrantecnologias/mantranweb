import { useState, useEffect, useRef } from "react";
import { XCircle, PlusCircle, Trash2, Search } from "lucide-react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
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
      className={"border border-gray-300 rounded px-2 h-[26px] text-[13px] " + className}
    >
      {children}
    </select>
  );
}

export default function NFSEDoc({ isOpen, onClose, onConfirm, btnIncluirRodapeRef }) {
  const [descricao, setDescricao] = useState("");
  const [modo, setModo] = useState("manual"); // manual | doc

  const [qtd, setQtd] = useState(1);
  const [valor, setValor] = useState("0,00");
  const [total, setTotal] = useState("0,00");

  // === REFS PARA NAVEGAÇÃO ===
  const descricaoRef = useRef(null);
  const manualRadioRef = useRef(null);
  const qtdRef = useRef(null);
  const valorRef = useRef(null);
  const totalRef = useRef(null);
  const btnConfirmarRef = useRef(null);

  // Foco inicial no campo Descrição ao abrir modal
  useEffect(() => {
    if (isOpen && descricaoRef.current) {
      setTimeout(() => descricaoRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handler para navegar com Enter
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef?.current) {
        nextRef.current.focus();
      }
    }
  };

  // ===============================
  // MOCK
  // ===============================
  const documentosMock = [
    {
      id: 1,
      doc: "Coleta",
      filial: "001",
      numero: "185698",
      cnpj: "50221019000136",
      cliente: "HNK-ITU (1) MATRIZ",
      cidade: "ITU",
      dt: "2025-11-20",
      valor: 120,
    },
    {
      id: 2,
      doc: "Conhecimento",
      filial: "001",
      numero: "185699",
      cnpj: "42446277004694",
      cliente: "SHPX LOGISTICA LTDA",
      cidade: "CAMPINAS",
      dt: "2025-11-20",
      valor: 80,
    },
  ];

  const [filtros, setFiltros] = useState({
    cnpj: "",
    cliente: "",
    dtInicio: "",
    dtFim: "",
    filial: "001",
    tipo: "TODOS",
  });

  const [resultado, setResultado] = useState(documentosMock);
  const [selecionados, setSelecionados] = useState([]);
  const [itensSelecionados, setItensSelecionados] = useState([]);
  const [numItem, setNumItem] = useState(1);
  const [botaoSelectAll, setBotaoSelectAll] = useState("Selecionar Todos");

  // ===============================  
  // CALCULA TOTAL MANUAL
  // ===============================
  useEffect(() => {
    const v = Number(valor.replace(".", "").replace(",", ".")) || 0;
    setTotal((v * qtd).toFixed(2).replace(".", ","));
  }, [valor, qtd]);

  // ===============================
  // CONVERTE data ISO -> DD/MM/YYYY
  // ===============================
  const formatarDataBR = (iso) => {
    if (!iso) return "";
    const [ano, mes, dia] = iso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  // ===============================
  // FILTRAR DOCUMENTOS
  // ===============================
  const filtrar = () => {
    let dados = [...documentosMock];

    if (filtros.cnpj) {
      dados = dados.filter((d) => d.cnpj.includes(filtros.cnpj));
    }
    if (filtros.cliente) {
      dados = dados.filter((d) =>
        d.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
      );
    }
    if (filtros.dtInicio) {
      dados = dados.filter((d) => d.dt >= filtros.dtInicio);
    }
    if (filtros.dtFim) {
      dados = dados.filter((d) => d.dt <= filtros.dtFim);
    }
    if (filtros.tipo !== "TODOS") {
      dados = dados.filter((d) => d.doc === filtros.tipo);
    }

    setResultado(dados);
  };

  // ===============================
  // ADICIONAR SELECIONADOS AO CARD 1
  // ===============================
  const adicionarSelecionados = () => {
    const docs = resultado.filter((d) => selecionados.includes(d.id));

    if (docs.length === 0) return;

    setItensSelecionados((prev) => [...prev, ...docs]);
  };

  // ===============================
  // CONFIRMAR
  // ===============================
  const confirmar = () => {
    if (!descricao.trim()) {
      alert("⚠️ Informe a descrição do item!");
      return;
    }

    let itemFinal = null;

    if (modo === "manual") {
      itemFinal = {
        id: Date.now(),
        numItem,
        descricao,
        qtde: qtd,
        valor: valor,
        total: total,
        natureza: "N",
      };
    } else {
      if (itensSelecionados.length === 0) {
        alert("⚠️ Selecione ao menos 1 documento!");
        return;
      }

      const soma = itensSelecionados.reduce((t, d) => t + d.valor, 0);

      itemFinal = {
        id: Date.now(),
        numItem,
        descricao,
        qtde: 1,
        valor: soma.toFixed(2).replace(".", ","),
        total: soma.toFixed(2).replace(".", ","),
        natureza: "N",
      };
    }

    // Envia para NFSEPage
    onConfirm(itemFinal);

    // incrementa número do item
    setNumItem((prev) => prev + 1);

    onClose();
  };


  // ===============================
  // SELECT ALL
  // ===============================
  const toggleSelectAll = () => {
    if (selecionados.length === resultado.length) {
      setSelecionados([]);
      setBotaoSelectAll("Selecionar Todos");
    } else {
      setSelecionados(resultado.map((d) => d.id));
      setBotaoSelectAll("Limpar Seleção");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="w-[900px] max-h-[90vh] bg-white rounded shadow-xl p-4 overflow-auto">

        {/* Nº Item + Descrição */}
        <div className="grid grid-cols-12 gap-2 mb-3 items-center">

          {/* Nº Item */}
          <Label className="col-span-1 text-right">Nº Item</Label>
          <Txt
            value={itensSelecionados.length + 1}
            readOnly
            className="col-span-1 bg-gray-100 text-center"
            tabIndex={-1}
          />

          {/* Descrição */}
          <Label className="col-span-1 text-right">Descrição</Label>
          <Txt
            ref={descricaoRef}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="col-span-9"
            placeholder="Informe a Descrição do Item"
            tabIndex={1}
            onKeyDown={(e) => handleKeyDown(e, manualRadioRef)}
          />
        </div>


        {/* MODO */}
        <div className="flex gap-4 mb-3">
          <label className="flex items-center gap-2">
            <input
              ref={manualRadioRef}
              type="radio"
              checked={modo === "manual"}
              onChange={() => setModo("manual")}
              tabIndex={2}
              onKeyDown={(e) => handleKeyDown(e, qtdRef)}
            />
            Manual
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={modo === "doc"}
              onChange={() => setModo("doc")}
              tabIndex={-1}
            />
            Selecionar Documentos
          </label>
        </div>

        {/* MODO MANUAL */}
        {modo === "manual" && (
          <div className="grid grid-cols-3 gap-4 p-3 border rounded bg-gray-50 mb-4">
            <div>
              <Label>Qtd</Label>
              <Txt
                ref={qtdRef}
                type="number"
                value={qtd}
                onChange={(e) => setQtd(Number(e.target.value))}
                tabIndex={3}
                onKeyDown={(e) => handleKeyDown(e, valorRef)}
              />
            </div>

            <div>
              <Label>Valor</Label>
              <Txt
                ref={valorRef}
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                tabIndex={4}
                onKeyDown={(e) => handleKeyDown(e, totalRef)}
              />
            </div>

            <div>
              <Label>Total</Label>
              <Txt
                ref={totalRef}
                value={total}
                readOnly
                className="bg-gray-100"
                tabIndex={5}
                onKeyDown={(e) => handleKeyDown(e, btnConfirmarRef)}
              />
            </div>
          </div>
        )}

        {/* MODO DOCUMENTOS */}
        {modo === "doc" && (
          <>
            {/* CARD 1 – Itens Selecionados */}
            <fieldset className="border rounded p-2 mb-3">
              <legend className="text-red-700 text-[13px] px-1">Documentos Selecionados</legend>

              <table className="w-full text-[12px] border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-1">Doc</th>
                    <th className="border p-1">Nº</th>
                    <th className="border p-1">Cliente</th>
                    <th className="border p-1">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {itensSelecionados.map((d) => (
                    <tr key={d.id}>
                      <td className="border p-1">{d.doc}</td>
                      <td className="border p-1">{d.numero}</td>
                      <td className="border p-1">{d.cliente}</td>
                      <td className="border p-1 text-right">{d.valor.toFixed(2)}</td>
                    </tr>
                  ))}

                  {itensSelecionados.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center p-2 text-gray-500">
                        Nenhum documento selecionado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </fieldset>

            {/* CARD 3 – FILTRO */}
            <fieldset className="border rounded p-2 mb-3">
              <legend className="text-red-700 text-[13px] px-1">
                Relação de Documentos para NF Serviço
              </legend>

              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label className="col-span-1">CNPJ</Label>
                <Txt
                  className="col-span-2"
                  value={filtros.cnpj}
                  onChange={(e) => setFiltros({ ...filtros, cnpj: e.target.value })}
                />

                <Txt
                  className="col-span-4"
                  value={filtros.cliente}
                  onChange={(e) => setFiltros({ ...filtros, cliente: e.target.value })}
                />

                <Label className="col-span-1 text-right">Período</Label>
                <Txt
                  type="date"
                  className="col-span-2"
                  value={filtros.dtInicio}
                  onChange={(e) => setFiltros({ ...filtros, dtInicio: e.target.value })}
                />
                <Txt
                  type="date"
                  className="col-span-2"
                  value={filtros.dtFim}
                  onChange={(e) => setFiltros({ ...filtros, dtFim: e.target.value })}
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-1">Filial</Label>
                <Sel
                  className="col-span-4"
                  value={filtros.filial}
                  onChange={(e) => setFiltros({ ...filtros, filial: e.target.value })}
                >
                  <option value="001">001</option>
                </Sel>

                <Label className="col-span-2 text-right">Tipo Doc.</Label>
                <Sel
                  className="col-span-3"
                  value={filtros.tipo}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
                >
                  <option value="TODOS">TODOS</option>
                  <option value="Coleta">Coleta</option>
                  <option value="Conhecimento">Conhecimento</option>
                </Sel>

                <button
                  onClick={filtrar}
                  className="col-span-2 border px-2 py-1 text-[12px] bg-gray-100 hover:bg-gray-200 rounded"
                >
                  <Search size={16} className="inline" /> Pesquisar
                </button>
              </div>
            </fieldset>

            {/* CARD 4 – GRID */}
            <div className="border rounded p-2 mb-3 max-h-[250px] overflow-auto">
              <table className="w-full text-[12px] border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-1"></th>
                    <th className="border p-1">Doc</th>
                    <th className="border p-1">Filial</th>
                    <th className="border p-1">Nº</th>
                    <th className="border p-1">CNPJ</th>
                    <th className="border p-1">Cliente</th>
                    <th className="border p-1">Cidade</th>
                    <th className="border p-1">DT</th>
                  </tr>
                </thead>
                <tbody>
                  {resultado.map((d) => (
                    <tr key={d.id}>
                      <td className="border p-1 text-center">
                        <input
                          type="checkbox"
                          checked={selecionados.includes(d.id)}
                          onChange={() => {
                            if (selecionados.includes(d.id))
                              setSelecionados(selecionados.filter((x) => x !== d.id));
                            else setSelecionados([...selecionados, d.id]);

                            if (selecionados.length + 1 === resultado.length)
                              setBotaoSelectAll("Limpar Seleção");
                          }}
                        />
                      </td>
                      <td className="border p-1">{d.doc}</td>
                      <td className="border p-1 text-center">{d.filial}</td>
                      <td className="border p-1 text-center">{d.numero}</td>
                      <td className="border p-1">{d.cnpj}</td>
                      <td className="border p-1">{d.cliente}</td>
                      <td className="border p-1">{d.cidade}</td>
                      <td className="border p-1">{formatarDataBR(d.dt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* RODAPÉ */}
        <div className="mt-4 flex justify-between items-center">

          {/* SELECIONAR TODOS */}
          {modo === "doc" && (
            <button
              onClick={toggleSelectAll}
              className="px-3 py-2 bg-gray-100 rounded border hover:bg-gray-200 text-[13px]"
            >
              {botaoSelectAll}
            </button>
          )}

          <div className="flex gap-3">
            {/* Adicionar */}
            {modo === "doc" && (
              <button
                onClick={adicionarSelecionados}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <PlusCircle size={14} className="inline" /> Adicionar
              </button>
            )}

            {/* Confirmar */}
            <button
              ref={btnConfirmarRef}
              onClick={confirmar}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmar();
                  // Foca no botão Incluir do rodapé após fechar
                  setTimeout(() => {
                    if (btnIncluirRodapeRef?.current) {
                      btnIncluirRodapeRef.current.focus();
                    }
                  }, 100);
                }
              }}
              className="px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
              tabIndex={6}
            >
              Confirmar
            </button>

            {/* Cancelar */}
            <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded" tabIndex={-1}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
