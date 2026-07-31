"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { atualizarPerfil } from "@/src/services/auth";

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, isAuthenticated, isLoading } = useAuth();

  // ✅ Estados para edição
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  // ✅ Quando começar a editar, carregar os dados do usuário
  const handleEditar = () => {
    if (usuario) {
      setNome(usuario.nome || "");
      setEmail(usuario.email || "");
    }
    setEditando(true);
    setMensagem(null);
    setErro(null);
  };

  const handleCancelar = () => {
    setEditando(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");
    setErro(null);
    setMensagem(null);
  };

  const handleSalvar = async () => {
  setMensagem(null);
  setErro(null);

  // ✅ Pegar o token do localStorage
  const token = localStorage.getItem("token");

  if (!token) {
    setErro("Você precisa estar logado para atualizar o perfil");
    return;
  }

  // Validação de senha
  if (novaSenha && novaSenha !== confirmarNovaSenha) {
    setErro("As novas senhas não coincidem");
    return;
  }

  if (novaSenha && novaSenha.length < 6) {
    setErro("A nova senha deve ter pelo menos 6 caracteres");
    return;
  }

  try {
    // ✅ Preparar os dados para enviar
    const dados: { nome: string; email: string; senha_atual?: string; nova_senha?: string } = {
      nome,
      email,
    };

    // Se tiver nova senha, incluir no payload
    if (novaSenha) {
      dados.senha_atual = senhaAtual;
      dados.nova_senha = novaSenha;
    }

    // ✅ Chamar a API para atualizar o perfil
    const resultado = await atualizarPerfil(token, dados);

    setMensagem(resultado.message || "Perfil atualizado com sucesso!");
    setEditando(false);
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarNovaSenha("");

    // ✅ Atualizar os dados do usuário no localStorage
    if (resultado.user) {
      localStorage.setItem("usuario", JSON.stringify(resultado.user));
      
      window.location.reload();
    }
  } catch (error) {
    setErro(error instanceof Error ? error.message : "Erro ao atualizar perfil");
  }
};

  // ✅ Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // ✅ Se não estiver autenticado, redireciona para login
  if (!isAuthenticated || !usuario) {
    if (typeof window !== "undefined") {
      router.push("/login?redirect=perfil");
    }
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">👤 Meu Perfil</h1>

      <div className="bg-white border rounded-lg p-6 shadow-sm">
        {mensagem && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-sm">
            {mensagem}
          </div>
        )}

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {erro}
          </div>
        )}

        {/* ✅ Modo de visualização */}
        {!editando && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <p className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-600">
                {usuario.nome || ""}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <p className="w-full border rounded-lg px-4 py-2 bg-gray-50 text-gray-600">
                {usuario.email || ""}
              </p>
            </div>

            <button
              type="button"
              onClick={handleEditar}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Editar perfil
            </button>
          </div>
        )}

        {/* ✅ Modo de edição */}
        {editando && (
          <div className="space-y-4">
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
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alterar senha */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Alterar senha</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha atual
                  </label>
                  <input
                    id="senhaAtual"
                    type="password"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova senha
                  </label>
                  <input
                    id="novaSenha"
                    type="password"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Nova senha (mínimo 6 caracteres)"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nova senha
                  </label>
                  <input
                    id="confirmarNovaSenha"
                    type="password"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleSalvar}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Salvar alterações
              </button>
              <button
                type="button"
                onClick={handleCancelar}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}