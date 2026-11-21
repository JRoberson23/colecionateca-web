import { api } from "./api";
import type { Avaliacao } from "./avaliacoes";

// Helper de erro (mesmo padrão do auth.ts)
function tratarErro(error: unknown, mensagemPadrao: string): never {
  if (error && typeof error === "object" && "response" in error) {
    const err = error as { response: { data: { message: string } } };
    throw new Error(err.response.data.message || mensagemPadrao);
  }
  throw new Error("Erro de conexão com o servidor");
}

// Lista todas (pendentes, aprovadas e rejeitadas)
export async function listarTodasAvaliacoes(
  token: string
): Promise<Avaliacao[]> {
  try {
    const response = await api.get("/avaliacoes/admin/todas", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao listar avaliações");
  }
}

// Aprova uma avaliação
export async function aprovarAvaliacao(
  token: string,
  id: string
): Promise<{ message: string; avaliacao: Avaliacao }> {
  try {
    const response = await api.patch(
      `/avaliacoes/admin/${id}/aprovar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao aprovar avaliação");
  }
}

// Rejeita uma avaliação
export async function rejeitarAvaliacao(
  token: string,
  id: string
): Promise<{ message: string; avaliacao: Avaliacao }> {
  try {
    const response = await api.patch(
      `/avaliacoes/admin/${id}/rejeitar`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao rejeitar avaliação");
  }
}

// Responde uma avaliação
export async function responderAvaliacao(
  token: string,
  id: string,
  resposta: string
): Promise<{ message: string; avaliacao: Avaliacao }> {
  try {
    const response = await api.patch(
      `/avaliacoes/admin/${id}/responder`,
      { resposta },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao responder avaliação");
  }
}

// Exclui uma avaliação
export async function deletarAvaliacaoAdmin(
  token: string,
  id: string
): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/avaliacoes/admin/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    tratarErro(error, "Erro ao excluir avaliação");
  }
}