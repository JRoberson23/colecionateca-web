/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
  imagens: string[];
  categoria: string;
  metadata: Metadata;
  destaque: boolean;
}

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [carregando, setCarregando] = useState(false);
  const [carregandoProduto, setCarregandoProduto] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carregandoUpload, setCarregandoUpload] = useState(false);

  const [form, setForm] = useState<FormData>({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    imagens: [],
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

  // ✅ CARREGAR DADOS DO PRODUTO
  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}`);
        if (!response.ok) throw new Error("Produto não encontrado");
        const data = await response.json();

        setForm({
          nome: data.nome || "",
          descricao: data.descricao || "",
          preco: data.preco?.toString() || "",
          estoque: data.estoque?.toString() || "",
          imagens: Array.isArray(data.imagens) ? data.imagens : [],
          categoria: data.categoria || "",
          metadata: {
            console: data.metadata?.console || "",
            ano: data.metadata?.ano?.toString() || "",
            autor: data.metadata?.autor || "",
            editora: data.metadata?.editora || "",
            fabricante: data.metadata?.fabricante || "",
            altura: data.metadata?.altura || "",
          },
          destaque: data.destaque || false,
        });
      } catch (error) {
        setErro(error instanceof Error ? error.message : "Erro ao carregar produto");
      } finally {
        setCarregandoProduto(false);
      }
    }
    carregarProduto();
  }, [id]);

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

  // ✅ Upload de MÚLTIPLAS imagens
  const handleUploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validar tamanho e tipo
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`A imagem ${file.name} deve ter no máximo 5MB.`);
        return;
      }
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        alert(`Formato de ${file.name} não suportado. Use JPG, PNG, GIF ou WEBP.`);
        return;
      }
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('imagens', file);
    });

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
      
      // ✅ ADICIONA as novas imagens ao array existente (não substitui!)
      setForm((prev) => ({
        ...prev,
        imagens: [...prev.imagens, ...data.imageUrls],
      }));

      // Limpa o input para poder subir mais imagens depois
      e.target.value = "";
    } catch (error) {
      console.error("Erro ao enviar imagens:", error);
      alert(error instanceof Error ? error.message : "Erro ao enviar imagens");
    } finally {
      setCarregandoUpload(false);
    }
  };

  // ✅ Remover imagem específica
  const removerImagem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index),
    }));
  };

  // ✅ Definir imagem como principal (mover para o índice 0)
  const definirComoPrincipal = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const novas = [...prev.imagens];
      const [img] = novas.splice(index, 1);
      novas.unshift(img);
      return { ...prev, imagens: novas };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Você precisa estar logado para editar um produto");
      }

      const metadata: Record<string, string> = {};
      Object.keys(form.metadata).forEach((key) => {
        if (form.metadata[key]) {
          metadata[key] = form.metadata[key];
        }
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.nome,
          descricao: form.descricao || undefined,
          preco: parseFloat(form.preco),
          estoque: parseInt(form.estoque),
          imagens: form.imagens,
          categoria: form.categoria || undefined,
          metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
          destaque: form.destaque,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao atualizar produto");
      }

      router.push("/admin");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao atualizar produto");
    } finally {
      setCarregando(false);
    }
  };

  if (carregandoProduto) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">Carregando produto...</p>
      </div>
    );
  }

  if (erro && !form.nome) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-red-600 text-lg">{erro}</p>
        <Link href="/admin" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
          ← Voltar para admin
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="text-blue-600 hover:text-blue-800">
          ← Voltar
        </Link>
        <h1 className="text-3xl font-bold">✏️ Editar Produto</h1>
      </div>

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

        {/* ✅ GALERIA DE IMAGENS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagens do Produto ({form.imagens.length})
          </label>

          {/* Grid de miniaturas */}
          {form.imagens.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {form.imagens.map((img, index) => (
                <div
                  key={index}
                  className={`relative group aspect-square rounded-lg overflow-hidden border-2 ${
                    index === 0 ? "border-blue-500" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Badge de principal */}
                  {index === 0 && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                      PRINCIPAL
                    </span>
                  )}

                  {/* Botões de ação */}
                  <div className="absolute top-1 right-1 flex gap-1 md:hidden">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => definirComoPrincipal(index)}
                        title="Definir como principal"
                        className="bg-blue-600 text-white w-7 h-7 rounded-full text-xs shadow-md flex items-center justify-center"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removerImagem(index)}
                      title="Remover imagem"
                      className="bg-red-600 text-white w-7 h-7 rounded-full text-xs shadow-md flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>

                  {/* ✅ DESKTOP: overlay com hover */}
                  <div className="hidden md:flex absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => definirComoPrincipal(index)}
                        title="Definir como principal"
                        className="bg-blue-600 text-white w-8 h-8 rounded-full text-xs hover:bg-blue-700 flex items-center justify-center"
                      >
                        ⭐
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removerImagem(index)}
                      title="Remover imagem"
                      className="bg-red-600 text-white w-8 h-8 rounded-full text-xs hover:bg-red-700 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input de upload (múltiplo) */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUploadImagem}
            disabled={carregandoUpload}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          {carregandoUpload && (
            <p className="text-sm text-blue-600 mt-1">📤 Enviando imagem(ns)...</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Formatos: JPG, PNG, GIF, WEBP (max 5MB cada). Você pode selecionar várias de uma vez.
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

        {erro && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{erro}</p>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={carregando || carregandoUpload}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {carregando ? "Salvando..." : "Salvar Alterações"}
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