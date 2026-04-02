import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import InputBuscaMotorista from "../components/InputBuscaMotorista";
import InputBuscaVeiculo from "../components/InputBuscaVeiculo";

export default function InicioColetaModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  const [dados, setDados] = useState({
    dataInicio: new Date().toISOString().slice(0, 10),
    horaInicio: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    veiculoSolic: "03 - 3/4",
    motoristaCod: "",
    motoristaNome: "",
    placa: "",
    desligado: false,
    tracaoCod: "",
    tracaoPlaca: "",
    kmInicio: "",
    classe: "",
    reboqueCod: "",
    reboqueDesc: "",
    reboque2Cod: "",
    reboque2Desc: "",
    transportador: ""
  });

  const focusNextTabIndex = (current) => {
    const next = modalRef.current?.querySelector(`[tabindex="${current + 1}"]`);
    if (next) next.focus();
  };

  const handleEnterAsTab = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextTabIndex(e.target.tabIndex);
    }
  };

  // Foco inicial ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const first = modalRef.current?.querySelector('[tabindex="1"]');
        if (first) first.focus();
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setDados({ ...dados, [field]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-[1180px] rounded shadow-lg border border-gray-300 flex flex-col"
      >

        {/* ================= HEADER ================= */}
        <div className="px-4 py-2 border-b border-gray-300 flex justify-between items-center">
          <h2 className="text-red-700 font-semibold text-[14px]">
            Início da Coleta
          </h2>
          <button onClick={onClose} tabIndex={-1}>
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTEÚDO ================= */}
        <div className="p-3 space-y-3 text-[12px]">

          {/* ========= CARD 1 ========= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-red-700 font-semibold">
              Dados do Início
            </legend>

            {/* LINHA 1 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-1 text-right">Início</label>

              <input
                type="date"
                value={dados.dataInicio}
                onChange={handleChange("dataInicio")}
                tabIndex={1}
                onKeyDown={handleEnterAsTab}
                className="col-span-2 border rounded px-2 h-[26px] outline-none focus:ring-2 focus:ring-red-200"
              />

              <input
                type="time"
                value={dados.horaInicio}
                onChange={handleChange("horaInicio")}
                tabIndex={2}
                onKeyDown={handleEnterAsTab}
                className="col-span-1 border rounded px-2 h-[26px] outline-none focus:ring-2 focus:ring-red-200"
              />

              <label className="col-span-2 text-right">Veículo Solic.</label>
              <select
                className="col-span-4 border rounded px-2 h-[26px] outline-none focus:ring-2 focus:ring-red-200"
                value={dados.veiculoSolic}
                onChange={handleChange("veiculoSolic")}
                tabIndex={3}
                onKeyDown={handleEnterAsTab}
              >
                <option>01 - UTILITÁRIO</option>
                <option>02 - VAN</option>
                <option>03 - 3/4</option>
                <option>04 - TOCO</option>
                <option>05 - TRUCK</option>
                <option>06 - BITRUCK</option>
                <option>07 - CAVALO MECÂNICO</option>
              </select>
            </div>

            {/* LINHA 2 */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <label className="col-span-1 text-right">Motorista</label>

              <InputBuscaMotorista
                className="col-span-2"
                label={null}
                value={dados.motoristaCod}
                onChange={handleChange("motoristaCod")}
                onSelect={(mot) => {
                  setDados({
                    ...dados,
                    motoristaCod: mot.cnh,
                    motoristaNome: mot.nome,
                    tracaoCod: mot.tracaoCodigo || dados.tracaoCod,
                    tracaoPlaca: mot.tracaoDesc || dados.tracaoPlaca,
                    reboqueCod: mot.reboqueCodigo || dados.reboqueCod,
                    reboqueDesc: mot.reboqueDesc || dados.reboqueDesc
                  });
                  focusNextTabIndex(4);
                }}
                tabIndex={4}
              />

              <input
                value={dados.motoristaNome}
                readOnly
                tabIndex={-1}
                className="col-span-4 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />

              <label className="col-span-1 text-right">Placa</label>
              <input
                value={dados.placa}
                readOnly
                tabIndex={-1}
                className="col-span-2 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />

              <label className="col-span-1 flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={dados.desligado}
                  onChange={(e) => setDados({ ...dados, desligado: e.target.checked })}
                  tabIndex={-1}
                />
                Desligado
              </label>
            </div>

            {/* LINHA 3 */}
            <div className="grid grid-cols-12 gap-2 items-center mt-2">
              <label className="col-span-1 text-right">Tração</label>

              <InputBuscaVeiculo
                className="col-span-2"
                label={null}
                tipoUtilizacao="T"
                value={dados.tracaoCod}
                onChange={handleChange("tracaoCod")}
                onSelect={(v) => {
                  setDados({
                    ...dados,
                    tracaoCod: v.codigo,
                    tracaoPlaca: `${v.placa} - ${v.modelo} - ${v.classe}`,
                    classe: v.classe,
                    placa: v.placa,
                    kmInicio: v.km || dados.kmInicio
                  });
                  focusNextTabIndex(5);
                }}
                tabIndex={5}
              />

              <input
                value={dados.tracaoPlaca}
                readOnly
                tabIndex={-1}
                className="col-span-4 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />

              <label className="col-span-1 text-right">Km Início</label>
              <input
                value={dados.kmInicio}
                onChange={handleChange("kmInicio")}
                tabIndex={6}
                onKeyDown={handleEnterAsTab}
                className="col-span-1 border rounded px-2 h-[26px] outline-none focus:ring-2 focus:ring-red-200"
              />

              <label className="col-span-1 text-right">Classe</label>
              <input
                value={dados.classe}
                readOnly
                tabIndex={-1}
                className="col-span-2 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />
            </div>





            {/* LINHA 5 */}
            <div className="grid grid-cols-12 gap-2 items-center mt-2">
              <label className="col-span-1 text-right">Reboque</label>

              <InputBuscaVeiculo
                className="col-span-2"
                label={null}
                tipoUtilizacao="R"
                value={dados.reboqueCod}
                onChange={handleChange("reboqueCod")}
                onSelect={(v) => {
                  setDados({
                    ...dados,
                    reboqueCod: v.codigo,
                    reboqueDesc: `${v.placa} - ${v.modelo} - ${v.classe}`
                  });
                  focusNextTabIndex(7);
                }}
                tabIndex={7}
              />

              <input
                value={dados.reboqueDesc}
                readOnly
                tabIndex={-1}
                className="col-span-9 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />
            </div>

            {/* LINHA 6 */}
            <div className="grid grid-cols-12 gap-2 items-center mt-2">
              <label className="col-span-1 text-right">Reboque 2</label>

              <InputBuscaVeiculo
                className="col-span-2"
                label={null}
                tipoUtilizacao="R"
                value={dados.reboque2Cod}
                onChange={handleChange("reboque2Cod")}
                onSelect={(v) => {
                  setDados({
                    ...dados,
                    reboque2Cod: v.codigo,
                    reboque2Desc: `${v.placa} - ${v.modelo} - ${v.classe}`
                  });
                  focusNextTabIndex(8);
                }}
                tabIndex={8}
              />

              <input
                value={dados.reboque2Desc}
                readOnly
                tabIndex={-1}
                className="col-span-9 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />
            </div>

            {/* LINHA 7 */}
            <div className="grid grid-cols-12 gap-2 items-center mt-2">
              <label className="col-span-1 text-right">Transportador</label>

              <input
                value={dados.transportador}
                readOnly
                tabIndex={-1}
                className="col-span-11 border rounded px-2 h-[26px] bg-gray-200 outline-none"
              />
            </div>
          </fieldset>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-gray-300 px-4 py-2 flex justify-end gap-2">
          <button
            onClick={onClose}
            tabIndex={-1}
            className="border px-4 py-[4px] rounded text-[12px] hover:bg-gray-100 outline-none"
          >
            Cancelar
          </button>

          <button
            tabIndex={9}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onClose();
              }
            }}
            onClick={onClose}
            className="border px-6 py-[4px] rounded text-[12px] bg-blue-50 text-blue-700 hover:bg-blue-100 outline-none focus:ring-2 focus:ring-blue-200"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
