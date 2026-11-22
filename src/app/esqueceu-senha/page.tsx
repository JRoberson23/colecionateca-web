"use client";

import { useState } from "react";
import Link from "next/link";
import { solicitarRecuperacao } from "@/src/services/auth";

export default function EsqueceuSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setEnviando(true);

    try {
      const resultado = await solicitarRecuperacao(email);
      setMensagem(
        resultado.message ||
          "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha."
      );
      setEmail("");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao solicitar recuperação");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">🔑 Esqueceu a senha?</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <p className="text-sm text-gray-600 mb-6 text-center">
          Digite seu e-mail cadastrado e enviaremos um link para você criar uma nova senha.
        </p>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {mensagem}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {enviando ? "Enviando..." : "Enviar link de recuperação"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <Link href="/login" className="text-blue-600 hover:text-blue-800">
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}