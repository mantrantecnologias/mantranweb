import { createContext, useContext, useEffect, useState } from "react";

// Cores padrão do sistema
const DEFAULT_FOOTER_NORMAL = "text-red-700";
const DEFAULT_FOOTER_HOVER  = "text-red-900";

const FooterIconColorContext = createContext();

export function FooterIconColorProvider({ children }) {
  const [footerIconColor, setFooterIconColor] = useState(DEFAULT_FOOTER_NORMAL);
  const [footerIconHoverColor, setFooterIconHoverColor] = useState(DEFAULT_FOOTER_HOVER);

  // Carregar cores do localStorage
  useEffect(() => {
    const cor = localStorage.getItem("param_footerIconColor");
    const hover = localStorage.getItem("param_footerIconHoverColor");

    if (cor) setFooterIconColor(cor);
    if (hover) setFooterIconHoverColor(hover);
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem("param_footerIconColor", footerIconColor);
    localStorage.setItem("param_footerIconHoverColor", footerIconHoverColor);
  }, [footerIconColor, footerIconHoverColor]);

  return (
    <FooterIconColorContext.Provider
      value={{
        footerIconColor,
        setFooterIconColor,
        footerIconHoverColor,
        setFooterIconHoverColor,
        DEFAULT_FOOTER_NORMAL,
        DEFAULT_FOOTER_HOVER,
      }}
    >
      {children}
    </FooterIconColorContext.Provider>
  );
}

export function useFooterIconColor() {
  return useContext(FooterIconColorContext);
}
