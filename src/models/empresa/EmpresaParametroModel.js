class EmpresaParametroModel {
    constructor(data = {}) {
        this.cd_Empresa = data.cd_Empresa ?? data.cD_Empresa ?? data.CD_Empresa ?? '';
        this.fl_Reinicia_Numeracao_Fatura = data.fl_Reinicia_Numeracao_Fatura ?? data.fL_Reinicia_Numeracao_Fatura ?? data.FL_Reinicia_Numeracao_Fatura ?? '';
        this.fl_Numeracao_Tipo_Cliente = data.fl_Numeracao_Tipo_Cliente ?? data.fL_Numeracao_Tipo_Cliente ?? data.FL_Numeracao_Tipo_Cliente ?? '';
        this.sq_Fatura_C = data.sq_Fatura_C ?? data.sQ_Fatura_C ?? data.SQ_Fatura_C ?? '';
        this.sq_Fatura_E = data.sq_Fatura_E ?? data.sQ_Fatura_E ?? data.SQ_Fatura_E ?? '';
        this.fl_Usar_Filial_Faturamento = data.fl_Usar_Filial_Faturamento ?? data.fL_Usar_Filial_Faturamento ?? data.FL_Usar_Filial_Faturamento ?? '';
        this.fl_Tem_CIOT = data.fl_Tem_CIOT ?? data.fL_Tem_CIOT ?? data.FL_Tem_CIOT ?? '';
        this.fl_Tem_ATM = data.fl_Tem_ATM ?? data.fL_Tem_ATM ?? data.FL_Tem_ATM ?? '';
        this.fl_Remetente_Solicitante = data.fl_Remetente_Solicitante ?? data.fL_Remetente_Solicitante ?? data.FL_Remetente_Solicitante ?? '';
        this.fl_Baixa_XML_NFE = data.fl_Baixa_XML_NFE ?? data.fL_Baixa_XML_NFE ?? data.FL_Baixa_XML_NFE ?? '';
        this.fl_Tem_Milk_Run = data.fl_Tem_Milk_Run ?? data.fL_Tem_Milk_Run ?? data.FL_Tem_Milk_Run ?? '';
        this.fl_Tem_Intelepost = data.fl_Tem_Intelepost ?? data.fL_Tem_Intelepost ?? data.FL_Tem_Intelepost ?? '';
        this.fl_ATM_WS = data.fl_ATM_WS ?? data.fL_ATM_WS ?? data.FL_ATM_WS ?? '';
        this.qt_Licenca_Mobile = data.qt_Licenca_Mobile ?? data.qT_Licenca_Mobile ?? data.QT_Licenca_Mobile ?? 0;
        this.fl_Email_CTRC_Apenas_Tomador = data.fl_Email_CTRC_Apenas_Tomador ?? data.fL_Email_CTRC_Apenas_Tomador ?? data.FL_Email_CTRC_Apenas_Tomador ?? '';
        this.numeracao_Viagem = data.numeracao_Viagem ?? data.Numeracao_Viagem ?? '';
        this.fl_Numeracao_Viagem_Empresa = data.fl_Numeracao_Viagem_Empresa ?? data.fL_Numeracao_Viagem_Empresa ?? data.FL_Numeracao_Viagem_Empresa ?? '';
        this.pasta_Importacao_XML = data.pasta_Importacao_XML ?? data.Pasta_Importacao_XML ?? '';
        this.fl_Bloqueado = data.fl_Bloqueado ?? data.fL_Bloqueado ?? data.FL_Bloqueado ?? '';
        this.fl_Envio_Mensagem = data.fl_Envio_Mensagem ?? data.fL_Envio_Mensagem ?? data.FL_Envio_Mensagem ?? '';
        this.email_SAC = data.email_SAC ?? data.EMAIL_SAC ?? data.Email_SAC ?? '';
        this.fl_DRE_Padrao = data.fl_DRE_Padrao ?? data.fL_DRE_Padrao ?? data.FL_DRE_Padrao ?? '';
        
        // Atributos internos do C# podem ser mapeados caso a API precise
        this.tabelaDB = data.tabelaDB ?? data.TabelaDB ?? 'ST_Empresa_Parametro';
        this.primaryKeys = data.primaryKeys ?? data.PrimaryKeys ?? ['CD_Empresa'];
    }
}

export default EmpresaParametroModel;
