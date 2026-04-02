import { useState } from "react";
import {
  XCircle,
  RotateCcw,
  PlusCircle,
  Edit,
  Trash2,
  HelpCircle,
} from "lucide-react";

export default function ManifestoCargaPerigosa({ onClose }) {
  const [form, setForm] = useState({
    numeroOnu: "",
    nomeEmbarque: "",
    classeRisco: "",
    grupoEmbalagem: "",
    quantidade: "",
    tipoVolume: "",
  });

  const [registros, setRegistros] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // Atualiza campos
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Incluir novo registro
  const handleIncluir = () => {
    if (!form.numeroOnu.trim()) return;
    if (editIndex !== null) {
      const atualizados = [...registros];
      atualizados[editIndex] = form;
      setRegistros(atualizados);
      setEditIndex(null);
    } else {
      setRegistros([...registros, form]);
    }
    setForm({
      numeroOnu: "",
      nomeEmbarque: "",
      classeRisco: "",
      grupoEmbalagem: "",
      quantidade: "",
      tipoVolume: "",
    });
  };

  // Editar registro selecionado
  const handleAlterar = (index) => {
    setForm(registros[index]);
    setEditIndex(index);
  };

  // Excluir registro
  const handleExcluir = (index) => {
    setRegistros(registros.filter((_, i) => i !== index));
  };

  // Limpar campos
  const handleLimpar = () => {
    setForm({
      numeroOnu: "",
      nomeEmbarque: "",
      classeRisco: "",
      grupoEmbalagem: "",
      quantidade: "",
      tipoVolume: "",
    });
    setEditIndex(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[850px] rounded shadow-lg border border-gray-300 p-4">
        <h2 className="text-center text-[14px] font-semibold text-red-700 border-b pb-1 mb-3">
          PARÂMETROS PARA CARGA PERIGOSA
        </h2>

        {/* CARD 1 - Parâmetros */}
        <fieldset className="border border-gray-300 rounded p-3 mb-3">
          <legend className="text-[13px] text-gray-700 px-1">Parâmetros</legend>

          <div className="space-y-2 text-[13px]">
            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Número ONU/UN</label>
              <input
                name="numeroOnu"
                value={form.numeroOnu}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Nome P/ Embarque</label>
              <input
                name="nomeEmbarque"
                value={form.nomeEmbarque}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Classe de Risco</label>
              <input
                name="classeRisco"
                value={form.classeRisco}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Grupo Embalagem</label>
              <input
                name="grupoEmbalagem"
                value={form.grupoEmbalagem}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Quantidade Total</label>
              <input
                name="quantidade"
                value={form.quantidade}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="w-40 text-right">Tipo de Volume</label>
              <input
                name="tipoVolume"
                value={form.tipoVolume}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-[2px] flex-1"
              />
            </div>
          </div>
        </fieldset>

        {/* CARD 2 - Grid */}
        <div className="border border-gray-300 rounded p-2 mb-3">
          <table className="w-full text-[12px] border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-2 py-1 text-left">Nº ONU</th>
                <th className="border px-2 py-1 text-left">Embarque</th>
                <th className="border px-2 py-1 text-left">Classe de Risco</th>
                <th className="border px-2 py-1 w-[100px] text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-2 text-gray-500 italic"
                  >
                    Nenhum registro adicionado
                  </td>
                </tr>
              ) : (
                registros.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{item.numeroOnu}</td>
                    <td className="border px-2 py-1">{item.nomeEmbarque}</td>
                    <td className="border px-2 py-1">{item.classeRisco}</td>
                    <td className="border px-2 py-1 text-center">
                      <button
                        onClick={() => handleAlterar(index)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleExcluir(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* CARD 3 - Rodapé */}
        <div className="border-t border-gray-300 pt-2 flex justify-start gap-4 text-[12px] text-red-700">
          <button
            onClick={onClose}
            title="Fechar"
            className="flex flex-col items-center hover:text-red-800"
          >
            <XCircle size={20} />
            <span>Fechar</span>
          </button>

          <button
            onClick={handleLimpar}
            title="Limpar Campos"
            className="flex flex-col items-center hover:text-red-800"
          >
            <RotateCcw size={20} />
            <span>Limpar</span>
          </button>

          <button
            onClick={handleIncluir}
            title="Incluir Registro"
            className="flex flex-col items-center hover:text-red-800"
          >
            <PlusCircle size={20} />
            <span>Incluir</span>
          </button>

          <button
            onClick={() => editIndex !== null && handleIncluir()}
            title="Alterar Registro"
            className="flex flex-col items-center hover:text-red-800"
          >
            <Edit size={20} />
            <span>Alterar</span>
          </button>

          <button
            onClick={() =>
              registros.length > 0 && handleExcluir(registros.length - 1)
            }
            title="Excluir Registro"
            className="flex flex-col items-center hover:text-red-800"
          >
            <Trash2 size={20} />
            <span>Excluir</span>
          </button>

          <button
            title="Ajuda"
            className="flex flex-col items-center hover:text-red-800"
          >
            <HelpCircle size={20} />
            <span>Ajuda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
