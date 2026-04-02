import { useState } from "react";
import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* ===============================
   Helpers
================================ */
function Label({ children, col = 2, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 col-span-${col} flex items-center ${className}`}
    >
      {children}
    </label>
  );
}

function Txt({ col = 3, readOnly = false, className = "", ...rest }) {
  return (
    <input
      {...rest}
      readOnly={readOnly}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full col-span-${col} ${readOnly ? "bg-gray-200" : ""
        } ${className}`}
    />
  );
}

function Sel({ col = 3, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full col-span-${col} ${className}`}
    />
  );
}

/* ===============================
   Componente Principal
================================ */
export default function EventoDespesa({ open, onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  // Lista mockada
  const [lista, setLista] = useState([
    {
      codigo: "0001",
      descricao: "DESPESAS DIVERSAS VIAGEM",
      valor: "0,00",
      dc: "D",
      categoria: "1000 - DESPESAS ADMINISTRATIVAS",
      subcategoria: "1001 - COMBUSTÍVEL",
      percFrete: "0,00",
      abastec: "S",
      inss: "N",
      sestSenat: "N",
      inserirAuto: "N",
      tipoPagtoCod: "",
      tipoPagtoDesc: "",
      padraoAdiantamento: "N",
      adiantamentoCiot: "N",
    },
  ]);

  /* ===============================
      ESTADO PRINCIPAL
  =============================== */
  const [dados, setDados] = useState({
    codigo: "",
    descricao: "",
    valor: "",
    dc: "D",
    categoriaCod: "1000",
    categoriaDesc: "DESPESAS ADMINISTRATIVAS",
    subcategoriaCod: "",
    subcategoriaDesc: "",
    percFrete: "",
    abastec: false,
    inss: false,
    sestSenat: false,

    // NOVOS CAMPOS
    inserirAuto: false,
    tipoPagtoCod: "",
    tipoPagtoDesc: "",
    padraoAdiantamento: false,
    adiantamentoCiot: false,
  });

  const limpar = () => {
    setDados({
      codigo: "",
      descricao: "",
      valor: "",
      dc: "D",
      categoriaCod: "1000",
      categoriaDesc: "DESPESAS ADMINISTRATIVAS",
      subcategoriaCod: "",
      subcategoriaDesc: "",
      percFrete: "",
      abastec: false,
      inss: false,
      sestSenat: false,

      // NOVOS CAMPOS
      inserirAuto: false,
      tipoPagtoCod: "",
      tipoPagtoDesc: "",
      padraoAdiantamento: false,
      adiantamentoCiot: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDados((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const incluir = () => {
    if (!dados.codigo || !dados.descricao) {
      alert("Informe Código e Descrição do evento.");
      return;
    }

    const novo = {
      codigo: dados.codigo,
      descricao: dados.descricao,
      valor: dados.valor || "0,00",
      dc: dados.dc,
      categoria: `${dados.categoriaCod} - ${dados.categoriaDesc}`,
      subcategoria:
        dados.subcategoriaCod && dados.subcategoriaDesc
          ? `${dados.subcategoriaCod} - ${dados.subcategoriaDesc}`
          : "",
      percFrete: dados.percFrete || "0,00",
      abastec: dados.abastec ? "S" : "N",
      inss: dados.inss ? "S" : "N",
      sestSenat: dados.sestSenat ? "S" : "N",

      // NOVOS CAMPOS
      inserirAuto: dados.inserirAuto ? "S" : "N",
      tipoPagtoCod: dados.tipoPagtoCod,
      tipoPagtoDesc: dados.tipoPagtoDesc,
      padraoAdiantamento: dados.padraoAdiantamento ? "S" : "N",
      adiantamentoCiot: dados.adiantamentoCiot ? "S" : "N",
    };

    setLista((prev) => [...prev, novo]);
    limpar();
  };

  const alterar = () => {
    if (!dados.codigo) return;

    setLista((prev) =>
      prev.map((l) =>
        l.codigo === dados.codigo
          ? {
            ...l,
            descricao: dados.descricao,
            valor: dados.valor || "0,00",
            dc: dados.dc,
            categoria: `${dados.categoriaCod} - ${dados.categoriaDesc}`,
            subcategoria:
              dados.subcategoriaCod && dados.subcategoriaDesc
                ? `${dados.subcategoriaCod} - ${dados.subcategoriaDesc}`
                : "",
            percFrete: dados.percFrete || "0,00",
            abastec: dados.abastec ? "S" : "N",
            inss: dados.inss ? "S" : "N",
            sestSenat: dados.sestSenat ? "S" : "N",

            // NOVOS CAMPOS
            inserirAuto: dados.inserirAuto ? "S" : "N",
            tipoPagtoCod: dados.tipoPagtoCod,
            tipoPagtoDesc: dados.tipoPagtoDesc,
            padraoAdiantamento: dados.padraoAdiantamento ? "S" : "N",
            adiantamentoCiot: dados.adiantamentoCiot ? "S" : "N",
          }
          : l
      )
    );
  };

  const excluir = () => {
    setLista((prev) => prev.filter((l) => l.codigo !== dados.codigo));
    limpar();
  };

  const handleFechar = () => {
    if (onClose) onClose();
    else window.history.back();
  };

  const selecionar = (item) => {
    const [catCod = "", catDesc = ""] = (item.categoria || "").split(" - ");
    const [subCod = "", subDesc = ""] = (item.subcategoria || "").split(" - ");

    setDados({
      codigo: item.codigo,
      descricao: item.descricao,
      valor: item.valor,
      dc: item.dc || "D",
      categoriaCod: catCod,
      categoriaDesc: catDesc,
      subcategoriaCod: subCod,
      subcategoriaDesc: subDesc,
      percFrete: item.percFrete,
      abastec: item.abastec === "S",
      inss: item.inss === "S",
      sestSenat: item.sestSenat === "S",

      // NOVOS CAMPOS
      inserirAuto: item.inserirAuto === "S",
      tipoPagtoCod: item.tipoPagtoCod || "",
      tipoPagtoDesc: item.tipoPagtoDesc || "",
      padraoAdiantamento: item.padraoAdiantamento === "S",
      adiantamentoCiot: item.adiantamentoCiot === "S",
    });
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
        }`}
    >
      <div className="bg-white border border-gray-300 shadow p-4 rounded flex-1 flex flex-col">

        {/* TÍTULO */}
        <h2 className="text-center text-red-700 font-bold text-lg mb-4">
          CADASTRO EVENTOS DESPESAS
        </h2>

        {/* ===============================
            CONTEÚDO
        =============================== */}
        <div className="flex-1 flex flex-col gap-3">

          {/* CARD 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            {/* ===============================
                LINHA 1
            =============================== */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={1}>Evento</Label>
              <Txt col={1} name="codigo" readOnly value={dados.codigo} onChange={handleChange} />


              <Txt col={4} name="descricao" value={dados.descricao} onChange={handleChange} />


              <div className="col-span-4 flex items-center gap-2 ml-2">
                <input
                  type="checkbox"
                  name="inserirAuto"
                  checked={dados.inserirAuto}
                  onChange={handleChange}
                />
                <span className="text-[12px]">Inserir este evento automaticamente</span>
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="padraoAdiantamento"
                  checked={dados.padraoAdiantamento}
                  onChange={handleChange}
                />
                <span className="text-[12px]">Evento Padrão de Adiantamento</span>
              </div>
            </div>


            {/* ===============================
                LINHA 2
            =============================== */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={1}>Categoria</Label>
              <Txt col={1} name="categoriaCod" value={dados.categoriaCod} onChange={handleChange} />
              <Txt col={4} name="categoriaDesc" value={dados.categoriaDesc} onChange={handleChange} />

              <Label col={1}>Subcategoria</Label>
              <Txt col={1} name="subcategoriaCod" value={dados.subcategoriaCod} onChange={handleChange} />
              <Txt col={4} name="subcategoriaDesc" value={dados.subcategoriaDesc} onChange={handleChange} />
            </div>

            {/* ===============================
                LINHA 3
            =============================== */}
            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={1}>Valor Evento</Label>
              <Txt col={1} name="valor" value={dados.valor} onChange={handleChange} />

              <Label col={1}>% Frete</Label>
              <Txt col={1} name="percFrete" value={dados.percFrete} onChange={handleChange} />

              <Label col={1}>D/C</Label>
              <Sel name="dc" col={1} value={dados.dc} onChange={handleChange}>
                <option value="D">D</option>
                <option value="C">C</option>
              </Sel>

              {/* NOVO CAMPO - TIPO PAGTO */}
              <Label col={1}>Tipo Pagto</Label>
              <Txt col={1} name="tipoPagtoCod" value={dados.tipoPagtoCod} onChange={handleChange} />
              <Txt col={4} name="tipoPagtoDesc" value={dados.tipoPagtoDesc} onChange={handleChange} />
            </div>

            {/* ===============================
                LINHA 4 – FLAGS
            =============================== */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-3 flex items-center gap-2">
                <input type="checkbox" name="abastec" checked={dados.abastec} onChange={handleChange} />
                <span className="text-[12px]">Evento de Abastecimento</span>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <input type="checkbox" name="inss" checked={dados.inss} onChange={handleChange} />
                <span className="text-[12px]">Incide INSS</span>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <input type="checkbox" name="sestSenat" checked={dados.sestSenat} onChange={handleChange} />
                <span className="text-[12px]">Incide SEST/SENAT</span>
              </div>



              <div className="col-span-3 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="adiantamentoCiot"
                  checked={dados.adiantamentoCiot}
                  onChange={handleChange}
                />
                <span className="text-[12px]">Adiantamento CIOT</span>
              </div>
            </div>
          </fieldset>

          {/* ===============================
              GRID
          =============================== */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Eventos
            </legend>

            <div className="border border-gray-300 rounded max-h-[360px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">Cód.</th>
                    <th className="border px-2 py-1">Descrição</th>
                    <th className="border px-2 py-1">Valor</th>
                    <th className="border px-2 py-1">D/C</th>
                    <th className="border px-2 py-1">Categoria</th>
                    <th className="border px-2 py-1">Subcategoria</th>
                    <th className="border px-2 py-1">% Frete</th>
                    <th className="border px-2 py-1">Abast.</th>
                    <th className="border px-2 py-1">INSS</th>
                    <th className="border px-2 py-1">SEST/SENAT</th>
                  </tr>
                </thead>

                <tbody>
                  {lista.map((item, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(item)}
                    >
                      <td className="border px-2 py-1">{item.codigo}</td>
                      <td className="border px-2 py-1">{item.descricao}</td>
                      <td className="border px-2 py-1 text-right">{item.valor}</td>
                      <td className="border px-2 py-1 text-center">{item.dc}</td>
                      <td className="border px-2 py-1">{item.categoria}</td>
                      <td className="border px-2 py-1">{item.subcategoria}</td>
                      <td className="border px-2 py-1 text-right">{item.percFrete}</td>
                      <td className="border px-2 py-1 text-center">{item.abastec}</td>
                      <td className="border px-2 py-1 text-center">{item.inss}</td>
                      <td className="border px-2 py-1 text-center">{item.sestSenat}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>


      </div>
      {/* ===============================
            RODAPÉ
        =============================== */}
      <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6 mt-3">
        <button
          onClick={handleFechar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={limpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={incluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={alterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={excluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}
