"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/contexts/AuthContext";

export default function CadastroPage() {
    const router = useRouter();
    const { registrar, isLoading } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erro, setError] = useState<string | null>(null);
    const [sucesso, setSucesso] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSucesso(null);

        // Validação básica
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem");
            return;
        }

        if (senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres");
            return;
        }

        try {
            await registrar(nome, email, senha);
            setSucesso("Conta criada com sucesso! Verifique seu e-mail para ativar sua conta.")
            // Limpar formulário
            setNome("");
            setEmail("");
            setSenha("");
            setConfirmarSenha("");

            // Redirecionar para login após 5 segundos
            setTimeout(() => {
                router.push("/login");
            }, 5000);
        } catch (error) {
            setError(error instanceof Error? error.message : "Erro ao criar conta");
        }
    };

    return (
        <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">📝 Criar Conta</h1>

        <div className="bg-white border rounded-lg p-6 shadow-sm">
            {erro && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
                {erro}
            </div>
            )}

            {sucesso && (
            <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
                {sucesso}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome */}
            <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
                </label>
                <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* E-mail */}
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

            {/* Senha */}
            <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
                </label>
                <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Confirmar Senha */}
            <div>
                <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar senha
                </label>
                <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                required
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
                {isLoading ? "Criando conta..." : "Criar Conta"}
            </button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Faça login
            </Link>
            </div>
        </div>
        </div>
    )
}