import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

/* ========================= Mocks ========================= */

// navigate
const navigateMock = vi.fn();

// location (vamos alternar por teste se precisar)
let locationMock = { pathname: "/modulo-oficina/oficina" };

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
        useLocation: () => locationMock,
    };
});

// contexto cores
vi.mock("../../context/IconColorContext", () => ({
    useIconColor: () => ({
        footerIconColorNormal: "text-gray-700",
        footerIconColorHover: "text-red-700",
    }),
}));

// Mock do InputBuscaCidade (pra não depender do componente real)
// Ele renderiza um input e, se você clicar em "Selecionar", dispara onSelect.
vi.mock("../InputBuscaCidade", () => ({
    default: ({ value, onChange, onSelect, className, tabIndex }) => (
        <div className={className}>
            <input
                data-testid="input-busca-cidade"
                value={value || ""}
                onChange={(e) => onChange?.(e)}
                tabIndex={tabIndex}
            />
            <button
                type="button"
                onClick={() =>
                    onSelect?.({ nome: "CAMPINAS", uf: "SP", cep: "13000-000" })
                }
            >
                Selecionar Cidade
            </button>
        </div>
    ),
}));

import Oficina from "../../pages/Oficina";

/* ========================= Helpers de teste ========================= */

function goToTab(label) {
    fireEvent.click(screen.getByRole("button", { name: new RegExp(label, "i") }));
}

function clickFooter(label) {
    fireEvent.click(screen.getByText(label));
}

function getCadastroInputs() {
    // Inputs do CADASTRO (textbox) incluem: cnpj, ie, razao, fantasia, endereco, bairro,
    // fone1 ddd, fone1, fone2 ddd, fone2, email e o input-busca-cidade mockado.
    return screen.getAllByRole("textbox");
}

function getConsultaInputs() {
    // Na consulta existem 4 textboxes: cnpj, razao, fantasia, cidade
    return screen.getAllByRole("textbox");
}

function openFirstResultadoRow() {
    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1];
    const rows = within(tbody).getAllByRole("row");

    // Se houver a linha de "Clique em Pesquisar...", ela também é row.
    // Então pegamos a primeira row que tenha cells (td) com CNPJ.
    const rowComDados = rows.find((r) => within(r).queryAllByRole("cell").length > 0);
    expect(rowComDados).toBeTruthy();
    fireEvent.click(rowComDados);
}

function doPesquisar() {
    // botão "Pesquisar" é um <button> com texto Pesquisar
    fireEvent.click(screen.getByRole("button", { name: /pesquisar/i }));
}

function getModal() {
    // modal padrão é texto + botões Sim/Não ou OK
    return screen.getByText(/confirma|sucesso|selecione|deseja/i);
}

/* ========================= Tests ========================= */

