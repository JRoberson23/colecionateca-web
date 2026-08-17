"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useAuth } from "../contexts/AuthContext";
import CarrinhoLateral from "./CarrinhoLateral";
import Animation from "./Animation";

export default function Header() {
  const { totalItens } = useCarrinho();
  const { usuario, logout } = useAuth();
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ✅ Detecta quando o usuário rola a página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // ✅ Link da animação do LottieFiles
  const controleAnimation = "https://lottie.host/ce3c5052-ea9e-41de-944b-02edfa6497ac/5mnnHIlKB0.lottie";

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
              : "bg-blue-600/90 backdrop-blur-sm shadow-md"
          }
        `}
      >
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/"
            className={`
              flex items-center gap-2 text-2xl font-bold transition-colors
              ${scrolled ? "text-blue-600" : "text-white"}
            `}
          >
            {/* ✅ Animação do controle - Link CDN */}
            <Animation
              src={controleAnimation}
              className="w-10 h-10 md:w-12 md:h-12"
              loop={true}
              autoplay={true}
            />
            <span>Colecionateca</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm md:text-base">
            <Link
              href="/produtos"
              className={`
                transition-colors hover:opacity-80
                ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
              `}
            >
              Produtos
            </Link>
            <button
              onClick={() => setCarrinhoAberto(true)}
              className={`
                flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80
                ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
              `}
            >
              🛒 Carrinho
              {mounted && totalItens > 0 && (
                <span
                  className={`
                    text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center
                    ${scrolled ? "bg-blue-600 text-white" : "bg-white text-blue-600"}
                  `}
                >
                  {totalItens}
                </span>
              )}
            </button>
            {mounted && (
            <>
              {/* ✅ Se usuário está logado */}
              {usuario ? (
                <div className="flex items-center gap-4">
                  <Link
                    href="/perfil"
                    className={`transition-colors hover:opacity-80 ${
                      scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                    }`}
                  >
                    👤 {usuario.nome}
                  </Link>
                  {/* ✅ Se for ADMIN, mostra link para admin */}
                  {usuario.role === "admin" && (
                    <Link
                      href="/admin"
                      className={`transition-colors hover:opacity-80 ${
                        scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                      }`}
                    >
                      🛠️ Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className={`transition-colors hover:opacity-80 ${
                      scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                    }`}
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`transition-colors hover:opacity-80 ${
                    scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"
                  }`}
                >
                  Login
                </Link>
              )}
            </>
          )}
          </nav>
        </div>
      </header>

      <div className="h-[72px] sm:h-[80px]" />

      <CarrinhoLateral
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
      />
    </>
  );
}