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
      const jaVisitou = localStorage.getItem("roberson-store-visitou");

      if (!jaVisitou) {
        setIsOpen(true);
        aquecerBackend();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Fechar o popup
  const fecharPopup = () => {
    localStorage.setItem("roberson-store-visitou", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 transform transition-all">

        {/* Ícone de boas-vindas */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">👋</div>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
            Bem-vindo à Roberson Store!
          </h1>
          <p className="text-gray-500 text-sm">
            E-commerce de Demonstração
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

        {/* Status do carregamento */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          {carregando ? (
            <>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Preparando o ambiente...</span>
            </>
          ) : (
            <>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Tudo pronto! 🎉</span>
            </>
          )}
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