"use client";

import Animation from "./Animation";

export default function Sobre() {
  const amongUsAnimation = "https://lottie.host/30a90670-3881-4b13-a754-c55d0e44c95b/gg1Z2R6GL1.lottie";

  return (
    <section className="bg-gray-50 py-12 px-4 rounded-2xl mb-12 relative overflow-hidden">
      {/* Animação de Among Us */}
      <div className="absolute bottom-0 left-0 pointer-events-none animate-walk mb-[-22px] md:mb-[-15px]">
        <Animation
          src={amongUsAnimation}
          className="w-20 h-20 md:w-20 md:h-20"
          loop={true}
          autoplay={true}
        />
      </div>

      <div className="container mx-auto text-center max-w-3xl px-4 relative z-10">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
          📖 Sobre a Colecionateca
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed">
          A Colecionateca nasceu da paixão por jogos e consoles antigos e novos.
          Nosso objetivo é conectar colecionadores e entusiastas com os
          clássicos que marcaram gerações.
        </p>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mt-4">
          Cada produto é cuidadosamente selecionado e testado para garantir
          a melhor experiência nostálgica possível.
        </p>
      </div>
    </section>
  );
}