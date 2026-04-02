import { XCircle, RotateCcw, PlusCircle, Edit, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}

function Txt({ readOnly = false, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`border rounded px-1 py-[2px] h-[26px] text-[13px] w-full ${
        readOnly ? "bg-gray-200 text-gray-600 cursor-not-allowed" : "bg-white"
      }`}
    />
  );
}

export default function ClienteContato({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const dragRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState("contato");

  const [contatos, setContatos] = useState([
    { nome: "ALAN", tipo: "F", email: "IMPLANTACAO@MANTRAN.COM.BR" },
  ]);
  const [form, setForm] = useState({
    cnpj: "50221019000136",
    razao: "HNK BR INDUSTRIA DE BEBIDAS LTDA",
    nome: "",
    fone: "",
    fax: "",
    departamento: "",
    cargo: "",
    email: "",
    observacao: "",
    tipoContato: "F",
  });

  // Centraliza o modal
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const { innerWidth, innerHeight } = window;
      const rect = modalRef.current.getBoundingClientRect();
      setPos({
        x: (innerWidth - rect.width) / 2,
        y: (innerHeight - rect.height) / 2,
      });
    }
  }, [isOpen]);

  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const duringDrag = (e) => {
    if (dragging) setPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const stopDrag = () => setDragging(false);

  const handleLimpar = () =>
    setForm({
      ...form,
      nome: "",
      fone: "",
      fax: "",
      departamento: "",
      cargo: "",
      email: "",
      observacao: "",
    });

  const handleIncluir = () => {
    if (!form.nome || !form.email) return alert("Preencha nome e e-mail!");
    const tipo = form.tipoContato === "F" ? "F" : "P";
    setContatos([...contatos, { nome: form.nome, tipo, email: form.email }]);
    alert("Contato incluído com sucesso!");
  };

  const handleSelectContato = (c) => {
    setForm({
      ...form,
      nome: c.nome,
      email: c.email,
      tipoContato: c.tipo === "F" ? "F" : "P",
    });
    setActiveTab("contato");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onMouseMove={duringDrag}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        className="absolute bg-white border border-gray-300 rounded-md shadow-lg w-[90vw] max-w-[900px] max-h-[90vh] overflow-y-auto p-3"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === Cabeçalho === */}
        <div
          ref={dragRef}
          onMouseDown={startDrag}
          className="text-center text-red-700 font-semibold text-[14px] py-1 border-b cursor-grab select-none"
        >
          CLIENTE - CONTATO
        </div>

        {/* === Abas === */}
        <div className="flex border-b border-gray-300 bg-white mt-2">
          {["contato", "lista"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 text-sm font-medium border-t border-x rounded-t-md ${
                activeTab === tab
                  ? "bg-white text-red-700 border-gray-300"
                  : "bg-gray-100 text-gray-600 border-transparent"
              } ${tab !== "contato" ? "ml-1" : ""}`}
            >
              {tab === "contato" ? "Contato" : "Lista de Contatos"}
            </button>
          ))}
        </div>

        {/* === CONTEÚDO === */}
        <div className="p-3 text-[13px] space-y-3">
          {/* === ABA CONTATO === */}
          {activeTab === "contato" && (
            <>
              {/* === CARD 1 === */}
              <fieldset className="border border-gray-300 rounded p-3 space-y-4">
  <legend className="text-red-700 font-semibold px-2">Dados</legend>

                {/* Linha 1 */}
                <div className="grid grid-cols-[100px_160px_1fr] gap-2 items-center">
                  <Label className="text-right">CNPJ Cliente</Label>
                  <Txt value={form.cnpj} readOnly />
                  <Txt value={form.razao} readOnly />
                </div>

                {/* Linha 2 */}
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <Label className="text-right">Nome do Contato</Label>
                  <Txt
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  />
                </div>

                {/* Linha 3 */}
                <div className="grid grid-cols-[100px_180px_100px_1fr] gap-2 items-center">
                  <Label className="text-right">Fone</Label>
                  <Txt
                    value={form.fone}
                    onChange={(e) => setForm({ ...form, fone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                  <Label className="text-right">Departamento</Label>
                  <Txt
                    value={form.departamento}
                    onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                  />
                </div>

                {/* Linha 4 */}
                <div className="grid grid-cols-[100px_1fr] gap-2 items-center">
                  <Label className="text-right">E-mail</Label>
                  <Txt
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Linha 5 */}
                <div className="grid grid-cols-[100px_1fr] gap-2 items-start">
                  <Label className="text-right mt-[4px]">Observação</Label>
                  <textarea
                    value={form.observacao}
                    onChange={(e) => setForm({ ...form, observacao: e.target.value })}
                    className="border border-gray-300 rounded px-2 py-1 text-[13px] w-full min-h-[60px] resize-y"
                  ></textarea>
                </div>
              </fieldset>

              {/* === CARD 2 === */}
              <fieldset className="border border-gray-300 rounded p-3">
                <legend className="text-red-700 font-semibold px-2">Tipo de Contato</legend>
                <div className="flex gap-8">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="tipo"
                      value="P"
                      checked={form.tipoContato === "P"}
                      onChange={(e) => setForm({ ...form, tipoContato: e.target.value })}
                    />
                    Pendência
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="tipo"
                      value="F"
                      checked={form.tipoContato === "F"}
                      onChange={(e) => setForm({ ...form, tipoContato: e.target.value })}
                    />
                    Faturamento
                  </label>
                </div>
              </fieldset>
            </>
          )}

          {/* === ABA LISTA DE CONTATOS === */}
          {activeTab === "lista" && (
            <fieldset className="border border-gray-300 rounded p-3">
              <legend className="text-red-700 font-semibold px-2">Lista de Contatos</legend>
              <div className="border border-gray-300 rounded max-h-[400px] overflow-auto">
                <table className="min-w-full text-[12px] border-collapse">
                  <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                    <tr>
                      {["Nome", "Tipo", "E-mail"].map((col) => (
                        <th key={col} className="border px-2 py-1 text-left">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {contatos.map((c, i) => (
                      <tr
                        key={i}
                        onClick={() => handleSelectContato(c)}
                        className="hover:bg-gray-50 cursor-pointer"
                      >
                        <td className="border px-2 py-1">{c.nome}</td>
                        <td className="border px-2 py-1">{c.tipo}</td>
                        <td className="border px-2 py-1">{c.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </fieldset>
          )}
        </div>

        {/* === Rodapé com ícones padrão === */}
        <div className="border-t mt-3 pt-2 flex justify-between bg-white sticky bottom-0">
          <div className="flex gap-3">
            {[
              { icon: XCircle, label: "Fechar", action: onClose },
              { icon: RotateCcw, label: "Limpar", action: handleLimpar },
              { icon: PlusCircle, label: "Incluir", action: handleIncluir },
              { icon: Edit, label: "Alterar" },
              { icon: Trash2, label: "Excluir" },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="flex items-center gap-1 text-red-700 hover:text-gray-700 text-[13px]"
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
