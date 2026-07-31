"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { buscarProdutoPorId } from "@/src/services/api"; 
import Image from "next/image";
import Link from "next/link";
import { useCarrinho } from "@/src/contexts/CarrinhoContext"; 
import { formatarPreco } from "@/src/lib/utils"; 

interface Produto {
  id: string;
  nome: string;
  console?: string;
  descricao?: string;
  preco: number;
  estoque: number;
  imagem?: string;
  categoria?: string;
  metadata?: {
    console?: string;
    ano?: number;
    autor?: string;
    editora?: string;
    fabricante?: string;
    altura?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DetalheProdutoPage() {
  const params = useParams();
  const id = params?.id as string;

  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const { adicionarItem } = useCarrinho();

  useEffect(() => {
    async function carregarProduto() {
      try {
        setCarregando(true);
        const dados = await buscarProdutoPorId(id);
        setProduto(dados);
      } catch (error) {
        setErro("Produto não encontrado");
        console.error(error);
      } finally {
        setCarregando(false);
      }
    }

    if (id) {
      carregarProduto();
    }
  }, [id]);

  if (carregando) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe ou foi removido.</p>
        <Link
          href="/produtos"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Voltar para produtos
        </Link>
      </div>
    );
  }

  // ✅ Montar informações adicionais do metadata
  const informacoesAdicionais = [];
  if (produto.metadata?.console) informacoesAdicionais.push({ label: "Console", value: produto.metadata.console });
  if (produto.metadata?.ano) informacoesAdicionais.push({ label: "Ano", value: produto.metadata.ano });
  if (produto.metadata?.autor) informacoesAdicionais.push({ label: "Autor", value: produto.metadata.autor });
  if (produto.metadata?.editora) informacoesAdicionais.push({ label: "Editora", value: produto.metadata.editora });
  if (produto.metadata?.fabricante) informacoesAdicionais.push({ label: "Fabricante", value: produto.metadata.fabricante });
  if (produto.metadata?.altura) informacoesAdicionais.push({ label: "Altura", value: produto.metadata.altura });

  return (
    <div>
      <Link
        href="/produtos"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 transition"
      >
        ← Voltar para produtos
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Imagem */}
        <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center">
          {produto.imagem ? (
            <Image
              src={produto.imagem}
              alt={produto.nome}
              width={400}
              height={400}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="text-8xl text-gray-300">🎮</div>
          )}
        </div>

        {/* Informações */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{produto.nome}</h1>
          {produto.categoria && (
            <span className="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-3">
              {produto.categoria}
            </span>
          )}

          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-green-600">
              {formatarPreco(produto.preco)}
            </span>
            {produto.estoque > 0 ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                Em estoque ({produto.estoque} unidades)
              </span>
            ) : (
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                Esgotado
              </span>
            )}
          </div>

          {/* ✅ Informações adicionais do metadata */}
          {informacoesAdicionais.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-sm text-gray-600 mb-2">Informações do produto:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {informacoesAdicionais.map((info) => (
                  <div key={info.label}>
                    <span className="text-gray-500">{info.label}:</span>
                    <span className="ml-1 font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-700 text-lg mb-6">
            {produto.descricao || "Sem descrição disponível."}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <label htmlFor="quantidade" className="font-semibold">
              Quantidade:
            </label>
            <input
              id="quantidade"
              type="number"
              min={1}
              max={produto.estoque}
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-20 border rounded px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              adicionarItem({
                produto_id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: quantidade,
                estoque: produto.estoque,
              });
              alert(`${produto.nome} adicionado ao carrinho!`);
            }}
            disabled={produto.estoque === 0}
            className={`w-full md:w-auto px-8 py-3 rounded-lg text-white font-semibold transition ${
              produto.estoque > 0
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {produto.estoque > 0 ? "Adicionar ao Carrinho 🛒" : "Produto Esgotado"}
          </button>
        </div>
      </div>
    </div>
  );
}