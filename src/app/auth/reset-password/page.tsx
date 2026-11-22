"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { redefinirSenha } from "@/src/services/auth";
import CampoSenha from "@/src/components/CampoSenha";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Se não tem token na URL, mostra erro
  const [tokenAusente, setTokenAusente] = useState(false);
  useEffect(() => {
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTokenAusente(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    if (!token) {
      setErro("Token inválido ou ausente.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setEnviando(true);
    try {
      const resultado = await redefinirSenha(token, novaSenha);
      setMensagem(resultado.message || "Senha redefinida com sucesso!");

      // Limpa campos e redireciona após 3 segundos
      setNovaSenha("");
      setConfirmarSenha("");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao redefinir senha");
    } finally {
      setEnviando(false);
    }
  };

  // Caso o usuário abra a página sem token na URL
  if (tokenAusente) {
    return (
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">🔐 Redefinir senha</h1>
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            Token inválido ou ausente. Solicite um novo link de recuperação.
          </div>
          <Link
            href="/esqueceu-senha"
            className="block text-center w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Solicitar novo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8">🔐 Redefinir senha</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        <p className="text-sm text-gray-600 mb-6 text-center">
          Escolha uma nova senha para sua conta.
        </p>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        {mensagem && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {mensagem}
            <p className="text-xs mt-1">Redirecionando para o login...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Nova senha
            </label>
            <CampoSenha
              id="novaSenha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar nova senha
            </label>
            <CampoSenha
              id="confirmarSenha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite a senha novamente"
              required
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {enviando ? "Redefinindo..." : "Redefinir senha"}
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

// useSearchParams precisa estar dentro de Suspense no Next.js 15+
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}