"use client";

import { useState } from "react";
import Estrelas from "./Estrelas";
import type { Avaliacao } from "../../services/avaliacoes";
import {
  aprovarAvaliacao,
  rejeitarAvaliacao,
  responderAvaliacao,
  deletarAvaliacaoAdmin,
} from "../../services/avaliacoesAdmin";
import Avatar from "../Avatar";

interface Props {
  avaliacao: Avaliacao;
  /** Chamado após qualquer ação bem-sucedida (para recarregar a lista) */
  onAtualizar: () => void;
}

export default function AdminAvaliacaoCard({ avaliacao, onAtualizar }: Props) {
  const [processando, setProcessando] = useState(false);
  const [respondendo, setRespondendo] = useState(false);
  const [textoResposta, setTextoResposta] = useState(avaliacao.resposta_admin || "");
  const [erro, setErro] = useState<string | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function executarAcao(acao: () => Promise<unknown>) {
    if (!token) {
      setErro("Token não encontrado. Faça login novamente.");
      return;
    }
    setProcessando(true);
    setErro(null);
    try {
      await acao();
      onAtualizar();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao executar ação");
    } finally {
      setProcessando(false);
    }
  }

  const handleAprovar = () =>
    executarAcao(() => aprovarAvaliacao(token!, avaliacao.id));

  const handleRejeitar = () => {
    if (!confirm("Tem certeza que deseja rejeitar esta avaliação?")) return;
    executarAcao(() => rejeitarAvaliacao(token!, avaliacao.id));
  };

  const handleExcluir = () => {
    if (!confirm("Tem certeza que deseja excluir permanentemente esta avaliação?")) return;
    executarAcao(() => deletarAvaliacaoAdmin(token!, avaliacao.id));
  };

  const handleResponder = async () => {
    if (!textoResposta.trim()) {
      setErro("A resposta não pode estar vazia.");
      return;
    }
    await executarAcao(() => responderAvaliacao(token!, avaliacao.id, textoResposta.trim()));
    setRespondendo(false);
  };

  // Formata a data
  function formatarData(data?: string) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Cores do badge conforme o status
    const badgeStatusConfig = {
    pendente: {
        texto: "⏳ Pendente",
        classes: "bg-yellow-100 text-yellow-800 border-yellow-300",
    },
    aprovada: {
        texto: "✅ Aprovada",
        classes: "bg-green-100 text-green-800 border-green-300",
    },
    rejeitada: {
        texto: "❌ Rejeitada",
        classes: "bg-red-100 text-red-800 border-red-300",
    },
    };

    const status =
    avaliacao.status === "aprovada" ||
    avaliacao.status === "rejeitada"
        ? avaliacao.status
        : "pendente";

    const badgeStatus = badgeStatusConfig[status];
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      {/* Cabeçalho: nome, email, data, status */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <Avatar 
            nome={avaliacao.usuario_nome || "Cliente"} 
            fotoUrl={avaliacao.usuario_foto_url} 
            tamanho="sm" 
          />
          <div>
            <p className="font-bold text-gray-800">{avaliacao.usuario_nome || "Cliente"}</p>
            <p className="text-xs text-gray-500">{avaliacao.usuario_email || ""}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatarData(avaliacao.createdAt)}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badgeStatus.classes}`}>
          {badgeStatus.texto}
        </span>
      </div>

      {/* Notas */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600 w-24">Geral:</span>
          <Estrelas valor={avaliacao.nota_geral} tamanho="text-sm" />
          <span className="text-xs text-gray-500">({avaliacao.nota_geral}/5)</span>
        </div>
        {(avaliacao.nota_navegacao || avaliacao.nota_design || avaliacao.nota_checkout) && (
          <div className="flex flex-wrap gap-3 text-xs text-gray-600 pl-1">
            {avaliacao.nota_navegacao ? (
              <span>Navegação: <strong>{avaliacao.nota_navegacao}/5</strong></span>
            ) : null}
            {avaliacao.nota_design ? (
              <span>Design: <strong>{avaliacao.nota_design}/5</strong></span>
            ) : null}
            {avaliacao.nota_checkout ? (
              <span>Checkout: <strong>{avaliacao.nota_checkout}/5</strong></span>
            ) : null}
          </div>
        )}
      </div>

      {/* Comentário */}
      {avaliacao.comentario && (
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <p className="text-sm text-gray-700 leading-relaxed">{avaliacao.comentario}</p>
        </div>
      )}

      {/* Resposta existente */}
      {avaliacao.resposta_admin && !respondendo && (
        <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3 mb-3">
          <p className="text-xs font-bold text-blue-700 mb-1">💬 Sua resposta:</p>
          <p className="text-sm text-blue-900 leading-relaxed">{avaliacao.resposta_admin}</p>
          {avaliacao.respondido_em && (
            <p className="text-xs text-blue-600 mt-1">
              Respondido em {formatarData(avaliacao.respondido_em)}
            </p>
          )}
        </div>
      )}

      {/* Formulário de resposta inline */}
      {respondendo && (
        <div className="mb-3">
          <textarea
            value={textoResposta}
            onChange={(e) => setTextoResposta(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Escreva a resposta que aparecerá junto do depoimento na home..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleResponder}
              disabled={processando}
              className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processando ? "Enviando..." : "Enviar resposta"}
            </button>
            <button
              onClick={() => {
                setRespondendo(false);
                setErro(null);
              }}
              disabled={processando}
              className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-2 rounded mb-3">
          {erro}
        </div>
      )}

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
        {avaliacao.status !== "aprovada" && (
          <button
            onClick={handleAprovar}
            disabled={processando}
            className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            ✅ Aprovar
          </button>
        )}

        {avaliacao.status !== "rejeitada" && (
          <button
            onClick={handleRejeitar}
            disabled={processando}
            className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition disabled:opacity-50"
          >
            ❌ Rejeitar
          </button>
        )}

        {!respondendo && (
          <button
            onClick={() => setRespondendo(true)}
            disabled={processando}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            💬 {avaliacao.resposta_admin ? "Editar resposta" : "Responder"}
          </button>
        )}

        <button
          onClick={handleExcluir}
          disabled={processando}
          className="bg-red-50 text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50 ml-auto"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
}