"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ✅ Definir o tipo do metadata
interface Metadata {
  console: string;
  ano: string;
  autor: string;
  editora: string;
  fabricante: string;
  altura: string;
  [key: string]: string;
}

interface FormData {
  nome: string;
  descricao: string;
  preco: string;
  estoque: string;
  imagem: string;
  categoria: string;
  metadata: Metadata;
  destaque: boolean;
}

export default function NovoProdutoPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [carregandoUpload, setCarregandoUpload] = useState(false);

  const [form, setForm] = useState<FormData>({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    imagem: "",
    categoria: "",
    metadata: {
      console: "",
      ano: "",
      autor: "",
      editora: "",
      fabricante: "",
      altura: "",
    },
    destaque: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("metadata.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        metadata: { ...prev.metadata, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      // ✅ Pegar token do localStorage diretamente
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar logado para criar um produto");
      }

      // ✅ Construir metadata sem valores vazios
      const metadata: Record<string, string> = {};
      Object.keys(form.metadata).forEach((key) => {
        if (form.metadata[key]) {
          metadata[key] = form.metadata[key];
        }
      });

      const response = await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao || undefined,
          preco: parseFloat(form.preco),
          estoque: parseInt(form.estoque),
          imagem: form.imagem || undefined,
          categoria: form.categoria || undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao criar produto");
      }

      router.push("/admin");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar produto");
    } finally {
      setCarregando(false);
    }
  };

  // ✅ Upload de imagem
const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validar tamanho (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("A imagem deve ter no máximo 5MB.");
    return;
  }

  // Validar tipo
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!tiposPermitidos.includes(file.type)) {
    alert("Formato de imagem não suportado. Use JPG, PNG, GIF ou WEBP.");
    return;
  }

  const formData = new FormData();
  formData.append('imagem', file);

  setCarregandoUpload(true);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:3001/produtos/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Erro ao enviar imagem");
    }

    const data = await response.json();
    setForm((prev) => ({ ...prev, imagem: data.imageUrl }));
  } catch (error) {
    console.error("Erro ao enviar imagem:", error);
    alert(error instanceof Error ? error.message : "Erro ao enviar imagem");
  } finally {
    setCarregandoUpload(false);
  }
};

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Voltar
        </Link>
        <h1 className="text-3xl font-bold">➕ Novo Produto</h1>
      </div>

      {erro && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
        {/* ... resto do formulário ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preço *</label>
            <input
              name="preco"
              type="number"
              step="0.01"
              value={form.preco}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estoque *</label>
            <input
              name="estoque"
              type="number"
              value={form.estoque}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* ✅ Campo de upload de imagem */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagem do Produto</label>
          <div className="flex items-center gap-4">
            {form.imagem && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <img
                  src={form.imagem}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImagem}
                disabled={carregandoUpload}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              {carregandoUpload && (
                <p className="text-sm text-blue-600 mt-1">📤 Enviando imagem...</p>
              )}
              <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG, GIF, WEBP (max 5MB)</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione...</option>
            <option value="jogo">Jogo</option>
            <option value="manga">Mangá</option>
            <option value="figure">Figure</option>
          </select>
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold text-gray-700 mb-3">📦 Informações adicionais (opcional)</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Console</label>
              <input
                name="metadata.console"
                value={form.metadata.console}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Ano</label>
              <input
                name="metadata.ano"
                value={form.metadata.ano}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Autor</label>
              <input
                name="metadata.autor"
                value={form.metadata.autor}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Editora</label>
              <input
                name="metadata.editora"
                value={form.metadata.editora}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fabricante</label>
              <input
                name="metadata.fabricante"
                value={form.metadata.fabricante}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Altura</label>
              <input
                name="metadata.altura"
                value={form.metadata.altura}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ✅ Checkbox de destaque */}
        <div className="flex items-center gap-2 border-t pt-4 mt-4">
          <input
            type="checkbox"
            id="destaque"
            checked={form.destaque}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="destaque" className="text-sm font-medium text-gray-700">
            ⭐ Destacar na Home
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={carregando || carregandoUpload}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar Produto"}
          </button>
          <Link
            href="/admin"
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-300 transition"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}