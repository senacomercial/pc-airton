# 🚀 Quick Start — Produção (Railway + Vercel)

**Tempo estimado: 15-20 minutos**

## Passo 1: Criar contas (5 min)

1. **Railway.app**
   - Acesse https://railway.app
   - Clique "Sign up with GitHub"
   - Autorize

2. **Vercel**
   - Acesse https://vercel.com
   - Clique "Sign up with GitHub"
   - Autorize

---

## Passo 2: Deploy Backend (Railway) — 5 min

1. **Railway Dashboard**
   - Clique **+ New Project**
   - Selecione **Deploy from GitHub repo**
   - Escolha `senacomercial/pc-airton`

2. **Adicionar serviços**
   - Clique **+ Add Service** → **Database** → **PostgreSQL**
   - Clique **+ Add Service** → **Database** → **Redis**
   - Railway vai provisionar automaticamente

3. **Variáveis de Ambiente**
   - Railway já forneceu `DATABASE_URL` e `REDIS_URL` automaticamente
   - Adicione em **Variables**:
     ```bash
     JWT_SECRET=<gere aqui: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
     JWT_REFRESH_SECRET=<gere aqui também>
     NODE_ENV=production
     PORT=3000
     ```

4. **Deploy**
   - Railway detecta `railway.json` na raiz
   - Build e start automáticos
   - Quando terminar, copie a URL: `https://<seu-projeto>.railway.app`

---

## Passo 3: Deploy Frontend (Vercel) — 5 min

1. **Vercel Dashboard**
   - Clique **Add New** → **Project**
   - Autorize GitHub e selecione `senacomercial/pc-airton`
   - Framework: Next.js (detectado automaticamente)
   - Root Directory: `frontend/`

2. **Variáveis de Ambiente**
   - Vá em **Settings** → **Environment Variables**
   - Adicione:
     ```bash
     NEXT_PUBLIC_API_URL=https://<seu-projeto-railway>.railway.app
     ```
   - Clique **Deploy**

3. **Resultado**
   - Frontend estará em `https://<seu-projeto>.vercel.app`

---

## Passo 4: Testar — 5 min

### 4.1 Backend health check
```bash
curl https://<seu-projeto-railway>.railway.app/api/v1/health
# Esperado: {"status":"ok"}
```

### 4.2 Frontend
- Abra `https://<seu-projeto>.vercel.app`
- Login com suas credenciais reais (não demo)
- Deve conectar ao backend Railway

### 4.3 Dados
- Primeiras vezes, sem dados (banco vazio)
- Para popular dados de teste:
  - Via Railway Shell: `cd backend && npm run db:seed`
  - Ou crie usuários via API

---

## Passo 5: (Opcional) Domínio Customizado

### Vercel
1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `app.seudominio.com`)
3. Aponte DNS para Vercel (instruções na tela)

### Railway
- Mesma coisa se quiser domínio para a API
- Vá em **Settings** → **Custom Domain**

---

## Checklist Final

- [ ] Railway mostra build `success`
- [ ] PostgreSQL + Redis estão rodando no Railway
- [ ] Vercel mostra deployment concluído
- [ ] `/api/v1/health` retorna `{"status":"ok"}`
- [ ] Frontend carrega sem erro de conexão
- [ ] Login funciona com usuário real

---

## URLs Finais

| Serviço | URL |
|---------|-----|
| **Backend API** | https://seu-projeto.railway.app |
| **Frontend** | https://seu-projeto.vercel.app |
| **Admin** | https://seu-projeto.railway.app/api/docs |

---

## Próximas Etapas

✅ **Produção está no ar!**

Agora é recomendado:
1. Configurar CI/CD automático (já feito — git push = deploy)
2. Configurar variáveis de pagamento (Stripe, se aplicável)
3. Habilitar HTTPS em domínio customizado
4. Monitorar logs em Railway + Vercel
5. Configurar alertas de erro

---

## 🆘 Dúvidas?

- **Railway não faz build?** → Verifique `railway.json` na raiz
- **Frontend não conecta ao backend?** → Verifique `NEXT_PUBLIC_API_URL`
- **Banco vazio?** → Execute `npm run db:seed` via Railway Shell
- **Port 3000 já em uso?** → Railway usa qualquer porta disponível, ignore

---

**Parabéns! 🎉 Sistema em produção!**

Para mais detalhes, veja `DEPLOYMENT.md`.
