"use client";

import { useState } from "react";
import AvaliacaoForm from "./AvaliacaoForm";
import AvaliacoesList from "./AvaliacoesList";

export default function AvaliacoesSection() {
  const [recarregar, setRecarregar] = useState(0);

  return (
    <section id="avaliacoes" className="mb-12">
      {/* ⭐ Cabeçalho da seção */}
      <div className="text-center mb-6">
        <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full text-sm font-bold mb-3">
          💬 SUA OPINIÃO IMPORTA
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Avalie a Roberson Store
        </h2>
      </div>

      {/* 💡 Aviso sobre avaliar o site */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 max-w-4xl mx-auto">
        <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
          💡 Por que avaliar a loja e não os produtos?
        </h3>
        <p className="text-sm text-blue-900 leading-relaxed">
          Este é um e-commerce de <strong>demonstração</strong>, sem vendas reais — avaliar
          produtos exigiria compras concretas para dar credibilidade às notas. Por isso, o
          feedback aqui é sobre a <strong>experiência com a plataforma</strong>: navegação,
          visual e facilidade de uso.
        </p>
        <p className="text-sm text-blue-900 leading-relaxed mt-2">
          Sua opinião ajuda a melhorar o projeto e mostra, na prática, como um e-commerce
          profissional funciona. Se quiser um site assim para o seu negócio,{" "}
          <a
            href="https://wa.me/5511950768793?text=Olá,%20vi%20o%20projeto%20Roberson%20Store%20e%20gostaria%20de%20um%20orçamento"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline hover:text-blue-700"
          >
            entre em contato para um orçamento
          </a>
          .
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <AvaliacaoForm onAtualizar={() => setRecarregar((n) => n + 1)} />
        </div>
        <div>
          <AvaliacoesList recarregar={recarregar} />
        </div>
      </div>
    </section>
  );
}