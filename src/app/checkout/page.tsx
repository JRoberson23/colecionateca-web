/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCarrinho } from "@/src/contexts/CarrinhoContext"; 
import { useAuth } from "@/src/contexts/AuthContext"; 
import { formatarPreco } from "@/src/lib/utils";

interface Endereco {
  id: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

// ✅ Interface para as opções de frete
interface OpcaoFrete {
  id?: number;
  name: string;
  price: number;
  delivery_time: number;
  company: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { itens, totalPreco, limparCarrinho } = useCarrinho();
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<string>("");
  const [metodoPagamento, setMetodoPagamento] = useState<string>("cartao");
  const [carregando, setCarregando] = useState(false);
  const [mostrarAviso, setMostrarAviso] =useState(false);
  
  // ✅ Estados para endereços reais
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [carregandoEnderecos, setCarregandoEnderecos] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoEndereco, setNovoEndereco] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
  });
  
  // Estados para o frete
  const [cep, setCep] = useState("");
  const [carregandoFrete, setCarregandoFrete] = useState(false);
  const [opcoesFrete, setOpcoesFrete] = useState<OpcaoFrete[]>([]);
  const [freteSelecionado, setFreteSelecionado] = useState<number | null>(null);
  const [valorFrete, setValorFrete] = useState(0);

  // ✅ Verificar se o usuário está logado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=checkout");
    }
  }, [isLoading, isAuthenticated, router]);

  // ✅ Buscar endereços do usuário
  useEffect(() => {
    async function carregarEnderecos() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCarregandoEnderecos(false);
          return;
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setEnderecos(data);
          if (data.length > 0) {
            setEnderecoSelecionado(data[0].id);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar endereços:", error);
      } finally {
        setCarregandoEnderecos(false);
      }
    }

    carregarEnderecos();
  }, []);

  // Se estiver carregando, mostra loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se o carrinho estiver vazio, redirecionar
  if (itens.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">🛒 Carrinho vazio</h1>
        <p className="text-gray-600 mb-6">Adicione produtos ao carrinho antes de finalizar a compra.</p>
        <Link
          href="/produtos"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Ver produtos
        </Link>
      </div>
    );
  }

  const handleAbrirAviso = () => {
    if (!enderecoSelecionado) {
      alert("⚠️ Por favor, selecione um endereço de entrega.");
      return;
    }
    if(itens.length === 0) {
      alert("⚠️ Seu carrinho está vazio. Adicione um produto antes de finalizar.");
      return;
    }
    if (freteSelecionado === null || valorFrete === 0) {
      alert("⚠️ Por favor, selecione uma opção de frete antes de finalizar");
      return
    }
    if (opcoesFrete.length === 0) {
      alert("⚠️ Nenhuma opção de frete disponível. Verifique o CEP informado.");
      return
    }
    if (freteSelecionado <= 0) {
      alert("⚠️ O valor do frete não é válido. Por favor recalcule o frete.");
      return;
    }
    setMostrarAviso(true);
  }

  const handleFinalizarPedido = async () => {

    setMostrarAviso(false);

    if (!enderecoSelecionado) {
      alert("Selecione um endereço de entrega.");
      return;
    }

    if (!confirm("⚠️ ATENÇÃO: Este é um site de demonstração. Nenhum produto será enviado. Deseja continuar?")){
      return;
    }

    setCarregando(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para finalizar o pedido.");
        setCarregando(false);
        return;
      }

      // Buscar endereço selecionado
      const endereco = enderecos.find((e) => e.id === enderecoSelecionado);

      // Preparar dados para a API
      const dadosPedido = {
        itens: itens.map((item) => ({
          produto_id: item.produto_id,
          nome: item.nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco,
          subtotal: item.preco * item.quantidade,
        })),
        endereco_id: enderecoSelecionado,
        frete: valorFrete,
        metodo_pagamento: metodoPagamento,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout/pagar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dadosPedido),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Erro ao criar pagamento");
      }

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        throw new Error("URL de pagamento não encontrada");
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      alert(error instanceof Error ? error.message : "Erro ao processar pagamento");
    } finally {
      setCarregando(false);
    }
  };

  // ✅ Buscar opções de frete
  const buscarFrete = async () => {
    const cepLimpo = cep.replace(/\D/g, "");

    if (cepLimpo.length !== 8) {
      alert("Digite um CEP válido com 8 números.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login?redirect=checkout");
      return;
    }

    setCarregandoFrete(true);
    setOpcoesFrete([]);
    setFreteSelecionado(null);
    setValorFrete(0);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/frete/calcular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cepDestino: cepLimpo,
          itens: itens.map((item) => ({
            produto_id: item.produto_id,
            nome: item.nome,
            quantidade: item.quantidade,
            preco: item.preco,
          })),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detalhes ||
            data?.message ||
            "Erro ao calcular frete."
        );
      }

      if (!Array.isArray(data)) {
        throw new Error("Resposta de frete inválida.");
      }

      setOpcoesFrete(data);
    } catch (error) {
      const mensagem =
        error instanceof Error
          ? error.message
          : "Erro desconhecido ao calcular frete.";

      console.error("Erro ao calcular frete:", mensagem);
      alert(mensagem);
    } finally {
      setCarregandoFrete(false);
    }
  };

  // ✅ Selecionar uma opção de frete
  const selecionarFrete = (index: number) => {
    const preco = Number(opcoesFrete[index]?.price) || 0;

    setFreteSelecionado(index);
    setValorFrete(preco);
  };

  // ✅ Adicionar novo endereço
  const handleAdicionarEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/enderecos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoEndereco),
      });

      if (response.ok) {
        const endereco = await response.json();
        setEnderecos([...enderecos, endereco]);
        setEnderecoSelecionado(endereco.id);
        setMostrarFormulario(false);
        setNovoEndereco({
          logradouro: "",
          numero: "",
          complemento: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
        });
        alert("Endereço adicionado com sucesso!");
      } else {
        const data = await response.json();
        alert(data.message || "Erro ao adicionar endereço");
      }
    } catch (error) {
      console.error("Erro ao adicionar endereço:", error);
      alert("Erro ao adicionar endereço");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">📦 Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Endereço de entrega */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">📍 Endereço de entrega</h2>
            <div className="space-y-3">
              {carregandoEnderecos ? (
                <p className="text-gray-500 text-sm">Carregando endereços...</p>
              ) : enderecos.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhum endereço cadastrado.</p>
              ) : (
                enderecos.map((endereco) => (
                  <label
                    key={endereco.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="endereco"
                      value={endereco.id}
                      checked={enderecoSelecionado === endereco.id}
                      onChange={(e) => setEnderecoSelecionado(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-semibold">{endereco.logradouro}, {endereco.numero}</p>
                      <p className="text-sm text-gray-600">
                        {endereco.bairro}, {endereco.cidade} - {endereco.estado}
                      </p>
                      <p className="text-sm text-gray-600">CEP: {endereco.cep}</p>
                      {endereco.complemento && (
                        <p className="text-sm text-gray-500">Complemento: {endereco.complemento}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
              
              <button
                onClick={() => setMostrarFormulario(true)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                + Adicionar novo endereço
              </button>

              {mostrarFormulario && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3">Novo Endereço</h3>
                  <form onSubmit={handleAdicionarEndereco} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Logradouro"
                        value={novoEndereco.logradouro}
                        onChange={(e) => setNovoEndereco({...novoEndereco, logradouro: e.target.value})}
                        required
                        className="border rounded-lg px-3 py-2 text-sm col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Número"
                        value={novoEndereco.numero}
                        onChange={(e) => setNovoEndereco({...novoEndereco, numero: e.target.value})}
                        required
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Complemento"
                        value={novoEndereco.complemento}
                        onChange={(e) => setNovoEndereco({...novoEndereco, complemento: e.target.value})}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Bairro"
                        value={novoEndereco.bairro}
                        onChange={(e) => setNovoEndereco({...novoEndereco, bairro: e.target.value})}
                        required
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={novoEndereco.cidade}
                        onChange={(e) => setNovoEndereco({...novoEndereco, cidade: e.target.value})}
                        required
                        className="border rounded-lg px-3 py-2 text-sm col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Estado (ex: SP)"
                        value={novoEndereco.estado}
                        onChange={(e) => setNovoEndereco({
                          ...novoEndereco,
                          estado: e.target.value.toUpperCase().slice(0, 2)
                        })}
                        required
                        maxLength={2}
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="CEP"
                        value={novoEndereco.cep}
                        onChange={(e) => setNovoEndereco({...novoEndereco, cep: e.target.value})}
                        required
                        className="border rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                      >
                        Salvar Endereço
                      </button>
                      <button
                        type="button"
                        onClick={() => setMostrarFormulario(false)}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">💳 Pagamento</h2>
            <div className="space-y-3">
              {[
                { value: "cartao", label: "Cartão de Crédito/Débito" },
                { value: "pix", label: "PIX" },
              ].map((opcao) => (
                <label
                  key={opcao.value}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={opcao.value}
                    checked={metodoPagamento === opcao.value}
                    onChange={(e) => setMetodoPagamento(e.target.value)}
                  />
                  <span>{opcao.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Frete */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">🚚 Frete</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Digite seu CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={9}
              />
              <button
                onClick={buscarFrete}
                disabled={carregandoFrete}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {carregandoFrete ? "Calculando..." : "Calcular Frete"}
              </button>
            </div>

            {opcoesFrete.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold text-gray-700">Selecione uma opção:</p>
                {opcoesFrete.map((opcao, index) => (
                  <label
                    key={index}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                      freteSelecionado === index ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="frete"
                        value={index}
                        checked={freteSelecionado === index}
                        onChange={() => selecionarFrete(index)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div>
                        <p className="font-medium text-sm">{opcao.name || "Entrega"}</p>
                        <p className="text-xs text-gray-500">{opcao.company || "Transportadora"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatarPreco(Number(opcao.price) || 0)}
                      </p>
                      <p className="text-xs text-gray-500">{opcao.delivery_time || 0} dias úteis</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resumo do pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">📋 Resumo do pedido</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {itens.map((item) => (
                <div key={item.produto_id} className="flex justify-between text-sm">
                  <span>
                    {item.nome} <span className="text-gray-500">x{item.quantidade}</span>
                  </span>
                  <span>{formatarPreco(totalPreco)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatarPreco(totalPreco)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Frete</span>
                <span>
                  {freteSelecionado !== null && valorFrete > 0
                    ? `R$ ${valorFrete.toFixed(2)}`
                    : "Calcule o frete"}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-green-600">
                  {formatarPreco(totalPreco + valorFrete)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAbrirAviso}
              disabled={carregando}
              className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition ${
                carregando ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {carregando ? "Processando..." : "Finalizar Pedido 🚀"}
            </button>

            <Link
              href="/carrinho"
              className="block text-center mt-4 text-blue-600 hover:text-blue-800 text-sm"
            >
              ← Voltar ao carrinho
            </Link>
          </div>
        </div>
      </div>
      {/* ⚠️ Modal de Aviso */}
      {mostrarAviso && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all">
            {/* Título */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-yellow-600 flex items-center gap-2">
                <span>⚠️</span> Atenção!
              </h3>
              <button
                onClick={() => setMostrarAviso(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo */}
            <div className="space-y-4">
              <p className="text-gray-700">
                <strong>Este é um site de demonstração e portfólio.</strong>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>🔹 Nenhum produto será enviado</li>
                  <li>🔹 Os pagamentos são simulados em ambiente de testes</li>
                  <li>🔹 Se você deseja apoiar este projeto, entre em contato pelo WhatsApp</li>
                </ul>
              </div>
              <p className="text-xs text-gray-500 italic">
                Ao continuar, você confirma que entende que este é um site de demonstração.
              </p>
            </div>

            {/* Botões */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleFinalizarPedido}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Sim, continuar 🚀
              </button>
              <button
                onClick={() => setMostrarAviso(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}