import { createContext, useContext, useEffect, useState } from "react";

const IconColorContext = createContext();

// === Função para obter prefixo do módulo ativo ===
function getModuloPrefix() {
  const modulo = localStorage.getItem("mantran_modulo") || "operacao";

  switch (modulo) {
    case "financeiro":
      return "fin_";
    case "comercial":
      return "com_";
    case "wms":
      return "wms_";
    case "oficina":
      return "oficina_";
    default:
      return "op_";
  }
}

// === Função para obter DEFAULTS por módulo ===
function getDefaultsByModulo() {
  const modulo = localStorage.getItem("mantran_modulo") || "operacao";

  switch (modulo) {
    case "financeiro":
      return {
        DEFAULT_ICON_COLOR: "text-green-700",
        DEFAULT_FOOTER_NORMAL: "text-green-700",
        DEFAULT_FOOTER_HOVER: "text-green-900",
      };

    case "wms":
      return {
        DEFAULT_ICON_COLOR: "text-red-900",
        DEFAULT_FOOTER_NORMAL: "text-red-900",
        DEFAULT_FOOTER_HOVER: "text-slate-900",
      };

    case "oficina":
      return {
        DEFAULT_ICON_COLOR: "text-orange-700",
        DEFAULT_FOOTER_NORMAL: "text-orange-700",
        DEFAULT_FOOTER_HOVER: "text-orange-900",
      };

    default: // operação
      return {
        DEFAULT_ICON_COLOR: "text-red-700",
        DEFAULT_FOOTER_NORMAL: "text-red-700",
        DEFAULT_FOOTER_HOVER: "text-red-900",
      };
  }
}

export function IconColorProvider({ children }) {
  const prefix = getModuloPrefix();

  const {
    DEFAULT_ICON_COLOR,
    DEFAULT_FOOTER_NORMAL,
    DEFAULT_FOOTER_HOVER,
  } = getDefaultsByModulo();

  // ================= HEADER / SIDEBAR =================
  const [iconColor, setIconColor] = useState(
    localStorage.getItem(prefix + "iconColor") || DEFAULT_ICON_COLOR
  );

  // ================= RODAPÉ NORMAL =================
  const [footerIconColorNormal, setFooterIconColorNormal] = useState(
    localStorage.getItem(prefix + "footerNormal") || DEFAULT_FOOTER_NORMAL
  );

  // ================= RODAPÉ HOVER =================
  const [footerIconColorHover, setFooterIconColorHover] = useState(
    localStorage.getItem(prefix + "footerHover") || DEFAULT_FOOTER_HOVER
  );

  // ================= PERSISTÊNCIA =================
  useEffect(() => {
    localStorage.setItem(prefix + "iconColor", iconColor);
  }, [iconColor, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + "footerNormal", footerIconColorNormal);
  }, [footerIconColorNormal, prefix]);

  useEffect(() => {
    localStorage.setItem(prefix + "footerHover", footerIconColorHover);
  }, [footerIconColorHover, prefix]);

  return (
    <IconColorContext.Provider
      value={{
        iconColor,
        setIconColor,

        footerIconColorNormal,
        footerIconColorHover,
        setFooterIconColorNormal,
        setFooterIconColorHover,

        DEFAULT_ICON_COLOR,
        DEFAULT_FOOTER_NORMAL,
        DEFAULT_FOOTER_HOVER,
      }}
    >
      {children}
    </IconColorContext.Provider>
  );
}

export function useIconColor() {
  return useContext(IconColorContext);
}
