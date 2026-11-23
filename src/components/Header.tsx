
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

  // Detecta quando o usuário rola a página
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

  // Animação do controle
  const controleAnimation =
    "https://lottie.host/ce3c5052-ea9e-41de-944b-02edfa6497ac/5mnnHIlKB0.lottie";

  // Primeiro nome para telas menores
  const primeiroNome = usuario?.nome?.split(" ")[0] || "";

  return (
    <>
      <header
        className={`
          sticky top-0 z-50 px-3 sm:px-4 py-2 sm:py-3
          transition-all duration-300
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50"
              : "bg-blue-600/90 backdrop-blur-sm shadow-md"
          }
        `}
      >
        {/* Container principal */}
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 lg:flex-row lg:gap-4">

          {/* Logo e nome */}
          <Link
            href="/"
            className={`
              flex items-center gap-2 shrink-0
              text-lg sm:text-2xl font-bold transition-colors
              ${scrolled ? "text-blue-600" : "text-white"}
            `}
          >
            <Animation
              src={controleAnimation}
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              loop={true}
              autoplay={true}
            />

            <span className="whitespace-nowrap">
              Roberson Store
            </span>
          </Link>

          {/* Navegação */}
          <nav
            className="
              flex w-full flex-wrap items-center justify-center
              gap-x-3 gap-y-2 text-xs sm:text-sm
              lg:w-auto lg:flex-nowrap lg:justify-end
              lg:gap-4 lg:text-base
            "
          >
            {/* Produtos */}
            <Link
              href="/produtos"
              className={`
                whitespace-nowrap transition-colors hover:opacity-80
                ${
                  scrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }
              `}
            >
              Produtos
            </Link>

            {/* Carrinho */}
            <button
              onClick={() => setCarrinhoAberto(true)}
              className={`
                flex items-center gap-1 cursor-pointer
                whitespace-nowrap transition-colors hover:opacity-80
                ${
                  scrolled
                    ? "text-gray-700 hover:text-blue-600"
                    : "text-white hover:text-blue-200"
                }
              `}
            >
              🛒 Carrinho

              {mounted && totalItens > 0 && (
                <span
                  className={`
                    text-xs font-bold rounded-full w-5 h-5 shrink-0
                    flex items-center justify-center
                    ${
                      scrolled
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600"
                    }
                  `}
                >
                  {totalItens}
                </span>
              )}
            </button>

            {/* Área do usuário */}
            {mounted && (
              <>
                {usuario ? (
                  <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 sm:gap-4">

                    {/* Perfil */}
                    <Link
                      href="/perfil"
                      className={`
                        flex items-center gap-1 sm:gap-2
                        whitespace-nowrap transition-colors hover:opacity-80
                        ${
                          scrolled
                            ? "text-gray-700 hover:text-blue-600"
                            : "text-white hover:text-blue-200"
                        }
                      `}
                    >
                      <Avatar
                        nome={usuario.nome}
                        fotoUrl={usuario.foto_url}
                        tamanho="sm"
                      />

                      {/* Nome completo no desktop */}
                      <span className="hidden sm:inline whitespace-nowrap">
                        {usuario.nome}
                      </span>

                      {/* Primeiro nome no celular */}
                      <span className="sm:hidden max-w-[90px] truncate">
                        {primeiroNome}
                      </span>
                    </Link>

                    {/* Acesso administrativo */}
                    {usuario.role === "admin" && (
                      <Link
                        href="/admin"
                        className={`
                          whitespace-nowrap transition-colors hover:opacity-80
                          ${
                            scrolled
                              ? "text-gray-700 hover:text-blue-600"
                              : "text-white hover:text-blue-200"
                          }
                        `}
                      >
                        🛠️ Admin
                      </Link>
                    )}

                    {/* Sair */}
                    <button
                      onClick={logout}
                      className={`
                        whitespace-nowrap transition-colors hover:opacity-80
                        ${
                          scrolled
                            ? "text-gray-700 hover:text-blue-600"
                            : "text-white hover:text-blue-200"
                        }
                      `}
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  /* Login */
                  <Link
                    href="/login"
                    className={`
                      whitespace-nowrap transition-colors hover:opacity-80
                      ${
                        scrolled
                          ? "text-gray-700 hover:text-blue-600"
                          : "text-white hover:text-blue-200"
                      }
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

      {/* Carrinho lateral */}
      <CarrinhoLateral
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
      />
    </>
  );
}
