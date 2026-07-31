"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { login as apiLogin, registrar as apiRegistrar } from "../services/auth";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Função para carregar dados do localStorage (fora do useEffect)
function carregarDadosIniciais() {
  if (typeof window === "undefined") {
    return { token: null, usuario: null };
  }
  try {
    const tokenSalvo = localStorage.getItem("token");
    const usuarioSalvo = localStorage.getItem("usuario");
    if (tokenSalvo && usuarioSalvo) {
      return {
        token: tokenSalvo,
        usuario: JSON.parse(usuarioSalvo),
      };
    }
  } catch (error) {
    console.error("Erro ao carregar dados do localStorage", error);
  }
  return { token: null, usuario: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // ✅ Inicializar com os dados do localStorage (sem useEffect)
  const [usuario, setUsuario] = useState<Usuario | null>(carregarDadosIniciais().usuario);
  const [token, setToken] = useState<string | null>(carregarDadosIniciais().token);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, senha: string) => {
  try {
    const data = await apiLogin(email, senha);
    const { token, user } = data;

    setToken(token);
    setUsuario(user);

    localStorage.setItem("token", token);
    localStorage.setItem("usuario", JSON.stringify(user));
  } catch (error) {
    throw error;
  }
};

  const registrar = async (nome: string, email: string, senha: string) => {
    try {
      const data = await apiRegistrar(nome, email, senha);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        isAuthenticated: !!token && !!usuario,
        isLoading,
        login,
        registrar,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}