"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import Estrelas from "./Estrelas";
import {
  buscarMinhaAvaliacao,
  criarOuAtualizarAvaliacao,
  deletarMinhaAvaliacao,
  type Avaliacao,
} from "../../services/avaliacoes";

interface Props {
  /** Chamado quando o usuário envia, edita ou exclui — para atualizar a lista ao lado */
  onAtualizar?: () => void;
}

export default function AvaliacaoForm({ onAtualizar }: Props) {
  const { usuario, token, isAuthenticated } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [avaliacaoExistente, setAvaliacaoExistente] = useState<Avaliacao | null>(null);

  // Campos do formulário
  const [notaGeral, setNotaGeral] = useState(0);
  const [notaNavegacao, setNotaNavegacao] = useState(0);
  const [notaDesign, setNotaDesign] = useState(0);
  const [notaCheckout, setNotaCheckout] = useState(0);
  const [comentario, setComentario] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Carrega a avaliação existente ao montar (se logado)
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    async function carregar() {
      setCarregando(true);
      try {
        const minha = await buscarMinhaAvaliacao(token!);
        if (minha) {
          setAvaliacaoExistente(minha);
          setNotaGeral(minha.nota_geral);
          setNotaNavegacao(minha.nota_navegacao || 0);
          setNotaDesign(minha.nota_design || 0);
          setNotaCheckout(minha.nota_checkout || 0);
          setComentario(minha.comentario || "");
        }
      } catch (error) {
        console.error("Erro ao carregar avaliação:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [isAuthenticated, token]);

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    if (notaGeral === 0) {
      setMensagem({ tipo: "erro", texto: "Escolha pelo menos a nota geral (estrelas)." });
      return;
    }

    setEnviando(true);
    setMensagem(null);

    try {
      const result = await criarOuAtualizarAvaliacao(token, {
        nota_geral: notaGeral,
        nota_navegacao: notaNavegacao || null,
        nota_design: notaDesign || null,
        nota_checkout: notaCheckout || null,
        comentario: comentario.trim() || undefined,
      });

      setMensagem({ tipo: "sucesso", texto: result.message });
      setAvaliacaoExistente(result.avaliacao);
      onAtualizar?.();
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: error instanceof Error ? error.message : "Erro ao enviar avaliação",
      });
    } finally {
      setEnviando(false);
    }
  }

  async function handleExcluir() {
    if (!token) return;
    if (!confirm("Tem certeza que deseja excluir sua avaliação?")) return;

    setEnviando(true);
    setMensagem(null);
    try {
      const result = await deletarMinhaAvaliacao(token);
      setMensagem({ tipo: "sucesso", texto: result.message });

      // Limpa o formulário
      setAvaliacaoExistente(null);
      setNotaGeral(0);
      setNotaNavegacao(0);
      setNotaDesign(0);
      setNotaCheckout(0);
      setComentario("");

      onAtualizar?.();
    } catch (error) {
      setMensagem({
        tipo: "erro",
        texto: error instanceof Error ? error.message : "Erro ao excluir avaliação",
      });
    } finally {
      setEnviando(false);
    }
  }

  if (!mounted) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm min-h-[280px]" />
    );
  }

  // --- Não logado ---
  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
        <p className="text-gray-700 mb-4">
          Para avaliar a loja, você precisa estar logado.
        </p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Fazer login
        </Link>
      </div>
    );
  }

  // --- Carregando avaliação existente ---
  if (carregando) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500">
        Carregando sua avaliação...
      </div>
    );
  }

  const statusBadge = avaliacaoExistente && (
    <span
      className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${
        avaliacaoExistente.status === "aprovada"
          ? "bg-green-100 text-green-700"
          : avaliacaoExistente.status === "rejeitada"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {avaliacaoExistente.status === "aprovada"
        ? "✅ Aprovada e publicada"
        : avaliacaoExistente.status === "rejeitada"
        ? "❌ Rejeitada pelo admin"
        : "⏳ Aguardando moderação"}
    </span>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-lg font-bold text-gray-800">
          {avaliacaoExistente ? "Sua avaliação" : "Avalie a loja"}
        </h3>
        {statusBadge}
      </div>

      {usuario && (
        <p className="text-sm text-gray-500 mb-4">
          Avaliando como <span className="font-semibold">{usuario.nome}</span>
        </p>
      )}

      <form onSubmit={handleEnviar} className="space-y-4">
        {/* Nota geral */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nota geral <span className="text-red-500">*</span>
          </label>
          <Estrelas valor={notaGeral} interativo onChange={setNotaGeral} tamanho="text-2xl" />
        </div>

        {/* Notas dimensionais */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Navegação
            </label>
            <Estrelas valor={notaNavegacao} interativo onChange={setNotaNavegacao} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Visual / Design
            </label>
            <Estrelas valor={notaDesign} interativo onChange={setNotaDesign} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Checkout
            </label>
            <Estrelas valor={notaCheckout} interativo onChange={setNotaCheckout} />
          </div>
        </div>

        {/* Comentário */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={1000}
            rows={3}
            placeholder="Conte o que achou da experiência..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
          <p className="text-xs text-gray-400 text-right mt-1">
            {comentario.length}/1000
          </p>
        </div>

        {/* Feedback */}
        {mensagem && (
          <div
            className={`text-sm p-3 rounded-lg ${
              mensagem.tipo === "sucesso"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        {/* Botões */}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={enviando}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando
              ? "Enviando..."
              : avaliacaoExistente
              ? "Atualizar avaliação"
              : "Enviar avaliação"}
          </button>

          {avaliacaoExistente && (
            <button
              type="button"
              onClick={handleExcluir}
              disabled={enviando}
              className="bg-red-50 text-red-600 border border-red-200 px-6 py-2 rounded-full font-semibold hover:bg-red-100 transition disabled:opacity-50"
            >
              Excluir avaliação
            </button>
          )}
        </div>

        {avaliacaoExistente && avaliacaoExistente.status === "aprovada" && (
          <p className="text-xs text-gray-500">
            Ao editar, sua avaliação volta para moderação antes de ser publicada novamente.
          </p>
        )}
      </form>
    </div>
  );
}