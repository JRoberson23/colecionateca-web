"use client";

import { useState, useEffect } from "react";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const aquecerBackend = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/health`, {
        method: "GET",
      });
    } catch {
      console.log("Backend aquecendo...");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      // sessionStorage: aparece a cada nova aba
      const jaVisitou = sessionStorage.getItem("roberson-store-visitou");

      if (!jaVisitou) {
        setIsOpen(true);
        aquecerBackend();
      }
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fecharPopup = () => {
    // sessionStorage: aparece a cada nova aba
    sessionStorage.setItem("roberson-store-visitou", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all">

        {/* Cabeçalho */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">👋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
            Bem-vindo à Roberson Store!
          </h1>
          <p className="text-gray-500 text-sm">E-commerce de Demonstração</p>
        </div>

        {/* ⚡ ANIMAÇÃO DE CARREGAMENTO ⚡ */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative w-20 h-20">
            {/* Anel externo (cinza) */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>

            {/* Anel girando (azul) */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>

            {/* Ícone no centro */}
            <div className="absolute inset-0 flex items-center justify-center">
              {carregando ? (
                <span className="text-2xl animate-pulse">🚀</span>
              ) : (
                <span className="text-2xl">✅</span>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3">
            {carregando ? "Preparando o ambiente..." : "Tudo pronto! 🎉"}
          </p>
        </div>

        {/* Aviso */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            Este site é um <strong>e-commerce de demonstração</strong> criado
            para mostrar soluções completas em lojas virtuais.
          </p>
          <ul className="text-sm text-gray-600 mt-3 space-y-1">
            <li>⚠️ Nenhuma venda real é realizada</li>
            <li>📦 Os produtos são fictícios</li>
            <li>🚀 Explore tudo à vontade!</li>
          </ul>
        </div>

        {/* Botão */}
        <button
          onClick={fecharPopup}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
        >
          Entendi, vamos lá! 🚀
        </button>
      </div>
    </div>
  );
}