"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/src/contexts/AuthContext"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { listarProdutos } from "@/src/services/api"; 

interface Produto {
  id: string;
  nome: string;
  categoria?: string;
  preco: number;
  estoque: number;
  imagem?: string;
  descricao?: string;
  metadata?: {
    console?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

interface Mensagem {
  tipo: "sucesso" | "erro";
  texto: string;
}

export default function AdminPage() {
  const { usuario, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState<Mensagem | null>(null);

  // ✅ Verificar se o usuário é ADMIN
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || usuario?.role !== "admin") {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, usuario, router]);

  // ✅ Carregar produtos
  useEffect(() => {
    if (usuario?.role === "admin") {
      listarProdutos()
        .then(setProdutos)
        .catch(console.error)
        .finally(() => setCarregando(false));
    }
  }, [usuario]);

  // ✅ Função para excluir produto (VERSÃO FORÇADA)
  const handleExcluir = async (id: string, nome: string) => {
    console.log('🗑️ EXCLUINDO PRODUTO - VERSÃO 2.0');
    console.log('📦 ID:', id);
    console.log('📦 Nome:', nome);
    console.log('🔗 URL:', `${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}`);

    if (!confirm(`Tem certeza que deseja excluir o produto "${nome}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMensagem({ tipo: "erro", texto: "Você precisa estar logado para excluir um produto" });
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📦 Status da resposta:', response.status);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao excluir produto");
      }

      setProdutos((prev) => prev.filter((p) => p.id !== id));
      setMensagem({ tipo: "sucesso", texto: `Produto "${nome}" excluído com sucesso!` });
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('❌ Erro ao excluir:', error);
      setMensagem({
        tipo: "erro",
        texto: error instanceof Error ? error.message : "Erro ao excluir produto",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🛠️ Painel Administrativo</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">📦 Gerenciar Produtos</h2>
          <Link
            href="/admin/produtos/novo"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Novo Produto
          </Link>
        </div>

        {/* ✅ Mensagens de sucesso/erro */}
        {mensagem && (
          <div
            className={`p-3 rounded mb-4 text-sm ${
              mensagem.tipo === "sucesso"
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {mensagem.texto}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3">Nome</th>
                <th className="text-left p-3">Categoria</th>
                <th className="text-left p-3">Preço</th>
                <th className="text-left p-3">Estoque</th>
                <th className="text-center p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map((produto) => (
                <tr key={produto.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{produto.nome}</td>
                  <td className="p-3">{produto.categoria || "-"}</td>
                  <td className="p-3">R$ {produto.preco.toFixed(2)}</td>
                  <td className="p-3">{produto.estoque}</td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/produtos/editar/${produto.id}`}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleExcluir(produto.id, produto.nome)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}