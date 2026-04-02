import { useState, useRef } from "react";
import TabelaFreteRetirada from "./TabelaFreteRetirada";
import TabelaFreteDevolucao from "./TabelaFreteDevolucao";

import {
  XCircle,
  RotateCcw,
  Package,
  DollarSign,
  PlusCircle,
  Edit,
  Trash2,
} from "lucide-react";
import TabelaFreteTarifa from "./TabelaFreteTarifa";

export default function TabelaFretePercurso({ onClose }) {
  const [abaAtiva, setAbaAtiva] = useState("percurso");
  const [mostrarTarifa, setMostrarTarifa] = useState(false);
  const [submenuAberto, setSubmenuAberto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [mostrarRetirada, setMostrarRetirada] = useState(false);
  const [mostrarDevolucao, setMostrarDevolucao] = useState(false);


  const percursos = [
    { cepOrigem: "13300003", origem: "ITU", cepDestino: "13010000", destino: "CAMPINAS", tarifa: 1 },
    { cepOrigem: "13300003", origem: "ITU", cepDestino: "39140000", destino: "ALVORADA DE MINAS", tarifa: 1 },
    { cepOrigem: "13300003", origem: "ITU", cepDestino: "64923000", destino: "ALVORADA DO GURGUÉIA", tarifa: 1 },
    { cepOrigem: "13300003", origem: "ITU", cepDestino: "85872000", destino: "ALVORADA DO IGUAÇU", tarifa: 1 },
    { cepOrigem: "13300003", origem: "ITU", cepDestino: "73950000", destino: "ALVORADA DO NORTE", tarifa: 1 },
  ];

  const percursosFiltrados = percursos.filter((p) =>
    Object.values(p).some((v) =>
      v.toString().toLowerCase().includes(filtro.toLowerCase())
    )
  );

  // === Movimento do modal ===
  const modalRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, dx: 0, dy: 0 });

  const startDrag = (e) => {
    const modal = modalRef.current;
    pos.current = {
      x: e.clientX,
      y: e.clientY,
      dx: modal.offsetLeft,
      dy: modal.offsetTop,
    };
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const onDrag = (e) => {
    const modal = modalRef.current;
    const { x, y, dx, dy } = pos.current;
    modal.style.left = dx + e.clientX - x + "px";
    modal.style.top = dy + e.clientY - y + "px";
  };

  const stopDrag = () => {
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
  };

  if (mostrarRetirada) {
  return <TabelaFreteRetirada onClose={() => setMostrarRetirada(false)} />;
}

if (mostrarDevolucao) {
  return <TabelaFreteDevolucao onClose={() => setMostrarDevolucao(false)} />;
}

  
  if (mostrarTarifa) {
    return <TabelaFreteTarifa onClose={() => setMostrarTarifa(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div
        ref={modalRef}
        className="absolute bg-white rounded-lg shadow-xl w-[90%] max-w-[1300px] max-h-[90vh] overflow-auto border border-gray-300 text-black"
        style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div
          className="cursor-move bg-gray-50 border-b border-gray-300 px-4 py-2 flex justify-between items-center"
          onMouseDown={startDrag}
        >
          <h2 className="text-red-700 font-semibold text-[14px]">PERCURSOS</h2>
        </div>

        {/* ABAS */}
        <div className="flex border-b border-gray-300 bg-white">
          {["percurso", "consulta"].map((aba) => (
            <button
              key={aba}
              onClick={() => setAbaAtiva(aba)}
              className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${
                abaAtiva === aba
                  ? "bg-white text-red-700 border-gray-300"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } ${aba !== "percurso" ? "ml-1" : ""}`}
            >
              {aba.charAt(0).toUpperCase() + aba.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-2">
          {/* === ABA PERCURSO === */}
          {abaAtiva === "percurso" && (
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">
                Dados do Percurso
              </legend>

              {/* === LINHA 1 - CEP ORIGEM === */}
              <div className="flex items-center gap-2 mb-1 text-[13px]">
                <label className="w-[110px] text-right">CEP Ref. Origem</label>
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[90px]" defaultValue="13300003" />
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[60px]" placeholder="Cod." />
                <input className="border border-gray-300 rounded px-2 py-[2px] flex-1" defaultValue="ITU" />
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[40px] text-center" defaultValue="SP" />
              </div>

              {/* === LINHA 2 - CEP DESTINO === */}
              <div className="flex items-center gap-2 mb-3 text-[13px]">
                <label className="w-[110px] text-right">CEP Ref. Destino</label>
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[90px]" defaultValue="13010000" />
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[60px]" placeholder="Cod." />
                <input className="border border-gray-300 rounded px-2 py-[2px] flex-1" defaultValue="CAMPINAS" />
                <input className="border border-gray-300 rounded px-2 py-[2px] w-[40px] text-center" defaultValue="SP" />
              </div>

              {/* === DEMAIS LINHAS (2 COLUNAS) === */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-[6px] text-[13px]">
                {[
                  ["Tarifa", "Rota"],
                  ["Sigla Percurso", "Valor Estacionamento"],
                  ["Qtde. Pedágios", "Valor CAT"],
                  ["Vr. Total Pedágios", "% Advalorem"],
                  ["Vr. Pedágios por Eixo", "Valor Advalorem"],
                  ["Distância KM", "Valor Taxa Entrega"],
                  ["Quilometragem", "Valor Taxa Coleta"],
                  ["Horas Previstas", "Valor Mín. Coleta"],
                  ["% Adicional Noturno", "Região"],
                  ["Valor Pallets", "Prazo Entrega (Hs)"],
                  ["Frete Mínimo", "% Dific. Entrega-TDE"],
                  ["Valor Escolta", "Vr. Min. Dific. Entrega"],
                  ["Valor Estadia", "Valor Taxa Descarga"],
                  ["% Dific. Acesso-TDA", "Fração Pedágio 100 KG"],
                  ["Vr. Min. Dific. Acesso", "Valor Seguro"],
                  ["GRIS (% sobre NF)", "Valor Rateio Estac. por CTRC House"],
                  ["Vr. Desp. por House", ""],
                  ["% Seguro", ""],
                ].map(([labelEsq, labelDir], i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2 flex-1">
                      <label className="w-[140px] text-right">{labelEsq}</label>
                      {labelEsq === "Rota" ? (
  <select
    className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-left text-[13px]"
    defaultValue="SP X RJ"
  >
    <option>SP X RJ</option>
    <option>SP X MG</option>
  </select>
) : (
  <input
    type={
      labelEsq === "Tarifa"
        ? "number"
        : labelEsq === "Sigla Percurso"
        ? "text"
        : "text"
    }
    step={labelEsq === "Tarifa" ? "1" : undefined}
    maxLength={labelEsq === "Sigla Percurso" ? 15 : undefined}
    className={`border border-gray-300 rounded px-2 py-[2px] w-[100px] ${
      labelEsq === "Sigla Percurso" ? "text-left uppercase" : "text-right"
    }`}
    defaultValue={
      labelEsq === "Tarifa"
        ? "0"
        : labelEsq === "Sigla Percurso"
        ? ""
        : "0,00"
    }
  />
)}


                    </div>

                    {labelDir && (
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <label className="w-[180px] text-right">{labelDir}</label>
                        <input className="border border-gray-300 rounded px-2 py-[2px] w-[100px] text-right" defaultValue="0,00" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </fieldset>
          )}

          {/* === ABA CONSULTA === */}
          {abaAtiva === "consulta" && (
            <div className="space-y-3">
              <fieldset className="border border-gray-300 rounded p-3">
                <legend className="text-red-700 font-semibold px-2">
                  Pesquisar
                </legend>
                <input
                  type="text"
                  placeholder="Digite para filtrar..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-[3px] w-full text-[13px]"
                />
              </fieldset>

              <fieldset className="border border-gray-300 rounded p-0 overflow-hidden">
                <table className="min-w-full border-collapse text-[13px]">
                  <thead className="bg-gray-200 text-gray-800 font-semibold text-center">
                    <tr>
                      <th className="border border-gray-300 px-2 py-1">CEP Origem</th>
                      <th className="border border-gray-300 px-2 py-1">Origem Nome</th>
                      <th className="border border-gray-300 px-2 py-1">CEP Destino</th>
                      <th className="border border-gray-300 px-2 py-1">Destino Nome</th>
                      <th className="border border-gray-300 px-2 py-1">Nº Tarifa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {percursosFiltrados.map((p, i) => (
                      <tr key={i} className={`text-center ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}>
                        <td className="border border-gray-300 px-2 py-[3px]">{p.cepOrigem}</td>
                        <td className="border border-gray-300 px-2 py-[3px]">{p.origem}</td>
                        <td className="border border-gray-300 px-2 py-[3px]">{p.cepDestino}</td>
                        <td className="border border-gray-300 px-2 py-[3px]">{p.destino}</td>
                        <td className="border border-gray-300 px-2 py-[3px]">{p.tarifa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right text-[12px] px-3 py-1 bg-gray-50 border-t border-gray-300">
                  Total de Percursos: {percursosFiltrados.length}
                </div>
              </fieldset>
            </div>
          )}
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-300 bg-gray-50 px-4 py-2 flex justify-between items-center rounded-b-lg text-red-700">
          <div className="flex items-center gap-4">
            <button title="Fechar" onClick={onClose} className="hover:text-red-800 transition">
              <XCircle size={20} />
            </button>

            <button title="Limpar" className="hover:text-red-800 transition">
              <RotateCcw size={20} />
            </button>

            <div className="relative">
              <button
                title="Retirada / Devolução de Container"
                onClick={() => setSubmenuAberto(!submenuAberto)}
                className="hover:text-red-800 transition"
              >
                <Package size={20} />
              </button>
              {submenuAberto && (
  <div className="absolute bottom-full mb-1 bg-white border border-gray-300 rounded shadow-md w-[180px] text-[13px] text-gray-700">
    <button
      className="block w-full text-left px-3 py-1 hover:bg-gray-100"
      onClick={() => {
        setMostrarRetirada(true);
        setSubmenuAberto(false);
      }}
    >
      Retirada de Container
    </button>
   <button
  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
  onClick={() => {
    setMostrarDevolucao(true);
    setSubmenuAberto(false);
  }}
>
  Devolução de Container
</button>
  </div>
)}
            </div>

            <button title="Tarifa" onClick={() => setMostrarTarifa(true)} className="hover:text-red-800 transition">
              <DollarSign size={20} />
            </button>

            <button title="Incluir" className="hover:text-red-800 transition">
              <PlusCircle size={20} />
            </button>

            <button title="Alterar" className="hover:text-red-800 transition">
              <Edit size={20} />
            </button>

            <button title="Excluir" className="hover:text-red-800 transition">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
