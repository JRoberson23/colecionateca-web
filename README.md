**Propósito:** Documentar o frontend, como rodar, variáveis de ambiente e estrutura.

```markdown
# 🎨 Colecionateca - Web

Frontend do e-commerce de consoles e jogos antigos.

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
# Preencha com a URL da API

# 3. Iniciar servidor
npm run dev

---

## 🔐 Variáveis de Ambiente
| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL da API (backend) |

---

📂 Estrutura do Frontend
web/
├── src/
│   ├── app/          # Páginas (App Router)
│   ├── components/   # Componentes React
│   ├── contexts/     # Contextos (carrinho, auth)
│   ├── services/     # Consumo da API
│   └── lib/          # Utilitários
├── public/           # Arquivos estáticos
└── package.json

---

🌐 Deploy
Vercel: https://colecionateca.vercel.app