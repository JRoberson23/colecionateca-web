# 🎨 Roberson Store - Web

Frontend do e-commerce de consoles e jogos, desenvolvido como projeto de TCC e portfólio full-stack.

> **Nota:** o projeto foi originalmente desenvolvido para um cliente sob o nome "Colecionateca". Após o cliente desistir do projeto, ele foi adaptado como portfólio pessoal e trabalho de conclusão de curso.

---

## 🚀 Tecnologias

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript

---

## 🛠️ Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local

# 3. Iniciar servidor
npm run dev
```

---

## 🔐 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL da API (backend) |

---

## 📂 Estrutura do Frontend

```
web/
├── src/
│   ├── app/          # Páginas (App Router)
│   ├── components/   # Componentes React
│   ├── contexts/     # Contextos (carrinho, auth)
│   ├── services/     # Consumo da API
│   └── lib/          # Utilitários
├── public/           # Arquivos estáticos
└── package.json
```

---

## 🌐 Deploy

Vercel: [https://roberson-store.vercel.app](https://roberson-store.vercel.app)

---

## 🔗 Repositório do Backend

[colecionateca-api](https://github.com/JRoberson23/colecionateca-api)

---

## 👤 Autor

**Roberson Junior** — Desenvolvedor Full-Stack
- GitHub: [@JRoberson23](https://github.com/JRoberson23)
- YouTube: [@RobersonDev](https://www.youtube.com/@RobersonDev)