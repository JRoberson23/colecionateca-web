"use client";

import { useState } from "react";
import AvaliacaoForm from "./AvaliacaoForm";
import AvaliacoesList from "./AvaliacoesList";

export default function AvaliacoesSection() {
  // Contador que, quando muda, força a lista a recarregar
  const [recarregar, setRecarregar] = useState(0);

  return (
    <section id="avaliacoes" className="mb-12">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Coluna esquerda: formulário */}
        <div>
          <AvaliacaoForm onAtualizar={() => setRecarregar((n) => n + 1)} />
        </div>

        {/* Coluna direita: lista (ou apenas "chamada" quando não há avaliações) */}
        <div>
          <AvaliacoesList recarregar={recarregar} />
        </div>
      </div>
    </section>
  );
}