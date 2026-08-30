export interface RespostaChat {
    palavrasChave: string[];
    resposta: string;
    acao?: "produtos" | "frete" | "pagamento" | "contato" | "sobre";
}

export const respostas: RespostaChat[] = [
    {
        palavrasChave: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "e ai", "opa"],
        resposta: "👋🏼 Olá! Bem-vindo(a) à Roberson Store! Como posso ajudar você hoje?",
    },
    {
        palavrasChave: ["produto", "catálogo", "loja", "comprar", "compras", "preço", "valor", "catalogo"],
        resposta: "🛒 Você pode explorar todos os nossos produtos na página de produtos! (clique em 'Produtos' no menu.) ⚠️ Mas lembre-se que essa é uma loja de demonstração com produtos fictícios, nenhum produto será entregue!",
        acao: "produtos",
    },
    {
        palavrasChave: ["frete", "entrega", "envio", "prazo", "transportadora", "sedex", "pac"],
        resposta: "📦 O frete é calculado automaticamente no checkout, com base no seu CEP. Você vará as opções disponiveis com os valores.",
        acao: "frete",
    },
    {
        palavrasChave: ["pagamento", "cartão", "pix", "parcelar", "parcela", "boleto", "credito", "debito"],
        resposta: "💳 Aceitamos cartões de crédito (parcelado em até 12x), cartão de débito e PIX. Tudo é processado com segurança pelo Mercado Pago! ⚠️ Mas lembre-se que essa é uma loja de demonstração com produtos fictícios, nenhum produto será entregue! Se gostou do trabalho e deseja fazer alguma doação entre em contato (11)95076-8793",
        acao: "pagamento"
    },
    {
        palavrasChave: ["contato", "ajuda", "whatsapp", "telefone", "email", "falar", "atendente", "suporte"],
        resposta: "📱 Você pode falar comigo pelo WhatsApp: (11)95076-8793, ou pelo e-mail: jroberson.junior@outlook.com",
        acao: "contato",
    },
    {
        palavrasChave: ["sobre", "quem", "empresa", "roberson", "loja", "história", "historia"],
        resposta: "🏭 A Roberson Store é um e-commerce de demonstração criado para mostrar soluções completas em lojas virtuais, com interação de pagamento, frete e painel administrativo.",
        acao: "sobre",
    },
    {
        palavrasChave: ["obrigado", "valeu", "grato", "obrigada"],
        resposta: "😊 Por nada! Estou aqui para ajudar. Se precisar de algo, é só me chamar.",
    },
    {
        palavrasChave: ["tchau", "até logo", "adeus", "flw", "falou", "xau", "ate"],
        resposta: "👋🏼 Até logo! Volte sempre à Roberson Store!",
    },
];