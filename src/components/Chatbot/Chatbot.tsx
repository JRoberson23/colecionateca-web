"use client";

import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import { respostas } from "@/src/lib/chatResponses";

interface Mensagem {
  texto: string;
  ehUsuario: boolean;
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      texto: "👋 Olá! Bem-vindo à Roberson Store! Como posso ajudar você hoje?",
      ehUsuario: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [carregando, setCarregando] = useState(false);
  const mensagensFimRef = useRef<HTMLDivElement>(null);

  // ✅ Rolar para a última mensagem
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // ✅ Função para encontrar a resposta E a ação
  const encontrarRespostaComAcao = (mensagem: string): { resposta: string; acao?: string } => {
    const mensagemLower = mensagem.toLowerCase();

    for (const item of respostas) {
      for (const palavra of item.palavrasChave) {
        if (mensagemLower.includes(palavra)) {
          return { resposta: item.resposta, acao: item.acao };
        }
      }
    }

    return {
      resposta: "🤔 Desculpe, não entendi sua pergunta. Tente perguntar sobre: produtos, frete, pagamento, contato ou sobre a loja.",
      acao: undefined,
    };
  };

  // ✅ Função para enviar mensagem
  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const mensagemUsuario = input.trim();
    setInput("");
    setCarregando(true);

    // Adicionar mensagem do usuário
    setMensagens((prev) => [
      ...prev,
      {
        texto: mensagemUsuario,
        ehUsuario: true,
        timestamp: new Date(),
      },
    ]);

    // Simular atraso de processamento
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Gerar resposta E ação
    const { resposta, acao } = encontrarRespostaComAcao(mensagemUsuario);

    // Adicionar resposta do bot
    setMensagens((prev) => [
      ...prev,
      {
        texto: resposta,
        ehUsuario: false,
        timestamp: new Date(),
      },
    ]);

    // ✅ Executar ação (redirecionamento) se houver
    if (acao === "produtos") {
      window.location.href = "/produtos";
    } else if (acao === "frete") {
      window.location.href = "/checkout";
    } else if (acao === "admin") {
      window.location.href = "/admin";
    }

    setCarregando(false);
  };

  // ✅ Tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      enviarMensagem();
    }
  };

  return (
    <>
      {/* ✅ Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-1 z-50 bg-blue-600/60 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaComments className="text-2xl" />}
      </button>

      {/* ✅ Janela do chat */}
      {isOpen && (
          <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-20 right-4 z-50 w-[270px] sm:w-80 md:w-96 h-[300px] sm:h-[400px] md:h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Cabeçalho */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-semibold">Roberson Store</span>
                <span className="text-xs bg-green-400 text-green-900 px-2 py-0.5 rounded-full">Online</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {mensagens.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.ehUsuario ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.ehUsuario
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                    dangerouslySetInnerHTML={{ __html: msg.texto }}
                  />
                </div>
              ))}
              {carregando && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2.5 rounded-2xl rounded-bl-none shadow-sm">
                    <span className="animate-pulse">🤔 Pensando...</span>
                  </div>
                </div>
              )}
              <div ref={mensagensFimRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-3 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                disabled={carregando}
              />
              <button
                onClick={enviarMensagem}
                disabled={carregando || !input.trim()}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}