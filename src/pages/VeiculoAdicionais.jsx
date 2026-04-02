import { useState } from "react";
import { XCircle, Edit, RotateCcw } from "lucide-react";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>
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

const onlyDigits = (v = "") => v.replace(/\D+/g, "");
const maskMilhar = (v = "") =>
  v ? Number(onlyDigits(v)).toLocaleString("pt-BR") : "";

export default function VeiculoAdicionais({ onClose }) {
  const [dados, setDados] = useState({
    capacidadePadrao: "",
    capacidadeReal: "",
    qtdGaiolas: "",
    comprimento: "",
    largura: "",
    altura: "",
    cubagem: "",
    bauNumero: "",
    cor: "",
    custoFixo: "",
    custoVariavel: "",
  });

  const limpar = () =>
    setDados({
      capacidadePadrao: "",
      capacidadeReal: "",
      qtdGaiolas: "",
      comprimento: "",
      largura: "",
      altura: "",
      cubagem: "",
      bauNumero: "",
      cor: "",
      custoFixo: "",
      custoVariavel: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[900px] p-3 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-3">
          VEÍCULO – DADOS ADICIONAIS
        </h2>

        <div className="space-y-3">

          {/* ======================= GRUPO 1 ======================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Capacidades
            </legend>

            <div className="grid grid-cols-12 gap-3 items-center mt-1">

              <Label className="col-span-2 text-right">Capacidade Padrão</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.capacidadePadrao)}
                onChange={(e) =>
                  setDados({
                    ...dados,
                    capacidadePadrao: onlyDigits(e.target.value),
                  })
                }
              />

              <Label className="col-span-2 text-right">Capacidade Real</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.capacidadeReal)}
                onChange={(e) =>
                  setDados({
                    ...dados,
                    capacidadeReal: onlyDigits(e.target.value),
                  })
                }
              />

              <Label className="col-span-2 text-right">Qtd. Gaiolas</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.qtdGaiolas)}
                onChange={(e) =>
                  setDados({
                    ...dados,
                    qtdGaiolas: onlyDigits(e.target.value),
                  })
                }
              />
            </div>
          </fieldset>

          {/* ======================= GRUPO 2 ======================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Dimensões
            </legend>

            <div className="grid grid-cols-12 gap-3 items-center mt-1">

              <Label className="col-span-2 text-right">Comprimento</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.comprimento)}
                onChange={(e) =>
                  setDados({ ...dados, comprimento: onlyDigits(e.target.value) })
                }
              />

              <Label className="col-span-1 text-right">Largura</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.largura)}
                onChange={(e) =>
                  setDados({ ...dados, largura: onlyDigits(e.target.value) })
                }
              />

              <Label className="col-span-1 text-right">Altura</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.altura)}
                onChange={(e) =>
                  setDados({ ...dados, altura: onlyDigits(e.target.value) })
                }
              />

              <Label className="col-span-1 text-right">Cubagem</Label>
              <Txt
                className="col-span-1 text-right"
                value={maskMilhar(dados.cubagem)}
                onChange={(e) =>
                  setDados({ ...dados, cubagem: onlyDigits(e.target.value) })
                }
              />
            </div>
          </fieldset>

          {/* ======================= GRUPO 3 ======================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="text-red-700 font-semibold px-2">
              Identificação & Custos
            </legend>

            {/* Linha 1 */}
            <div className="grid grid-cols-12 gap-3 items-center mt-1">

              <Label className="col-span-2 text-right">Baú Nº</Label>
              <Txt
                className="col-span-2"
                value={dados.bauNumero}
                onChange={(e) =>
                  setDados({ ...dados, bauNumero: e.target.value })
                }
              />

              <Label className="col-span-1 text-right">Cor</Label>
              <Txt
                className="col-span-3"
                value={dados.cor}
                onChange={(e) =>
                  setDados({ ...dados, cor: e.target.value })
                }
              />
            </div>

            {/* Linha 2 */}
            <div className="grid grid-cols-12 gap-3 items-center mt-2">

              <Label className="col-span-2 text-right">Custo Fixo</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.custoFixo)}
                onChange={(e) =>
                  setDados({ ...dados, custoFixo: onlyDigits(e.target.value) })
                }
              />

              <Label className="col-span-2 text-right">Custo Variável</Label>
              <Txt
                className="col-span-2 text-right"
                value={maskMilhar(dados.custoVariavel)}
                onChange={(e) =>
                  setDados({
                    ...dados,
                    custoVariavel: onlyDigits(e.target.value),
                  })
                }
              />
            </div>
          </fieldset>
        </div>

{/* Rodapé */}
<div className="flex justify-end gap-3 mt-4">

  {/* Fechar */}
  <button
    onClick={onClose}
    className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
  >
    <XCircle size={14} />
    Fechar
  </button>

  {/* Alterar */}
  <button
    onClick={() => alert("Função Alterar futuramente")}
    className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
  >
    <Edit size={14} />
    Alterar
  </button>

  {/* Limpar */}
  <button
    onClick={limpar}
    className="flex items-center gap-1 text-red-700 border border-red-700 rounded px-3 py-[4px] text-[12px] hover:bg-red-50"
  >
    <RotateCcw size={14} />
    Limpar
  </button>

</div>

      </div>
    </div>
  );
}
