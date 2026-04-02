const BASE_URL = import.meta.env.VITE_API_URL || "";

export default function IndexURI() {
  return {

    // ======= Autenticação / Login====================================================
    login_uri: `${BASE_URL}/api/Token`,
    logout_uri: `${BASE_URL}/api/Token/logout`,
    // ============================================================================

    // ======= Empresa====================================================================
    empresa_lista_uri: `${BASE_URL}/api/Empresa/buscar-lista-empresas`,
    empresa_incluir_uri: `${BASE_URL}/api/Empresa/incluir-empresa`,
    empresa_alterar_uri: `${BASE_URL}/api/Empresa/alterar-empresa`,
    empresa_excluir_uri: `${BASE_URL}/api/Empresa/excluir-empresa`,
    empresa_buscar_hub_uri: `${BASE_URL}/api/Empresa/buscar-empresa-hub-desenvolvedor`,
    empresa_buscar_parametro_uri: `${BASE_URL}/api/Empresa/buscar-empresa-parametro`,
    empresa_verifica_senha_uri: `${BASE_URL}/api/Empresa/verifica-senha-empresa`,
    empresa_alterar_parametro_uri: `${BASE_URL}/api/Empresa/alterar-empresa_parametro`,
    // ============================================================================


    // ======= CIOT====================================================================
    operadora_lista_uri: `${BASE_URL}/api/CIOT/buscar-lista-operadora-ciot`,
    operadora_buscar_uri: `${BASE_URL}/api/CIOT/buscar-operadora-ciot`,
    operadora_alterar_uri: `${BASE_URL}/api/CIOT/alterar-operador_ciot`,
    // ============================================================================

    // ======= Filial====================================================================
    filial_lista_uri: `${BASE_URL}/api/Filial/buscar-lista-filiais`,
    filial_buscar_uri: `${BASE_URL}/api/Filial/buscar-filial`,
    filial_incluir_uri: `${BASE_URL}/api/Filial/incluir-filial`,
    filial_alterar_uri: `${BASE_URL}/api/Filial/alterar-filial`,
    filial_excluir_uri: `${BASE_URL}/api/Filial/excluir-filial`,
    filial_buscar_parametro_uri: `${BASE_URL}/api/Filial/buscar-filial-parametro`,
    filial_alterar_parametro_uri: `${BASE_URL}/api/Filial/alterar-filial-parametro`,
    filial_buscar_hub_uri: `${BASE_URL}/api/Filial/buscar-filial-hub-desenvolvedor`,

    // ============================================================================
  };
}

