import { useState } from "react";
import InputBuscaCliente from "../components/InputBuscaCliente";
import { maskCNPJ } from "../utils/masks";

export default function CteSubcontratado({ onClose, tpServico }) {
  const [cliente, setCliente] = useState({ cnpj: "", razao: "" });
  const [cidade, setCidade] = useState({ nome: "", uf: "", ie: "" });
  const [docAnt, setDocAnt] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [carga, setCarga] = useState({
    produtoCod: "",
    produtoDesc: "",
    embalagemCod: "",
    embalagemDesc: "",
    valor: "",
    volume: "",
    pesoBruto: "",
    pesoCubado: "",
    quantidade: "",
    altura: "",
    largura: "",
    comprimento: "",
  });

  // Adiciona item ao grid
  const adicionarDocumento = () => {
    if (!docAnt.trim()) return;
    const novoItem = {
      numero: docAnt.trim(),
      emitente: cliente.cnpj || "00000000000000",
    };
    setDocumentos([...documentos, novoItem]);
    setDocAnt("");
  };

  // Remove item selecionado
  const removerDocumento = (index) => {
    const novos = documentos.filter((_, i) => i !== index);
    setDocumentos(novos);
  };

  // Enter ou Tab adiciona automaticamente
  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      adicionarDocumento();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-[13px]">
      <div className="bg-white w-[900px] rounded shadow-lg border border-gray-300 p-4">
        {/* === TÍTULO === */}
        <h2 className="text-center text-red-700 font-semibold text-[14px] mb-3 border-b pb-1">
          {tpServico === "4"
            ? "DOCUMENTOS ANTERIORES / INFORMAÇÕES DA CARGA"
            : "DOCUMENTOS ANTERIORES"}
        </h2>

        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {/* === CARD 1 - VALORES === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Valores
            </legend>

            {/* Linha 1 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Cliente</label>
              <InputBuscaCliente
                className="w-[180px]"
                label={null}
                value={cliente.cnpj}
                onChange={(e) => setCliente({ ...cliente, cnpj: e.target.value })}
                onSelect={(emp) => {
                  setCliente({
                    cnpj: maskCNPJ(emp.cnpj),
                    razao: emp.razao
                  });
                  setCidade({
                    nome: emp.cidade || "",
                    uf: emp.uf || "",
                    ie: emp.ie || ""
                  });
                }}
              />
              <input
                type="text"
                placeholder="Razão Social"
                value={cliente.razao}
                className="border border-gray-300 rounded px-2 h-[24px] flex-1 bg-gray-200"
                readOnly
              />
            </div>

            {/* Linha 2 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Cidade</label>
              <input
                type="text"
                placeholder="Cidade"
                value={cidade.nome}
                onChange={(e) =>
                  setCidade({ ...cidade, nome: e.target.value })
                }
                className="border border-gray-300 rounded px-2 h-[24px] flex-1 bg-gray-200"
                readOnly
              />
              <input
                type="text"
                placeholder="UF"
                value={cidade.uf}
                onChange={(e) =>
                  setCidade({ ...cidade, uf: e.target.value })
                }
                className="border border-gray-300 rounded px-2 h-[24px] w-[60px] text-center bg-gray-200"
                readOnly
              />
              <label className="text-[12px]">IE</label>
              <input
                type="text"
                placeholder="Inscrição Estadual"
                value={cidade.ie}
                onChange={(e) =>
                  setCidade({ ...cidade, ie: e.target.value })
                }
                className="border border-gray-300 rounded px-2 h-[24px] w-[180px] bg-gray-200"
                readOnly
              />
            </div>

            {/* Linha 3 */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-[12px]">Nº Doc. Ant.</label>
              <input
                type="text"
                placeholder="Digite o número e pressione Enter"
                value={docAnt}
                onChange={(e) => setDocAnt(e.target.value)}
                onKeyDown={handleKeyPress}
                className="border border-gray-300 rounded px-2 h-[24px] flex-1"
              />
            </div>
          </fieldset>

          {/* === CARD 2 - GRID === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Documentos Anteriores Cadastrados
            </legend>

            <div className="border border-gray-300 rounded overflow-auto max-h-[250px]">
              <table className="min-w-full text-[12px] border-collapse">
                <thead className="bg-gray-100 border-b border-gray-300">
                  <tr>
                    <th className="px-2 py-[4px] text-left border-r w-[70%]">
                      Nº Documento Anterior
                    </th>
                    <th className="px-2 py-[4px] text-left">
                      CNPJ/CPF Emitente
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {documentos.length > 0 ? (
                    documentos.map((doc, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 cursor-pointer"
                        onDoubleClick={() => removerDocumento(index)}
                      >
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {doc.numero}
                        </td>
                        <td className="border-t border-gray-200 px-2 py-[3px]">
                          {doc.emitente}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="text-center text-gray-500 py-2 italic"
                      >
                        Nenhum documento cadastrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* === CARD 3 E 4 - EXIBE SOMENTE SE tpServico = 4 === */}
          {tpServico === "4" && (
            <>
              {/* CARD 3 - INFORMAÇÕES DA CARGA */}
              <fieldset className="border border-gray-300 rounded p-3">
                <legend className="text-[13px] text-red-700 font-medium px-2">
                  Informações da Carga
                </legend>

                {/* Linha 1 - Produto */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="w-24 text-[12px]">Produto</label>
                  <input
                    type="text"
                    value={carga.produtoCod}
                    onChange={(e) =>
                      setCarga({ ...carga, produtoCod: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-center"
                  />
                  <input
                    type="text"
                    value={carga.produtoDesc}
                    onChange={(e) =>
                      setCarga({ ...carga, produtoDesc: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] flex-1"
                  />
                </div>

                {/* Linha 2 - Embalagem */}
                <div className="flex items-center gap-2 mb-2">
                  <label className="w-24 text-[12px]">Embalagem</label>
                  <input
                    type="text"
                    value={carga.embalagemCod}
                    onChange={(e) =>
                      setCarga({ ...carga, embalagemCod: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-center"
                  />
                  <input
                    type="text"
                    value={carga.embalagemDesc}
                    onChange={(e) =>
                      setCarga({ ...carga, embalagemDesc: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] flex-1"
                  />
                </div>

                {/* Linha 3 - Numéricos */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-[12px]">Valor NF</label>
                  <input
                    type="number"
                    step="0.01"
                    value={carga.valor}
                    onChange={(e) =>
                      setCarga({ ...carga, valor: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Volume</label>
                  <input
                    type="number"
                    step="1"
                    value={carga.volume}
                    onChange={(e) =>
                      setCarga({ ...carga, volume: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Peso Bruto</label>
                  <input
                    type="number"
                    step="0.01"
                    value={carga.pesoBruto}
                    onChange={(e) =>
                      setCarga({ ...carga, pesoBruto: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Peso Cubado</label>
                  <input
                    type="number"
                    step="0.01"
                    value={carga.pesoCubado}
                    onChange={(e) =>
                      setCarga({ ...carga, pesoCubado: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                </div>
              </fieldset>

              {/* CARD 4 - CALCULAR CUBAGEM */}
              <fieldset className="border border-gray-300 rounded p-3">
                <legend className="text-[13px] text-red-700 font-medium px-2">
                  Calcular Cubagem
                </legend>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-[12px]">Quantidade</label>
                  <input
                    type="number"
                    value={carga.quantidade}
                    onChange={(e) =>
                      setCarga({ ...carga, quantidade: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Altura</label>
                  <input
                    type="number"
                    value={carga.altura}
                    onChange={(e) =>
                      setCarga({ ...carga, altura: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Largura</label>
                  <input
                    type="number"
                    value={carga.largura}
                    onChange={(e) =>
                      setCarga({ ...carga, largura: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                  <label>Comprimento</label>
                  <input
                    type="number"
                    value={carga.comprimento}
                    onChange={(e) =>
                      setCarga({ ...carga, comprimento: e.target.value })
                    }
                    className="border border-gray-300 rounded px-2 h-[24px] w-[100px] text-right"
                  />
                </div>
              </fieldset>
            </>
          )}
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between text-[13px]">
          <button
            onClick={onClose}
            className="px-5 py-[5px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-red-700 font-medium"
          >
            Fechar
          </button>

          <div className="flex gap-2">
            <button
              onClick={adicionarDocumento}
              className="px-4 py-[5px] bg-green-600 hover:bg-green-700 text-white rounded font-medium"
            >
              Incluir
            </button>
            <button
              onClick={() => {
                if (documentos.length === 0) return;
                removerDocumento(documentos.length - 1);
              }}
              className="px-4 py-[5px] bg-red-600 hover:bg-red-700 text-white rounded font-medium"
            >
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
