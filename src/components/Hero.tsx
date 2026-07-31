"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-2xl mb-12">
      {/* ✅ Vídeo de fundo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-consoles.mp4" type="video/mp4" />
      </video>
      
      {/* ✅ Overlay escuro para o texto ficar legível */}
      <div className="absolute inset-0 bg-black/50" />

      {/* ✅ Conteúdo */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
           Colecionateca
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-6">
          Sua loja de consoles!
        </p>
        <p className="text-base md:text-lg mb-8 max-w-2xl mx-auto px-4">
          Encontre os clássicos que marcaram época, desde o SNES até os consoles atuais.
        </p>
        <Link
          href="/produtos"
          className="bg-white text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg inline-block text-sm md:text-base"
        >
          Ver Produtos →
        </Link>
      </div>
    </section>
  );
}