import { createContext, useContext, useEffect, useState } from "react";

// Criar contexto único para todas as cores
const IconColorContext = createContext();

// Valores padrão
const DEFAULT_COLOR = "text-red-700";
const DEFAULT_FOOTER_COLOR = "text-red-700";
const DEFAULT_FOOTER_HOVER = "text-red-900";

export function IconColorProvider({ children }) {
  // === HEADER + SIDEBAR ===
  const [iconColor, setIconColor] = useState(DEFAULT_COLOR);

  // === RODAPÉ ===
  const [footerIconColorNormal, setFooterIconColorNormal] = useState(DEFAULT_FOOTER_COLOR);
  const [footerIconColorHover, setFooterIconColorHover] = useState(DEFAULT_FOOTER_HOVER);

  // Carrega do localStorage ao iniciar
  useEffect(() => {
    const savedHeader = localStorage.getItem("param_iconColor");
    const savedFooterNormal = localStorage.getItem("param_footerIconColorNormal");
    const savedFooterHover = localStorage.getItem("param_footerIconColorHover");

    if (savedHeader) setIconColor(savedHeader);
    if (savedFooterNormal) setFooterIconColorNormal(savedFooterNormal);
    if (savedFooterHover) setFooterIconColorHover(savedFooterHover);
  }, []);

  // Salva no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("param_iconColor", iconColor);
  }, [iconColor]);

  useEffect(() => {
    localStorage.setItem("param_footerIconColorNormal", footerIconColorNormal);
  }, [footerIconColorNormal]);

  useEffect(() => {
    localStorage.setItem("param_footerIconColorHover", footerIconColorHover);
  }, [footerIconColorHover]);

  return (
    <IconColorContext.Provider
      value={{
        // Header & Sidebar
        iconColor,
        setIconColor,
        DEFAULT_COLOR,

        // Rodapé
        footerIconColorNormal,
        footerIconColorHover,
        setFooterIconColorNormal,
        setFooterIconColorHover,
        DEFAULT_FOOTER_COLOR,
        DEFAULT_FOOTER_HOVER,
      }}
    >
      {children}
    </IconColorContext.Provider>
  );
}

// Hook para usar facilmente
export function useIconColor() {
  return useContext(IconColorContext);
}
