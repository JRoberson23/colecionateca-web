"use client";

import { useCarrinho } from "../contexts/CarrinhoContext";
import { formatarPreco } from "../lib/utils"; 
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CarrinhoLateralProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CarrinhoLateral({ isOpen, onClose }: CarrinhoLateralProps) {
  const { itens, removerItem, atualizarQuantidade, totalItens, totalPreco, limparCarrinho } = useCarrinho();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            🛒 Carrinho
            {mounted && (
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {totalItens} itens
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Lista de itens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {itens.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500">Seu carrinho está vazio</p>
              <button
                onClick={onClose}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Continuar comprando →
              </button>
            </div>
          ) : (
            itens.map((item) => (
              <div
                key={item.produto_id}
                className="flex items-center gap-4 border-b pb-4"
              >
                {/* Imagem */}
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {item.imagem ? (
                    <Image
                      src={item.imagem}
                      alt={item.nome}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🎮</span>
                  )}
                </div>

                {/* Informações */}
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.nome}</h3>
                  <p className="text-gray-500 text-xs">{item.console}</p>
                  <p className="text-green-600 font-bold text-sm">
                    {formatarPreco(item.preco)}
                  </p>
                </div>

                {/* Quantidade e remover */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantidade}</span>
                    <button
                      onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)}
                      className="px-2 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removerItem(item.produto_id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Rodapé (total e ações) */}
        {itens.length > 0 && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total:</span>
              <span className="text-green-600">{formatarPreco(totalPreco)}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={limparCarrinho}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Limpar
              </button>
              <Link
                href="/checkout"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition"
                onClick={onClose}
              >
                Finalizar Compra →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}