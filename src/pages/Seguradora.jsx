// src/pages/Seguradora.jsx
import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  Users,
  Package,
  MapPin,
  Layers,
  Route,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* =========================
   Helpers
========================= */
function Label({ children, col = 3, start, className = "" }) {
  return (
    <label
      className={`
        text-[12px] text-gray-700 
        col-span-${col} 
        ${start ? `col-start-${start}` : ""}
        flex items-center
        ${className}
      `}
    >
      {children}
    </label>
  );
}

function Txt({ col = 3, start, className = "", ...rest }) {
  return (
    <input
      {...rest}
      className={`
        border border-gray-300 rounded px-1 h-[26px] text-[13px]
        col-span-${col}
        ${start ? `col-start-${start}` : ""}
        ${className}
      `}
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

/* =========================
   Modal: Grupo Mercadoria
========================= */
function GrupoMercadoriaModal({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    { codigo: "1", descricao: "ELETRODOMÉSTICOS", valorCobertura: "5,00" },
    { codigo: "2", descricao: "BOLSAS", valorCobertura: "1,00" },
  ]);

  const [dados, setDados] = useState({
    codigo: "",
    descricao: "",
    valorCobertura: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () => {
    setDados({ codigo: "", descricao: "", valorCobertura: "" });
  };

  const incluir = () => {
    if (!dados.codigo || !dados.descricao) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((g) => (g.codigo === dados.codigo ? dados : g))
    );
  };

  const excluir = () => {
    setLista((prev) => prev.filter((g) => g.codigo !== dados.codigo));
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white border border-gray-300 rounded shadow-lg w-[900px] max-h-[80vh] flex flex-col">
        <h2 className="text-center text-red-700 font-bold text-lg py-2 border-b border-gray-300">
          GRUPOS DE MERCADORIA
        </h2>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={2}>Código Grupo</Label>
              <Txt
                col={2}
                name="codigo"
                value={dados.codigo}
                onChange={handleChange}
              />

              <Label col={2}>Valor Máx. Indeniza</Label>
              <Txt
                col={2}
                name="valorCobertura"
                value={dados.valorCobertura}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <Label col={2}>Descrição do Grupo</Label>
              <Txt
                col={8}
                name="descricao"
                value={dados.descricao}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Card 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Grupos Cadastrados
            </legend>

            <div className="border border-gray-300 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">Código</th>
                    <th className="border px-2 py-1">Descrição Grupo</th>
                    <th className="border px-2 py-1">Valor Cobertura</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((g, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(g)}
                    >
                      <td className="border px-2 py-1">{g.codigo}</td>
                      <td className="border px-2 py-1">{g.descricao}</td>
                      <td className="border px-2 py-1 text-right">
                        {g.valorCobertura}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          <button
            onClick={onClose}
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
    </div>
  );
}

/* =========================
   Modal: Mercadorias Apólice
========================= */
function MercadoriasApoliceModal({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    {
      grupo: "2 - BOLSAS",
      produtoSeguradora: "1",
      codProduto: "0000",
      descProduto: "DIVERSOS",
    },
  ]);

  const [dados, setDados] = useState({
    grupo: "2 - BOLSAS",
    produtoSeguradora: "",
    codProduto: "",
    descProduto: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () => {
    setDados({
      grupo: "2 - BOLSAS",
      produtoSeguradora: "",
      codProduto: "",
      descProduto: "",
    });
  };

  const incluir = () => {
    if (!dados.grupo || !dados.codProduto) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((m) =>
        m.grupo === dados.grupo && m.codProduto === dados.codProduto
          ? dados
          : m
      )
    );
  };

  const excluir = () => {
    setLista((prev) =>
      prev.filter(
        (m) =>
          !(m.grupo === dados.grupo && m.codProduto === dados.codProduto)
      )
    );
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white border border-gray-300 rounded shadow-lg w-[900px] max-h-[80vh] flex flex-col">
        <h2 className="text-center text-red-700 font-bold text-lg py-2 border-b border-gray-300">
          MERCADORIAS APÓLICE
        </h2>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={2}>Grupo Mercadoria</Label>
              <Sel
                col={3}
                name="grupo"
                value={dados.grupo}
                onChange={handleChange}
                className="w-full"
              >
                <option>1 - ELETRODOMÉSTICOS</option>
                <option>2 - BOLSAS</option>
                <option>3 - DIVERSOS</option>
              </Sel>

              <Label col={3}>Cód. Produto Seguradora</Label>
              <Txt
                col={2}
                name="produtoSeguradora"
                value={dados.produtoSeguradora}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <Label col={2}>Produto</Label>
              <Txt
                col={3}
                name="codProduto"
                value={dados.codProduto}
                onChange={handleChange}
              />
              <Txt
                col={5}
                name="descProduto"
                value={dados.descProduto}
                onChange={handleChange}
                readOnly
              />
            </div>
          </fieldset>

          {/* Card 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Mercadorias da Apólice
            </legend>

            <div className="border border-gray-300 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">Grupo Mercadoria</th>
                    <th className="border px-2 py-1">
                      Cód. Produto Seguradora
                    </th>
                    <th className="border px-2 py-1">Cód. Produto</th>
                    <th className="border px-2 py-1">Descrição Produto</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((m, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(m)}
                    >
                      <td className="border px-2 py-1">{m.grupo}</td>
                      <td className="border px-2 py-1 text-right">
                        {m.produtoSeguradora}
                      </td>
                      <td className="border px-2 py-1">{m.codProduto}</td>
                      <td className="border px-2 py-1">{m.descProduto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          <button
            onClick={onClose}
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
    </div>
  );
}

/* =========================
   Modal: Clientes Excluídos
========================= */
function ClientesExcluidosModal({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    {
      codigo: "1",
      cnpj: "50221019000136",
      razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
    },
  ]);

  const [dados, setDados] = useState({
    codigo: "",
    cnpj: "",
    razao: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () => setDados({ codigo: "", cnpj: "", razao: "" });

  const incluir = () => {
    if (!dados.codigo || !dados.cnpj) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((c) => (c.codigo === dados.codigo ? dados : c))
    );
  };

  const excluir = () => {
    setLista((prev) => prev.filter((c) => c.codigo !== dados.codigo));
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white border border-gray-300 rounded shadow-lg w-[900px] max-h-[80vh] flex flex-col">
        <h2 className="text-center text-red-700 font-bold text-lg py-2 border-b border-gray-300">
          CLIENTES EXCLUÍDOS APÓLICE
        </h2>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={2}>Código</Label>
              <Txt
                col={3}
                name="codigo"
                value={dados.codigo}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <Label col={2}>Cliente</Label>
              <Txt
                col={3}
                name="cnpj"
                value={dados.cnpj}
                onChange={handleChange}
              />
              <Txt
                col={5}
                name="razao"
                value={dados.razao}
                readOnly
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Card 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Clientes Vinculados
            </legend>

            <div className="border border-gray-300 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">Código Cliente</th>
                    <th className="border px-2 py-1">CNPJ / CPF</th>
                    <th className="border px-2 py-1">Razão Social</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((c, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(c)}
                    >
                      <td className="border px-2 py-1">{c.codigo}</td>
                      <td className="border px-2 py-1">{c.cnpj}</td>
                      <td className="border px-2 py-1">{c.razao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          <button
            onClick={onClose}
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
    </div>
  );
}

/* =========================
   Modal: Região Urbana
========================= */
function RegiaoUrbanaModal({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    {
      cepOrigem: "13010000",
      cidadeOrigem: "CAMPINAS",
      ufOrigem: "SP",
      cepDestino: "13280001",
      cidadeDestino: "VINHEDO",
      ufDestino: "SP",
    },
  ]);

  const [dados, setDados] = useState({
    cepOrigem: "",
    cidadeOrigem: "",
    ufOrigem: "",
    cepDestino: "",
    cidadeDestino: "",
    ufDestino: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () =>
    setDados({
      cepOrigem: "",
      cidadeOrigem: "",
      ufOrigem: "",
      cepDestino: "",
      cidadeDestino: "",
      ufDestino: "",
    });

  const incluir = () => {
    if (!dados.cepOrigem || !dados.cepDestino) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((r) =>
        r.cepOrigem === dados.cepOrigem && r.cepDestino === dados.cepDestino
          ? dados
          : r
      )
    );
  };

  const excluir = () => {
    setLista((prev) =>
      prev.filter(
        (r) =>
          !(
            r.cepOrigem === dados.cepOrigem &&
            r.cepDestino === dados.cepDestino
          )
      )
    );
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white border border-gray-300 rounded shadow-lg w-[950px] max-h-[80vh] flex flex-col">
        <h2 className="text-center text-red-700 font-bold text-lg py-2 border-b border-gray-300">
          REGIÕES URBANAS
        </h2>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={2}>Cidade Origem</Label>
              <Txt
                col={2}
                name="cepOrigem"
                value={dados.cepOrigem}
                onChange={handleChange}
              />
              <Txt
                col={5}
                name="cidadeOrigem"
                value={dados.cidadeOrigem}
                readOnly
                onChange={handleChange}
              />
              <Txt
                col={1}
                name="ufOrigem"
                value={dados.ufOrigem}
                readOnly
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <Label col={2}>Cidade Destino</Label>
              <Txt
                col={2}
                name="cepDestino"
                value={dados.cepDestino}
                onChange={handleChange}
              />
              <Txt
                col={5}
                name="cidadeDestino"
                value={dados.cidadeDestino}
                readOnly
                onChange={handleChange}
              />
              <Txt
                col={1}
                name="ufDestino"
                value={dados.ufDestino}
                readOnly
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Card 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Regiões Cadastradas
            </legend>

            <div className="border border-gray-300 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">CEP Origem</th>
                    <th className="border px-2 py-1">Cidade Origem</th>
                    <th className="border px-2 py-1">UF</th>
                    <th className="border px-2 py-1">CEP Destino</th>
                    <th className="border px-2 py-1">Cidade Destino</th>
                    <th className="border px-2 py-1">UF</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((r, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(r)}
                    >
                      <td className="border px-2 py-1">{r.cepOrigem}</td>
                      <td className="border px-2 py-1">{r.cidadeOrigem}</td>
                      <td className="border px-2 py-1 text-center">
                        {r.ufOrigem}
                      </td>
                      <td className="border px-2 py-1">{r.cepDestino}</td>
                      <td className="border px-2 py-1">{r.cidadeDestino}</td>
                      <td className="border px-2 py-1 text-center">
                        {r.ufDestino}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          <button
            onClick={onClose}
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
    </div>
  );
}

/* =========================
   Modal: Percurso
========================= */
const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

function PercursoModal({ onClose }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    { ufOrigem: "PI", ufDestino: "AL", rctrc: "1,0000", rcf: "2,0000", tn: "12,0000" },
  ]);

  const [dados, setDados] = useState({
    ufOrigem: "SP",
    ufDestino: "RJ",
    rctrc: "",
    rcf: "",
    tn: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () =>
    setDados({
      ufOrigem: "SP",
      ufDestino: "RJ",
      rctrc: "",
      rcf: "",
      tn: "",
    });

  const incluir = () => {
    if (!dados.ufOrigem || !dados.ufDestino) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((p) =>
        p.ufOrigem === dados.ufOrigem && p.ufDestino === dados.ufDestino
          ? dados
          : p
      )
    );
  };

  const excluir = () => {
    setLista((prev) =>
      prev.filter(
        (p) =>
          !(
            p.ufOrigem === dados.ufOrigem &&
            p.ufDestino === dados.ufDestino
          )
      )
    );
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white border border-gray-300 rounded shadow-lg w-[900px] max-h-[80vh] flex flex-col">
        <h2 className="text-center text-red-700 font-bold text-lg py-2 border-b border-gray-300">
          PERCURSOS
        </h2>

        <div className="flex-1 p-3 flex flex-col gap-3 overflow-y-auto">
          {/* Card 1 */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="grid grid-cols-12 gap-2 mb-2">
              <Label col={2}>UF Origem</Label>
              <Sel
                col={3}
                name="ufOrigem"
                value={dados.ufOrigem}
                onChange={handleChange}
                className="w-full"
              >
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Sel>

              <Label col={2}>Taxa RCTR-C</Label>
              <Txt
                col={2}
                name="rctrc"
                value={dados.rctrc}
                onChange={handleChange}
              />

              <Label col={1}>Taxa TN</Label>
              <Txt col={2} name="tn" value={dados.tn} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-12 gap-2">
              <Label col={2}>UF Destino</Label>
              <Sel
                col={3}
                name="ufDestino"
                value={dados.ufDestino}
                onChange={handleChange}
                className="w-full"
              >
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Sel>

              <Label col={2}>Taxa RCF-DC</Label>
              <Txt
                col={2}
                name="rcf"
                value={dados.rcf}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          {/* Card 2 - Grid */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Percursos Cadastrados
            </legend>

            <div className="border border-gray-300 rounded max-h-[260px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="border px-2 py-1">UF Origem</th>
                    <th className="border px-2 py-1">UF Destino</th>
                    <th className="border px-2 py-1">RCTR-C</th>
                    <th className="border px-2 py-1">RCF-DC</th>
                    <th className="border px-2 py-1">TN</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((p, idx) => (
                    <tr
                      key={idx}
                      className="cursor-pointer hover:bg-red-50"
                      onClick={() => selecionar(p)}
                    >
                      <td className="border px-2 py-1 text-center">
                        {p.ufOrigem}
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {p.ufDestino}
                      </td>
                      <td className="border px-2 py-1 text-right">{p.rctrc}</td>
                      <td className="border px-2 py-1 text-right">{p.rcf}</td>
                      <td className="border px-2 py-1 text-right">{p.tn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>

        {/* Rodapé */}
        <div className="border-t border-gray-300 bg-white py-2 px-4 flex items-center gap-6">
          <button
            onClick={onClose}
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
    </div>
  );
}

/* =========================
   Tela Principal: Seguradora
========================= */
export default function Seguradora({ open }) {
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState([
    {
      codigo: "000",
      nome: "POR CONTA DO CLIENTE",
      cnpj: "00000000000000",
      cidade: "SAO PAULO",
      uf: "SP",
      cep: "04013001",
      fone: "1130000000",
      apolice: "000000000000",
      vencimento: "2025-11-28",
      agravacao: "0,00",
      cobertura: "0,00",
      fat: "0,00",
    },
  ]);

  const [dados, setDados] = useState({
    codigo: "",
    nome: "",
    cnpj: "",
    cidade: "",
    uf: "",
    cep: "",
    apolice: "",
    vencimento: "",
    fone: "",
    agravacao: "",
    cobertura: "",
    fat: "",
  });

  // Modais
  const [showGrupo, setShowGrupo] = useState(false);
  const [showMercadorias, setShowMercadorias] = useState(false);
  const [showClientes, setShowClientes] = useState(false);
  const [showRegiao, setShowRegiao] = useState(false);
  const [showPercurso, setShowPercurso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDados((prev) => ({ ...prev, [name]: value }));
  };

  const limpar = () => {
    setDados({
      codigo: "",
      nome: "",
      cnpj: "",
      cidade: "",
      uf: "",
      cep: "",
      apolice: "",
      vencimento: "",
      fone: "",
      agravacao: "",
      cobertura: "",
      fat: "",
    });
  };

  const incluir = () => {
    if (!dados.codigo || !dados.nome) return;
    setLista((prev) => [...prev, dados]);
    limpar();
  };

  const alterar = () => {
    setLista((prev) =>
      prev.map((s) => (s.codigo === dados.codigo ? dados : s))
    );
  };

  const excluir = () => {
    setLista((prev) => prev.filter((s) => s.codigo !== dados.codigo));
    limpar();
  };

  const selecionar = (item) => {
    setDados(item);
  };

  const handleFechar = () => {
    window.history.back();
  };

  return (
    <>
      <div
        className={`transition-all duration-300 mt-[44px] text-[13px] bg-gray-50 h-[calc(100vh-56px)] flex flex-col ${open ? "ml-[192px]" : "ml-[56px]"
          }`}
      >
        <div className="bg-white border border-gray-300 shadow p-4 rounded flex-1 flex flex-col">
          {/* Título */}
          <h2 className="text-center text-red-700 font-bold text-lg mb-4">
            SEGURADORA
          </h2>

          <div className="flex-1 flex flex-col gap-3">
            {/* Card 1 - Parâmetros */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Parâmetros
              </legend>

              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label col={1}>Código</Label>
                <Txt
                  col={2}
                  name="codigo"
                  readOnly
                  value={dados.codigo}
                  onChange={handleChange}
                />

                <Label col={1}>Nome</Label>
                <Txt
                  col={6}
                  name="nome"
                  value={dados.nome}
                  onChange={handleChange}
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label col={1}>CNPJ/CPF</Label>
                <Txt
                  col={2}
                  name="cnpj"
                  value={dados.cnpj}
                  onChange={handleChange}
                />

                <Label col={1}>Cidade</Label>
                <Txt
                  col={5}
                  name="cidade"
                  value={dados.cidade}
                  onChange={handleChange}
                />

                <Txt
                  col={1}
                  name="uf"
                  readOnly
                  value={dados.uf}
                  onChange={handleChange}
                />
              </div>

              {/* Linha 3 */}
              <div className="grid grid-cols-12 gap-2 mb-2">
                <Label col={1}>CEP</Label>
                <Txt
                  col={2}
                  name="cep"
                  value={dados.cep}
                  onChange={handleChange}
                />

                <Label col={1}>Nº Apólice</Label>
                <Txt
                  col={2}
                  name="apolice"
                  value={dados.apolice}
                  onChange={handleChange}
                />

                <Label col={1}>Vencimento</Label>
                <Txt
                  col={2}
                  type="date"
                  name="vencimento"
                  value={dados.vencimento}
                  onChange={handleChange}
                />
              </div>

              {/* Linha 4 */}
              <div className="grid grid-cols-12 gap-2">
                <Label col={1}>Fone</Label>
                <Txt
                  col={2}
                  name="fone"
                  value={dados.fone}
                  onChange={handleChange}
                />

                <Label col={1}>% Agravação</Label>
                <Txt
                  col={2}
                  name="agravacao"
                  value={dados.agravacao}
                  onChange={handleChange}
                />

                <Label col={1}>Valor Cobertura</Label>
                <Txt
                  col={2}
                  name="cobertura"
                  value={dados.cobertura}
                  onChange={handleChange}
                />

                <Label col={1}>Índice FAT</Label>
                <Txt
                  col={1}
                  name="fat"
                  value={dados.fat}
                  onChange={handleChange}
                />
              </div>
            </fieldset>

            {/* Card 2 - Botões auxiliares */}
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Funções Relacionadas
              </legend>

              <div className="grid grid-cols-12 gap-2">
                <button
                  onClick={() => setShowGrupo(true)}
                  className="col-span-3 flex items-center justify-center gap-2 border border-gray-300 rounded py-1 text-[12px] text-red-700 hover:bg-red-50"
                >
                  <Layers size={16} />
                  Grupo Mercadoria
                </button>

                <button
                  onClick={() => setShowMercadorias(true)}
                  className="col-span-3 flex items-center justify-center gap-2 border border-gray-300 rounded py-1 text-[12px] text-red-700 hover:bg-red-50"
                >
                  <Package size={16} />
                  Mercadorias
                </button>

                <button
                  onClick={() => setShowClientes(true)}
                  className="col-span-3 flex items-center justify-center gap-2 border border-gray-300 rounded py-1 text-[12px] text-red-700 hover:bg-red-50"
                >
                  <Users size={16} />
                  Clientes
                </button>

                <button
                  onClick={() => setShowRegiao(true)}
                  className="col-span-3 flex items-center justify-center gap-2 border border-gray-300 rounded py-1 text-[12px] text-red-700 hover:bg-red-50"
                >
                  <MapPin size={16} />
                  Região Urbana
                </button>
              </div>
            </fieldset>

            {/* Card 3 - Grid principal */}
            <fieldset className="border border-gray-300 rounded p-3 flex-1 flex flex-col">
              <legend className="text-red-700 font-semibold text-[13px] px-2">
                Seguradoras Cadastradas
              </legend>

              <div className="border border-gray-300 rounded flex-1 overflow-y-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="border px-2 py-1">Código</th>
                      <th className="border px-2 py-1">CGC/CPF</th>
                      <th className="border px-2 py-1">Nome</th>
                      <th className="border px-2 py-1">Cidade</th>
                      <th className="border px-2 py-1">UF</th>
                      <th className="border px-2 py-1">CEP</th>
                      <th className="border px-2 py-1">Fone</th>
                      <th className="border px-2 py-1">% Agravação</th>
                      <th className="border px-2 py-1">Cobertura</th>
                      <th className="border px-2 py-1">Vencimento</th>
                      <th className="border px-2 py-1">FAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((s, idx) => (
                      <tr
                        key={idx}
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => selecionar(s)}
                      >
                        <td className="border px-2 py-1">{s.codigo}</td>
                        <td className="border px-2 py-1">{s.cnpj}</td>
                        <td className="border px-2 py-1">{s.nome}</td>
                        <td className="border px-2 py-1">{s.cidade}</td>
                        <td className="border px-2 py-1 text-center">
                          {s.uf}
                        </td>
                        <td className="border px-2 py-1">{s.cep}</td>
                        <td className="border px-2 py-1">{s.fone}</td>
                        <td className="border px-2 py-1 text-right">
                          {s.agravacao}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {s.cobertura}
                        </td>
                        <td className="border px-2 py-1">
                          {s.vencimento &&
                            new Date(s.vencimento).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {s.fat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          </div>


        </div>
        {/* Rodapé principal */}
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

          <button
            onClick={() => setShowPercurso(true)}
            className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
          >
            <Route size={20} />
            <span>Percurso</span>
          </button>
        </div>
      </div>

      {/* Modais internos */}
      {showGrupo && <GrupoMercadoriaModal onClose={() => setShowGrupo(false)} />}
      {showMercadorias && (
        <MercadoriasApoliceModal onClose={() => setShowMercadorias(false)} />
      )}
      {showClientes && (
        <ClientesExcluidosModal onClose={() => setShowClientes(false)} />
      )}
      {showRegiao && (
        <RegiaoUrbanaModal onClose={() => setShowRegiao(false)} />
      )}
      {showPercurso && (
        <PercursoModal onClose={() => setShowPercurso(false)} />
      )}
    </>
  );
}
