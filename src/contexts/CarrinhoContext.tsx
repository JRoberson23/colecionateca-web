"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Tipos
interface ItemCarrinho {
  produto_id: string;
  nome: string;
  console?: string;
  preco: number;
  quantidade: number;
  imagem?: string;
  estoque?: number;
}

interface CarrinhoContextType {
  itens: ItemCarrinho[];
  adicionarItem: (item: Omit<ItemCarrinho, "quantidade"> & { quantidade?: number }) => void;
  removerItem: (produto_id: string) => void;
  atualizarQuantidade: (produto_id: string, quantidade: number) => void;
  limparCarrinho: () => void;
  totalItens: number;
  totalPreco: number;
}

// Função para carregar o carrinho do localStorage
function carregarCarrinhoInicial(): ItemCarrinho[] {
  if (typeof window === "undefined") return [];
  try {
    const salvo = localStorage.getItem("carrinho");
    if (salvo) {
      return JSON.parse(salvo);
    }
  } catch {
    // Ignorar erro
  }
  return [];
}

// Contexto
const CarrinhoContext = createContext<CarrinhoContextType | undefined>(undefined);

// Provider
export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinhoInicial);

  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  }, [itens]);

  // Adicionar item ao carrinho (com validação de estoque)
  const adicionarItem = (item: Omit<ItemCarrinho, "quantidade"> & { quantidade?: number }) => {
  const quantidade = item.quantidade || 1;
  const estoqueDisponivel = item.estoque || 0;

  setItens((prev) => {
    const existente = prev.find((i) => i.produto_id === item.produto_id);

    if (existente) {
      const novaQuantidade = existente.quantidade + quantidade;
      if (novaQuantidade > (existente.estoque || 0)) {
        alert(`⚠️ Estoque insuficiente! Disponível: ${existente.estoque || 0}`);
        return prev;
      }
      return prev.map((i) =>
        i.produto_id === item.produto_id
          ? { ...i, quantidade: novaQuantidade }
          : i
      );
    }

    if (quantidade > estoqueDisponivel) {
      alert(`⚠️ Estoque insuficiente! Disponível: ${estoqueDisponivel}`);
      return prev;
    }

    return [
      ...prev,
      {
        produto_id: item.produto_id,
        nome: item.nome,
        console: item.console,
        preco: item.preco,
        quantidade,
        imagem: item.imagem,
        estoque: estoqueDisponivel,
      },
    ];
  });
};

  // Remover item do carrinho
  const removerItem = (produto_id: string) => {
    setItens((prev) => prev.filter((i) => i.produto_id !== produto_id));
  };

  // Atualizar quantidade (com validação de estoque)
  const atualizarQuantidade = (produto_id: string, quantidade: number) => {
    if (quantidade <= 0) {
      removerItem(produto_id);
      return;
    }

    setItens((prev) =>
      prev.map((i) => {
        if (i.produto_id === produto_id) {
          // ✅ Validar se a quantidade não excede o estoque
          if (quantidade > (i.estoque || 0)) {
            alert(`⚠️ Estoque insuficiente! Disponível: ${i.estoque || 0}`);
            return i;
          }
          return { ...i, quantidade };
        }
        return i;
      })
    );
  };

  // Limpar carrinho
  const limparCarrinho = () => {
    setItens([]);
  };

  // Totais
  const totalItens = itens.reduce((acc, item) => acc + item.quantidade, 0);
  const totalPreco = itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <CarrinhoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        atualizarQuantidade,
        limparCarrinho,
        totalItens,
        totalPreco,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
}

// Hook para usar o carrinho
export function useCarrinho() {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de CarrinhoProvider");
  }
  return context;
}