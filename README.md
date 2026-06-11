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
├── backend/          # API (NestJS + TypeScript + Prisma + PostgreSQL)
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

# 2. Backend
cd backend
cp .env.example .env
npm install
npx prisma migrate dev      # cria o schema
npm run start:dev           # API em http://localhost:3000
```

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL 16 (PostGIS em fase posterior) |
| Cache/realtime | Redis |
| Auth | JWT (access + refresh) |
| Pagamento | Mercado Pago (Preapproval) |

Roadmap e decisões em [`docs/PRD.md`](docs/PRD.md).
