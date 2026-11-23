"use client";

import { useEffect, useState } from "react";
import Estrelas from "./Estrelas";
import { listarAvaliacoesPublicas, type Avaliacao } from "../../services/avaliacoes";
import Avatar from "../Avatar";

interface Props {
  /** Se mudar, força recarregar (usado após enviar/editar/excluir) */
  recarregar?: number;
}

export default function AvaliacoesList({ recarregar }: Props) {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [media, setMedia] = useState(0);
  const [total, setTotal] = useState(0);
  const [filtroNota, setFiltroNota] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      setErro(null);
      try {
        const data = await listarAvaliacoesPublicas(filtroNota ?? undefined);
        setAvaliacoes(data.avaliacoes);
        // A média e o total sempre vêm do conjunto completo (sem filtro)
        setMedia(data.media);
        setTotal(data.total);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        setErro("Não foi possível carregar as avaliações.");
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [filtroNota, recarregar]);

  // Formata a data para pt-BR
  function formatarData(data?: string) {
    if (!data) return "";
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <section className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm h-full">
      {/* Cabeçalho com média */}
      <div className="text-center mb-6">
        <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold mb-3">
          ⭐ AVALIAÇÕES
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          O que estão dizendo
        </h2>

        {total > 0 ? (
          <div className="flex items-center justify-center gap-3 mt-3">
            <Estrelas valor={media} tamanho="text-2xl" />
            <span className="text-lg font-bold text-gray-800">{media.toFixed(1)}</span>
            <span className="text-sm text-gray-500">
              ({total} avaliaç{total > 1 ? "ões" : "ão"})
            </span>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">
            Ainda não há avaliações publicadas.
          </p>
        )}
      </div>

      {/* Filtros por nota */}
      {total > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setFiltroNota(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              filtroNota === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Todas
          </button>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              onClick={() => setFiltroNota(n)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                filtroNota === n
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {n} ⭐
            </button>
          ))}
        </div>
      )}

      {/* Estados: carregando / erro / vazio / lista */}
      {carregando ? (
        <p className="text-center text-gray-500 py-8">Carregando avaliações...</p>
      ) : erro ? (
        <p className="text-center text-red-600 py-8">{erro}</p>
      ) : avaliacoes.length === 0 ? (
        <p className="text-center text-gray-500 py-8">
          {filtroNota
            ? `Nenhuma avaliação com ${filtroNota} estrela${filtroNota > 1 ? "s" : ""}.`
            : "Nenhuma avaliação publicada ainda."}
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {avaliacoes.map((av) => (
            <article
              key={av.id}
              className="bg-gray-50 rounded-xl p-5 border border-gray-200"
            >
              {/* Cabeçalho do card */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar 
                    nome={av.usuario_nome || "Cliente"} 
                    fotoUrl={av.usuario_foto_url} 
                    tamanho="sm" 
                  />
                  <div>
                    <p className="font-bold text-gray-800">
                      {av.usuario_nome || "Cliente"}
                    </p>
                    <p className="text-xs text-gray-500">{formatarData(av.createdAt)}</p>
                  </div>
                </div>
                <Estrelas valor={av.nota_geral} tamanho="text-sm" />
              </div>

              {/* Comentário */}
              {av.comentario ? (
                <p className="text-gray-700 text-sm leading-relaxed">
                  {av.comentario}
                </p>
              ) : (
                <p className="text-gray-400 text-sm italic">
                  (Sem comentário)
                </p>
              )}

              {/* Resposta do admin */}
              {av.resposta_admin && (
                <div className="mt-3 pl-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg p-3">
                  <p className="text-xs font-bold text-blue-700 mb-1">
                    💬 Resposta da loja
                  </p>
                  <p className="text-sm text-blue-900 leading-relaxed">
                    {av.resposta_admin}
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}