/* eslint-disable @next/next/no-img-element */
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
  imagens: string;
  categoria: string;
  metadata: Metadata;
  destaque: boolean;
}

export default function NovoProdutoPage() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [imagens, setImagens] = useState<string[]>([]);
  const [carregandoUpload, setCarregandoUpload] = useState(false);

  const [form, setForm] = useState<FormData>({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    imagens: "",
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos`, {
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
          imagens: imagens,
          categoria: form.categoria || undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          destaque: form.destaque,
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

// ✅ Upload de múltiplas imagens
const handleUploadImagens = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  // Verificar se não excede 5
  if (imagens.length + files.length > 5) {
    alert('Você pode adicionar no máximo 5 imagens.');
    return;
  }

  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('imagens', files[i]);
  }

  setCarregandoUpload(true);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Erro ao enviar imagens");
    }

    const data = await response.json();
    setImagens([...imagens, ...data.imageUrls]);
  } catch (error) {
    console.error("Erro ao enviar imagens:", error);
    alert(error instanceof Error ? error.message : "Erro ao enviar imagens");
  } finally {
    setCarregandoUpload(false);
  }
};

// ✅ Remover uma imagem
const removerImagem = (index: number) => {
  setImagens(imagens.filter((_, i) => i !== index));
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Imagens do Produto (máx. 5)
        </label>
        
        {/* Prévia das imagens */}
        <div className="flex flex-wrap gap-2 mb-2">
          {imagens.map((img, index) => (
            <div key={index} className="relative w-20 h-20 border rounded">
              <img src={img} alt={`Produto ${index}`} className="w-full h-full object-cover rounded" />
              <button
                type="button"
                onClick={() => removerImagem(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {imagens.length < 5 && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadImagens}
            disabled={carregandoUpload}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        )}
        {carregandoUpload && (
          <p className="text-sm text-blue-600 mt-1">📤 Enviando imagens...</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {imagens.length}/5 imagens • Formatos: JPG, PNG, GIF, WEBP (max 5MB cada)
        </p>
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