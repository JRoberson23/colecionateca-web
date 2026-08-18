/* eslint-disable @next/next/no-img-element */
"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white px-4 py-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base">
          © {new Date().getFullYear()} Colecionateca. Todos os direitos reservados.
        </p>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Sua loja de consoles e jogos antigos.
        </p>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          📍 Santa Catarina, Brasil
        </p>

        {/* ✅ Desenvolvedor */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-6 pt-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <span className="text-sm md:text-base text-gray-300 font-bold">
              Desenvolvido por
            </span>          

            <a
              href="https://roberson-dev.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition duration-300"
            >
              <img
                src="/images/logo-roberson.png"
                alt="Logo Roberson Dev"
                className="w-14 md:w-16 bg-white p-2 rounded-full shadow-lg hover:scale-105 transition duration-300"
              />
            </a>

            <div className="text-left text-sm md:text-base text-pink-100 font-bold">
                com 🖥️ e ☕
            </div>
          </div>
        </div>

        {/* ✅ WhatsApp */}
        <div className="flex justify-center mt-1 gap-2 ml-0 md:ml-10">
          <a
            href="https://wa.me/5511950768793?text=Olá,%20adorei%20o%20trabalho%20na%20Colecionateca.%20Gostaria%20de%20um%20orçamento."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-300 hover:text-white hover:scale-105 transition duration-300"
          >
            <p className="text-sm md:text-base">
              Fale comigo!
            </p>
            <FaWhatsapp className="text-2xl text-green-500" />
          </a>
        </div>
        
      </div>
    </footer>
  );
}