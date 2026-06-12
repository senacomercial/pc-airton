# Frontend — Sugar Dream Web

O frontend é uma aplicação **Next.js 14** com **TypeScript** que recria fielmente
o design "Sugar Dream Web" do Claude Design. Todas as 6 telas estão implementadas
e conectadas ao backend NestJS.

## Estrutura

```
frontend/
├── src/
│   ├── app/
│   │   ├── (app)/              # shell autenticado (sidebar + topbar)
│   │   │   ├── matches/        # dashboard com grid de matches
│   │   │   ├── profile/        # perfil detalhado + reviews
│   │   │   ├── chat/           # chat com Smart Warning financeiro
│   │   │   ├── moderation/     # fila de denúncias
│   │   │   └── lives/          # grid de webinars
│   │   ├── login/              # página de login
│   │   ├── page.tsx            # landing page
│   │   └── layout.tsx          # root + AuthProvider
│   ├── components/
│   │   ├── Sidebar.tsx         # navegação lateral
│   │   ├── Topbar.tsx          # barra superior
│   │   └── ProtectedRoute.tsx  # guarda de autenticação
│   ├── lib/
│   │   ├── api.ts              # cliente HTTP + tipos
│   │   └── auth.tsx            # contexto JWT + login
│   ├── styles/
│   │   └── theme.ts            # tokens Sena DS (cores, fontes, gradientes)
│   └── globals.css             # reset + animações
├── next.config.js              # rewrite /backend → API backend
├── tsconfig.json               # strict mode
└── package.json
```

## Design tokens

Centralizados em `src/styles/theme.ts`, extraídos do brandbook Sena v1.0:

- **Cores**: preto asfalto `#000`, dourado pódio `#C5A059`, laranja ignição `#E85D04`, verde online `#27AE60`, vermelho perigo `#CC0000`
- **Tipografia**: Playfair Display (serif, headlines), Montserrat (sans, corpo), JetBrains Mono (mono, métricas)
- **Espacamento**: sistema 4px
- **Raios**: 0–8px (afiados, "F1")
- **Sombras**: discreta (0 1px 2px) até lg (0 20px 60px)

## Autenticação

1. **Login**: `POST /api/v1/auth/login` com email/senha
2. **Token**: armazenado em localStorage como `sd_token`
3. **Proteção**: ProtectedRoute redireciona usuários não-autenticados para `/login`
4. **Headers**: todos os requests autenticados incluem `Authorization: Bearer <token>`

Demo (hardcoded no seed do backend):
- Email: `joao.daddy@demo.com`
- Senha: `Demo@1234`

## Integração com o backend

Em dev, o Next.js reescreve `/backend/*` para `NEXT_PUBLIC_API_URL` (padrão `http://localhost:3000`),
evitando CORS.

Rotas consumidas:
- `POST /api/v1/auth/login` — autenticação
- `GET /api/v1/users/me` — perfil atual
- `GET /api/v1/matches` — grid de compatibilidade

Rotas com dados estáticos (fallback):
- `/chat` — conversa hardcoded + Smart Warning
- `/moderation` — fila de exemplo
- `/lives` — webinars de demo

## Como rodar

### Terminal 1: Backend

```bash
cd backend
npm install
npm run db:migrate    # setup Prisma + PostgreSQL
npm run db:seed       # popula dados de demo
npm run start:dev     # inicia NestJS em :3000
```

### Terminal 2: Frontend

```bash
cd frontend
npm install
npm run dev           # inicia Next.js em :4000
```

Abra http://localhost:4000 no navegador.

### Fluxo

1. Landing page (`/`) com nav + hero + seletor de perfil
2. Clica em CTA → redireciona para `/login`
3. Login com `joao.daddy@demo.com` / `Demo@1234` → JWT armazenado
4. Redirecionado para `/matches` (dashboard com grid 4 colunas)
5. Clica em um card → vai para `/profile`
6. Clica "Iniciar Chat" → vai para `/chat`
7. Clica "Moderação" (sidebar) → vai para `/moderation`
8. Clica "Lives" (sidebar) → vai para `/lives`

## Variáveis de ambiente

Opcionais (por padrão, aponta para `http://localhost:3000`):

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Build & Deploy

```bash
npm run build
npm run start -p 4000   # production
```

## Próximos passos

- [ ] Conectar Chat, Moderation e Lives a endpoints reais da API
- [ ] Adicionar upload de foto de perfil
- [ ] Pagamento (integração Stripe)
- [ ] WebSocket para mensagens em tempo real (Socket.io)
- [ ] Notificações (in-app + email)
