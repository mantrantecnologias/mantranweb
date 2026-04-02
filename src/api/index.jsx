import React from "react";
import { useState, useEffect } from "react";

export default function IndexURI() {
  return {

    // ======= Autenticação / Login====================================================
    login_uri: "/api/Token",
    logout_uri: "/api/Token/logout",
    // ============================================================================

    // ======= Empresa====================================================================
    empresa_lista_uri: "/api/Empresa/buscar-lista-empresas",
    empresa_incluir_uri: "/api/Empresa/incluir-empresa",
    empresa_alterar_uri: "/api/Empresa/alterar-empresa",
    empresa_excluir_uri: "/api/Empresa/excluir-empresa",
    empresa_buscar_hub_uri: "/api/Empresa/buscar-empresa-hub-desenvolvedor",
    empresa_buscar_parametro_uri: "/api/Empresa/buscar-empresa-parametro",
    empresa_verifica_senha_uri: "/api/Empresa/verifica-senha-empresa",
    empresa_alterar_parametro_uri: "/api/Empresa/alterar-empresa_parametro",
    // ============================================================================


    // ======= CIOT====================================================================
    operadora_lista_uri: "/api/CIOT/buscar-lista-operadora-ciot",
    operadora_buscar_uri: "/api/CIOT/buscar-operadora-ciot",
    operadora_alterar_uri: "/api/CIOT/alterar-operador_ciot",
    // ============================================================================

    // ======= Filial====================================================================
    filial_lista_uri: "/api/Filial/buscar-lista-filiais",
    filial_buscar_uri: "/api/Filial/buscar-filial",
    filial_incluir_uri: "/api/Filial/incluir-filial",
    filial_alterar_uri: "/api/Filial/alterar-filial",
    filial_excluir_uri: "/api/Filial/excluir-filial",
    filial_buscar_parametro_uri: "/api/Filial/buscar-filial-parametro",
    filial_alterar_parametro_uri: "/api/Filial/alterar-filial-parametro",
    filial_buscar_hub_uri: "/api/Filial/buscar-filial-hub-desenvolvedor",

    // ============================================================================
  };
}
