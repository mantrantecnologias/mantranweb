class UsuarioLoginModel {
    constructor(data = {}) {
        this.Nome_Usuario = data.Nome_Usuario ?? data.nome_Usuario ?? '';
        this.Senha = data.Senha ?? data.senha ?? '';
        this.Codigo_Empresa = data.Codigo_Empresa ?? data.codigo_Empresa ?? '';
        this.Codigo_Filial = data.Codigo_Filial ?? data.codigo_Filial ?? '';
        this.eMail = data.eMail ?? data.email ?? '';
    }
}

export default UsuarioLoginModel;
