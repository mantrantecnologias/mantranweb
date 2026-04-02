import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import Login from "../Login";
import { UsuarioService } from "../../services/UsuarioService";

// Mock do UsuarioService
vi.mock("../../services/UsuarioService", () => ({
    UsuarioService: {
        Login: vi.fn(),
    },
}));

describe("Componente Login", () => {
    const onLoginMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    test("renderiza os campos de usuário, senha e o botão de entrar", () => {
        render(<Login onLogin={onLoginMock} />);

        expect(screen.getByPlaceholderText(/Digite seu usuário/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Digite sua senha/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
    });

    test("exibe o modal de atenção ao tentar logar com campos vazios", async () => {
        const user = userEvent.setup();
        render(<Login onLogin={onLoginMock} />);

        const loginButton = screen.getByRole("button", { name: /Entrar/i });
        await user.click(loginButton);

        expect(screen.getByText(/Atenção!/i)).toBeInTheDocument();
        expect(screen.getByText(/Informe usuário e senha!/i)).toBeInTheDocument();
    });

    test("realiza o login com sucesso e chama onLogin", async () => {
        const user = userEvent.setup();
        const mockUserData = {
            usuario_Web: "suporte.mantran",
            login: "suporte",
            token: "mock-token-123",
        };

        UsuarioService.Login.mockResolvedValueOnce({
            sucesso: true,
            data: mockUserData,
        });

        render(<Login onLogin={onLoginMock} />);

        const userInput = screen.getByPlaceholderText(/Digite seu usuário/i);
        const passInput = screen.getByPlaceholderText(/Digite sua senha/i);
        const loginButton = screen.getByRole("button", { name: /Entrar/i });

        await user.type(userInput, "suporte");
        await user.type(passInput, "123");
        await user.click(loginButton);

        await waitFor(() => {
            expect(UsuarioService.Login).toHaveBeenCalledWith({
                Usuario: "suporte",
                Senha: "123",
            });
        });

        expect(localStorage.getItem("usuarioNome")).toBe("suporte.mantran");
        expect(localStorage.getItem("token")).toBe("mock-token-123");
        expect(onLoginMock).toHaveBeenCalledWith("suporte.mantran");
    });

    test("exibe modal de erro ao falhar o login na API", async () => {
        const user = userEvent.setup();

        UsuarioService.Login.mockResolvedValueOnce({
            sucesso: false,
            mensagem: "Usuário ou senha inválidos!",
        });

        render(<Login onLogin={onLoginMock} />);

        const userInput = screen.getByPlaceholderText(/Digite seu usuário/i);
        const passInput = screen.getByPlaceholderText(/Digite sua senha/i);
        const loginButton = screen.getByRole("button", { name: /Entrar/i });

        await user.type(userInput, "errado");
        await user.type(passInput, "456");
        await user.click(loginButton);

        expect(await screen.findByText(/Atenção!/i)).toBeInTheDocument();
        expect(screen.getByText(/Usuário ou senha inválidos!/i)).toBeInTheDocument();
        expect(onLoginMock).not.toHaveBeenCalled();
    });

    test("exibe modal de erro genérico em caso de exceção na API", async () => {
        const user = userEvent.setup();

        UsuarioService.Login.mockRejectedValueOnce(new Error("Network Error"));

        render(<Login onLogin={onLoginMock} />);

        const userInput = screen.getByPlaceholderText(/Digite seu usuário/i);
        const passInput = screen.getByPlaceholderText(/Digite sua senha/i);
        const loginButton = screen.getByRole("button", { name: /Entrar/i });

        await user.type(userInput, "admin");
        await user.type(passInput, "admin");
        await user.click(loginButton);

        expect(await screen.findByText(/Erro ao conectar com o servidor/i)).toBeInTheDocument();
    });
});
