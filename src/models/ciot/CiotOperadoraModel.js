export class CiotModel {
    constructor(data = {}) {
        // Reservado para futuras implementações caso CIOT_Transp ganhe propriedades
    }
}

export class CiotOperadoraModel {
    constructor(data = {}) {
        this.cd_Operadora = data.cd_Operadora ?? data.cD_Operadora ?? data.CD_Operadora ?? '';
        this.nome = data.nome ?? data.Nome ?? data.NOME ?? '';
        this.nome_Usuario = data.nome_Usuario ?? data.Nome_Usuario ?? '';
        this.senha = data.senha ?? data.Senha ?? '';
        this.fl_Gerar_Contas_Pagar = data.fl_Gerar_Contas_Pagar ?? data.fL_Gerar_Contas_Pagar ?? data.FL_Gerar_Contas_Pagar ?? '';
        this.fl_Operadora_Utilizada = data.fl_Operadora_Utilizada ?? data.fL_Operadora_Utilizada ?? data.FL_Operadora_Utilizada ?? '';
        this.nr_Ultima_Rota = data.nr_Ultima_Rota ?? data.nR_Ultima_Rota ?? data.NR_Ultima_Rota ?? '';
        this.cd_Natureza_Carga = data.cd_Natureza_Carga ?? data.cD_Natureza_Carga ?? data.CD_Natureza_Carga ?? '';
        this.qt_Dias_Agregado = data.qt_Dias_Agregado ?? data.qT_Dias_Agregado ?? data.QT_Dias_Agregado ?? 0;
        this.qt_Dias_Terceiro = data.qt_Dias_Terceiro ?? data.qT_Dias_Terceiro ?? data.QT_Dias_Terceiro ?? 0;
        this.qt_Dias_Cooperado = data.qt_Dias_Cooperado ?? data.qT_Dias_Cooperado ?? data.QT_Dias_Cooperado ?? 0;
        this.cd_Evento_Pedagio = data.cd_Evento_Pedagio ?? data.cD_Evento_Pedagio ?? data.CD_Evento_Pedagio ?? '';
        this.cd_Pagamento_Pedagio = data.cd_Pagamento_Pedagio ?? data.cD_Pagamento_Pedagio ?? data.CD_Pagamento_Pedagio ?? 0;
        this.cd_Categoria_Pedagio = data.cd_Categoria_Pedagio ?? data.cD_Categoria_Pedagio ?? data.CD_Categoria_Pedagio ?? 0;
        this.cd_Sub_Categoria_Pedagio = data.cd_Sub_Categoria_Pedagio ?? data.cD_Sub_Categoria_Pedagio ?? data.CD_Sub_Categoria_Pedagio ?? 0;
        this.st_Pedagio = data.st_Pedagio ?? data.sT_Pedagio ?? data.ST_Pedagio ?? 0;
        this.sl_Pedagio = data.sl_Pedagio ?? data.sL_Pedagio ?? data.SL_Pedagio ?? 0;
        this.fl_Categoria_Veiculo = data.fl_Categoria_Veiculo ?? data.fL_Categoria_Veiculo ?? data.FL_Categoria_Veiculo ?? '';
        this.cd_Meio_Pagamento = data.cd_Meio_Pagamento ?? data.cD_Meio_Pagamento ?? data.CD_Meio_Pagamento ?? 0;
        this.tp_Conta = data.tp_Conta ?? data.tP_Conta ?? data.TP_Conta ?? 0;
        this.st_Pagamento = data.st_Pagamento ?? data.sT_Pagamento ?? data.ST_Pagamento ?? 0;
        this.tp_Efetivacao = data.tp_Efetivacao ?? data.tP_Efetivacao ?? data.TP_Efetivacao ?? 0;
        this.cd_Evento = data.cd_Evento ?? data.cD_Evento ?? data.CD_Evento ?? '';
        this.cd_Pagamento = data.cd_Pagamento ?? data.cD_Pagamento ?? data.CD_Pagamento ?? 0;
        this.cd_Categoria = data.cd_Categoria ?? data.cD_Categoria ?? data.CD_Categoria ?? 0;
        this.cd_Sub_Categoria = data.cd_Sub_Categoria ?? data.cD_Sub_Categoria ?? data.CD_Sub_Categoria ?? 0;
        this.link_Producao = data.link_Producao ?? data.Link_Producao ?? '';
        this.link_Homologacao = data.link_Homologacao ?? data.Link_Homologacao ?? '';
        this.versao = data.versao ?? data.Versao ?? '';
        this.ambiente = data.ambiente ?? data.Ambiente ?? '';
        this.fl_Apenas_Vale_Pedagio = data.fl_Apenas_Vale_Pedagio ?? data.fL_Apenas_Vale_Pedagio ?? data.FL_Apenas_Vale_Pedagio ?? '';
        
        // Internal properties
        this.tabelaDB = data.tabelaDB ?? data.TabelaDB ?? 'ST_CIOT_Operadora';
        this.primaryKeys = data.primaryKeys ?? data.PrimaryKeys ?? ['CD_Operadora'];
    }
}

export default CiotOperadoraModel;
