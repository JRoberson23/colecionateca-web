"use client";

import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import ProdutosDestaque from "../components/ProdutosDestaque";
import Sobre from "../components/Sobre";

export default function Home() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    async function buscarDestaques() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/destaque`);
        const data = await response.json();
        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos em destaque:", error);
      }
    }
    buscarDestaques();
  }, []);

  return (
    <div>
      <Hero />
      <ProdutosDestaque produtos={produtos} />
      <Sobre />
    </div>
  );
}