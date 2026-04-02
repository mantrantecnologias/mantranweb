import { createContext, useContext, useEffect, useState } from "react";

const ModulosContext = createContext();

const DEFAULT_MODULOS = {
  operacao: true,        // 🔥 padrão ativo
  ecommerce: false,
  financeiro: true,      // 🔥 padrão ativo
  ediXml: false,
  oficina: false,
  bi: false,
  relatorios: false,
  comercial: false,
  crm: false,
  seguranca: false,
  wms: false,
  roteirizador: false,
  baixaXml: false,
  vendas: false,
  localize: false,
  mobile: false,
};

export function ModulosProvider({ children }) {
  const [modulos, setModulos] = useState(() => {
    const salvo = localStorage.getItem("mantran_modulos_empresa");
    return salvo ? JSON.parse(salvo) : DEFAULT_MODULOS;
  });

  // 🔥 sempre que mudar, persiste
  useEffect(() => {
    localStorage.setItem(
      "mantran_modulos_empresa",
      JSON.stringify(modulos)
    );
  }, [modulos]);

  return (
    <ModulosContext.Provider value={{ modulos, setModulos }}>
      {children}
    </ModulosContext.Provider>
  );
}

export function useModulos() {
  return useContext(ModulosContext);
}
