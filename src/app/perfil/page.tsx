"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import { atualizarPerfil, uploadFoto, removerFoto } from "@/src/services/auth";
import Avatar from "@/src/components/Avatar";
import CampoSenha from "@/src/components/CampoSenha";

export default function PerfilPage() {
  const router = useRouter();
  const { usuario, isAuthenticated, isLoading, atualizarUsuario } = useAuth();

  // ✅ Estados para edição
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [editando, setEditando] = useState(false);

  // ✅ Estados do upload de foto
  const [enviandoFoto, setEnviandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState<string | null>(null);

  // ✅ Upload de foto
  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    // Validação no cliente (o backend também valida)
    if (arquivo.size > 5 * 1024 * 1024) {
      setErroFoto("A imagem deve ter no máximo 5MB.");
      return;
    }

    const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!tiposPermitidos.includes(arquivo.type)) {
      setErroFoto("Formato inválido. Use JPG, PNG, GIF ou WEBP.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setErroFoto("Você precisa estar logado.");
      return;
    }

    setEnviandoFoto(true);
    setErroFoto(null);
    try {
      const resultado = await uploadFoto(token, arquivo);
      atualizarUsuario(resultado.user);
      setMensagem("Foto de perfil atualizada!");
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      setErroFoto(error instanceof Error ? error.message : "Erro ao enviar foto");
    } finally {
      setEnviandoFoto(false);
      // Limpa o input para permitir reenviar o mesmo arquivo
      e.target.value = "";
    }
  };

  // ✅ Remover foto
  const handleRemoverFoto = async () => {
    if (!confirm("Tem certeza que deseja remover sua foto de perfil?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      setErroFoto("Você precisa estar logado.");
      return;
    }

    setEnviandoFoto(true);
    setErroFoto(null);
    try {
      const resultado = await removerFoto(token);
      atualizarUsuario(resultado.user);
      setMensagem("Foto de perfil removida.");
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      setErroFoto(error instanceof Error ? error.message : "Erro ao remover foto");
    } finally {
      setEnviandoFoto(false);
    }
  };

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

    const token = localStorage.getItem("token");

    if (!token) {
      setErro("Você precisa estar logado para atualizar o perfil");
      return;
    }

    if (novaSenha && novaSenha !== confirmarNovaSenha) {
      setErro("As novas senhas não coincidem");
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      setErro("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      const dados: { nome: string; senha_atual?: string; nova_senha?: string } = {
        nome,
      };

      if (novaSenha) {
        dados.senha_atual = senhaAtual;
        dados.nova_senha = novaSenha;
      }

      const resultado = await atualizarPerfil(token, dados);

      setMensagem(resultado.message || "Perfil atualizado com sucesso!");
      setEditando(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarNovaSenha("");

      if (resultado.user) {
        // Usa atualizarUsuario em vez de localStorage + reload
        atualizarUsuario(resultado.user);
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

        {/* ✅ Seção de foto de perfil */}
        <div className="flex flex-col items-center gap-3 pb-6 mb-6 border-b">
          <Avatar
            nome={usuario.nome}
            fotoUrl={usuario.foto_url}
            tamanho="lg"
          />

          {erroFoto && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm w-full text-center">
              {erroFoto}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <label
              htmlFor="upload-foto"
              className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition ${
                enviandoFoto ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              {enviandoFoto ? "Enviando..." : usuario.foto_url ? "Trocar foto" : "Adicionar foto"}
            </label>
            <input
              id="upload-foto"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleUploadFoto}
              disabled={enviandoFoto}
            />

            {usuario.foto_url && (
              <button
                type="button"
                onClick={handleRemoverFoto}
                disabled={enviandoFoto}
                className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition disabled:opacity-50"
              >
                Remover foto
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center max-w-md">
            JPG, PNG, GIF ou WEBP — máximo 5MB. A imagem será redimensionada automaticamente.
          </p>

          {/* ⚠️ Aviso de conteúdo apropriado */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md text-center">
            <p className="text-xs text-yellow-800">
              ⚠️ <span className="font-bold">Escolha uma foto apropriada.</span>{" "}
              Fotos com conteúdo ofensivo, violento, sexual ou que viole direitos autorais
              serão removidas e podem resultar em suspensão da conta.
            </p>
          </div>
        </div>

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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado.</p>
            </div>

            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Alterar senha</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha atual
                  </label>
                  <CampoSenha
                    id="senhaAtual"
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                </div>

                <div>
                  <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova senha
                  </label>
                  <CampoSenha
                    id="novaSenha"
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="Nova senha (mínimo 6 caracteres)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nova senha
                  </label>
                  <CampoSenha
                    id="confirmarNovaSenha"
                    value={confirmarNovaSenha}
                    onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>
            </div>

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