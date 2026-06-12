# Sugar Dream

Plataforma de relacionamentos sugar **por assinatura** (web-first). Monorepo do MVP.

> Documento de produto/técnico completo: [`docs/PRD.md`](docs/PRD.md).

## Visão geral

- **Modelo:** pago desde o cadastro. R$ 19,90 (sugar baby) / R$ 99,90 (sugar daddy/mommy).
- **Paywall:** pagamento é **bloqueante** — cadastro mínimo → checkout (Mercado Pago) → liveness/foto/questionário → perfil ativo.
- **Núcleo do produto:** o chat entre membros (única coisa relevante atrás do paywall).

## Estrutura do monorepo

```
.
├── backend/          # API (NestJS 10 + TypeScript + Prisma 5 + PostgreSQL)
├── frontend/         # Web (Next.js 14 + TypeScript + App Router)
├── docs/             # PRD/PLR e documentação
└── docker-compose.yml
```

## Pré-requisitos

- Node.js 20+ (testado em 22)
- Docker + Docker Compose (para Postgres e Redis locais)

## Subir o ambiente de desenvolvimento

```bash
# 1. Sobe Postgres + Redis
docker compose up -d

# 2. Backend (terminal 1)
cd backend
cp .env.example .env
npm install
npm run db:migrate          # setup Prisma + schema
npm run db:seed             # popula dados de demo
npm run start:dev           # API em http://localhost:3000

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev                 # Next.js em http://localhost:4000
```

Acesse http://localhost:4000 para ver a landing page. Login: `joao.daddy@demo.com` / `Demo@1234`.

**Detalhes:** ver [`FRONTEND.md`](FRONTEND.md) para stack frontend e [`backend/README.md`](backend/README.md) para API.

## Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Backend** | NestJS 10 + TypeScript |
| **ORM** | Prisma 5 |
| **Banco** | PostgreSQL 16 (PostGIS em fase posterior) |
| **Cache/realtime** | Redis, Socket.io (para chat em tempo real) |
| **Auth** | JWT (access 1h, refresh 7d) + bcrypt |
| **Criptografia** | AES-256-GCM (envelope encryption para mensagens) |
| **Pagamento** | Mercado Pago (Preapproval, futuro) |

## Documentação

- [`FRONTEND.md`](FRONTEND.md) — setup e arquitetura da web
- [`backend/README.md`](backend/README.md) — API e endpoints
- [`docs/PRD.md`](docs/PRD.md) — visão de produto, compliance, roadmap
