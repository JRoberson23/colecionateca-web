"use client";

import { useState, useRef, useEffect } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";

interface Mensagem {
  texto: string;
  ehUsuario: boolean;
  timestamp: Date;
}

interface RespostaChat {
  mensagem: string;
  action: string;
  intent: string;
  redirectUrl: string | null;
}

export default function DialogflowChatbot() {
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

  // Rolar para a última mensagem
  useEffect(() => {
    mensagensFimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  // Enviar mensagem para o backend
  const enviarMensagem = async () => {
    if (!input.trim()) return;

    const mensagemUsuario = input.trim();
    setInput("");
    setCarregando(true);

    // Adicionar mensagem do usuário
    setMensagens((prev) => [
      ...prev,
      { texto: mensagemUsuario, ehUsuario: true, timestamp: new Date() },
    ]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chatbot/mensagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mensagem: mensagemUsuario }),
      });

      if (!response.ok) {
        throw new Error("Erro ao comunicar com o chatbot");
      }

      const data: RespostaChat = await response.json();

      // Adicionar resposta do bot
      setMensagens((prev) => [
        ...prev,
        {
          texto: data.mensagem || "Desculpe, não entendi. Pode repetir?",
          ehUsuario: false,
          timestamp: new Date(),
        },
      ]);

      // Se tiver redirectUrl, abrir em nova aba ou redirecionar
      if (data.redirectUrl) {
        if (data.redirectUrl.startsWith("http")) {
          window.open(data.redirectUrl, "_blank");
        } else {
          window.location.href = data.redirectUrl;
        }
      }
    } catch (error) {
      console.error("Erro no chat:", error);
      setMensagens((prev) => [
        ...prev,
        {
          texto: "⚠️ Erro ao conectar. Tente novamente mais tarde.",
          ehUsuario: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") enviarMensagem();
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-4 z-50 text-white p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? "bg-blue-700" : "bg-blue-600/60 hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {isOpen ? <FaTimes className="text-2xl" /> : <FaComments className="text-2xl" />}
      </button>

      {/* Janela do chat */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="fixed bottom-36 right-4 z-50 w-[300px] sm:w-80 md:w-96 h-[350px] sm:h-[400px] md:h-[450px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            {/* Cabeçalho */}
            <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-semibold text-sm sm:text-base">Roberson Store</span>
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
                <div key={index} className={`flex ${msg.ehUsuario ? "justify-end" : "justify-start"}`}>
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