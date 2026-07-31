"use client";

import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function login(email: string, senha: string) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      senha,
    });
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response: { data: { message: string } } };
      throw new Error(err.response.data.message || "Erro ao fazer login");
    }
    throw new Error("Erro de conexão com o servidor");
  }
}

export async function registrar(nome: string, email: string, senha: string) {
    try {
        const response = await axios.post (`${API_URL}/auth/register`, {
            nome,
            email,
            senha,
        });
        return response.data;
    } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
        const err = error as { response: { data: { message: string } } };
        throw new Error(err.response.data.message || "Erro ao registrar");
    }
    throw new Error("Erro de conexão com o servidor");
    }
}

export async function atualizarPerfil(
  token: string,
  dados: {
    nome?: string;
    email?: string;
    senha_atual?: string;
    nova_senha?: string;
  }
) {
  try {
    const response = await axios.put(
      `${API_URL}/auth/perfil`,
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const err = error as { response: { data: { message: string } } };
      throw new Error(err.response.data.message || "Erro ao atualizar perfil");
    }
    throw new Error("Erro de conexão com o servidor");
  }
}