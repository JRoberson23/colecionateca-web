/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  console: string;
  preco: number;
  imagem: string;
  descricao: string;
}

const produtosMock: Produto[] = [
  {
    id: "1",
    nome: "Super Mario World",
    console: "SNES",
    preco: 299.90,
    imagem: "https://placehold.co/300x200/blue/white?text=Mario",
    descricao: "O clássico jogo do Mario para SNES",
  },
  {
    id: "2",
    nome: "The Legend of Zelda",
    console: "Nintendo 64",
    preco: 399.90,
    imagem: "https://placehold.co/300x200/green/white?text=Zelda",
    descricao: "O clássico jogo de aventura do Link",
  },
  {
    id: "3",
    nome: "Sonic the Hedgehog 2",
    console: "Mega Drive",
    preco: 199.90,
    imagem: "https://placehold.co/300x200/orange/white?text=Sonic",
    descricao: "O jogo mais rápido do Sonic",
  },
];

export default function ProdutosDestaque() {
  return (
    <section className="mb-12 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        🔥 Produtos em Destaque
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosMock.map((produto) => (
          <div
            key={produto.id}
            className="bg-white border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg md:text-xl font-semibold">{produto.nome}</h3>
              <p className="text-gray-600 text-sm">{produto.console}</p>
              <p className="text-xl md:text-2xl font-bold text-green-600 mt-2">
                R$ {produto.preco.toFixed(2)}
              </p>
              <Link
                href="/produtos"
                className="mt-4 w-full block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm md:text-base"
              >
                Ver Produtos →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}