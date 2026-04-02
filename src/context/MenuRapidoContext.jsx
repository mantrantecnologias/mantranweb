import { createContext, useContext, useState, useEffect } from "react";

// --- ATALHOS PADRÃO DO SISTEMA ---
const atalhosPadrao = [
  { id: 1, label: "Viagem", rota: "/viagem", icone: "fa-truck-fast" },
  { id: 2, label: "NFSe", rota: "/nfse", icone: "fa-file-invoice" },
  { id: 3, label: "CTe", rota: "/cte", icone: "fa-file-lines" },
  { id: 4, label: "Coleta", rota: "/coleta", icone: "fa-boxes-packing" },
  { id: 5, label: "Manifesto", rota: "/manifesto", icone: "fa-file-contract" },
  
];

const MenuRapidoContext = createContext();

export function MenuRapidoProvider({ children }) {
  const [atalhos, setAtalhos] = useState(() => {
    const salvo = localStorage.getItem("menuRapido");
    return salvo ? JSON.parse(salvo) : atalhosPadrao;
  });

  useEffect(() => {
    localStorage.setItem("menuRapido", JSON.stringify(atalhos));
  }, [atalhos]);

  const adicionarAtalho = (atalho) => {
    setAtalhos((prev) => [...prev, atalho]);
  };

const removerAtalho = (rota) => {
  setAtalhos((prev) => prev.filter((a) => a.rota !== rota));
};


  const restaurarPadrao = () => {
    setAtalhos(atalhosPadrao);
  };

  return (
    <MenuRapidoContext.Provider
      value={{ atalhos, adicionarAtalho, removerAtalho, restaurarPadrao }}
    >
      {children}
    </MenuRapidoContext.Provider>
  );
}

export function useMenuRapido() {
  return useContext(MenuRapidoContext);
}
