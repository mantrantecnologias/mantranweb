import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { XCircle, RotateCcw, Edit } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const iconCaminhao = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/726/726455.png",
  iconSize: [32, 32],
});
const iconEntrega = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
});

function Label({ children, className = "" }) {
  return <label className={`text-[12px] text-gray-600 ${className}`}>{children}</label>;
}
function Txt(props) {
  return (
    <input
      {...props}
      className={
        "border border-gray-300 rounded px-1 py-[2px] h-[24px] text-[13px] " +
        (props.className || "")
      }
    />
  );
}

export default function ViagemMonitoramento({ onClose }) {
  const [documentos] = useState([
    {
      id: 1,
      status: "Em Trânsito",
      documento: "62307",
      motivo: "Descarga parcial",
      tipo: "CT",
      coleta: "29/10/2025 00:00",
      prevChegada: "04/11/2025 05:32",
      chegada: "",
      saida: "",
      parada: "K.A. MENDES R ENGENHEIRO EDUARDO AFONSO NADOLNY, 826",
      endereco: "CURITIBA / PR",
      veiculo: "GQU3320 - SCANIA T113 H 4X2 320",
      motorista: "NAVEGANTES",
    },
  ]);

  // Coordenadas de exemplo (Campinas → Curitiba)
  const origem = [-22.9056, -47.0608];
  const destino = [-25.4284, -49.2733];
  const rota = [origem, destino];

  // Scroll automático ao abrir
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  // === Controle de arrastar ===
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* === MODAL FLUTUANTE === */}
      <div
        className="absolute bg-white rounded-lg shadow-lg border border-gray-300 w-[1200px] h-[700px] flex flex-col overflow-hidden"
        style={{
          top: position.y,
          left: position.x,
          cursor: dragging ? "grabbing" : "default",
        }}
      >
        {/* === CABEÇALHO === */}
        <div
          className="flex justify-between items-center bg-gradient-to-r from-red-700 to-gray-800 text-white px-4 py-2 rounded-t-lg select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-sm font-semibold">Monitoramento de Viagem</h2>
          <button onClick={onClose}>
            <XCircle size={20} className="text-white hover:text-gray-200" />
          </button>
        </div>

        {/* === CONTEÚDO === */}
        <div
          ref={containerRef}
          className="flex-1 bg-gray-50 p-3 flex flex-col gap-3 overflow-auto"
        >
          {/* === CARD 1 - MAPA === */}
          <fieldset className="border border-gray-300 rounded p-2 flex-1 flex flex-col h-[400px]">
            <legend className="text-red-700 font-semibold px-2">
              Localização da Viagem
            </legend>

            <div className="flex-1 border border-gray-200 rounded overflow-hidden">
              <MapContainer
                center={[-23.5, -47.5]}
                zoom={6}
                className="w-full h-full z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                <Marker position={origem} icon={iconCaminhao}>
                  <Popup>
                    <b>Origem:</b> Campinas/SP
                  </Popup>
                </Marker>
                <Marker position={destino} icon={iconEntrega}>
                  <Popup>
                    <b>Destino:</b> Curitiba/PR
                  </Popup>
                </Marker>
                <Polyline positions={rota} color="red" weight={3} />
              </MapContainer>
            </div>
          </fieldset>

          {/* === CARD 2 - GRID DOCUMENTOS === */}
          <fieldset className="border border-gray-300 rounded p-2 bg-white">
            <legend className="text-red-700 font-semibold px-2">
              Documentos da Viagem
            </legend>

            <div className="overflow-auto max-h-[180px] border border-gray-200 rounded">
              <table className="min-w-full text-[12px] border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {[
                      "Status",
                      "Nº Documento",
                      "Motivo Parada",
                      "Tipo",
                      "Data/Hora Coleta",
                      "Prev. Chegada",
                      "Data Chegada",
                      "Data Saída",
                      "Parada",
                      "Endereço Parada",
                      "Veículo",
                      "Motorista",
                    ].map((h) => (
                      <th
                        key={h}
                        className="border px-2 py-1 text-left whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((d, i) => (
                    <tr
                      key={d.id}
                      className={`${
                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-red-50 cursor-pointer transition`}
                      onClick={() =>
                        alert(`Abrir detalhes do documento ${d.documento}`)
                      }
                    >
                      <td className="border px-2">{d.status}</td>
                      <td className="border px-2">{d.documento}</td>
                      <td className="border px-2">{d.motivo}</td>
                      <td className="border px-2">{d.tipo}</td>
                      <td className="border px-2">{d.coleta}</td>
                      <td className="border px-2">{d.prevChegada}</td>
                      <td className="border px-2">{d.chegada || "--"}</td>
                      <td className="border px-2">{d.saida || "--"}</td>
                      <td className="border px-2">{d.parada}</td>
                      <td className="border px-2">{d.endereco}</td>
                      <td className="border px-2">{d.veiculo}</td>
                      <td className="border px-2">{d.motorista}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </fieldset>

          {/* === CARD 3 - RODAPÉ === */}
          <fieldset className="border border-gray-300 rounded p-2 flex justify-between items-center bg-white">
            <div className="flex gap-4 text-red-700">
              <button
                onClick={onClose}
                className="flex flex-col items-center text-[11px] hover:text-red-800"
              >
                <XCircle size={20} />
                <span>Fechar</span>
              </button>

              <button className="flex flex-col items-center text-[11px] hover:text-red-800">
                <RotateCcw size={20} />
                <span>Limpar</span>
              </button>

              <button className="flex flex-col items-center text-[11px] hover:text-red-800">
                <Edit size={20} />
                <span>Alterar</span>
              </button>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