describe("Tela Oficina", () => {
    let nowSpy;

    beforeEach(() => {
        navigateMock.mockClear();
        locationMock = { pathname: "/modulo-oficina/oficina" };

        // deixa Date.now previsível pros testes de incluir
        nowSpy = vi.spyOn(Date, "now").mockReturnValue(123456789);
    });

    afterEach(() => {
        nowSpy?.mockRestore?.();
    });

    it("renderiza título e abas", () => {
        render(<Oficina open={true} />);

        expect(screen.getByText("OFICINA")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cadastro/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /consulta/i })).toBeInTheDocument();
    });

    it("na consulta, mostra mensagem padrão antes de pesquisar", () => {
        render(<Oficina open={true} />);

        goToTab("Consulta");
        expect(
            screen.getByText("Clique em Pesquisar para exibir os registros.")
        ).toBeInTheDocument();
    });

    it("pesquisa por cidade e lista resultados", () => {
        render(<Oficina open={true} />);

        goToTab("Consulta");

        // preenche cidade = CAMPINAS
        const inputs = screen.getAllByRole("textbox");
        // na consulta: [0]=cnpj [1]=razao [2]=fantasia [3]=cidade
        fireEvent.change(inputs[3], { target: { value: "campinas" } });

        doPesquisar();

        // Deve aparecer OFICINA TESTE (cidade CAMPINAS)
        expect(screen.getByText("OFICINA TESTE")).toBeInTheDocument();
        expect(screen.getByText("CAMPINAS")).toBeInTheDocument();
    });

    it("clicar no resultado abre no cadastro e preenche campos", () => {
        render(<Oficina open={true} />);

        goToTab("Consulta");

        // pesquisar tudo (sem filtro) e abrir primeira oficina
        doPesquisar();
        openFirstResultadoRow();

        // volta pro cadastro
        expect(screen.getByRole("button", { name: /cadastro/i })).toBeInTheDocument();

        // Confere que algum campo conhecido foi preenchido
        // Ex: Razão Social do primeiro mock
        expect(screen.getByDisplayValue("FREIOS CASQUEIROS EIRELI")).toBeInTheDocument();
    });

    it("Incluir: abre confirmação e ao confirmar adiciona e aparece na consulta", () => {
        render(<Oficina open={true} />);

        // preencher campos mínimos (vamos usar Razão/Fantasia e CNPJ)
        // Cadastro inputs: melhor pegar por placeholder em alguns
        fireEvent.change(screen.getByPlaceholderText("Somente dígitos"), {
            target: { value: "11111111000199" },
        });

        // Razão Social / Fantasia não têm placeholder. Vamos buscar por “textbox” e usar ordem segura:
        // A ordem comum no DOM do cadastro:
        // 0=cnpj, 1=ie, 2=razao, 3=fantasia, 4=endereco, 5=bairro, (cidade readOnly não entra), ddd1, fone1, ddd2, fone2, email
        const tbs = getCadastroInputs();
        fireEvent.change(tbs[2], { target: { value: "OFICINA NOVA LTDA" } });
        fireEvent.change(tbs[3], { target: { value: "OFICINA NOVA" } });

        // clique incluir
        clickFooter("Incluir");

        // abre confirmação
        expect(screen.getByText("Confirma a Inclusão?")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Sim"));

        // sucesso
        expect(
            screen.getByText("Oficina incluída com sucesso! (mock)")
        ).toBeInTheDocument();
        fireEvent.click(screen.getByText("OK"));

        // vai na consulta, pesquisar e conferir que aparece
        goToTab("Consulta");
        doPesquisar();

        expect(screen.getByText("OFICINA NOVA")).toBeInTheDocument();
        expect(screen.getByText("OFICINA NOVA LTDA")).toBeInTheDocument();
        // CNPJ aparece na grid como texto
        expect(screen.getByText("11111111000199")).toBeInTheDocument();
    });

    it("Alterar: sem seleção mostra mensagem info", () => {
        render(<Oficina open={true} />);

        clickFooter("Alterar");

        expect(
            screen.getByText("Selecione uma oficina para alterar.")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("OK"));
    });

    it("Alterar: com seleção atualiza registro e mostra sucesso", () => {
        render(<Oficina open={true} />);

        // seleciona uma oficina pela consulta
        goToTab("Consulta");
        doPesquisar();
        openFirstResultadoRow();

        // altera fantasia
        const tbs = getCadastroInputs();
        fireEvent.change(tbs[3], { target: { value: "FANTASIA ALTERADA" } });

        clickFooter("Alterar");

        expect(
            screen.getByText("Oficina alterada com sucesso! (mock)")
        ).toBeInTheDocument();
        fireEvent.click(screen.getByText("OK"));

        // consulta e confirma que mudou
        goToTab("Consulta");
        doPesquisar();
        expect(screen.getByText("FANTASIA ALTERADA")).toBeInTheDocument();
    });

    it("Excluir: sem seleção mostra mensagem info", () => {
        render(<Oficina open={true} />);

        clickFooter("Excluir");

        expect(
            screen.getByText("Selecione uma oficina para excluir.")
        ).toBeInTheDocument();

        fireEvent.click(screen.getByText("OK"));
    });

    it("Excluir: com seleção pede confirmação e remove", () => {
        render(<Oficina open={true} />);

        // seleciona pela consulta
        goToTab("Consulta");
        doPesquisar();
        openFirstResultadoRow();

        // garante que está com o cadastro preenchido com o primeiro mock
        expect(screen.getByDisplayValue("FREIOS CASQUEIROS EIRELI")).toBeInTheDocument();

        clickFooter("Excluir");
        expect(screen.getByText("Deseja excluir esta oficina?")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Sim"));

        expect(
            screen.getByText("Oficina excluída com sucesso! (mock)")
        ).toBeInTheDocument();
        fireEvent.click(screen.getByText("OK"));

        // consulta: pesquisa e não deve existir mais a razão social excluída
        goToTab("Consulta");
        doPesquisar();

        expect(
            screen.queryByText("FREIOS CASQUEIROS EIRELI")
        ).not.toBeInTheDocument();
    });

    it("Limpar no Cadastro: limpa campos", () => {
        render(<Oficina open={true} />);

        fireEvent.change(screen.getByPlaceholderText("Somente dígitos"), {
            target: { value: "123" },
        });

        clickFooter("Limpar");

        // voltou vazio
        expect(screen.getByPlaceholderText("Somente dígitos")).toHaveValue("");
    });

    it("Limpar na Consulta: limpa filtros e volta mensagem padrão", () => {
        render(<Oficina open={true} />);

        goToTab("Consulta");

        const inputs = screen.getAllByRole("textbox");
        fireEvent.change(inputs[3], { target: { value: "campinas" } });

        doPesquisar();
        expect(screen.getByText("OFICINA TESTE")).toBeInTheDocument();

        // clicar no botão Limpar do CARD (Parâmetros de Pesquisa), não o do rodapé
        const card = screen.getByText("Parâmetros de Pesquisa").closest("fieldset");
        const btnLimparCard = within(card).getByTitle("Limpar");
        fireEvent.click(btnLimparCard);

        // mensagem padrão
        expect(
            screen.getByText("Clique em Pesquisar para exibir os registros.")
        ).toBeInTheDocument();
    });


    it("Fechar: chama navigate(-1)", () => {
        render(<Oficina open={true} />);

        clickFooter("Fechar");
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});
