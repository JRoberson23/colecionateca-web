import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const api = axios.create({
    baseURL: API_URL,
});

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  imagem?: string;
  categoria?: string;
  metadata?: {
    console?: string;
    ano?: number;
    autor?: string;
    editora?: string;
    fabricante?: string;
    altura?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
  createdAt: string;
  updatedAt: string;
}

export async function listarProdutos() {
    try {
        const response = await api.get("/produtos");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
}

export async function buscarProdutoPorId(id: string) {
    try {
        const response = await api.get(`/produtos/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar produto ${id}:`, error);
        throw error;
    }
}