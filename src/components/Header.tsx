"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCarrinho } from "../contexts/CarrinhoContext";
import { useAuth } from "../contexts/AuthContext";
import CarrinhoLateral from "./CarrinhoLateral";
import Animation from "./Animation";
import Avatar from "./Avatar";

export default function Header() {
  const { totalItens } = useCarrinho();
  const { usuario, logout } = useAuth();
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const controleAnimation = "https://lottie.host/ce3c5052-ea9e-41de-944b-02edfa6497ac/5mnnHIlKB0.lottie";
  const primeiroNome = usuario?.nome?.split(" ")[0] || "";

  return (
    <>
      {/* sticky em vez de fixed: não precisa de espaçador */}
      <header
        className={`
          sticky top-0 z-50 px-3 sm:px-4 py-2 sm:py-3 transition-all duration-300
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
              : "bg-blue-600/90 backdrop-blur-sm shadow-md"
          }
        `}
      >
        <div className="container mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo: só ícone no mobile, ícone + nome em sm+ */}
          <Link
            href="/"
            className={`
              flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-bold transition-colors shrink-0
              ${scrolled ? "text-blue-600" : "text-white"}
            `}
          >
            <Animation
              src={controleAnimation}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              loop={true}
              autoplay={true}
            />
            <span className="hidden sm:inline">Roberson Store</span>
          </Link>

          {/* Nav: flex-nowrap para não quebrar linha */}
          <nav className="flex flex-nowrap items-center justify-end gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base min-w-0">
            <Link
              href="/produtos"
              className={`
                whitespace-nowrap transition-colors hover:opacity-80
                ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
              `}
            >
              Produtos
            </Link>

            <button
              onClick={() => setCarrinhoAberto(true)}
              className={`
                flex items-center gap-1 cursor-pointer transition-colors hover:opacity-80 whitespace-nowrap
                ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
              `}
            >
              🛒
              <span className="hidden md:inline">Carrinho</span>
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
                {usuario ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                      href="/perfil"
                      className={`
                        flex items-center gap-1 sm:gap-2 transition-colors hover:opacity-80
                        ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
                      `}
                    >
                      <Avatar
                        nome={usuario.nome}
                        fotoUrl={usuario.foto_url}
                        tamanho="sm"
                      />
                      {/* Desktop: nome completo. Mobile: primeiro nome */}
                      <span className="hidden sm:inline whitespace-nowrap">{usuario.nome}</span>
                      <span className="sm:hidden whitespace-nowrap max-w-[70px] truncate">
                        {primeiroNome}
                      </span>
                    </Link>

                    {/* Admin: só em sm+ */}
                    {usuario.role === "admin" && (
                      <Link
                        href="/admin"
                        className={`
                          hidden sm:inline whitespace-nowrap transition-colors hover:opacity-80
                          ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
                        `}
                      >
                        🛠️ Admin
                      </Link>
                    )}

                    <button
                      onClick={logout}
                      className={`
                        whitespace-nowrap transition-colors hover:opacity-80
                        ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
                      `}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className={`
                      whitespace-nowrap transition-colors hover:opacity-80
                      ${scrolled ? "text-gray-700 hover:text-blue-600" : "text-white hover:text-blue-200"}
                    `}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Sem espaçador — sticky fica no fluxo */}
      <CarrinhoLateral
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
      />
    </>
  );
}