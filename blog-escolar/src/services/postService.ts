import api from "./authService";

type Post = {
  id: string;
  titulo: string;
  conteudo: string;
  areaDoConhecimento: string;
  CriadoEm?: string;
  AtualizadoEm?: string;
};

async function getPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>("/posts");
  return response.data;
}

export type { Post };
export { getPosts };
