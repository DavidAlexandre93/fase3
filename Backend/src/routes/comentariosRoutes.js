import express from "express";
import { Comentario } from "../models/Comentario.js";
import { Posts } from "../models/Post.js";
import { validarProfessor } from "../middleware/validarProfessor.js";

const comentariosRoutes = express.Router();

// Criar comentário (qualquer usuário)
comentariosRoutes.post("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const { autor, texto } = req.body;
        if (!texto || !autor) return res.status(400).json({ message: "Autor e texto obrigatórios" });
        const post = await Posts.findById(postId);
        if (!post) return res.status(404).json({ message: "Post não encontrado" });
        const comentario = new Comentario({ post: postId, autor, texto });
        await comentario.save();
        res.status(201).json(comentario);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar comentários de um post
comentariosRoutes.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;
        const comentarios = await Comentario.find({ post: postId }).sort({ criadoEm: -1 });
        res.json(comentarios);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Excluir comentário (apenas professores)
comentariosRoutes.delete("/:comentarioId", validarProfessor, async (req, res) => {
    try {
        const { comentarioId } = req.params;
        const comentario = await Comentario.findById(comentarioId);
        if (!comentario) return res.status(404).json({ message: "Comentário não encontrado" });
        await comentario.deleteOne();
        res.json({ message: "Comentário excluído" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default comentariosRoutes;
