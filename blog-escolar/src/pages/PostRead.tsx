import AudioRead from '../components/AudioRead';
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById } from "../services/postService";
import type { Post } from "../services/postService";
import { criarComentario, excluirComentario, listarComentarios } from "../services/comentarioService";
import type { Comentario } from "../services/comentarioService";
import useQuery from "../hooks/useQuery";
import useAuth from "../hooks/useAuth";
import "../styles/PostRead.css";
import "../styles/center.css";

// O componente PostRead depende do useParams para saber qual post mostrar,
// e do getPosts para buscar os dados do backend.
const PostRead: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const nomeComentario = useMemo(() => (user?.nome?.trim() ? user.nome.trim() : "Anônimo"), [user?.nome]);
  const [comentariosAbertos, setComentariosAbertos] = useState(false);
  const novoComentarioRef = useRef<HTMLTextAreaElement | null>(null);
  const {
    data: post,
    isLoading,
    isError,
    refetch: refetchPost,
  } = useQuery<Post>({
    queryKey: ["post", id],
    enabled: Boolean(id),
    queryFn: () => getPostById(id as string),
  });

  const {
    data: comentariosRaw,
    isLoading: comentariosLoading,
    refetch: refetchComentarios,
  } = useQuery<Comentario[]>({
    queryKey: ["comentarios", id, comentariosAbertos],
    enabled: Boolean(id) && comentariosAbertos,
    queryFn: () => listarComentarios(id as string),
  });

  const comentarios = comentariosRaw ?? [];

  useEffect(() => {
    if (!comentariosAbertos) return;
    const t = window.setTimeout(() => {
      novoComentarioRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [comentariosAbertos]);

  if (!id) return <p style={{ color: 'red', textAlign: 'center' }}>ID inválido.</p>;
  if (isLoading) return <p style={{ textAlign: 'center' }}>Carregando...</p>;
  if (isError) return <p style={{ color: 'red', textAlign: 'center' }}>Post não encontrado.</p>;
  if (!post) return null;

  const criado = post.CriadoEm;
  const atualizado = post.AtualizadoEm;
  const foiAtualizado = Boolean(atualizado) && atualizado !== criado;

  return (
    <div className="page-center">
      {/* Modal de comentários */}
      {comentariosAbertos && id && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "#0008",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              minWidth: 340,
              maxWidth: 420,
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 4px 24px #0003",
              position: "relative",
            }}
          >
            <button
              onClick={() => setComentariosAbertos(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                fontSize: 22,
                cursor: "pointer",
                color: "#7c4dbe",
              }}
              aria-label="Fechar comentários"
              title="Fechar"
            >
              ×
            </button>
            <h3 style={{ color: "#7c4dbe", marginBottom: 12 }}>Comentários</h3>
            {comentariosLoading ? (
              <p>Carregando comentários...</p>
            ) : (
              <>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem("novoComentario") as HTMLTextAreaElement;
                    const texto = input.value.trim();
                    if (!texto) return;
                    input.disabled = true;
                    try {
                      await criarComentario(id, texto, nomeComentario);
                      await refetchComentarios();
                      await refetchPost();
                      input.value = "";
                    } catch {
                      alert("Erro ao enviar comentário.");
                    }
                    input.disabled = false;
                  }}
                  style={{ display: "flex", gap: 8, marginBottom: 16 }}
                >
                  <textarea
                    name="novoComentario"
                    placeholder="Escreva um comentário..."
                    ref={novoComentarioRef}
                    rows={2}
                    style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc", resize: "vertical" }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: "#7c4dbe",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Comentar
                  </button>
                </form>

                <div style={{ fontSize: 12, color: "#666", marginTop: -8, marginBottom: 12 }}>
                  Comentando como <strong>{nomeComentario}</strong>
                </div>

                {comentarios.length === 0 ? (
                  <p style={{ color: "#888" }}>Nenhum comentário ainda.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {comentarios.map((com) => (
                      <li key={com._id} style={{ borderBottom: "1px solid #eee", padding: "8px 0", position: "relative" }}>
                        <div style={{ fontWeight: 600, color: "#7c4dbe", fontSize: 15 }}>
                          {typeof com.autor === "string" ? com.autor : com.autor?.nome || "Usuário"}
                        </div>
                        <div style={{ fontSize: 14, color: "#444", margin: "2px 0 4px 0" }}>{com.texto}</div>
                        <div style={{ fontSize: 12, color: "#888" }}>{new Date(com.criadoEm).toLocaleString("pt-BR")}</div>
                        {user?.role === "professor" && (
                          <button
                            onClick={async () => {
                              if (!window.confirm("Excluir este comentário?")) return;
                              try {
                                await excluirComentario(com._id);
                                await refetchComentarios();
                                await refetchPost();
                              } catch {
                                alert("Erro ao excluir comentário.");
                              }
                            }}
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 0,
                              background: "none",
                              border: "none",
                              color: "#e04d4d",
                              fontWeight: 700,
                              fontSize: 16,
                              cursor: "pointer",
                            }}
                            title="Excluir comentário"
                          >
                            Excluir
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Topo roxo com título, subtítulo e infos */}
      <div className="postread-topo">
        <div className="postread-titulo">{post.titulo} <AudioRead text={post.titulo} /></div>
        <div className="postread-infos">
          <span className="postread-info">{post.areaDoConhecimento || "Artigos"} <AudioRead text={post.areaDoConhecimento || 'Artigos'} /></span>
          {post.autor && (
            <span className="postread-info">Publicado por {typeof post.autor === "string" ? post.autor : post.autor.nome} <AudioRead text={`Publicado por ${typeof post.autor === "string" ? post.autor : post.autor.nome}`} /></span>
          )}
          <button
            type="button"
            onClick={() => setComentariosAbertos(true)}
            className="comentario-icone-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
            }}
            title="Ver e comentar"
            aria-label="Ver e comentar"
          >
            <FaRegCommentDots size={18} color="#ffffff" />
            <span style={{ fontWeight: 700, color: "#ffffff", fontSize: 14 }}>{post.comentariosCount ?? 0}</span>
          </button>
          {foiAtualizado ? (
            <span className="postread-info">Atualizado em {atualizado} <AudioRead text={`Atualizado em ${atualizado}`} /></span>
          ) : (
            <span className="postread-info">Publicado em {criado || '--'} <AudioRead text={`Publicado em ${criado || '--'}`} /></span>
          )}
        </div>
      </div>
      {/* Imagem centralizada */}
      {/* Se quiser exibir imagem, adicione campo no backend e frontend */}
      {/* Conteúdo do post */}
      <div className="postread-conteudo">
        {post.conteudo} <AudioRead text={post.conteudo} />
      </div>
      {/* Botão de voltar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 24px', borderRadius: 8, background: '#7c4dbe', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
          Voltar
        </button>
      </div>
    </div>
  );
};

export default PostRead;
