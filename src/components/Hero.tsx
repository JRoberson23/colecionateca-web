"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl mb-12">
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
        <div className="inline-block text-white px-4 py-1 rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
          🚀 E-COMMERCE DE DEMONSTRAÇÃO
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          Roberson Store
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl mb-3 font-semibold text-white">
          Sua vitrine profissional de e-commerce!
        </p>
        
        <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto px-4">
          Um e-commerce completo e funcional, com carrinho, pagamento, frete e 
          painel administrativo. Tudo pronto para o seu negócio!
        </p>

        {/* ⚠️ AVISO IMPORTANTE - COM DESTAQUE */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-3 mb-6 max-w-2xl mx-auto">
        <p className="text-white/80 text-xs md:text-sm">
          ⚠️ <span className="font-semibold">Site de demonstração:</span> Este é um portfólio de e-commerce. 
          Nenhuma venda real é realizada.
        </p>
      </div>

        {/* Selos de funcionalidades */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 text-sm">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🛒 Carrinho</span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">💳 Pagamento</span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">📦 Frete</span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🛡️ Admin</span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">📱 Responsivo</span>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/produtos"
            className="bg-white text-blue-600 px-6 py-3 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg inline-block text-sm md:text-base"
          >
            Explorar Produtos →
          </Link>
          <Link
            href="#sobre"
            className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 md:px-8 md:py-3 mb-3 rounded-full font-semibold hover:bg-white/30 transition shadow-lg inline-block text-sm md:text-base border border-white/30"
          >
            💼 Sobre o Projeto
          </Link>
        </div>
      </div>
    </section>
  );
}