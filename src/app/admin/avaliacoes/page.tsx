"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminAvaliacaoCard from "@/src/components/Avaliacoes/AdminAvaliacaoCard";
import type { Avaliacao } from "@/src/services/avaliacoes";
import { listarTodasAvaliacoes } from "@/src/services/avaliacoesAdmin";

type FiltroStatus = "todas" | "pendente" | "aprovada" | "rejeitada";

export default function AdminAvaliacoesPage() {
  const { usuario, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroStatus>("todas");

  // ✅ Proteção de rota (mesmo padrão do /admin/page.tsx)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || usuario?.role !== "admin") {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, usuario, router]);

  // ✅ Carregar avaliações
  const carregar = useCallback(async () => {
    await Promise.resolve();

    const token = localStorage.getItem("token");
    if (!token) {
      setErro("Token não encontrado. Faça login novamente.");
      setCarregando(false);
      return;
    }
    setErro(null);
    try {
      const data = await listarTodasAvaliacoes(token);
      setAvaliacoes(data);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar avaliações");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
  if (usuario?.role === "admin") {
    // eslint-disable-next-line
    carregar();
  }
}, [usuario, carregar]);

  // ✅ Contadores por status
  const total = avaliacoes.length;
  const pendentes = avaliacoes.filter((a) => a.status === "pendente").length;
  const aprovadas = avaliacoes.filter((a) => a.status === "aprovada").length;
  const rejeitadas = avaliacoes.filter((a) => a.status === "rejeitada").length;

  // ✅ Filtro aplicado
  const avaliacoesFiltradas =
    filtro === "todas"
      ? avaliacoes
      : avaliacoes.filter((a) => a.status === filtro);

  // Enquanto verifica autenticação
  if (isLoading || !isAuthenticated || usuario?.role !== "admin") {
    return (
      <div className="max-w-6xl mx-auto py-12 text-center text-gray-500">
        Verificando permissões...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-3xl font-bold">⭐ Gerenciar Avaliações</h1>
          <p className="text-sm text-gray-500 mt-1">
            Aprove, rejeite ou responda as avaliações dos clientes
          </p>
        </div>
        <Link
          href="/admin"
          className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
        >
          ← Voltar ao painel
        </Link>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{total}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-yellow-700 font-semibold uppercase">Pendentes</p>
          <p className="text-2xl font-bold text-yellow-800 mt-1">{pendentes}</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-green-700 font-semibold uppercase">Aprovadas</p>
          <p className="text-2xl font-bold text-green-800 mt-1">{aprovadas}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
          <p className="text-xs text-red-700 font-semibold uppercase">Rejeitadas</p>
          <p className="text-2xl font-bold text-red-800 mt-1">{rejeitadas}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {([
          { valor: "todas", label: "Todas" },
          { valor: "pendente", label: `Pendentes (${pendentes})` },
          { valor: "aprovada", label: `Aprovadas (${aprovadas})` },
          { valor: "rejeitada", label: `Rejeitadas (${rejeitadas})` },
        ] as { valor: FiltroStatus; label: string }[]).map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              filtro === f.valor
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {carregando ? (
        <p className="text-center text-gray-500 py-12">Carregando avaliações...</p>
      ) : erro ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {erro}
        </div>
      ) : avaliacoesFiltradas.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <p className="text-gray-500">
            {filtro === "todas"
              ? "Nenhuma avaliação recebida ainda."
              : `Nenhuma avaliação ${filtro}${
                  filtro === "aprovada" || filtro === "rejeitada" ? "s" : ""
                }.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {avaliacoesFiltradas.map((avaliacao) => (
            <AdminAvaliacaoCard
              key={avaliacao.id}
              avaliacao={avaliacao}
              onAtualizar={carregar}
            />
          ))}
        </div>
      )}
    </div>
  );
}