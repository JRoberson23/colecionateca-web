import { api } from "./api";

export interface Avaliacao {
  id: string;
  usuario_id?: string;
  nota_geral: number;
  nota_navegacao?: number | null;
  nota_design?: number | null;
  nota_checkout?: number | null;
  comentario?: string | null;
  status?: string;
  resposta_admin?: string | null;
  respondido_em?: string | null;
  createdAt?: string;
  updatedAt?: string;
  usuario_nome?: string;
  usuario_email?: string;
}

export interface RespostaListaAvaliacoes {
  total: number;
  media: number;
  avaliacoes: Avaliacao[];
}

// Helper para padronizar o tratamento de erro (mesmo padrão do auth.ts)
function tratarErro(error: unknown, mensagemPadrao: string): never {
  if (error && typeof error === "object" && "response" in error) {
    const err = error as { response: { data: { message: string } } };
    throw new Error(err.response.data.message || mensagemPadrao);
  }
  throw new Error("Erro de conexão com o servidor");
}

// Público - lista as avaliações aprovadas (com média e filtro opcional por nota)
export async function listarAvaliacoesPublicas(
  nota?: number
): Promise<RespostaListaAvaliacoes> {
  try {
    const params = nota ? { nota } : {};
    const response = await api.get("/avaliacoes", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    throw error;
  }
}

// Cliente - busca a própria avaliação (retorna null se ainda não avaliou)
export async function buscarMinhaAvaliacao(
  token: string
): Promise<Avaliacao | null> {
  try {
    const response = await api.get("/avaliacoes/minha", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao buscar sua avaliação");
  }
}

// Cliente - cria ou edita a avaliação
export async function criarOuAtualizarAvaliacao(
  token: string,
  dados: {
    nota_geral: number;
    nota_navegacao?: number | null;
    nota_design?: number | null;
    nota_checkout?: number | null;
    comentario?: string;
  }
): Promise<{ message: string; avaliacao: Avaliacao }> {
  try {
    const response = await api.post("/avaliacoes", dados, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao enviar avaliação");
  }
}

// Cliente - remove a própria avaliação
export async function deletarMinhaAvaliacao(
  token: string
): Promise<{ message: string }> {
  try {
    const response = await api.delete("/avaliacoes/minha", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao remover avaliação");
  }
}