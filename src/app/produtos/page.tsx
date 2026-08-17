"use client";

import { useEffect, useState } from "react";
import { listarProdutos } from "@/src/services/api";
import ProdutoCard from "@/src/components/ProdutoCard";

interface Produto {
  id: string;
  nome: string;
  console?: string;
  preco: number;
  estoque: number;
  imagens: string[];
  descricao?: string;
  categoria?: string;
  metadata?: {
    console?: string;
    autor?: string;
    fabricante?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
  const [ imagemAtual, setImagemAtual ] = useState(0);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregando(true);
        const dados = await listarProdutos();
        setProdutos(dados);
      } catch (error) {
        setErro("Erro ao carregar produtos. Tente novamente.");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  // ✅ Extrair categorias únicas para filtro
  const categorias = [...new Set(
  produtos
    .map((p) => p.categoria)
    .filter((cat): cat is string => Boolean(cat) && typeof cat === 'string')
  )];

  // ✅ Filtrar produtos por categoria
  const produtosFiltrados = filtroCategoria
    ? produtos.filter((p) => p.categoria === filtroCategoria)
    : produtos;

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{erro}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          Nenhum produto encontrado no momento.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🎮 Produtos</h1>
      <p className="text-gray-600 mb-6">
        Confira nossa coleção de jogos, mangás e figures!
      </p>

      {/* ✅ Filtros por categoria */}
      {categorias.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-sm font-semibold text-gray-700 mr-2 self-center">
            Filtrar por categoria:
          </span>
          <button
            onClick={() => setFiltroCategoria(null)}
            className={`px-4 py-1 text-sm border rounded-full transition ${
              !filtroCategoria
                ? "bg-blue-600 text-white border-blue-600"
                : "hover:bg-blue-100 hover:border-blue-400"
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-1 text-sm border rounded-full transition ${
                filtroCategoria === cat
                  ? "bg-blue-600 text-white border-blue-600"
                  : "hover:bg-blue-100 hover:border-blue-400"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Lista de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {produtosFiltrados.map((produto) => (
          <ProdutoCard
            key={produto.id}
            id={produto.id}
            nome={produto.nome}
            console={produto.metadata?.console}
            preco={produto.preco}
            imagens={produto.imagens}
            descricao={produto.descricao}
            estoque={produto.estoque}
            categoria={produto.categoria}
            metadata={produto.metadata}
          />
        ))}
      </div>
    </div>
  );
}