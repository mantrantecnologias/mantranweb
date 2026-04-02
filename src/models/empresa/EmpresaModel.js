class EmpresaModel {
    constructor(data = {}) {
        this.cd_Empresa = data.cd_Empresa ?? data.cD_Empresa ?? data.CD_Empresa ?? '';
        this.sigla = data.sigla ?? data.Sigla ?? '';
        this.cgc_CPF = data.cgc_CPF ?? data.cgC_CPF ?? data.CGC_CPF ?? '';
        this.ie = data.ie ?? data.IE ?? '';
        this.razao_Social = data.razao_Social ?? data.Razao_Social ?? '';
        this.fantasia = data.fantasia ?? data.Fantasia ?? '';
        this.endereco = data.endereco ?? data.Endereco ?? '';
        this.bairro = data.bairro ?? data.Bairro ?? '';
        this.cidade = data.cidade ?? data.Cidade ?? '';
        this.uf = data.uf ?? data.UF ?? '';
        this.cep = data.cep ?? data.CEP ?? '';
        this.ddd = data.ddd ?? data.DDD ?? '';
        this.fone = data.fone ?? data.Fone ?? '';
        this.ddd_Fax = data.ddd_Fax ?? data.ddD_Fax ?? data.DDD_Fax ?? '';
        this.fax = data.fax ?? data.FAX ?? '';
        this.e_Mail = data.e_Mail ?? data.E_Mail ?? '';
        this.fl_Cooperativa = data.fl_Cooperativa ?? data.fL_Cooperativa ?? data.FL_Cooperativa ?? false;
        this.pc_Cooperativa = data.pc_Cooperativa ?? data.pC_Cooperativa ?? data.PC_Cooperativa ?? '';
        this.site = data.site ?? data.Site ?? '';
        this.fl_Trabalha_Cidade_Filial_Atendimento = data.fl_Trabalha_Cidade_Filial_Atendimento ?? data.fL_Trabalha_Cidade_Filial_Atendimento ?? data.FL_Trabalha_Cidade_Filial_Atendimento ?? false;
    }
}

export default EmpresaModel;
