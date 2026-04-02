// src/pages/ClienteEmbalagem.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useIconColor } from "../context/IconColorContext";

/* Helpers */
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
        "border border-gray-300 rounded px-1 h-[26px] text-[13px] w-full " +
        className
      }
    >
      {children}
    </select>
  );
}

/* ================= Mock ================= */
const mockLista = [
  {
    cnpj: "00774806940",
    fantasia: "ALZIRA NAVARRETE SANCHEZ",
    embalagemCliente: "1",
    embalagemCorrespondente: "FAR",
  },
  {
    cnpj: "00799015903",
    fantasia: "VANDA EMILIA PONTES",
    embalagemCliente: "1234",
    embalagemCorrespondente: "FAR",
  },
];

/* ================= Component ================= */
export default function ClienteEmbalagem({ open }) {
  const navigate = useNavigate();
  const { footerIconColorNormal, footerIconColorHover } = useIconColor();

  const [lista, setLista] = useState(mockLista);
  const [selecionado, setSelecionado] = useState(null);

  const [dados, setDados] = useState({
    cnpj: "",
    razaoSocial: "",
    embalagemCliente: "",
    embalagemCorrespondente: "Caixa",
  });

  /* Handlers */
  const handleChange = (field) => (e) => {
    setDados({ ...dados, [field]: e.target.value });
  };

  const handleLimpar = () => {
    setDados({
      cnpj: "",
      razaoSocial: "",
      embalagemCliente: "",
      embalagemCorrespondente: "Caixa",
    });
    setSelecionado(null);
  };

  const handleIncluir = () => {
    if (!dados.cnpj || !dados.razaoSocial) {
      alert("Informe o CNPJ e a Razão Social!");
      return;
    }

    setLista((prev) => [...prev, dados]);
    handleLimpar();
  };

  const handleAlterar = () => {
    if (selecionado === null) return alert("Selecione um registro!");

    const nova = [...lista];
    nova[selecionado] = dados;
    setLista(nova);
    handleLimpar();
  };

  const handleExcluir = () => {
    if (selecionado === null) return alert("Selecione um registro!");

    setLista(lista.filter((_, i) => i !== selecionado));
    handleLimpar();
  };

  const handleSelecionar = (item, idx) => {
    setSelecionado(idx);
    setDados({
      cnpj: item.cnpj,
      razaoSocial: item.fantasia,
      embalagemCliente: item.embalagemCliente,
      embalagemCorrespondente: item.embalagemCorrespondente,
    });
  };

  return (
    <div
      className={`transition-all duration-300 mt-[44px] text-[13px] text-gray-700 bg-gray-50
      h-[calc(100vh-56px)] flex flex-col
      ${open ? "ml-[192px]" : "ml-[56px]"}`}
    >
      {/* Título */}
      <h1 className="text-center text-red-700 font-semibold py-1 text-sm border-b border-gray-300">
        CLIENTE – EMBALAGEM
      </h1>

      {/* Conteúdo */}
      <div className="flex-1 p-3 bg-white border-x border-b border-gray-300 rounded-b-md overflow-y-auto">
        {/* ================= CARD GERAL ================= */}
        <div className="border border-gray-300 rounded p-3 bg-white flex flex-col gap-3">

          {/* ================= Card 1 - Parâmetros ================= */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Parâmetros
            </legend>

            <div className="space-y-2">

              {/* Linha 1 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Cliente</Label>

                <Txt
                  className="col-span-2"
                  placeholder="CNPJ"
                  value={dados.cnpj}
                  onChange={handleChange("cnpj")}
                />

                <Txt
                  className="col-span-8 bg-gray-200"
                  placeholder="Razão Social"
                  readOnly
                  value={dados.razaoSocial}
                />
              </div>

              {/* Linha 2 */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <Label className="col-span-2">Emb. Cliente</Label>

                <Txt
                  className="col-span-2"
                  value={dados.embalagemCliente}
                  onChange={handleChange("embalagemCliente")}
                />

                <Label className="col-span-3">Emb. Correspondente</Label>

                <Sel
                  className="col-span-5"
                  value={dados.embalagemCorrespondente}
                  onChange={handleChange("embalagemCorrespondente")}
                >
                  <option>Caixa</option>
                  <option>Rolo</option>
                  <option>Fardos</option>
                  <option>Pacote</option>
                </Sel>
              </div>
            </div>
          </fieldset>

          {/* ================= Card 2 - GRID ================= */}
          <fieldset className="border border-gray-300 rounded p-3 bg-white">
            <legend className="text-red-700 font-semibold text-[13px] px-2">
              Embalagens Cadastradas
            </legend>

            <div className="border border-gray-200 rounded max-h-[350px] overflow-y-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1 text-center">CNPJ</th>
                    <th className="border px-2 py-1">Fantasia</th>
                    <th className="border px-2 py-1 text-center">Emb. Cliente</th>
                    <th className="border px-2 py-1 text-center">Correspondente</th>
                  </tr>
                </thead>

                <tbody>
                  {lista.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`cursor-pointer hover:bg-red-100 ${
                        selecionado === idx ? "bg-red-200" : ""
                      }`}
                      onClick={() => handleSelecionar(row, idx)}
                    >
                      <td className="border px-2 py-1 text-center">{row.cnpj}</td>
                      <td className="border px-2 py-1">{row.fantasia}</td>
                      <td className="border px-2 py-1 text-center">{row.embalagemCliente}</td>
                      <td className="border px-2 py-1 text-center">{row.embalagemCorrespondente}</td>
                    </tr>
                  ))}

                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-3 text-gray-500">
                        Nenhuma embalagem cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ================= Rodapé ================= */}
      <div className="border-t border-gray-300 bg-white py-2 px-5 flex items-center gap-6">

        <button
          onClick={() => navigate(-1)}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <XCircle size={20} />
          <span>Fechar</span>
        </button>

        <button
          onClick={handleLimpar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <RotateCcw size={20} />
          <span>Limpar</span>
        </button>

        <button
          onClick={handleIncluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <PlusCircle size={20} />
          <span>Incluir</span>
        </button>

        <button
          onClick={handleAlterar}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Edit size={20} />
          <span>Alterar</span>
        </button>

        <button
          onClick={handleExcluir}
          className={`flex flex-col items-center text-[11px] ${footerIconColorNormal} hover:${footerIconColorHover}`}
        >
          <Trash2 size={20} />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}
