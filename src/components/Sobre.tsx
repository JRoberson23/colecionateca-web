"use client";

import Animation from "./Animation";

export default function Sobre() {
  const amongUsAnimation = "https://lottie.host/30a90670-3881-4b13-a754-c55d0e44c95b/gg1Z2R6GL1.lottie";

  return (
    <section id="sobre" className="bg-gray-50 py-12 px-4 rounded-2xl mb-12 relative overflow-hidden">
      {/* Animação de Among Us */}
      <div className="absolute bottom-0 left-0 pointer-events-none animate-walk mb-[-22px] md:mb-[-15px]">
        <Animation
          src={amongUsAnimation}
          className="w-20 h-20 md:w-20 md:h-20"
          loop={true}
          autoplay={true}
        />
      </div>

      <div className="container mx-auto text-center max-w-4xl px-4 relative z-10">
        {/* Badge */}
        <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold mb-4">
          💼 Sobre o Projeto
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-blue-600 mb-6">
          Sobre a Roberson Store
        </h2>
        
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg text-left">
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            <span className="font-bold text-blue-600">Roberson Store</span> é um 
            <span className="font-bold text-yellow-600"> e-commerce de demonstração </span> 
            desenvolvido para mostrar o que é possível fazer com um site profissional.
          </p>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            Aqui você encontra todas as funcionalidades que um e-commerce de verdade precisa:
          </p>

          {/* Funcionalidades */}
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-700 mb-2">🛒 Para o cliente</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Catálogo de produtos</li>
                <li>✅ Carrinho de compras</li>
                <li>✅ Pagamento com cartão/PIX</li>
                <li>✅ Cálculo de frete</li>
                <li>✅ Cadastro e login</li>
              </ul>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-2">🛠️ Para o lojista</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✅ Painel administrativo</li>
                <li>✅ Gestão de produtos</li>
                <li>✅ Controle de pedidos</li>
                <li>✅ Gestão de clientes</li>
                <li>✅ Relatórios e vendas</li>
              </ul>
            </div>
          </div>

          <p className="text-gray-700 text-base md:text-lg leading-relaxed mt-4">
            Tudo isso em um site <span className="font-bold">100% funcional</span>, 
            responsivo e pronto para ser personalizado para o seu negócio.
          </p>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              💡 <span className="font-bold">Quer um site como este?</span> 
              {" "}Entre em contato e vamos conversar sobre o projeto do seu e-commerce!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}