/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { formatarPreco } from "../lib/utils";

interface ProdutoCardProps {
  id: string;
  nome: string;
  console?: string;
  preco: number;
  imagens?: string[];
  descricao?: string;
  estoque?: number;
  categoria?: string;
  metadata?: {
    console?: string;
    autor?: string;
    fabricante?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
}

export default function ProdutoCard({
  id,
  nome,
  console: consoleProp,
  preco,
  imagens,
  descricao,
  estoque = 0,
  categoria,
  metadata,
}: ProdutoCardProps) {
  console.log('📷 Imagens recebidas:', imagens);
  const { adicionarItem } = useCarrinho();

  // ✅ Determina qual texto mostrar para a subcategoria
  const subcategoria = consoleProp || metadata?.console || metadata?.autor || categoria || "Produto";

  const handleAdicionarAoCarrinho = () => {
    adicionarItem({
      produto_id: id,
      nome: nome,
      console: consoleProp || metadata?.console,
      preco: preco,
      imagem: imagens?.[0],
      quantidade: 1,
      estoque: estoque,
    });
    alert(`${nome} adicionado ao carrinho!`);
  };

  //usar primeira imagem como principal
  const imagemPrincipal = imagens && Array.isArray(imagens) && imagens.length > 0 ? imagens[0] : null;

  return (
    <div className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow hover:scale-105 transform duration-200">
      <Link href={`/produtos/${id}`}>
        <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center">
          {imagemPrincipal ? (
            <Image
              src={imagemPrincipal}
              alt={nome}
              fill
              className="object-contain p-2"
              unoptimized={imagemPrincipal?.includes('cloudinary.com')}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-4xl">🎮</div>
          )}

          {categoria && (
            <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {categoria}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/produtos/${id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600 transition">
            {nome}
          </h3>
        </Link>
        <p className="text-sm text-gray-500">{subcategoria}</p>
        <p className="text-lg font-bold text-green-600 mt-1">
          {formatarPreco(preco)}
        </p>
        <button
          onClick={handleAdicionarAoCarrinho}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}