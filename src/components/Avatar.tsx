"use client";

import { useState } from "react";

interface AvatarProps {
  nome: string;
  /** URL da foto (se null/undefined, mostra as iniciais) */
  fotoUrl?: string | null;
  /** Tamanho do avatar */
  tamanho?: "sm" | "md" | "lg";
  className?: string;
}

// Gera as iniciais do nome
function gerarIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "?";
  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

// Gera uma cor consistente baseada no nome
function gerarCor(nome: string): string {
  const paleta = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }
  return paleta[Math.abs(hash) % paleta.length];
}

const tamanhos = {
  sm: "w-8 h-8 text-xs",
  md: "w-12 h-12 text-base",
  lg: "w-20 h-20 text-2xl",
};

export default function Avatar({
  nome,
  fotoUrl,
  tamanho = "md",
  className = "",
}: AvatarProps) {
  const [erroImagem, setErroImagem] = useState(false);

  const classesTamanho = tamanhos[tamanho];
  const iniciais = gerarIniciais(nome || "?");
  const corFundo = gerarCor(nome || "?");

  // Se tem foto e ela não falhou, mostra a foto
  if (fotoUrl && !erroImagem) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fotoUrl}
        alt={`Foto de ${nome || "usuário"}`}
        className={`${classesTamanho} rounded-full object-cover border-2 border-white shadow-sm ${className}`}
        onError={() => setErroImagem(true)}
      />
    );
  }

  // Caso contrário, mostra as iniciais com cor consistente
  return (
    <div
      className={`${classesTamanho} ${corFundo} rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm ${className}`}
      title={nome || "Usuário"}
    >
      {iniciais}
    </div>
  );
}