import Link from "next/link";

export default function PedidoConfirmadoPage() {
  return (
    <div className="text-center py-12 max-w-md mx-auto">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold text-green-600 mb-4">Pedido Confirmado!</h1>
      <p className="text-gray-600 mb-6">
        Seu pedido foi realizado com sucesso. Você receberá um e-mail com os detalhes da compra.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Número do pedido: <span className="font-mono">#2026-001</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/produtos"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Continuar comprando
        </Link>
        <Link
          href="/"
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition"
        >
          Voltar para Home
        </Link>
      </div>
    </div>
  );
}