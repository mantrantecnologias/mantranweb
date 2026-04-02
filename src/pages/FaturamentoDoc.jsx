import { useState, useRef, useEffect } from "react";
import { XCircle } from "lucide-react";

/* =============================
   Helpers
============================= */
function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>
      {children}
    </label>
  );
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

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] " +
        className
      }
    >
      {children}
    </select>
  );
}

const formatNumero = (n) =>
  n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function emissaoToISO(emissaoBr) {
  // emissaoBr no formato "dd/mm/aaaa"
  if (!emissaoBr) return "";
  const [dia, mes, ano] = emissaoBr.split("/");
  if (!dia || !mes || !ano) return "";
  return `${ano}-${mes}-${dia}`;
}

/* =============================
   Componente Principal
============================= */
export default function FaturamentoDoc({
  numeroFatura = "046504C",
  onClose,
  onUpdateTotais,
}) {
  /* =============================
     DRAG NATIVO (IGUAL COBRANCA BANCARIA)
  ============================== */

  const modalRef = useRef(null);
  const headerRef = useRef(null);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setPos({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2,
      });
    }
  }, []);

  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const duringDrag = (e) => {
    if (dragging) {
      setPos({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const stopDrag = () => setDragging(false);

  /* =============================
     DADOS MOCK
  ============================== */

  const [docsFatura, setDocsFatura] = useState([
    {
      id: 1,
      filial: "001",
      serie: "001",
      tipoDoc: "CTRC",
      docto: "058779",
      impresso: "S",
      emissao: "08/10/2025",
      vrMercadoria: 10.0,
      vrFrete: 10.0,
      cnpj: "50221019000136",
      tpCte: "Normal",
    },
    {
      id: 2,
      filial: "001",
      serie: "001",
      tipoDoc: "CTRC",
      docto: "058781",
      impresso: "S",
      emissao: "09/10/2025",
      vrMercadoria: 12.0,
      vrFrete: 11.01,
      cnpj: "50221019000136",
      tpCte: "Normal",
    },
  ]);

  const [docsDisponiveis] = useState([
    {
      id: 3,
      docto: "058782",
      cnpj: "50221019000136",
      razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
      cidade: "SALVADOR",
      emissao: "10/10/2025",
      filial: "001",
      tipoDoc: "CTRC",
      valor: 50.0,
      tpCte: "Normal",
      serie: "001",
    },
    {
      id: 4,
      docto: "058783",
      cnpj: "50221019000136",
      razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
      cidade: "SALVADOR",
      emissao: "10/10/2025",
      filial: "001",
      tipoDoc: "CTRC",
      valor: 80.0,
      tpCte: "Normal",
      serie: "001",
    },
    {
      id: 5,
      docto: "058784",
      cnpj: "50221019000136",
      razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
      cidade: "SALVADOR",
      emissao: "27/10/2025",
      filial: "001",
      tipoDoc: "CTRC",
      valor: 131.0,
      tpCte: "Normal",
      serie: "001",
    },
  ]);

  const [selectedIds, setSelectedIds] = useState([]);

  /* =============================
     ESTADOS DOS FILTROS (CARD 4)
  ============================== */

  const [filtroCnpj, setFiltroCnpj] = useState("50221019000136");
  const [filtroDataIni, setFiltroDataIni] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [filtroNumeroCte, setFiltroNumeroCte] = useState("");
  const [filtroFilial, setFiltroFilial] = useState("TODAS");
  const [filtrosAplicados, setFiltrosAplicados] = useState(null);

  /* =============================
     LÓGICA DOCUMENTOS DISPONÍVEIS + FILTRO
  ============================== */

  // Base: documentos que não estão na fatura
  const baseAvailableDocs = docsDisponiveis.filter(
    (d) => !docsFatura.some((f) => f.id === d.id)
  );

  const aplicarFiltros = (docs) => {
    if (!filtrosAplicados) return docs;

    let resultado = [...docs];
    const { cnpj, dataIni, dataFim, numeroCte, filial } = filtrosAplicados;

    if (cnpj) {
      resultado = resultado.filter((d) =>
        d.cnpj.toLowerCase().includes(cnpj.toLowerCase())
      );
    }

    if (numeroCte) {
      resultado = resultado.filter((d) =>
        d.docto.toLowerCase().includes(numeroCte.toLowerCase())
      );
    }

    if (filial && filial !== "TODAS") {
      // docs.filial é "001" e o select traz algo como "001 - MANTRAN..."
      // então verificamos se a string do select contém o código da filial
      const codFilial = filial.split(" - ")[0];
      resultado = resultado.filter((d) => d.filial === codFilial);
    }

    if (dataIni) {
      resultado = resultado.filter(
        (d) => emissaoToISO(d.emissao) >= dataIni
      );
    }

    if (dataFim) {
      resultado = resultado.filter(
        (d) => emissaoToISO(d.emissao) <= dataFim
      );
    }

    return resultado;
  };

  const availableDocs = aplicarFiltros(baseAvailableDocs);

  const allSelected =
    availableDocs.length > 0 && selectedIds.length === availableDocs.length;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(availableDocs.map((d) => d.id));
    }
  };

  const handleAdicionar = () => {
    const selecionados = availableDocs.filter((d) =>
      selectedIds.includes(d.id)
    );

    if (selecionados.length === 0) return;

    setDocsFatura((prev) => {
      const existentesIds = prev.map((x) => x.id);
      const novos = selecionados
        .filter((d) => !existentesIds.includes(d.id))
        .map((d) => ({
          id: d.id,
          filial: d.filial,
          serie: d.serie,
          tipoDoc: d.tipoDoc,
          docto: d.docto,
          impresso: "N",
          emissao: d.emissao,
          vrMercadoria: d.valor,
          vrFrete: d.valor,
          cnpj: d.cnpj,
          tpCte: d.tpCte,
        }));

      return [...prev, ...novos];
    });

    // limpa seleção dos que foram adicionados
    setSelectedIds((prev) =>
      prev.filter((id) => !selecionados.some((d) => d.id === id))
    );
  };

  const handleRemoverDocFatura = (doc) => {
    const confirmado = window.confirm(
      `Deseja remover o Documento "${doc.docto}" da Fatura?`
    );
    if (!confirmado) return;

    setDocsFatura((prev) => prev.filter((d) => d.id !== doc.id));
  };

  const totalDocs = docsFatura.length;
  const totalFrete = docsFatura.reduce((sum, d) => sum + d.vrFrete, 0);

  const handleFechar = () => {
    if (onUpdateTotais) {
      onUpdateTotais({
        totalTitulo: totalFrete,
        valorLiquido: totalFrete,
      });
    }
    if (onClose) onClose();
  };

  /* =============================
     AÇÕES DE FILTRO (PESQUISAR / LIMPAR)
  ============================== */

  const handlePesquisar = () => {
    setFiltrosAplicados({
      cnpj: filtroCnpj.trim(),
      dataIni: filtroDataIni || null,
      dataFim: filtroDataFim || null,
      numeroCte: filtroNumeroCte.trim(),
      filial: filtroFilial,
    });
    setSelectedIds([]);
  };

  const handleLimpar = () => {
    setFiltroCnpj("50221019000136");
    setFiltroDataIni("");
    setFiltroDataFim("");
    setFiltroNumeroCte("");
    setFiltroFilial("TODAS");
    setFiltrosAplicados(null);
    setSelectedIds([]);
  };

  /* =============================
     RENDER
  ============================== */

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50"
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        className="absolute bg-white rounded-md shadow-2xl w-[1000px] h-[560px] flex flex-col border border-gray-300"
        style={{
          left: pos.x,
          top: pos.y,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* Cabeçalho (área de drag invisível) */}
        <div
          ref={headerRef}
          onMouseDown={startDrag}
          className="cursor-grab select-none flex items-center justify-between px-0 py-1 to-black text-white rounded-t-md"
        ></div>

        {/* Conteúdo */}
        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
          {/* Card 1 */}
          <div className="border border-gray-300 rounded bg-white p-1 flex items-center">
            <Label className="mr-2">Nº Fatura</Label>
            <span className="text-2xl text-blue-600 font-bold">
              {numeroFatura}
            </span>
          </div>

          {/* Cards 2 e 3 */}
          <div className="flex gap-2 h-[170px]">
            {/* Card 2 */}
            <div className="border border-gray-300 rounded bg-white flex-1 flex flex-col">
              <div className="px-2 py-1 bg-gray-50 rounded-t">
                <h2 className="text-red-700 font-semibold text-[13px]">
                  Documentos da Fatura
                </h2>
              </div>

              <div className="flex-1 overflow-auto p-1">
                <table className="w-full text-[11px] border">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="border p-[2px]">Filial</th>
                      <th className="border p-[2px]">Série</th>
                      <th className="border p-[2px]">Tipo Doc</th>
                      <th className="border p-[2px]">Docto</th>
                      <th className="border p-[2px]">Impresso</th>
                      <th className="border p-[2px]">Emissão</th>
                      <th className="border p-[2px]">Vr Mercadoria</th>
                      <th className="border p-[2px]">Vr Frete</th>
                      <th className="border p-[2px]">CPF/CNPJ</th>
                      <th className="border p-[2px]">Tp CTe</th>
                    </tr>
                  </thead>

                  <tbody>
                    {docsFatura.map((d) => (
                      <tr
                        key={d.id}
                        className="hover:bg-green-100 cursor-pointer"
                        onDoubleClick={() => handleRemoverDocFatura(d)}
                        title="Duplo clique para remover da fatura"
                      >
                        <td className="border p-[2px] text-center">
                          {d.filial}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.serie}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.tipoDoc}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.docto}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.impresso}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.emissao}
                        </td>
                        <td className="border p-[2px] text-right">
                          {formatNumero(d.vrMercadoria)}
                        </td>
                        <td className="border p-[2px] text-right">
                          {formatNumero(d.vrFrete)}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.cnpj}
                        </td>
                        <td className="border p-[2px] text-center">
                          {d.tpCte}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Card 3 */}
            <div className="border border-gray-300 rounded bg-white w-[180px] flex flex-col justify-center items-stretch gap-2 p-2">
              <button className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[12px]">
                Teclado CTe
              </button>
              <button className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[12px]">
                Scanner
              </button>
              <button className="border border-gray-300 rounded px-3 py-1 bg-gray-50 hover:bg-gray-100 text-[12px]">
                Teclado NFSe
              </button>
            </div>
          </div>

          {/* Card 4 */}
          <div className="border border-gray-300 rounded bg-white p-2">
            <span className="text-red-700 font-semibold text-[13px]">
              Relação de Documentos para Faturar
            </span>

            <div className="space-y-2 mt-1">
              {/* Linha 1 */}
              <div className="flex items-center gap-2">
                <Label className="w-[70px]">CNPJ/CPF</Label>
                <Sel className="w-[120px]">
                  <option>Cliente</option>
                  <option>Remetente</option>
                </Sel>
                <Txt
                  className="w-[150px]"
                  value={filtroCnpj}
                  onChange={(e) => setFiltroCnpj(e.target.value)}
                />

                <Txt
                  className="flex-1 bg-gray-200"
                  readOnly
                  defaultValue="HNK BR INDUSTRIA DE BEBIDAS LTDA"
                />

                <Label className="w-[50px]">Docto</Label>
                <Sel className="w-[160px]">
                  <option>CTe</option>
                  <option>NFSe</option>
                  <option>Minuta</option>
                </Sel>
              </div>

              {/* Linha 2 */}
              <div className="flex items-center gap-2">
                <Label className="w-[70px]">Período</Label>
                <Txt
                  type="date"
                  className="w-[120px]"
                  value={filtroDataIni || ""}
                  onChange={(e) => setFiltroDataIni(e.target.value)}
                />
                <span>Até</span>
                <Txt
                  type="date"
                  className="w-[120px]"
                  value={filtroDataFim || ""}
                  onChange={(e) => setFiltroDataFim(e.target.value)}
                />

                <Label className="w-[30px] ml-[20px]">Filial</Label>
                <Sel
                  className="w-[300px]"
                  value={filtroFilial}
                  onChange={(e) => setFiltroFilial(e.target.value)}
                >
                  <option value="TODAS">TODAS</option>
                  <option value="001 - MANTRAN TECNOLOGIAS LTDA ME">
                    001 - MANTRAN TECNOLOGIAS LTDA ME
                  </option>
                  <option value="002 - MANTRAN TECNOLOGIAS FILIAL">
                    002 - MANTRAN TECNOLOGIAS FILIAL
                  </option>
                </Sel>
                <Label className="w-[40px] ml-[10px]">Padrão</Label>
                <Sel className="w-[160px] ml-[10px]">
                  <option>001 - HEINEKEN</option>
                </Sel>
              </div>

              {/* Linha 3 */}
              <div className="flex items-center gap-2">
                <Label className="w-[70px]">Pré Fatura</Label>
                <Txt className="w-[120px]" />

                <Label className="w-[40px]">Viagem</Label>
                <Txt className="w-[100px]" />

                <Label className="w-[50px] ml-[20px]">Divisão</Label>
                <Sel className="w-[280px]">
                  <option>0004 - REFRIGERADO</option>
                </Sel>
              </div>

              {/* Linha 4 */}
              <div className="flex items-center gap-2">
                <Label className="w-[70px]">Nº CTe</Label>
                <Txt
                  className="w-[100px]"
                  value={filtroNumeroCte}
                  onChange={(e) => setFiltroNumeroCte(e.target.value)}
                />

                <label className="flex items-center gap-1 text-[12px]">
                  <input type="checkbox" className="accent-red-700" />
                  Filtrar Entrega
                </label>

                <Label className="ml-[80px]">Grupo Econômico</Label>
                <Sel className="w-[250px]">
                  <option>001 - HEINEKEN</option>
                </Sel>
                <div className="flex gap-2 ml-auto">
                  <button
                    className="border border-gray-300 rounded px-3 py-[4px] text-[12px] bg-gray-50 hover:bg-gray-100"
                    onClick={handleLimpar}
                  >
                    Limpar
                  </button>
                  <button
                    className="border border-gray-300 rounded px-3 py-[4px] text-[12px] bg-gray-50 hover:bg-gray-100"
                    onClick={handlePesquisar}
                  >
                    Pesquisar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 */}
          <div className="border border-gray-300 rounded bg-white p-2 flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] border">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="border p-[2px]">Chk</th>
                    <th className="border p-[2px]">Nº Docto</th>
                    <th className="border p-[2px]">CNPJ/CPF</th>
                    <th className="border p-[2px]">Razão</th>
                    <th className="border p-[2px]">Cidade</th>
                    <th className="border p-[2px]">Emissão</th>
                    <th className="border p-[2px]">Filial</th>
                    <th className="border p-[2px]">Tipo Doc</th>
                    <th className="border p-[2px]">Valor</th>
                    <th className="border p-[2px]">Tp CTe</th>
                    <th className="border p-[2px]">Série</th>
                  </tr>
                </thead>

                <tbody>
                  {availableDocs.map((d) => (
                    <tr key={d.id} className="hover:bg-green-50">
                      <td className="border p-[2px] text-center">
                        <input
                          type="checkbox"
                          className="accent-red-700 cursor-pointer"
                          checked={selectedIds.includes(d.id)}
                          onChange={() => toggleSelect(d.id)}
                        />
                      </td>
                      <td className="border p-[2px] text-center">{d.docto}</td>
                      <td className="border p-[2px] text-center">{d.cnpj}</td>
                      <td className="border p-[2px]">{d.razao}</td>
                      <td className="border p-[2px] text-center">
                        {d.cidade}
                      </td>
                      <td className="border p-[2px] text-center">
                        {d.emissao}
                      </td>
                      <td className="border p-[2px] text-center">
                        {d.filial}
                      </td>
                      <td className="border p-[2px] text-center">
                        {d.tipoDoc}
                      </td>
                      <td className="border p-[2px] text-right">
                        {formatNumero(d.valor)}
                      </td>
                      <td className="border p-[2px] text-center">{d.tpCte}</td>
                      <td className="border p-[2px] text-center">{d.serie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 px-3 py-2 flex items-center justify-between bg-white">
          {/* ESQUERDA – TOTAIS */}
          <div className="flex gap-4 items-center">
            <div>
              <Label>Total Documentos</Label>
              <input
                type="text"
                readOnly
                value={totalDocs}
                className="border border-gray-300 rounded px-2 py-[3px] h-[26px] text-[13px] bg-gray-100 w-[120px] text-center"
              />
            </div>

            <div>
              <Label>Total Frete</Label>
              <input
                type="text"
                readOnly
                value={formatNumero(totalFrete)}
                className="border border-gray-300 rounded px-2 py-[3px] h-[26px] text-[13px] bg-gray-100 w-[120px] text-center"
              />
            </div>
          </div>

          {/* MEIO – AÇÕES */}
          <div className="flex gap-2">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
            >
              <XCircle size={14} className="text-red-700" />
              {allSelected ? "Limpar Seleção" : "Selecionar Todos"}
            </button>

            <button
              onClick={handleAdicionar}
              className="flex items-center gap-1 border border-gray-300 rounded px-3 py-[4px] bg-gray-50 hover:bg-gray-100 text-[12px]"
            >
              <XCircle size={14} className="text-red-700" />
              Adicionar
            </button>
          </div>

          {/* DIREITA – FECHAR */}
          <div>
            <button
              onClick={handleFechar}
              className="border border-gray-300 rounded px-4 py-[4px] bg-red-700 text-white hover:bg-red-800 text-[13px] flex items-center gap-1"
            >
              <XCircle size={18} />
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
