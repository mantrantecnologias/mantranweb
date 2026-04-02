// src/components/__tests__/EmpresaFilialParametro.test.jsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";

// 🔧 Mock do navigate
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

// 🔧 Mock do contexto de cor
vi.mock("../../context/IconColorContext", () => ({
    useIconColor: () => ({
        footerIconColorNormal: "text-gray-700",
        footerIconColorHover: "text-red-700",
    }),
}));

// 🔧 Mock do modal FilialParametro
vi.mock("../../pages/filial/FilialParametro", () => ({
    default: ({ onClose }) => (
        <div data-testid="filial-parametro-modal">
            <p>FILIAL PARAMETRO MODAL</p>
            <button onClick={onClose}>Fechar Modal</button>
        </div>
    ),
}));

import EmpresaFilialParametro from "../../pages/EmpresaFilialParametro";

function goToConsultaTab() {
    fireEvent.click(screen.getByRole("button", { name: /consulta/i }));
}

function goToCadastroTab() {
    fireEvent.click(screen.getByRole("button", { name: /cadastro/i }));
}

function clickFooterAction(label) {
    fireEvent.click(screen.getByText(label));
}

/**
 * Pega a PRIMEIRA linha do tbody da tabela de consulta e clica nela.
 * Assim não depende de texto duplicado (1000000,00 aparece duas vezes).
 */
function clickFirstConsultaRow() {
    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1]; // [0]=thead, [1]=tbody
    const rows = within(tbody).getAllByRole("row");
    fireEvent.click(rows[0]);
}

/**
 * Inputs sem label/for: pegamos por ordem.
 * Ordem típica na tela:
 * [0]=VR Bloqueio, [1]=Indica Redutor, [2]=Tabela Padrão,
 * [3]=VR Aviso, [4]=% Juros, [5]=Tabela Coleta, ...
 */
function getInputVrBloqueio() {
    const inputs = screen.getAllByRole("textbox");
    return inputs[0];
}
function getInputVrAviso() {
    const inputs = screen.getAllByRole("textbox");
    return inputs[3];
}

/**
 * Selects:
 * [0]=Empresa, [1]=Filial, depois outros selects do form...
 */
function getSelectEmpresa() {
    const selects = screen.getAllByRole("combobox");
    return selects[0];
}
function getSelectFilial() {
    const selects = screen.getAllByRole("combobox");
    return selects[1];
}

function getConsultaRows() {
    const table = screen.getByRole("table");
    const tbody = within(table).getAllByRole("rowgroup")[1];
    return within(tbody).queryAllByRole("row");
}

describe("Tela EmpresaFilialParametro", () => {
    beforeEach(() => {
        navigateMock.mockClear();
    });

    it("renderiza o título e abas", () => {
        render(<EmpresaFilialParametro open={true} />);

        expect(screen.getByText("PARÂMETRO DE FILIAL")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /cadastro/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /consulta/i })).toBeInTheDocument();
    });

    it("seleciona uma linha na consulta e volta pro cadastro", () => {
        render(<EmpresaFilialParametro open={true} />);

        goToConsultaTab();
        clickFirstConsultaRow();

        // deve voltar pro cadastro
        expect(screen.getByRole("button", { name: /cadastro/i })).toBeInTheDocument();

        // e deve existir input com valor padrão (VR Bloqueio)
        expect(getInputVrBloqueio()).toHaveValue("1000000,00");
    });

    it("inclui um novo registro e aparece na grid", () => {
        render(<EmpresaFilialParametro open={true} />);

        // quantidade antes
        goToConsultaTab();
        const rowsBefore = getConsultaRows().length;

        // volta pro cadastro
        goToCadastroTab();

        // ✅ muda a chave (Filial) para não colidir com 001/001
        fireEvent.change(getSelectFilial(), { target: { value: "005" } });

        // muda VR Bloqueio
        fireEvent.change(getInputVrBloqueio(), { target: { value: "777,77" } });

        // clica incluir
        clickFooterAction("Incluir");

        // valida na grid: aumentou e existe 777,77
        goToConsultaTab();

        const rowsAfter = getConsultaRows().length;
        expect(rowsAfter).toBe(rowsBefore + 1);

        expect(screen.getByText("777,77")).toBeInTheDocument();
    });

    it("altera um registro com confirmação e atualiza na grid", () => {
        render(<EmpresaFilialParametro open={true} />);

        // seleciona registro existente
        goToConsultaTab();
        clickFirstConsultaRow();

        // muda VR Aviso
        fireEvent.change(getInputVrAviso(), { target: { value: "888,88" } });

        clickFooterAction("Alterar");

        // confirmação
        expect(screen.getByText("Deseja alterar o Parâmetro da Filial?")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Sim"));

        // sucesso
        expect(screen.getByText("Alteração realizada com sucesso!")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "OK" }));

        // consulta: deve ter 888,88
        goToConsultaTab();
        expect(screen.getByText("888,88")).toBeInTheDocument();
    });

    it("exclui um registro com confirmação e remove da grid", () => {
        render(<EmpresaFilialParametro open={true} />);

        // seleciona registro existente
        goToConsultaTab();
        clickFirstConsultaRow();

        clickFooterAction("Excluir");

        // confirmação
        expect(screen.getByText("Deseja excluir o Parâmetro da Filial?")).toBeInTheDocument();
        fireEvent.click(screen.getByText("Sim"));

        // sucesso
        expect(screen.getByText("Exclusão realizada com sucesso!")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "OK" }));

        // consulta: tabela deve ficar vazia
        goToConsultaTab();
        const rows = getConsultaRows();
        expect(rows.length).toBe(0);
    });

    it("limpa o formulário", () => {
        render(<EmpresaFilialParametro open={true} />);

        fireEvent.change(getInputVrBloqueio(), { target: { value: "123,45" } });
        clickFooterAction("Limpar");

        expect(getInputVrBloqueio()).toHaveValue("1000000,00");
    });

    it("abre e fecha modal de parâmetros", () => {
        render(<EmpresaFilialParametro open={true} />);

        clickFooterAction("Parâmetros");
        expect(screen.getByTestId("filial-parametro-modal")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Fechar Modal"));
        expect(screen.queryByTestId("filial-parametro-modal")).not.toBeInTheDocument();
    });

    it("clica em fechar e chama navigate(-1)", () => {
        render(<EmpresaFilialParametro open={true} />);

        clickFooterAction("Fechar");
        expect(navigateMock).toHaveBeenCalledWith(-1);
    });
});
