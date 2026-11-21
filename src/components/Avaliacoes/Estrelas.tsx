"use client";

import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface EstrelasProps {
  /** Nota de 1 a 5 (pode ser 0 quando ainda não avaliado) */
  valor: number;
  /** Se true, o usuário pode clicar para alterar a nota */
  interativo?: boolean;
  /** Callback chamado quando o usuário clica (só no modo interativo) */
  onChange?: (novaNota: number) => void;
  /** Tamanho das estrelas (classes Tailwind) */
  tamanho?: string;
  /** Se true, mostra a nota numérica ao lado (ex: "4.5") */
  mostrarNota?: boolean;
}

export default function Estrelas({
  valor,
  interativo = false,
  onChange,
  tamanho = "text-xl",
  mostrarNota = false,
}: EstrelasProps) {
  const [hover, setHover] = useState(0);

  // No modo interativo, mostra a estrela "hover" quando o mouse passa
  const notaExibida = interativo && hover > 0 ? hover : valor;

  const handleClick = (nota: number) => {
    if (interativo && onChange) {
      onChange(nota);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((nota) => {
        const preenchida = nota <= notaExibida;
        return (
          <button
            key={nota}
            type="button"
            disabled={!interativo}
            onClick={() => handleClick(nota)}
            onMouseEnter={() => interativo && setHover(nota)}
            onMouseLeave={() => interativo && setHover(0)}
            className={`
              ${tamanho}
              ${interativo ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
              ${preenchida ? "text-yellow-400" : "text-gray-300"}
              bg-transparent border-0 p-0
            `}
            aria-label={`${nota} estrela${nota > 1 ? "s" : ""}`}
          >
            {preenchida ? <FaStar /> : <FaRegStar />}
          </button>
        );
      })}
      {mostrarNota && valor > 0 && (
        <span className="ml-2 text-sm text-gray-600 font-medium">
          {valor.toFixed(1)}
        </span>
      )}
    </div>
  );
}