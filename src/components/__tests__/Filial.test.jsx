import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";

/** 1) Mock do IconColorContext (igual Empresa) */
vi.mock("../../context/IconColorContext", () => {
    return {
        useIconColor: () => ({
            footerIconColorNormal: "text-gray-600",
            footerIconColorHover: "text-red-700",
        }),
    };
});

/** 2) Mock do react-router-dom (useNavigate) */
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

/** 3) Mock do InputBuscaCidade (vira input simples) */
vi.mock("../InputBuscaCidade", () => {
    return {
        default: ({ value, onChange, tabIndex, className }) => (
            <input
                data-testid="input-busca-cidade"
                className={className}
                value={value || ""}
                onChange={onChange}
                tabIndex={tabIndex}
            />
        ),
    };
});

import Filial from "../../pages/filial/Filial";

describe("Tela Filial (CRUD local + modais)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renderiza e inicia na aba Cadastro", async () => {
        render(<Filial open={false} />);

        expect(screen.getByText(/CADASTRO FILIAL/i)).toBeInTheDocument();
        expect(screen.getByText(/Dados da Filial/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Filial/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Consulta/i })).toBeInTheDocument();
    });

    test("consulta: mostra filiais mock e ao clicar preenche cadastro", async () => {
        const user = userEvent.setup();
        render(<Filial open={false} />);

        await user.click(screen.getByRole("button", { name: /Consulta/i }));

        expect(screen.getByText(/TESTE MANTRAN/i)).toBeInTheDocument();
        expect(screen.getByText(/FILIAL WMS/i)).toBeInTheDocument();

        await user.click(screen.getByText(/FILIAL WMS/i));

        // voltou no cadastro
        expect(screen.getByText(/Dados da Filial/i)).toBeInTheDocument();

        // valida campos preenchidos por tabIndex (como no seu layout)
        const codigo = document.querySelector('input[tabindex="1"]');
        const cnpj = document.querySelector('input[tabindex="2"]');
        const sigla = document.querySelector('input[tabindex="3"]');
        const razao = document.querySelector('input[tabindex="5"]');

        expect(codigo?.value).toBe("005");
        expect(sigla?.value).toBe("WMS");
        expect(cnpj?.value).toBe("35.755.290/3001-10");
        expect(razao?.value).toBe("FILIAL WMS");
    });

    test("Incluir: adiciona filial na lista e exibe modal de sucesso", async () => {
        const user = userEvent.setup();
        render(<Filial open={false} />);

        // Preenche campos mínimos
        const codigo = document.querySelector('input[tabindex="1"]');
        const cnpj = document.querySelector('input[tabindex="2"]');
        const sigla = document.querySelector('input[tabindex="3"]');
        const razao = document.querySelector('input[tabindex="5"]');

        await user.type(codigo, "777");
        await user.type(cnpj, "11222333000144"); // mascara
        await user.type(sigla, "E2E");
        await user.type(razao, "FILIAL E2E");

        await user.click(screen.getByRole("button", { name: /Incluir/i }));

        // modal de sucesso
        expect(await screen.findByText(/Inclusão realizada com sucesso!/i)).toBeInTheDocument();

        // fecha modal
        await user.click(screen.getByRole("button", { name: /^OK$/i }));

        // vai na consulta e confere se entrou
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        expect(screen.getByText("777")).toBeInTheDocument();
        expect(screen.getByText(/FILIAL E2E/i)).toBeInTheDocument();
    });

    test("Alterar: pede confirmação (Sim/Não) e ao confirmar mostra sucesso", async () => {
        const user = userEvent.setup();
        render(<Filial open={false} />);

        // seleciona uma filial existente via consulta
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        await user.click(screen.getByText(/TESTE MANTRAN/i));

        // muda a razão social
        const razao = document.querySelector('input[tabindex="5"]');
        await user.clear(razao);
        await user.type(razao, "TESTE MANTRAN ALTERADO");

        // clicar Alterar => abre confirmação
        await user.click(screen.getByRole("button", { name: /Alterar/i }));
        expect(await screen.findByText(/Deseja alterar a Filial\?/i)).toBeInTheDocument();

        // confirma
        await user.click(screen.getByRole("button", { name: /^Sim$/i }));

        // sucesso
        expect(await screen.findByText(/Alteração realizada com sucesso!/i)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /^OK$/i }));

        // volta consulta e confere que alterou
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        expect(screen.getByText(/TESTE MANTRAN ALTERADO/i)).toBeInTheDocument();
    });

    test("Excluir: pede confirmação (Sim/Não) e ao confirmar remove e mostra sucesso", async () => {
        const user = userEvent.setup();
        render(<Filial open={false} />);

        // seleciona filial existente
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        await user.click(screen.getByText(/FILIAL WMS/i));

        // excluir => abre confirmação
        await user.click(screen.getByRole("button", { name: /Excluir/i }));
        expect(await screen.findByText(/Deseja excluir a Filial\?/i)).toBeInTheDocument();

        // confirma
        await user.click(screen.getByRole("button", { name: /^Sim$/i }));

        // sucesso
        expect(await screen.findByText(/Exclusão realizada com sucesso!/i)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /^OK$/i }));

        // consulta: não deve mais existir o texto
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        expect(screen.queryByText(/FILIAL WMS/i)).not.toBeInTheDocument();
    });

    test("Alterar/Excluir: se clicar Não na confirmação, não muda nada", async () => {
        const user = userEvent.setup();
        render(<Filial open={false} />);

        // seleciona filial
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        await user.click(screen.getByText(/TESTE MANTRAN/i));

        // tenta excluir e cancela
        await user.click(screen.getByRole("button", { name: /Excluir/i }));
        expect(await screen.findByText(/Deseja excluir a Filial\?/i)).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: /^Não$/i }));

        // volta consulta e garante que ainda existe
        await user.click(screen.getByRole("button", { name: /Consulta/i }));
        expect(screen.getByText(/TESTE MANTRAN/i)).toBeInTheDocument();
    });
});
