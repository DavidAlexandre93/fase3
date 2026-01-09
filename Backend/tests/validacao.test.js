import bcrypt from "bcryptjs";
import ValidacaoController from "../src/controllers/validacaoController.js";
import { Usuario } from "../src/models/Usuario.js";

// Mocka dependências externas
jest.mock("bcryptjs");
jest.mock("../src/models/Usuario.js");

describe("ValidacaoController", () => {

    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    // TESTE: Cadastro de usuário
    describe("cadastrarUsuario", () => {
        it("deve cadastrar um novo usuário com sucesso", async () => {
            req.body = {
                nome: "Caroline",
                email: "carol@example.com",
                senha: "123456",
                role: "aluno"
            };

            const hashedSenha = "senha-hash";
            bcrypt.hash.mockResolvedValue(hashedSenha);

            const usuarioCriado = {
                _id: "abc123",
                nome: req.body.nome,
                email: req.body.email,
                senha: hashedSenha,
                role: req.body.role
            };

            Usuario.create.mockResolvedValue(usuarioCriado);

            await ValidacaoController.cadastrarUsuario(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
            expect(Usuario.create).toHaveBeenCalledWith({
                nome: "Caroline",
                email: "carol@example.com",
                senha: hashedSenha,
                role: "aluno"
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Usuário registrado com sucesso",
                Usuario: usuarioCriado
            });
        });

        it("deve retornar erro 400 se ocorrer falha ao cadastrar", async () => {
            req.body = { nome: "Teste" };
            const erro = new Error("Erro no cadastro");
            Usuario.create.mockRejectedValue(erro);

            await ValidacaoController.cadastrarUsuario(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Erro no cadastro - Falha ao registrar usuario"
            });
        });
    });

    // TESTE: Login de usuário
    describe("login", () => {
        it("deve retornar erro 400 se email ou senha não forem enviados", async () => {
            req.body = { email: "" };

            await ValidacaoController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Email e senha são obrigatórios"
            });
        });

        it("deve retornar erro 400 se o usuário não for encontrado", async () => {
            req.body = { email: "naoexiste@example.com", senha: "123456" };
            Usuario.findOne.mockResolvedValue(null);

            await ValidacaoController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Usuário não encontrado"
            });
        });

        it("deve retornar erro 400 se a senha for inválida", async () => {
            req.body = { email: "carol@example.com", senha: "senhaErrada" };
            const usuarioFake = { senha: "senhaCorreta" };
            Usuario.findOne.mockResolvedValue(usuarioFake);
            bcrypt.compare.mockResolvedValue(false);

            await ValidacaoController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Senha inválida"
            });
        });

        it("deve retornar 200 se o login for bem-sucedido", async () => {
            req.body = { email: "carol@example.com", senha: "123456" };
            const usuarioFake = {
                _id: "abc123",
                nome: "Caroline",
                email: "carol@example.com",
                senha: "senhaCriptografada",
                role: "professor"
            };

            Usuario.findOne.mockResolvedValue(usuarioFake);
            bcrypt.compare.mockResolvedValue(true);

            await ValidacaoController.login(req, res);

            expect(Usuario.findOne).toHaveBeenCalledWith({ email: "carol@example.com" });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Login realizado",
                usuario: {
                    id: "abc123",
                    nome: "Caroline",
                    email: "carol@example.com",
                    role: "professor"
                }
            });
        });

        it("deve retornar erro 500 em caso de exceção inesperada", async () => {
            req.body = { email: "carol@example.com", senha: "123456" };
            Usuario.findOne.mockRejectedValue(new Error("Erro inesperado"));

            await ValidacaoController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Erro inesperado" });
        });
    });
});
