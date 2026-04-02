import { useState } from "react";

function Label({ children, className = "" }) {
  return (
    <label className={`text-[12px] text-gray-700 ${className}`}>{children}</label>
  );
}
function Txt(props) {
  return (
    <input
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${props.className || ""}`}
    />
  );
}
function Sel(props) {
  return (
    <select
      {...props}
      className={`border border-gray-300 rounded px-1 py-[2px] h-[26px] text-[13px] ${props.className || ""}`}

    />
  );
}

export default function MotoristaPessoal({ onClose }) {
  const [dados, setDados] = useState({
    mae: "",
    pai: "",
    dependentes: "",
    pis: "",
    dtPis: "",
    grauInstrucao: "",
    rg: "",
    emissaoRg: "",
    cidadeRg: "",
    ufRg: "",
  });

  const limpar = () =>
    setDados({
      mae: "",
      pai: "",
      dependentes: "",
      pis: "",
      dtPis: "",
      grauInstrucao: "",
      rg: "",
      emissaoRg: "",
      cidadeRg: "",
      ufRg: "",
    });

  const ufs = [
    "", "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS",
    "MT","PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO"
  ];

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-md shadow-lg w-[750px] p-4 text-[13px]">
        <h2 className="text-center text-red-700 font-semibold mb-3">
          MOTORISTA – DADOS PESSOAIS
        </h2>

        <div className="space-y-4">

          {/* ================= NOME DA MÃE ================= */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2 text-right">Nome da Mãe</Label>
            <Txt
              className="col-span-10"
              value={dados.mae}
              onChange={(e) => setDados({ ...dados, mae: e.target.value })}
            />
          </div>

          {/* ================= NOME DO PAI ================= */}
          <div className="grid grid-cols-12 gap-2 items-center">
            <Label className="col-span-2 text-right">Nome do Pai</Label>
            <Txt
              className="col-span-10"
              value={dados.pai}
              onChange={(e) => setDados({ ...dados, pai: e.target.value })}
            />
          </div>

          {/* ================= FIELDSET RG ================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-[12px] text-gray-600">Documento – RG</legend>

            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1 text-right">RG</Label>
              <Txt
                className="col-span-2"
                value={dados.rg}
                onChange={(e) => setDados({ ...dados, rg: e.target.value })}
              />

              <Label className="col-span-2 text-right">Emissão</Label>
              <Txt
                type="date"
                className="col-span-2"
                value={dados.emissaoRg}
                onChange={(e) => setDados({ ...dados, emissaoRg: e.target.value })}
              />

              <Label className="col-span-1 text-right">Cidade</Label>
              <Txt
                className="col-span-3"
                value={dados.cidadeRg}
                onChange={(e) => setDados({ ...dados, cidadeRg: e.target.value })}
              />

              
              <Sel
                className="col-span-1"
                value={dados.ufRg}
                onChange={(e) => setDados({ ...dados, ufRg: e.target.value })}
              >
                {ufs.map((uf) => (
                  <option key={uf}>{uf}</option>
                ))}
              </Sel>
            </div>
          </fieldset>

          {/* ================= FIELDSET PIS ================= */}
          <fieldset className="border border-gray-300 rounded p-3">
            <legend className="px-2 text-[12px] text-gray-600">Dados do PIS</legend>

            <div className="grid grid-cols-12 gap-2 items-center">
              <Label className="col-span-1 text-right">PIS</Label>
              <Txt
                className="col-span-3"
                value={dados.pis}
                onChange={(e) => setDados({ ...dados, pis: e.target.value })}
              />

              <Label className="col-span-2 text-right">Cadastro PIS</Label>
              <Txt
                type="date"
                className="col-span-2"
                value={dados.dtPis}
                onChange={(e) => setDados({ ...dados, dtPis: e.target.value })}
              />

              <Label className="col-span-2 text-right">Dependentes</Label>
              <Txt
                className="col-span-1"
                value={dados.dependentes}
                onChange={(e) => setDados({ ...dados, dependentes: e.target.value })}
              />
            </div>
          </fieldset>

          {/* ================= GRAU DE INSTRUÇÃO + ESTADO CIVIL ================= */}
<div className="grid grid-cols-12 gap-2 items-center">
  
  <Label className="col-span-2 text-right">Grau de Instrução</Label>
  <Sel
    className="col-span-4"
    value={dados.grauInstrucao}
    onChange={(e) => setDados({ ...dados, grauInstrucao: e.target.value })}
  >
    <option value=""></option>
    <option value="Fundamental">Fundamental</option>
    <option value="Médio">Médio</option>
    <option value="Superior">Superior</option>
  </Sel>

  <Label className="col-span-2 text-right">Estado Civil</Label>
<Sel
  className="col-span-4"
  value={dados.estadoCivil}
  onChange={(e) => setDados({ ...dados, estadoCivil: e.target.value })}
>
  <option></option>
  <option>Solteiro</option>
  <option>Casado</option>
  <option>Divorciado</option>
</Sel>
</div>

{/* ================= EMAIL ================= */}
<div className="grid grid-cols-12 gap-2 items-center mt-2">
  <Label className="col-span-2 text-right">Email</Label>
  <Txt
    className="col-span-10"
    value={dados.email}
    onChange={(e) => setDados({ ...dados, email: e.target.value })}
  />
</div>


        </div>

        {/* BOTÕES */}
        <div className="flex justify-end gap-3 mt-4">
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
