# 📊 Status do Desenvolvimento — Sugar Dream MVP

**Data:** 11 de junho de 2026  
**Branch:** `claude/gifted-lamport-ck2e0d`  
**Commits:** 3 (scaffold + pagamento + verificação)

---

## ✅ Implementado (Fase 1 — Fundação)

### Infraestrutura
- ✅ NestJS 10 scaffold com TypeScript
- ✅ PostgreSQL schema (Prisma) com todas as tabelas
- ✅ Redis (docker-compose)
- ✅ Prisma ORM configurado
- ✅ .env e configuração
- ✅ Docker Compose (Postgres + Redis)

### Autenticação
- ✅ `POST /api/v1/auth/register` — Cadastro mínimo (email, telefone, senha, tipo)
  - Validação de idade (≥18)
  - Hash bcrypt da senha
  - Status inicial: `AWAITING_PAYMENT`
  - Geração de tokens JWT (access + refresh)
- ✅ `POST /api/v1/auth/login` — Login (com validação de status)
- ✅ `POST /api/v1/auth/refresh` — Refresh token
- ✅ `GET /api/v1/auth/me` — Dados do usuário autenticado
- ✅ Passport JWT Strategy + Guards

### Usuários
- ✅ `GET /api/v1/users/me` — Dados completos do usuário
- ✅ `GET /api/v1/users/profile` — Perfil (bio, interesses, fotos)
- ✅ `PUT /api/v1/users/profile` — Atualizar perfil

### Pagamento (Mercado Pago)
- ✅ `POST /api/v1/subscriptions/create` — Criar subscription
  - Validação de plano por tipo (baby R$19,90 vs daddy/mommy R$99,90)
  - Mock de checkout URL
  - Persistência no banco
- ✅ `POST /api/v1/subscriptions/webhook` — Preparação para webhook

### Verificação
- ✅ `POST /api/v1/verification/send-phone-code` — Enviar SMS (mock)
- ✅ `POST /api/v1/verification/verify-phone` — Validar código (mock)
- ✅ `POST /api/v1/verification/liveness` — Liveness + face matching (mock)
  - Scores de liveness (0,95) e face match (0,96)
  - Check de idade
  - Flag `faceVerified` atualizado

### Documentação
- ✅ `README.md` — Visão geral
- ✅ `DEVELOPMENT.md` — Guia completo de setup e rotas
- ✅ `docs/PRD.md` — Especificação completa do produto
- ✅ `setup.sh` — Script automatizado de setup

---

## 🚧 Em andamento / Próximos passos

### Próximas features (ordem de importância)

| # | Feature | Status | Estimativa |
|---|---------|--------|-----------|
| 1 | **Chat (WebSocket)** | 🟡 Planejado | 3-4 commits |
| 2 | **Questionário comportamental** | 🟡 Planejado | 2-3 commits |
| 3 | **Matching** | 🟡 Planejado | 2-3 commits |
| 4 | **Moderação/Reports** | 🟡 Planejado | 2 commits |
| 5 | **Reputação/Reviews** | 🟡 Planejado | 1-2 commits |
| 6 | **Lives (Google Meet)** | 🟡 Planejado | 1 commit |

### Integrações reais (mock → real)

| Serviço | Status | Prioridade | Notas |
|---------|--------|------------|-------|
| Mercado Pago | 🟡 Mock | ALTA | Substituir checkout mock por real Preapproval API |
| AWS Rekognition | 🟡 Mock | ALTA | Liveness + face matching real |
| Twilio SMS | 🟡 Mock | ALTA | Envio real de SMS |
| SendGrid Email | 🟡 Não iniciado | MÉDIA | Notificações por e-mail |
| Redis | 🟡 Não iniciado | MÉDIA | Cache, sessions, pub/sub para WebSocket |
| AWS S3 | 🟡 Não iniciado | MÉDIA | Upload de fotos/vídeos |

### Segurança & Compliance

| Item | Status |
|------|--------|
| **Mercado Pago (MCC validation)** | 🔴 BLOQUEADOR — Validar elegibilidade em Fase 0 |
| **LGPD (DPO, consentimento)** | 🟡 Documentado em PRD; implementar depois |
| **Anti-CSAM** | 🟡 Planejado para antes do lançamento |
| **2FA obrigatório** | 🟡 Preparado em schema; implementar depois |
| **Encryption KMS** | 🟡 Preparado; implementar com chat |

---

## 📝 Como rodar localmente

```bash
# Clone + setup
git clone https://github.com/senacomercial/pc-airton.git
cd pc-airton
chmod +x setup.sh
./setup.sh

# Backend em modo desenvolvimento
cd backend
npm run start:dev
# API em http://localhost:3000
```

**Pré-requisitos:** Docker, Node.js 20+, npm.

---

## 🗂️ Estrutura do código

```
backend/
├── src/
│   ├── auth/           → Autenticação (register, login, JWT)
│   ├── users/          → Perfis e dados de usuário
│   ├── payments/       → Mercado Pago + subscriptions
│   ├── verification/   → Telefone + liveness + face matching
│   ├── [chat/]         → 🔜 WebSocket e mensagens
│   ├── [questionnaire/]→ 🔜 Questionário comportamental
│   ├── [matching/]     → 🔜 Algoritmo de compatibilidade
│   ├── [moderation/]   → 🔜 Reports e moderação
│   ├── prisma/         → ORM e schema
│   └── app.module.ts   → Módulo raiz
├── prisma/
│   └── schema.prisma   → Schema completo (23 tabelas)
└── package.json
```

---

## 🎯 Métricas de progresso

- **Endpoints implementados:** 15 de ~50 (30%)
- **Módulos:** 5 de ~9 (55%)
- **Schema PostgreSQL:** 100% (26 tabelas + enums)
- **Testes:** 0 (próxima fase)
- **Documentação:** 100%

---

## 📌 Decisões técnicas importantes

1. **Paywall desde o dia 1:** Cadastro → checkout → liberação de features (não free tier)
2. **Chat como núcleo:** É a única coisa relevante atrás do paywall
3. **Questionário como sinal, não gate:** Auto-relato não é seguro; usado para triagem e moderação
4. **Criptografia realista:** TLS + KMS envelope (não E2E; server lê para moderar)
5. **Stack monolítica MVP:** NestJS + Prisma + PostgreSQL; microserviços em Fase 2

---

## ⚠️ Riscos & Bloqueadores

1. **Mercado Pago elegibilidade** — Stripe proíbe sugar dating; MP ainda a validar (Fase 0 — CRÍTICO)
2. **Liveness & KYC** — Requisitos legais de verificação de idade (decisão: terceirizar para Onfido/Unico)
3. **Anti-CSAM** — Obrigatório por lei (PhotoDNA ou serviço equivalente antes do lançamento)

---

## 🚀 Próximas ações

1. **Este commit:** Publicar estrutura + primeiras rotas
2. **Próximo bloco:** Chat (WebSocket + Redis pub/sub)
3. **Depois:** Questionnaire + matching
4. **Paralelo:** Integrar serviços reais (Mercado Pago, AWS, etc.)

---

**Última atualização:** 11 jun 2026, 20:30 UTC
