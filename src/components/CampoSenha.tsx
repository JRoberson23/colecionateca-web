"use client";

import { useState, InputHTMLAttributes } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type CampoSenhaProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function CampoSenha({ className = "", ...props }: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visivel ? "text" : "password"}
        className={`w-full border rounded-lg px-4 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition p-1"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visivel}
        title={visivel ? "Ocultar senha" : "Mostrar senha"}
      >
        {visivel ? "🙈" : "🐵"}
      </button>
    </div>
  );
}