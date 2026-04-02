import { useState, useRef, useEffect } from "react";
import {
  XCircle,
  Trash2,
  Edit,
  PlusCircle,
  RotateCcw,
  FileText,
} from "lucide-react";
import InputBuscaCliente from "../components/InputBuscaCliente";
import InputBuscaLocalidadeAduaneira from "../components/InputBuscaLocalidadeAduaneira";

function Label({ children, className = "" }) {
  return (
    <label
      className={`text-[12px] text-gray-700 font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </label>
  );
}

function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-2 h-[22px] text-[13px] outline-none focus:ring-1 focus:ring-red-200 " +
        (props.className || "")
      }
    />
  );
}

function Sel({ children, className = "", ...rest }) {
  return (
    <select
      {...rest}
      className={`border border-gray-300 rounded px-1 h-[22px] text-[13px] outline-none focus:ring-1 focus:ring-red-200 ${className}`}
    >
      {children}
    </select>
  );
}

export default function Comex({ onClose }) {
  const modalRef = useRef(null);

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

  // Foco inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      const first = modalRef.current?.querySelector('[tabindex="1"]');
      if (first) first.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const [documentos, setDocumentos] = useState([]);
  const [novoDoc, setNovoDoc] = useState({
    di: "",
    processo: "",
    referencia: "",
    reserva: "",
    lacre: "",
  });

  const [participantes, setParticipantes] = useState({
    armador: "",
    armadorRazao: "",
    exportador: "",
    exportadorRazao: "",
  });

  const handleParticipanteChange = (campo) => (e) => {
    setParticipantes({ ...participantes, [campo]: e.target.value, [`${campo}Razao`]: "" });
  };

  const handleParticipanteSelect = (campo) => (emp) => {
    setParticipantes({ ...participantes, [campo]: emp.cnpj, [`${campo}Razao`]: emp.razao });
  };

  const [comex, setComex] = useState({
    localEmbarque: "",
    localEmbarqueDesc: "",
    localDesembarque: "",
    localDesembarqueDesc: "",
    terminalRetirada: "",
    terminalRetiradaDesc: "",
    terminalEntrega: "",
    terminalEntregaDesc: "",
    retiradaContainer: "",
    retiradaContainerDesc: "",
    devContainer: "",
    devContainerDesc: "",
    tipoContainer: "",
  });

  const handleComexChange = (campo) => (e) => {
    setComex({ ...comex, [campo]: e.target.value, [`${campo}Desc`]: "" });
  };

  const handleComexSelect = (campo) => (loc) => {
    setComex({ ...comex, [campo]: loc.codigo, [`${campo}Desc`]: loc.nome });
  };

  const adicionarDocumento = () => {
    if (novoDoc.di.trim() === "") return;
    setDocumentos([...documentos, novoDoc]);
    setNovoDoc({
      di: "",
      processo: "",
      referencia: "",
      reserva: "",
      lacre: "",
    });
  };

  const removerDocumento = (index) => {
    const atualizados = documentos.filter((_, i) => i !== index);
    setDocumentos(atualizados);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-auto">
      <div
        ref={modalRef}
        className="bg-white w-[1200px] rounded shadow-lg border border-gray-300"
      >
        {/* TÍTULO */}
        <div className="bg-black text-white text-center py-1 font-semibold text-[14px]">
          COMEX
        </div>

        <div className="p-3 space-y-3 text-[13px]">
          {/* CARD 1 - CONTROLE DO CONTAINER */}
          <div className="border border-gray-300 rounded p-2 space-y-2">
            <h2 className="text-[13px] font-semibold text-gray-700 mb-1 text-center border-b pb-1">
              Controle do Container
            </h2>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="w-[120px] text-right">Nº Container</Label>
                <Txt
                  className="w-[200px]"
                  tabIndex={1}
                  onKeyDown={handleEnterAsTab}
                />
                <Label className="w-[100px] text-right">Vr. Container</Label>
                <Txt
                  className="w-[100px]"
                  tabIndex={2}
                  onKeyDown={handleEnterAsTab}
                />
                <Label className="w-[60px] text-right">Tara</Label>
                <Txt
                  className="w-[100px]"
                  tabIndex={3}
                  onKeyDown={handleEnterAsTab}
                />
                <Label className="w-[140px] text-right">Impostos Suspensos</Label>
                <Txt
                  className="w-[100px]"
                  tabIndex={4}
                  onKeyDown={handleEnterAsTab}
                />
              </div>

              {/* Linha 2: Tipo, Navio */}
              <div className="flex items-center gap-2">
                <Label className="w-[120px] text-right">Tipo</Label>
                <Sel
                  className="flex-1"
                  value={comex.tipoContainer}
                  onChange={handleComexChange("tipoContainer")}
                  tabIndex={5}
                  onKeyDown={handleEnterAsTab}
                >
                  <option value=""></option>
                  <option value="20 DRY">20 DRY</option>
                  <option value="20 DRY ST">20 DRY ST</option>
                  <option value="20 FLAT RACK">20 FLAT RACK</option>
                  <option value="20 ISOTANK">20 ISOTANK</option>
                  <option value="20 OPEN TOP">20 OPEN TOP</option>
                  <option value="20 REEFER">20 REEFER</option>
                  <option value="40 DRY">40 DRY</option>
                  <option value="40 DRY ST">40 DRY ST</option>
                  <option value="40 FLAT RACK">40 FLAT RACK</option>
                  <option value="40 HIGH CUBIC">40 HIGH CUBIC</option>
                  <option value="40 OPEN TOP">40 OPEN TOP</option>
                  <option value="40 REEFER HIGH CUBIC">40 REEFER HIGH CUBIC</option>
                  <option value="40 REEFER STANDARD">40 REEFER STANDARD</option>
                </Sel>
                <Label className="w-[80px] text-right">Navio</Label>
                <Txt
                  className="flex-1"
                  tabIndex={6}
                  onKeyDown={handleEnterAsTab}
                />
              </div>

              {/* Linha 3: Armador */}
              <div className="flex items-center gap-2">
                <Label className="w-[120px] text-right">Armador</Label>
                <InputBuscaCliente
                  className="w-[180px]"
                  inputClassName="h-[22px]"
                  value={participantes.armador}
                  onChange={handleParticipanteChange("armador")}
                  onSelect={(emp) => {
                    handleParticipanteSelect("armador")(emp);
                    focusNextTabIndex(7);
                  }}
                  tabIndex={7}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={participantes.armadorRazao} tabIndex={-1} />
              </div>

              {/* Linha 4: Exportador */}
              <div className="flex items-center gap-2">
                <Label className="w-[120px] text-right">Exportador</Label>
                <InputBuscaCliente
                  className="w-[180px]"
                  inputClassName="h-[22px]"
                  value={participantes.exportador}
                  onChange={handleParticipanteChange("exportador")}
                  onSelect={(emp) => {
                    handleParticipanteSelect("exportador")(emp);
                    focusNextTabIndex(8);
                  }}
                  tabIndex={8}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={participantes.exportadorRazao} tabIndex={-1} />
              </div>

              {/* Linha 5: Local Embarque, Local Desembarque */}
              <div className="flex items-center gap-2">
                <Label className="w-[130px] text-right">Local Embarque</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.localEmbarque}
                  onChange={handleComexChange("localEmbarque")}
                  onSelect={(loc) => {
                    handleComexSelect("localEmbarque")(loc);
                    focusNextTabIndex(9);
                  }}
                  tabIndex={9}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.localEmbarqueDesc} tabIndex={-1} />
                <Label className="w-[140px] text-right">Local Desembarque</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.localDesembarque}
                  onChange={handleComexChange("localDesembarque")}
                  onSelect={(loc) => {
                    handleComexSelect("localDesembarque")(loc);
                    focusNextTabIndex(10);
                  }}
                  tabIndex={10}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.localDesembarqueDesc} tabIndex={-1} />
              </div>

              {/* Linha 6: Terminal Retirada, Terminal Entrega */}
              <div className="flex items-center gap-2">
                <Label className="w-[130px] text-right">Terminal Retirada</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.terminalRetirada}
                  onChange={handleComexChange("terminalRetirada")}
                  onSelect={(loc) => {
                    handleComexSelect("terminalRetirada")(loc);
                    focusNextTabIndex(11);
                  }}
                  tabIndex={11}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.terminalRetiradaDesc} tabIndex={-1} />
                <Label className="w-[140px] text-right">Terminal Entrega</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.terminalEntrega}
                  onChange={handleComexChange("terminalEntrega")}
                  onSelect={(loc) => {
                    handleComexSelect("terminalEntrega")(loc);
                    focusNextTabIndex(12);
                  }}
                  tabIndex={12}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.terminalEntregaDesc} tabIndex={-1} />
              </div>

              {/* Linha 7: Retirada Container, Dev. Container */}
              <div className="flex items-center gap-2">
                <Label className="w-[130px] text-right">Retirada Container</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.retiradaContainer}
                  onChange={handleComexChange("retiradaContainer")}
                  onSelect={(loc) => {
                    handleComexSelect("retiradaContainer")(loc);
                    focusNextTabIndex(13);
                  }}
                  tabIndex={13}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.retiradaContainerDesc} tabIndex={-1} />
                <Label className="w-[140px] text-right">Dev. Container</Label>
                <InputBuscaLocalidadeAduaneira
                  className="w-[80px]"
                  inputClassName="h-[22px]"
                  value={comex.devContainer}
                  onChange={handleComexChange("devContainer")}
                  onSelect={(loc) => {
                    handleComexSelect("devContainer")(loc);
                    focusNextTabIndex(14);
                  }}
                  tabIndex={14}
                />
                <Txt className="flex-1 bg-gray-200" readOnly value={comex.devContainerDesc} tabIndex={-1} />
              </div>

              {/* Linha 8: Data Programação (esq)  |  Devolve Container (dir) */}
              <div className="flex items-center gap-2">
                {/* Grupo esquerdo */}
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Data Programação</Label>
                  <Txt
                    type="datetime-local"
                    className="w-[250px]"
                    tabIndex={15}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>

                {/* Espaçador para jogar o próximo grupo à direita */}
                <div className="flex-1" />

                {/* Grupo direito (alinhado à direita) */}
                <div className="flex items-center gap-2">
                  <Label className="w-[140px] text-right">Devolve Container</Label>
                  <Txt
                    type="datetime-local"
                    className="w-[250px]"
                    tabIndex={16}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
              </div>


              {/* Linha 9: Nº CTRC Master, Valor Dev. Container (alinhado à direita) */}
              <div className="flex items-center gap-2 justify-end">
                <Label className="w-[130px] text-right">Nº CTRC Master</Label>
                <Txt
                  className="w-[150px]"
                  tabIndex={17}
                  onKeyDown={handleEnterAsTab}
                />
                <Label className="w-[150px] text-right">Valor Dev. Container</Label>
                <Txt className="w-[115px]" tabIndex={-1} />
              </div>
            </div>
          </div>


          {/* CARD 2 - DOCUMENTOS ADUANEIROS */}
          <div className="border border-gray-300 rounded p-2 space-y-2">
            <h2 className="text-[13px] font-semibold text-gray-700 mb-1">
              Documentos Aduaneiros
            </h2>

            <div className="space-y-2">
              {/* Linha 1: Nº DI / DTA | Nº Processo DI */}
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº DI / DTA</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.di}
                    onChange={(e) => setNovoDoc({ ...novoDoc, di: e.target.value })}
                    tabIndex={18}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Processo DI</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.processo}
                    onChange={(e) => setNovoDoc({ ...novoDoc, processo: e.target.value })}
                    tabIndex={19}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
              </div>

              {/* Linha 2: Nº Referência | Nº Lacre */}
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Referência</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.referencia}
                    onChange={(e) => setNovoDoc({ ...novoDoc, referencia: e.target.value })}
                    tabIndex={20}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Lacre</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.lacre}
                    onChange={(e) => setNovoDoc({ ...novoDoc, lacre: e.target.value })}
                    tabIndex={21}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
              </div>

              {/* Linha 3: Nº Reserva | Nº Lacre Compl. */}
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Reserva</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.reserva}
                    onChange={(e) => setNovoDoc({ ...novoDoc, reserva: e.target.value })}
                    tabIndex={22}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Lacre Compl.</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.lacreCompl}
                    onChange={(e) => setNovoDoc({ ...novoDoc, lacreCompl: e.target.value })}
                    tabIndex={23}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
              </div>

              {/* Linha 4: Nº CTRC House | Nº Invoice */}
              <div className="grid grid-cols-2 gap-x-6">
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº CTRC House</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.ctrcHouse}
                    onChange={(e) => setNovoDoc({ ...novoDoc, teacher: e.target.value })}
                    tabIndex={24}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="w-[130px] text-right">Nº Invoice</Label>
                  <Txt
                    className="flex-1"
                    value={novoDoc.invoice}
                    onChange={(e) => setNovoDoc({ ...novoDoc, invoice: e.target.value })}
                    tabIndex={25}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>
              </div>

              {/* Linha 5: Nº Nota Fiscal + Botões */}
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <Label className="w-[130px] text-right">Nº Nota Fiscal</Label>
                  <Txt
                    className="w-[250px]"
                    value={novoDoc.notaFiscal}
                    onChange={(e) => setNovoDoc({ ...novoDoc, notaFiscal: e.target.value })}
                    tabIndex={26}
                    onKeyDown={handleEnterAsTab}
                  />
                </div>

                <div className="flex items-center gap-2 text-red-700">
                  <button
                    title="Limpar"
                    className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-3 py-[4px] flex items-center gap-1 text-[12px] text-gray-700 outline-none focus:ring-1 focus:ring-red-200"
                    onClick={() =>
                      setNovoDoc({ di: "", processo: "", referencia: "", reserva: "", lacre: "" })
                    }
                    tabIndex={-1}
                  >
                    <RotateCcw size={14} className="text-red-600" /> Limpar
                  </button>

                  <button
                    title="Remover"
                    onClick={() => removerDocumento(documentos.length - 1)}
                    className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-3 py-[4px] flex items-center gap-1 text-[12px] text-gray-700 outline-none focus:ring-1 focus:ring-red-200"
                    tabIndex={-1}
                  >
                    <Trash2 size={14} className="text-red-600" /> Remover
                  </button>

                  <button
                    title="Alterar"
                    className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-3 py-[4px] flex items-center gap-1 text-[12px] text-gray-700 outline-none focus:ring-1 focus:ring-red-200"
                    tabIndex={-1}
                  >
                    <Edit size={14} className="text-red-600" /> Alterar
                  </button>

                  <button
                    title="Adicionar"
                    onClick={adicionarDocumento}
                    className="border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded px-3 py-[4px] flex items-center gap-1 text-[12px] text-gray-700 outline-none focus:ring-2 focus:ring-red-200"
                    tabIndex={27}
                    onKeyDown={handleEnterAsTab}
                  >
                    <PlusCircle size={14} className="text-green-700" /> Adicionar
                  </button>
                </div>
              </div>
            </div>
          </div>






          {/* CARD 4 - GRID */}
          <div className="border border-gray-300 rounded mt-2">
            <table className="w-full text-[12px] text-gray-700">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="text-left px-2 py-1">Nº DI/DTA</th>
                  <th className="text-left px-2 py-1">Nº Processo DI</th>
                  <th className="text-left px-2 py-1">Nº Referência</th>
                  <th className="text-left px-2 py-1">Nº Reserva</th>
                  <th className="text-left px-2 py-1">Nº Lacre</th>
                </tr>
              </thead>
              <tbody>
                {documentos.map((doc, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-1">{doc.di}</td>
                    <td className="px-2 py-1">{doc.processo}</td>
                    <td className="px-2 py-1">{doc.referencia}</td>
                    <td className="px-2 py-1">{doc.reserva}</td>
                    <td className="px-2 py-1">{doc.lacre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-4 mt-3 text-red-700">
            <button
              title="Fechar Tela"
              onClick={onClose}
              className="hover:opacity-80 transition outline-none focus:ring-2 focus:ring-red-200 rounded"
              tabIndex={29}
            >
              <XCircle />
            </button>
            <button
              title="Limpar Tela"
              className="outline-none focus:ring-2 focus:ring-red-200 rounded"
              tabIndex={-1}
            >
              <RotateCcw />
            </button>
            <button
              title="Salvar"
              className="outline-none focus:ring-2 focus:ring-red-200 rounded"
              tabIndex={28}
              onKeyDown={handleEnterAsTab}
            >
              <FileText />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
