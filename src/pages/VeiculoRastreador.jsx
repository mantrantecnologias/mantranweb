import { useState } from "react";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>
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
const maskPhone = (v) => {
  v = onlyDigits(v).slice(0, 11);
  if (v.length <= 10)
    return v
      .replace(/^(\d{0,2})/, "($1")
      .replace(/^\((\d{2})(\d{0,4})/, "($1) $2")
      .replace(/^\((\d{2})\) (\d{4})(\d{0,4})/, "($1) $2-$3");
  return v
    .replace(/^(\d{0,2})/, "($1")
    .replace(/^\((\d{2})(\d{0,5})/, "($1) $2")
    .replace(/^\((\d{2})\) (\d{5})(\d{0,4})/, "($1) $2-$3");
};

export default function VeiculoRastreador({ onClose }) {
  const [dados, setDados] = useState({
    imei: "",
    celular: "",
    rastreador: "",
    login: "",
    senha: "",
    observacao: "",
  });

  const limpar = () =>
    setDados({
      imei: "",
      celular: "",
      rastreador: "",
      login: "",
      senha: "",
      observacao: "",
    });

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[520px] p-3 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-2">
          VEÍCULO – RASTREADOR
        </h2>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label className="w-[90px] text-right">Número IMEI</Label>
            <Txt
              className="flex-1"
              value={dados.imei}
              onChange={(e) =>
                setDados({ ...dados, imei: onlyDigits(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-[90px] text-right">DDD / Celular</Label>
            <Txt
              className="flex-1"
              value={dados.celular}
              onChange={(e) =>
                setDados({ ...dados, celular: maskPhone(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-[90px] text-right">Rastreador</Label>
            <Txt
              className="flex-1"
              value={dados.rastreador}
              onChange={(e) =>
                setDados({ ...dados, rastreador: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-[90px] text-right">Login</Label>
            <Txt
              className="w-[160px]"
              value={dados.login}
              onChange={(e) =>
                setDados({ ...dados, login: e.target.value })
              }
            />
            <Label className="w-[60px] text-right">Senha</Label>
            <Txt
              type="password"
              className="w-[160px]"
              value={dados.senha}
              onChange={(e) =>
                setDados({ ...dados, senha: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <Label className="w-[90px] text-right">Observação</Label>
            <Txt
              className="flex-1"
              value={dados.observacao}
              onChange={(e) =>
                setDados({ ...dados, observacao: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-3">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
          >
            Fechar
          </button>
          <button
            onClick={limpar}
            className="border border-gray-300 rounded px-3 py-[4px] text-[12px] hover:bg-gray-100"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  );
}
