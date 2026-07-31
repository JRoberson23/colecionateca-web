"use client";

import Link from "next/link";
import { useCarrinho } from "@/src/contexts/CarrinhoContext";
import { formatarPreco } from "@/src/lib/utils"; 
import Image from "next/image";

export default function CarrinhoPage() {
  const { itens, removerItem, atualizarQuantidade, totalPreco, limparCarrinho } = useCarrinho();

  if (itens.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">🛒 Carrinho vazio</h1>
        <p className="text-gray-600 mb-6">Adicione produtos ao carrinho para continuar.</p>
        <Link
          href="/produtos"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">🛒 Meu Carrinho</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de itens */}
        <div className="lg:col-span-2 space-y-4">
          {itens.map((item) => (
            <div
              key={item.produto_id}
              className="flex items-center gap-4 bg-white border rounded-lg p-4 shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                {item.imagem ? (
                  <Image
                    src={item.imagem}
                    alt={item.nome}
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <span className="text-3xl">🎮</span>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.nome}</h3>
                <p className="text-gray-500 text-sm">{item.console}</p>
                <p className="text-green-600 font-bold">{formatarPreco(item.preco)}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded">
                  <button
                    onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{item.quantidade}</span>
                  <button
                    onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removerItem(item.produto_id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Resumo */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">📋 Resumo</h2>
            <div className="flex justify-between text-lg font-bold border-t pt-4">
              <span>Total:</span>
              <span className="text-green-600">{formatarPreco(totalPreco)}</span>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                onClick={limparCarrinho}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Limpar
              </button>
              <Link
                href="/checkout"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition"
              >
                Finalizar →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}