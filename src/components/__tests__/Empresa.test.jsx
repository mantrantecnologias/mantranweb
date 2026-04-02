import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";


vi.mock("../../context/IconColorContext", () => {
    return {
        useIconColor: () => ({
            footerIconColorNormal: "text-gray-600",
            footerIconColorHover: "text-red-700",
        }),
    };
});

import Empresa from "../../pages/empresa/Empresa"; // ajuste se seu path for diferente

describe("Tela Empresa", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renderiza e mostra o registro inicial na grid", async () => {
        render(<Empresa open={false} />);

        // registro inicial do seu state
        expect(screen.getByText(/Mantran Tecnologia LTDA/i)).toBeInTheDocument();
        expect(screen.getByText(/^MANTRAN$/i)).toBeInTheDocument();
        expect(screen.getByText(/12\.345\.678\/0001-90/i)).toBeInTheDocument();
    });

    test("não permite incluir sem código (mostra alert)", async () => {
        const user = userEvent.setup();
        const alertMock = vi.spyOn(window, "alert").mockImplementation(() => { });

        render(<Empresa open={false} />);

        // clica no botão Incluir (ele tem o texto visível)
        await user.click(screen.getByRole("button", { name: /Incluir/i }));

        expect(alertMock).toHaveBeenCalled();
        expect(alertMock).toHaveBeenCalledWith("Informe o código!");
    });

    test("inclui uma empresa e ela aparece na grid", async () => {
        const user = userEvent.setup();

        render(<Empresa open={false} />);

        // preencher campos (no seu código, os inputs NÃO têm label associada,
        // então vamos pegar por 'name' via querySelector no container)
        const codigo = document.querySelector('input[name="codigo"]');
        const sigla = document.querySelector('input[name="sigla"]');
        const cnpj = document.querySelector('input[name="cnpj"]');
        const razao = document.querySelector('input[name="razao"]');

        expect(codigo).toBeTruthy();
        expect(sigla).toBeTruthy();
        expect(cnpj).toBeTruthy();
        expect(razao).toBeTruthy();

        await user.type(codigo, "777");
        await user.type(sigla, "E2E");
        await user.type(cnpj, "11222333000144"); // vai mascarar
        await user.type(razao, "EMPRESA E2E LTDA");

        await user.click(screen.getByRole("button", { name: /Incluir/i }));

        expect(await screen.findByText(/EMPRESA E2E LTDA/i)).toBeInTheDocument();
        // cnpj mascarado esperado
        expect(screen.getByText(/11\.222\.333\/0001-44/i)).toBeInTheDocument();
    });

    test("exclui uma empresa selecionando na grid e clicando Excluir", async () => {
        const user = userEvent.setup();

        render(<Empresa open={false} />);

        // seleciona o item inicial clicando na linha (ou no texto)
        await user.click(screen.getByText(/Mantran Tecnologia LTDA/i));

        // clica em Excluir
        await user.click(screen.getByRole("button", { name: /Excluir/i }));

        // some da tela
        expect(screen.queryByText(/Mantran Tecnologia LTDA/i)).not.toBeInTheDocument();
    });
});
