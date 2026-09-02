export interface RespostaChat {
    palavrasChave: string[];
    resposta: string;
    acao?: "produtos" | "frete" | "pagamento" | "contato" | "sobre" | "site" | "doacao" | "admin" | "ajuda" | "vender";
}

export const respostas: RespostaChat[] = [
    // SAUDAÇÕES
    {
        palavrasChave: ["oi", "olá", "ola", "bom dia", "boa tarde", "boa noite", "e ai", "opa", "salve", "fala", "iae", "oie"],
        resposta: "👋🏼 Olá! Bem-vindo(a) à Roberson Store! Como posso ajudar você hoje?\n\n💬 Pergunte sobre:\n🔹 Produtos\n🔹 Pagamento\n🔹 Frete\n🔹 Sobre a loja\n🔹 Contato",
    },

    // PRODUTOS
    {
        palavrasChave: ["produto", "catálogo", "catalogo", "loja", "comprar", "compras", "preço", "valor", "precos", "produtos", "estoque", "item", "itens", "mercadoria", "vender"],
        resposta: "🛒 Você pode explorar todos os nossos produtos na <a href='/produtos' style='color: #2563eb; font-weight: bold;'>página de produtos</a>!\n\n⚠️ Lembre-se: essa é uma loja de demonstração com produtos fictícios. Nenhum produto será entregue.\n\n📍 <a href='/produtos' style='color: #2563eb; font-weight: bold;'>Clique aqui para ver os produtos →</a>",
        acao: "produtos",
    },

    // FRETE
    {
        palavrasChave: ["frete", "entrega", "envio", "prazo", "transportadora", "sedex", "pac", "entregar", "receber", "correios", "jadlog", "loggi", "prazo de entrega"],
        resposta: "📦 O frete é calculado automaticamente no checkout, com base no seu CEP.\n\nVocê verá as opções disponíveis com prazos e valores:\n✅ Sedex (mais rápido)\n✅ PAC (mais econômico)\n✅ Outras transportadoras parceiras\n\n📍 <a href='/checkout' style='color: #2563eb; font-weight: bold;'>Ir para o checkout →</a>",
        acao: "frete",
    },

    // PAGAMENTO
    {
        palavrasChave: ["pagamento", "cartão", "pix", "parcelar", "parcela", "boleto", "credito", "debito", "pagar", "pagamentos", "formas de pagamento", "cartao", "credito"],
        resposta: "💳 Aceitamos as seguintes formas de pagamento:\n\n✅ Cartão de crédito (parcelado em até 12x)\n✅ Cartão de débito\n✅ PIX (aprovado na hora)\n\n🔒 Tudo é processado com segurança pelo Mercado Pago!\n\n⚠️ Lembre-se: essa é uma loja de demonstração com produtos fictícios.",
        acao: "pagamento",
    },

    // CONTATO
    {
        palavrasChave: ["contato", "ajuda", "whatsapp", "telefone", "email", "falar", "atendente", "suporte", "duvida", "dúvida", "socorro", "problema"],
        resposta: "📱 Fale comigo pelos canais abaixo:\n\n📞 <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>WhatsApp: (11) 95076-8793</a>\n📧 <a href='mailto:jroberson.junior@outlook.com' style='color: #2563eb; font-weight: bold;'>E-mail: jroberson.junior@outlook.com</a>\n\n🌐 <a href='https://roberson-dev.vercel.app/' target='_blank' style='color: #8B5CF6; font-weight: bold;'>Meu portfólio</a>\n\n💬 Estou aqui para ajudar!",
        acao: "contato",
    },

    // SOBRE A LOJA
    {
        palavrasChave: ["sobre", "quem", "empresa", "roberson", "loja", "história", "historia", "fundador", "criador", "desenvolvedor", "dev"],
        resposta: "🏭 A <strong>Roberson Store</strong> é um e-commerce de demonstração criado para mostrar soluções completas em lojas virtuais.\n\n🛠️ Tecnologias utilizadas:\n✅ Next.js + React + TypeScript\n✅ Node.js + Express + PostgreSQL\n✅ Mercado Pago (pagamento)\n✅ Melhor Envio (frete)\n✅ Tailwind CSS (design)\n\n📍 <a href='#sobre' style='color: #2563eb; font-weight: bold;'>Saiba mais sobre o projeto →</a>",
        acao: "sobre",
    },

    // PORTFÓLIO DO DEV
    {
        palavrasChave: ["portfólio", "dev", "programador", "desenvolvedor", "site do dev", "roberson dev", "meu site", "trabalho", "freelancer", "contratar"],
        resposta: "🚀 Sou desenvolvedor full-stack e adoro criar soluções incríveis!\n\n🌐 <a href='https://roberson-dev.vercel.app/' target='_blank' style='color: #8B5CF6; font-weight: bold;'>Meu portfólio</a>\n📞 <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>WhatsApp: (11) 95076-8793</a>\n📧 <a href='mailto:jroberson.junior@outlook.com' style='color: #2563eb; font-weight: bold;'>E-mail: jroberson.junior@outlook.com</a>\n\n💼 <a href='https://roberson-dev.vercel.app/' target='_blank' style='color: #8B5CF6; font-weight: bold;'>Veja meus projetos →</a>",
        acao: "site",
    },

    // DOAÇÕES
    {
        palavrasChave: ["doação", "doar", "pix", "apoio", "apoiar", "contribuir", "ajudar", "doacao"],
        resposta: "❤️ Que legal que você quer apoiar o projeto!\n\n💳 Você pode fazer uma doação via PIX:\n📱 <strong>jroberson.junior@outlook.com</strong>\n\n⚠️ Lembre-se: essa é uma loja de demonstração. Mas seu apoio me ajuda a continuar criando projetos incríveis! 🚀\n\n📞 <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>Fale comigo no WhatsApp</a>",
        acao: "doacao",
    },

    // VENDER MEU SITE (CAPTURAR CLIENTES)
    {
        palavrasChave: ["quero um site igual a esse", "quero um site assim", "você faz sites", "contratar", "quanto custa um site", "me ajuda a criar uma loja", "trabalha com desenvolvimento", "sites profissionais", "criação de site", "site personalizado", "faz site", "desenvolve site", "sistema de ecommerce", "loja virtual", "preço do site", "orçamento", "gostei do projeto", "quero ter um site desses", "vende site", "cria sites", "dev", "programador", "freelancer", "quero contratar"],
        resposta: `🚀 Que legal que você gostou do projeto!

        Sou desenvolvedor full-stack e posso criar um site personalizado para você!

        📞 <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>Fale comigo no WhatsApp</a>
        📧 <a href='mailto:jroberson.junior@outlook.com' style='color: #2563eb; font-weight: bold;'>Envie um e-mail</a>
        🌐 <a href='https://roberson-dev.vercel.app/' target='_blank' style='color: #8B5CF6; font-weight: bold;'>Veja meu portfólio</a>

    💬 O que você precisa? Vamos conversar!`,
        acao: "vender",
    },

    // PAINEL ADMIN
    {
        palavrasChave: ["admin", "administrador", "painel", "gerenciar", "dashboard", "dash", "administrativo"],
        resposta: "🛠️ O painel administrativo da Roberson Store permite gerenciar:\n\n✅ Produtos (criar, editar, deletar)\n✅ Pedidos (visualizar e atualizar status)\n✅ Clientes (gerenciar usuários)\n✅ Estoque (controlar quantidade)\n\n📍 <a href='/admin' style='color: #2563eb; font-weight: bold;'>Acessar painel admin →</a>",
        acao: "admin",
    },

    // AJUDA
    {
        palavrasChave: ["ajuda", "duvida", "dúvida", "socorro", "não sei", "como faz", "como", "como funciona"],
        resposta: "🤔 Desculpe, não entendi completamente sua pergunta.\n\n💬 Aqui estão alguns tópicos que posso ajudar:\n\n🔹 <strong>Produtos</strong> – O que vendemos e onde encontrar\n🔹 <strong>Pagamento</strong> – Formas de pagamento\n🔹 <strong>Frete</strong> – Como é calculado\n🔹 <strong>Contato</strong> – Como falar comigo\n🔹 <strong>Sobre</strong> – A história da loja\n🔹 <strong>Site</strong> – Meu portfólio como dev\n\n📞 Se preferir, fale comigo pelo <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>WhatsApp</a>!",
        acao: "ajuda",
    },

    // AGRADECIMENTOS
    {
        palavrasChave: ["obrigado", "valeu", "grato", "obrigada", "agradeço", "muito obrigado"],
        resposta: "😊 Por nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, é só me chamar.\n\n🌟 Volte sempre à Roberson Store!",
    },

    // DESPEDIDAS
    {
        palavrasChave: ["tchau", "até logo", "adeus", "flw", "falou", "xau", "ate", "ate logo", "até mais"],
        resposta: "👋🏼 Até logo! Foi um prazer conversar com você. Volte sempre à Roberson Store!\n\n📞 Se precisar, estou aqui no <a href='https://wa.me/5511950768793' target='_blank' style='color: #25D366; font-weight: bold;'>WhatsApp</a> e no <a href='mailto:jroberson.junior@outlook.com' style='color: #2563eb; font-weight: bold;'>e-mail</a>.",
    },
];