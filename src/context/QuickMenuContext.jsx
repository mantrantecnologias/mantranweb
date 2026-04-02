import { createContext, useContext, useState, useEffect } from "react";

const QuickMenuContext = createContext();

export function QuickMenuProvider({ children }) {
  const [quickMenu, setQuickMenu] = useState(() => {
    const salvo = localStorage.getItem("quickMenu");
    return salvo
      ? JSON.parse(salvo)
      : [
          {
            id: "viagem",
            label: "Viagem",
            icone: "fa-truck-fast",
            rota: "/viagem",
          },
          {
            id: "nfse",
            label: "NFSe",
            icone: "fa-file-invoice",
            rota: "/nfse",
          },
          {
            id: "cte",
            label: "CTe",
            icone: "fa-file-lines",
            rota: "/cte",
          },
          {
            id: "coleta",
            label: "Coleta",
            icone: "fa-boxes-packing",
            rota: "/coleta",
          },
          {
            id: "manifesto",
            label: "Manifesto",
            icone: "fa-file-contract",
            rota: "/manifesto",
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem("quickMenu", JSON.stringify(quickMenu));
  }, [quickMenu]);

  return (
    <QuickMenuContext.Provider value={{ quickMenu, setQuickMenu }}>
      {children}
    </QuickMenuContext.Provider>
  );
}

export function useQuickMenu() {
  return useContext(QuickMenuContext);
}
