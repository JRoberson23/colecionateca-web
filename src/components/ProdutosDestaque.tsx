"use client";

import Image from "next/image";
import Link from "next/link";
import { formatarPreco } from "../lib/utils";

interface ProdutoDestaque {
  id: string;
  nome: string;
  preco: number;
  imagens?: string[];
  categoria?: string;
  metadata?: {
    console?: string;
  };
}

export default function ProdutosDestaque({ produtos }: { produtos: ProdutoDestaque[] }) {
  if (!produtos || produtos.length === 0) {
    return null;
  }

  return (
    <section className="mb-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        🔥 Produtos em Destaque
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtos.map((produto) => (
          <Link
            key={produto.id}
            href={`/produtos/${produto.id}`}
            className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition hover:-translate-y-1 duration-300"
          >
            <div className="relative w-full h-48 bg-gray-100">
              {produto.imagens && produto.imagens.length ? (
                <Image
                  src={produto.imagens[0]}
                  alt={produto.nome}
                  fill
                  className="object-contain p-2"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 quality={100}
                 unoptimized={produto.imagens[0].includes('cloudinary.com')}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-4xl">
                  🎮
                </div>
              )}
              <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                ⭐ Destaque
              </span>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{produto.nome}</h3>
              <p className="text-sm text-gray-500">
                {produto.metadata?.console || produto.categoria || "Produto"}
              </p>
              <p className="text-xl font-bold text-green-600 mt-2">
                {formatarPreco(produto.preco)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}