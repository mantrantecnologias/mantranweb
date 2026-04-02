import { useState } from "react";
import { Search } from "lucide-react";
import InputBuscaCliente from "../components/InputBuscaCliente";
import { maskCNPJ } from "../utils/masks";

export default function CteComplementar({ onClose }) {
  const [custos, setCustos] = useState({
    imposto: false,
    calculo: false,
    taxaCancelamento: false,
    freteMorto: false,
    freteRetorno: false,
    trt: false,
    estadia: false,
  });

  const [dados, setDados] = useState({
    controle: "",
    impresso: "",
    serie: "",
    remetenteCNPJ: "",
    remetenteRazao: "",
    destinatarioCNPJ: "",
    destinatarioRazao: "",
    chave: "",
    emissao: "",
    frete: "",
    estadia: "",
  });

  // 🔍 Função simulada de busca
  const handlePesquisar = () => {
    if (!dados.controle && !dados.impresso) {
      alert("⚠️ Informe o Nº Controle ou Nº Impresso para pesquisar!");
      return;
    }

    let novoControle = dados.controle;
    let novoImpresso = dados.impresso;
    let novaSerie = dados.serie;

    // Se informou o Controle → preenche Impresso e Série
    if (dados.controle && !dados.impresso) {
      novoImpresso = "002420";
      novaSerie = "001";
    }
    // Se informou o Impresso → preenche Controle e Série
    else if (dados.impresso && !dados.controle) {
      novoControle = "002444";
      novaSerie = "001";
    }

    // Simula carregamento de dados do CT-e
    setTimeout(() => {
      setDados({
        controle: novoControle,
        impresso: novoImpresso,
        serie: novaSerie,
        remetenteCNPJ: "50221019000136",
        remetenteRazao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
        destinatarioCNPJ: "0525495700651",
        destinatarioRazao: "HNK BR LOGISTICA E DISTRIBUICAO LTDA",
        chave: "35251042446277000273570001310092471598637860",
        emissao: "2025-11-09",
        frete: "1250,00",
        estadia: "90",
      });
      alert("✅ Dados do CT-e carregados com sucesso!");
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 text-[13px]">
      <div className="bg-white w-[900px] rounded shadow-lg border border-gray-300 p-4">
        {/* === TÍTULO === */}
        <h2 className="text-center text-red-700 font-semibold text-[14px] mb-3 border-b pb-1">
          COMPLEMENTAR DE CONHECIMENTO
        </h2>

        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
          {/* === CARD 1 === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Conhecimento a ser Complementado
            </legend>

            {/* Linha 1 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Nº Controle</label>
              <input
                type="text"
                value={dados.controle}
                onChange={(e) =>
                  setDados({ ...dados, controle: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] w-[120px]"
              />
              <label className="w-20 text-[12px] text-right">Nº Impresso</label>
              <input
                type="text"
                value={dados.impresso}
                onChange={(e) =>
                  setDados({ ...dados, impresso: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] w-[120px]"
              />
              <label className="w-10 text-[12px] text-right">Série</label>
              <input
                type="text"
                value={dados.serie}
                onChange={(e) =>
                  setDados({ ...dados, serie: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] w-[60px]"
              />
              <button
                onClick={handlePesquisar}
                className="ml-auto border border-gray-300 rounded bg-gray-50 hover:bg-gray-100 flex items-center justify-center gap-1 px-3 py-[3px]"
              >
                <Search size={14} className="text-blue-600" />
                <span className="text-[12px]">Pesquisar</span>
              </button>
            </div>

            {/* Linha 2 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Remetente</label>
              <InputBuscaCliente
                className="w-[160px]"
                label={null}
                value={dados.remetenteCNPJ}
                onChange={(e) => setDados({ ...dados, remetenteCNPJ: e.target.value })}
                onSelect={(emp) => setDados({
                  ...dados,
                  remetenteCNPJ: maskCNPJ(emp.cnpj),
                  remetenteRazao: emp.razao
                })}
              />
              <input
                type="text"
                readOnly
                placeholder="Razão Social"
                value={dados.remetenteRazao}
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] flex-1 bg-gray-200"
              />
            </div>

            {/* Linha 3 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Destinatário</label>
              <InputBuscaCliente
                className="w-[160px]"
                label={null}
                value={dados.destinatarioCNPJ}
                onChange={(e) => setDados({ ...dados, destinatarioCNPJ: e.target.value })}
                onSelect={(emp) => setDados({
                  ...dados,
                  destinatarioCNPJ: maskCNPJ(emp.cnpj),
                  destinatarioRazao: emp.razao
                })}
              />
              <input
                type="text"
                placeholder="Razão Social"
                value={dados.destinatarioRazao}
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] flex-1 bg-gray-200"
                readOnly
              />
            </div>

            {/* Linha 4 */}
            <div className="flex items-center gap-2 mb-2">
              <label className="w-24 text-[12px]">Chave CT-e</label>
              <input
                type="text"
                value={dados.chave}
                onChange={(e) =>
                  setDados({ ...dados, chave: e.target.value })
                }
                placeholder="35251042446277000273570001310092471598637860"
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] font-mono text-[12px] flex-1"
              />
            </div>

            {/* Linha 5 */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-[12px]">Dt. Emissão</label>
              <input
                type="date"
                value={dados.emissao}
                onChange={(e) =>
                  setDados({ ...dados, emissao: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] w-[150px]"
              />
              <label className="w-20 text-[12px] text-right">Vr. Frete</label>
              <input
                type="text"
                placeholder="0,00"
                value={dados.frete}
                onChange={(e) =>
                  setDados({ ...dados, frete: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] text-right w-[120px]"
              />
              <label className="w-32 text-[12px] text-right">
                Total Minutos Estadia
              </label>
              <input
                type="text"
                placeholder="0"
                value={dados.estadia}
                onChange={(e) =>
                  setDados({ ...dados, estadia: e.target.value })
                }
                className="border border-gray-300 rounded px-2 py-[2px] h-[24px] text-right w-[100px]"
              />
            </div>
          </fieldset>

          {/* === CARD 2 - Custos Adicionais === */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-[13px] text-red-700 font-medium px-2">
              Custos Adicionais
            </legend>

            <div className="grid grid-cols-2 gap-2 mt-1">
              {[
                ["Apenas Imposto", "imposto"],
                ["Cálculo Completo", "calculo"],
                ["Taxa Cancelamento", "taxaCancelamento"],
                ["Frete Morto", "freteMorto"],
                ["Frete Retorno", "freteRetorno"],
                ["TRT", "trt"],
                ["Estadia", "estadia"],
              ].map(([label, key]) => (
                <label key={key} className="flex items-center gap-2 text-[13px]">
                  <input
                    type="checkbox"
                    checked={custos[key]}
                    onChange={(e) =>
                      setCustos({ ...custos, [key]: e.target.checked })
                    }
                    className="accent-red-700"
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* === RODAPÉ === */}
        <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between text-[13px]">
          <button
            onClick={onClose}
            className="px-5 py-[5px] bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded text-red-700 font-medium"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              alert("✅ Complementar confirmado com sucesso!");
              onClose();
            }}
            className="px-5 py-[5px] bg-red-700 hover:bg-red-800 text-white rounded font-medium"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
