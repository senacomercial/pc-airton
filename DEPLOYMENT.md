# Deployment Guide — Sugar Dream (Produção)

## Visão Geral

Este guia cobre o deploy em produção com:
- **Backend**: Railway.app (NestJS + PostgreSQL + Redis)
- **Frontend**: Vercel (Next.js)

Custos estimados: ~$15-30/mês (Railway) + plano Vercel (grátis ou Pro).

---

## Pré-requisitos

1. Conta GitHub (já tem)
2. Conta [Railway.app](https://railway.app) (sign up com GitHub)
3. Conta [Vercel](https://vercel.com) (sign up com GitHub)
4. Domínio (opcional, mas recomendado)

---

## 1. Deploy Backend em Railway

### 1.1 Criar projeto Railway

1. Acesse https://railway.app
2. Clique em **New Project**
3. Selecione **Deploy from GitHub repo**
4. Autorize e selecione `senacomercial/pc-airton`
5. Railway detectará automaticamente que é um monorepo

### 1.2 Configurar Railway

**No painel do Railway:**

1. Clique em **Add Service** → **Database** → **PostgreSQL**
   - Railway cria automaticamente uma instância
   - Anota a URL de conexão (será usada como `DATABASE_URL`)

2. Clique em **Add Service** → **Database** → **Redis**
   - Redis será criado
   - Railway fornecerá a URL (será usada como `REDIS_URL`)

3. Clique em **Add Service** → **GitHub Repo** → selecione `pc-airton`
   - Railway perguntará qual pasta buildar
   - Deixe vazio ou use `.` (Railway lerá `railway.json`)

### 1.3 Variáveis de ambiente

No painel Railway, vá em **Variables** do seu app e configure:

```bash
# Banco de dados (Railway preencherá automaticamente)
DATABASE_URL=postgresql://user:pass@host:5432/railway

# Redis (Railway preencherá automaticamente)
REDIS_URL=redis://user:pass@host:6379

# JWT e segurança (gere strings aleatórias fortes)
JWT_SECRET=sua_chave_secreta_muito_aleatoria_aqui
JWT_REFRESH_SECRET=outra_chave_secreta_muito_aleatoria_aqui

# API
PORT=3000
NODE_ENV=production

# Se tiver Stripe/pagamentos
# STRIPE_SECRET_KEY=sk_live_...
# STRIPE_WEBHOOK_SECRET=whsec_...
```

**Gerar secrets seguros:**
```bash
# Terminal local
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 1.4 Deploy

1. Railway lê `railway.json` automaticamente
2. Executa `npm run build` no backend
3. Inicia com `npm run start`
4. Expõe a API em `https://<seu-projeto-railway>.railway.app`

**Verificar deploy:**
```bash
curl https://<seu-projeto-railway>.railway.app/api/v1/health
```

---

## 2. Deploy Frontend em Vercel

### 2.1 Conectar GitHub

1. Acesse https://vercel.com
2. Clique em **Add New** → **Project**
3. Selecione `senacomercial/pc-airton`
4. Configure:
   - **Framework**: Next.js
   - **Root Directory**: `frontend/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2.2 Variáveis de Ambiente

No painel Vercel, vá em **Settings** → **Environment Variables**:

```bash
# Apontar para o backend Railway
NEXT_PUBLIC_API_URL=https://<seu-projeto-railway>.railway.app

# Remover a flag de demo mode
# (não defina NEXT_PUBLIC_DEMO_MODE, ou deixe vazio)

# Remover static export
# (não defina NEXT_PUBLIC_STATIC_EXPORT, ou deixe vazio)
```

**Importante:** Vercel vai detectar que é Next.js com App Router e fará o deploy automático. A variável `NEXT_PUBLIC_API_URL` será injetada na build.

### 2.3 Deploy

1. Vercel faz build automático a cada push em `main` ou `claude/gifted-lamport-ck2e0d`
2. Frontend estará em `https://<seu-projeto-vercel>.vercel.app`
3. Ou em domínio customizado se configurar

---

## 3. Conectar Frontend ao Backend

### 3.1 Verificar no código

No `frontend/src/lib/auth.tsx`, a lógica já está preparada:

```typescript
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
if (demoMode) {
  // login sem backend (demo)
} else {
  // login real via backend
  const res = await fetch('/backend/api/v1/auth/login', ...);
}
```

### 3.2 Proxy de API em Vercel

No `frontend/next.config.js`, há lógica condicional que ativa rewrites em dev:

```javascript
async rewrites() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return [{ source: '/backend/:path*', destination: `${api}/:path*` }];
}
```

**Em produção (Vercel):**
- Remova o rewrite ou use `NEXT_PUBLIC_API_URL` para apontar direto
- O frontend fará requisições para `https://<seu-backend-railway>.railway.app/api/v1/...`

Atualize `frontend/next.config.js`:

```javascript
async rewrites() {
  // Em produção, apontar direto para Railway
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return [{ source: '/backend/:path*', destination: `${api}/:path*` }];
}
```

---

## 4. Migração do Banco de Dados

### 4.1 Railway executa migrations automaticamente?

**Não por padrão.** Você precisa rodar as migrations na Railway.

**Opção A: Via SSH/console Railway**
```bash
# No painel Railway, vá em "Shell" do seu app
cd backend
npm run db:migrate -- --skip-generate
```

**Opção B: Adicionar hook na Railway**
Crie um `scripts/migrate.sh`:
```bash
#!/bin/bash
cd backend
npm run db:migrate -- --skip-generate
npm run db:seed  # (opcional, só uma vez)
```

Depois em `railway.json`, adicione:
```json
{
  "build": { ... },
  "deploy": {
    "preStartCommand": "bash scripts/migrate.sh",
    "startCommand": "cd backend && npm run start"
  }
}
```

---

## 5. Variáveis de Ambiente Consolidadas

### Backend (Railway)

```bash
# Banco + Cache
DATABASE_URL=postgresql://user:pass@host:5432/railway
REDIS_URL=redis://user:pass@host:6379

# Segurança
JWT_SECRET=seu_secret_aleatorio
JWT_REFRESH_SECRET=outro_secret_aleatorio

# Ambiente
NODE_ENV=production
PORT=3000

# API (opcional, para CORS)
# FRONTEND_URL=https://seu-frontend.vercel.app
```

### Frontend (Vercel)

```bash
# Apontar para backend
NEXT_PUBLIC_API_URL=https://seu-backend-railway.railway.app

# NÃO defina:
# NEXT_PUBLIC_DEMO_MODE (será undefined → login real)
# NEXT_PUBLIC_STATIC_EXPORT (será undefined → Next.js normal)
# NEXT_PUBLIC_BASE_PATH (será undefined → raiz)
```

---

## 6. Pós-Deploy: Checklist

- [ ] Backend Railway responde em `/health`
- [ ] Frontend Vercel está online
- [ ] Login com credenciais funciona
- [ ] Chat carrega dados do backend
- [ ] Matches fazem requisições ao backend
- [ ] WebSocket (chat real-time) conecta
- [ ] Domínio customizado está apontado (se tiver)

---

## 7. Rollback

**Se algo der errado:**

**Railway:**
- Vá em **Deployments**
- Selecione uma versão anterior
- Clique em **Redeploy**

**Vercel:**
- Vá em **Deployments**
- Clique em **Promote** na versão anterior

---

## 8. Monitoramento

### Railway Logs
```bash
# No painel Railway, clique em "Logs" do seu app
# Veja erros de boot, crashes, etc
```

### Vercel Logs
```bash
# No painel Vercel, clique em "Function Logs" ou "Edge Logs"
```

### Health Checks
```bash
# Backend
curl https://seu-backend.railway.app/api/v1/health

# Frontend
curl https://seu-frontend.vercel.app
```

---

## 9. Custos Estimados

| Serviço | Plano | Custo/mês |
|---------|-------|-----------|
| Railway (backend) | Starter | Grátis 1º mês, depois ~$10-20 |
| Railway (PostgreSQL) | Shared | Incluído no Starter |
| Railway (Redis) | Shared | Incluído no Starter |
| Vercel | Hobby (grátis) | Grátis |
| Vercel | Pro | $20 (opcional) |
| **Total** | - | **~$10-20/mês** |

---

## 10. Troubleshooting

### "Connect ECONNREFUSED 127.0.0.1:5432"
- Database não está rodando ou URL está errada
- Verifique `DATABASE_URL` no Railway

### "npm: not found"
- Dockerfile ou railway.json especifica Node version errada
- Use `node:20-alpine` ou superior

### "JWT verification failed"
- `JWT_SECRET` está diferente entre builds
- Garanta que a variável está fixa em Railway (não regenerada)

### "CORS error from frontend"
- Backend não tem CORS habilitado para o domínio Vercel
- Adicione em `backend/src/main.ts`:
  ```typescript
  app.enableCors({
    origin: 'https://seu-frontend.vercel.app',
    credentials: true
  });
  ```

---

## Próximos Passos

1. Criar conta Railway + Vercel
2. Conectar repositório GitHub
3. Definir variáveis de ambiente
4. Testar login e dados
5. Configurar domínio customizado
6. Habilitar CI/CD (git push = deploy automático)

**Dúvidas? Deixa comigo!**
