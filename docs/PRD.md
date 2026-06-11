# 🔧 SUGAR DREAM — PRD/PLR TÉCNICO v2.0

**Versão:** 2.0 (refinada)  
**Data:** Junho 2026  
**Status:** Pronto para desenvolvimento  
**Repositório:** https://github.com/senacomercial/appsugardream

---

## 📋 Resumo executivo — Mudanças v1.0 → v2.0

- **Criptografia corrigida:** TLS + KMS envelope encryption (não E2E fake no MVP; moderação requer server-side access)
- **Questionário deixa de ser gate:** agora é sinal de triagem + revisão humana (não selo "Verified Healthy")
- **Algoritmo de matching limpo:** pesos normalizados 0–1, sem penalidades mágicas
- **Stack decidida:** React + TypeScript + Node.js/NestJS + PostgreSQL + PostGIS
- **Pagamento via Mercado Pago:** não Stripe (que proíbe sugar dating). R$ 19,90 (baby) / R$ 99,90 (daddy/mommy)
- **Pagamento vem ANTES do perfil completo:** cadastro mínimo → checkout → desbloqueado para liveness/foto/questionário
- **Chat é o produto central:** única coisa relevante atrás do paywall
- **Lives simplificadas:** apenas link do Google Meet + gravações na área educacional
- **Nova seção de Compliance & Riscos:** incluindo validação de MCC no Mercado Pago

---

## 1. VISÃO GERAL

### 1.1 Objetivo
Sugar Dream é uma **plataforma de relacionamentos sugar por assinatura**, fundamentada em segurança e integridade comportamental. Usuários pagam desde o cadastro; o MVP viabiliza: onboarding com verificação multi-camada, questionário como sinal de triagem, matching ponderado, chat (coração do produto), moderação e lives educacionais.

### 1.2 Princípios de engenharia
1. **Honestidade de segurança:** não prometemos E2E se o servidor precisa ler mensagens para moderar. Prometemos TLS + criptografia em repouso + moderação.
2. **Humano no circuito:** nenhuma decisão de alto risco (aprovar, banir, escalar) é 100% automática.
3. **Escopo enxuto primeiro:** web-first; apps nativos em Fase 2.
4. **Compliance é pré-requisito:** pagamento, verificação de idade, anti-CSAM são decididos **antes** de codar, não depois.

### 1.3 Stack (decidida)

| Camada | Escolha | Justificativa |
|---|---|---|
| **Web** | React + TypeScript, Zustand, Tailwind | Time-to-market; ecossistema maduro |
| **Mobile (Fase 2)** | React Native (Expo) | Reuso de tipos/lógica com web |
| **Backend** | Node.js + TypeScript (NestJS) | Tipos compartilhados; WebSocket nativo |
| **DB primário** | PostgreSQL 16 + PostGIS + pgvector | Geolocalização (PostGIS); similaridade (pgvector) no MVP |
| **Cache / realtime** | Redis + BullMQ | Cache, pub/sub, jobs (um sistema só) |
| **Busca full-text** | Postgres `tsvector` (Elasticsearch em Fase 2) | Evita overhead operacional no MVP |
| **Mídia** | S3 + CloudFront (SSE-KMS) | Padrão; criptografado em repouso |
| **Infra** | ECS Fargate + Terraform | Sem Kubernetes no MVP (overhead) |
| **Observabilidade** | OpenTelemetry → Datadog ou Grafana | Padronizado |

### 1.4 Serviços de terceiros

| Função | Provedor | Notas |
|---|---|---|
| **Pagamento** | Mercado Pago (Preapproval) | PIX, cartão, boleto; validar MCC em Fase 0 |
| **E-mail / SMS / Push** | SendGrid / Twilio / Firebase | Notificações |
| **KYC / Liveness / Idade** | AWS Rekognition Liveness ou Onfido/Unico (BR) | Verificação de identidade |
| **Lives** | Google Meet | Apenas link; gravação no S3 → área educacional |
| **Anti-CSAM** | PhotoDNA ou equivalente | Escaneamento de mídia obrigatório |

### 1.5 Arquitetura

```
┌───────────────────────── CLIENTS ────────────────────────────┐
│   React (Web)      React Native (Fase 2: iOS / Android)      │
└────────────────────────────┬──────────────────────────────────┘
                             ▼
              ┌──────────────────────────────────┐
              │  API Gateway + Auth (JWT)        │
              │  Rate limiting · WAF · TLS 1.3   │
              └──────────────┬───────────────────┘
                             ▼
┌──────────────────── BACKEND (NestJS) ──────────────────┐
│ Auth/User │ Verification │ Matching │ Chat (WS) │       │
│ Reputation│ Moderation   │ Payment  │ Notification│Admin │
│ Lives     │ Content      │          │            │      │
└──────────────────────────┬─────────────────────────────┘
                           ▼
┌──────────────────────── DATA LAYER ───────────────────┐
│ PostgreSQL+PostGIS│ Redis │ S3 (SSE-KMS) │ KMS       │
└───────────────────────────────────────────────────────┘
```

Monólito modular no MVP; microserviços em Fase 2+ se volume justificar.

### 1.6 Modelo de negócio — Paywall desde o dia 1

| Público | Preço mensal | Acesso |
|---|---|---|
| `sugar_baby` | **R$ 19,90** | Chat, matching, perfil |
| `sugar_daddy`, `sugar_mommy` | **R$ 99,90** | Chat, matching, perfil |

- Pagamento **obrigatório antes do perfil completo** (após cadastro mínimo e checkout).
- Sem free trial no MVP.
- `userType` é **travado após liveness** — não pode mudar (anti-fraude).
- Renovação automática mensal; não pagar → acesso suspenso.

---

## 2. AUTENTICAÇÃO, ONBOARDING & PAYWALL

### 2.1 Fluxo de onboarding (sequenciado)

```
1. CADASTRO MÍNIMO
   email, telefone, senha, nome, userType, birthDate, gender
   ↓
2. CHECKOUT MERCADO PAGO ← BLOQUEANTE (R$ 19,90 ou R$ 99,90)
   Preapproval + Checkout Pro
   ↓
3. PAGAMENTO APROVADO → desbloqueado:
   - Foto de perfil
   - Verificação facial (liveness)
   - Validação de idade
   - Questionário comportamental
   - Perfil completo (bio, interesses, educação, etc.)
   ↓
4. STATUS = 'active' → acesso a chat, matching, lives
```

### 2.2 Cadastro mínimo — `POST /api/v1/auth/register`

```json
{
  "email": "user@example.com",
  "password": "PlainTextOverTLS!",
  "phone": "+5511999999999",
  "firstName": "João",
  "userType": "sugar_daddy",          // sugar_daddy | sugar_baby | sugar_mommy
  "birthDate": "1990-01-15",
  "gender": "M"                       // M | F | NB | Other
}
```

**Validações:**
- E-mail único; telefone E.164
- **Idade ≥ 18 (calculada de `birthDate`) — bloqueante**
- Senha forte: ≥10 chars, classes mistas; validada contra lista de vazadas (não exigir `!` obrigatório)
- Enviada em texto sobre TLS e hasheada com **argon2id** ou **bcrypt(12)** no servidor (nunca hash pré-computado)

**Resposta:**
```json
{
  "userId": "uuid",
  "status": "awaiting_payment",
  "nextStep": "checkout",
  "checkoutUrl": "https://www.mercadopago.com.br/checkout/...",
  "planName": "Sugar Daddy",
  "planPrice": 99.90,
  "currency": "BRL"
}
```

> **Neste ponto:** usuário **não tem foto, não fez liveness, não respondeu questionário**. Será tudo após pagamento.

### 2.3 Checkout via Mercado Pago

`checkoutUrl` aponta para **Checkout Pro** (hospedado pelo MP). Métodos: PIX, cartão, boleto.

Descrição no histórico: `"Sugar Dream — Assinatura Mensal"`.

### 2.4 Webhook de confirmação — `POST /api/v1/webhooks/mercadopago`

```python
def handle_mp_webhook(event):
    if event['action'] in ['payment.created', 'payment.updated']:
        payment_id = event['data']['id']
        payment = mp_api.get_payment(payment_id)  # Reconsulta obrigatória
        
        if payment['status'] == 'approved':
            user = get_user_by_payment_metadata(payment)
            user.status = 'pending_profile'
            user.subscription_status = 'active'
            user.subscription_id = payment['subscription_id']
            
            # Libera: foto, liveness, questionário, perfil completo
            send_notification(user, "✅ Pagamento confirmado! Conclua seu perfil...")
```

**Segurança obrigatória:**
- Validar `x-signature` (HMAC) do webhook.
- Reconsultar `GET /v1/payments/{id}` no MP antes de liberar — nunca confiar só do payload.
- Idempotência: processar cada `payment.id` uma única vez.

### 2.5 Foto de perfil — `POST /api/v1/verification/upload-photo`

Foto principal (≥400×400 px, ≤10 MB). Armazenado em S3 com URL pré-assinada.

### 2.6 Verificação facial + idade — `POST /api/v1/verification/liveness`

Upload de vídeo curto (≤5 MB, ≤10 s) via URL pré-assinada. Liveness + face matching + **estimativa/validação de idade**.

```json
{
  "verified": true,
  "livenessScore": 0.97,
  "faceMatchScore": 0.96,
  "ageCheck": "passed",
  "verifiedAt": "2026-06-15T10:00:00Z"
}
```

**Aprovação automática:** liveness ≥ 0,90 **e** faceMatch ≥ 0,95. Casos limítrofes → revisão humana.

> **Após liveness aprovado:** `userType` é **travado**. Não pode mudar mais (anti-fraude: homem não vira "baby" para pagar menos).

### 2.7 Questionário comportamental — `POST /api/v1/questionnaire/submit`

Respondido após liveness aprovado (ou aprovação pendente).

**Mudança conceitual:** na v1.0 o questionário **aprovava/reprovava** com o selo "Verified Healthy". Agora é um **sinal de triagem**:
- Alimenta o matching (compatibilidade de dimensões)
- Sinaliza perfis para moderação (red flags)
- Educa o usuário
- **Não concede selo de segurança**

Trust score vem de verificações objetivas + histórico de reviews (Seção 4).

**5 dimensões (0–100 cada):**
1. Maturidade emocional
2. Respeito à autonomia
3. Clareza de expectativas
4. Segurança emocional
5. Autossuficiência

Perguntas **neutras de gênero** (v1.0 era heteronormativa). Exemplo:
- *"Se a outra pessoa recusar algo sexual, qual sua reação?"*
  - Respeitar / Argumentar / Condicionar apoio (última = sinal de risco)

Resultado em job de background (BullMQ); red flags vão para fila de moderação.

```python
def behavior_signals(answers):
    dims = {
        'emotional_maturity': score_emotional_maturity(answers),
        'respect_autonomy': score_respect_autonomy(answers),
        'clear_expectations': score_clear_expectations(answers),
        'emotional_safety': score_emotional_safety(answers),
        'self_sufficiency': score_self_sufficiency(answers),
    }
    risk_flags = detect_risk_flags(answers)
    return {
        'dimensions': dims,
        'overall': sum(dims.values()) / 5,
        'risk_flags': risk_flags,
        'needs_human_review': len(risk_flags) > 0,
    }
```

**Armazenamento:** respostas criptografadas (KMS); histórico versionado; dimensões em cache Redis.

### 2.8 Perfil completo — PUT antes de "active"

Bio, interesses, fotos adicionais (max 5), status de relacionamento, educação, `incomeRange` (daddies/mommies só). Usuário marca como completo → status muda para `active`.

---

## 3. PERFIL & MATCHING

### 3.1 Atualizar perfil — `PUT /api/v1/profiles/:userId`

Bio ≤ 500 chars; 1 foto principal + até 5 adicionais (≥400×400, ≤10 MB, WebP); 3–15 interesses.

### 3.2 Algoritmo de matching (MVP)

`GET /api/v1/matches?limit=10&offset=0`

**Pesos:** demográfico 20% · expectativas 40% · comportamental 40%. Cada sub-score normalizado a 0–1 **antes** de ser ponderado (não misturar escalas).

```python
def compatibility(user, cand):
    demo  = demographic_score(user, cand)     # 0..1
    expec = expectations_score(user, cand)     # 0..1
    behav = behavioral_score(user, cand)       # 0..1
    return round(100 * (0.20*demo + 0.40*expec + 0.40*behav))
```

**Demográfico (0–1):** distância PostGIS, diferença de idade, interesses em comum (Jaccard), educação.

**Expectativas (0–1):** alinhamento sobre natureza do relacionamento, clareza financeira, compatibilidade de limites, discrição.

**Comportamental (0–1):** média das 5 dimensões + bônus se ambos verificados.

> **Removido da v1.0:** penalidades arbitrárias (`score -= red_flags * 25`), indexação mágica de respostas, NLP de "clareza". **NLP fica para Fase 2.**

Incompatibilidades fortes **filtram** (não aparecem), não geram score negativo.

Candidatos pré-filtrados no banco (tipo oposto, faixa etária, raio km, exclui bloqueados/denunciados); ranqueados; cacheado 15 min.

### 3.3 Filtros avançados — `GET /api/v1/matches/search`

Idade, raio (km), interesses, status de relacionamento, educação, `incomeRange`, score mínimo, online agora, foto verificada, ordenação (`compatibility|recent|nearest`).

---

## 4. CHAT, REPUTAÇÃO & MODERAÇÃO

### 4.1 Chat — o núcleo do produto

**Decisão estratégica:** Chat é a **única coisa relevante atrás do paywall**. É o que gera engajamento e receita.

`wss://api.sugardream.com/ws/chat?token=jwt`. Mensagens `text|image|audio|video`; mídia via URL pré-assinada com expiração. Status `sent|delivered|read`.

### 4.2 Criptografia de mensagens (corrigida)

**v1.0 estava quebrada:** derivava a chave de `user_id` (público) + guardava salt em claro → qualquer um recompõe a chave. Além disso, prometer E2E e moderar são contraditórios.

**v2.0 (honesto):**
- **Em trânsito:** TLS 1.3.
- **Em repouso:** criptografia de coluna via **envelope encryption** — data key por conversa, cifrada por master key em **AWS KMS**. Aplicação descriptografa sob demanda; material de chave nunca vive no banco em claro.
- **Moderação:** o produto precisa detectar coerção/abuso, logo o servidor **pode** ler conteúdo. **Não chamamos de E2E.** (E2E real é meta de Fase 3, fora do MVP.)

### 4.3 Avisos inteligentes (anti-golpe)

Detecção heurística de troca de dados financeiros → **aviso, não bloqueio**. Regex de cartão com separadores, CPF, palavras-chave PIX/banco. **Conteúdo não armazenado** além do necessário.

### 4.4 Reputação

Review só após relacionamento (ambos na conversa; ≥7 dias desde última mensagem; 1 review por dupla). Dimensões: respeito, comunicação, honestidade, pontualidade. Visibilidade pública agregada.

**Trust score** (este SIM vira selo):
```python
def trust_score(u):
    s = 0
    if u.phone_verified: s += 10
    if u.face_verified: s += 15
    if u.document_verified: s += 15
    if u.background_checked: s += 10      # máx 50
    if u.review_count >= 5: s += min(30, u.avg_rating * 6)   # máx 30
    days = (now() - u.created_at).days
    s += 20 if days >= 90 else 10 if days >= 30 else 0        # máx 20
    return min(100, s)
```

Selo de confiança vem daqui (fatos), **não** do questionário.

### 4.5 Moderação

Report (`POST /api/v1/reports`) com evidências; fila admin ordenada por urgência; ações `dismiss|warning|suspend_24h|suspend_7d|suspend_30d|ban`. Escalonamento a autoridades sempre com humano, log formal, retenção de evidências (especialmente CSAM/exploração).

---

## 5. PAGAMENTO via Mercado Pago

### 5.1 Integração

Dois planos **Preapproval**: `plan_baby` (R$ 19,90) e `plan_daddy_mommy` (R$ 99,90). Empresa (titular da conta MP) recebe transações.

`userType` escolhido no cadastro determina plano e é **travado após liveness**. Fluxo: usuário vê plano/preço → checkout MP → validação → desbloqueio.

```http
POST /api/v1/subscriptions/create
{ "userId": "uuid" }
→ { "checkoutUrl": "...", "status": "pending" }
```

### 5.2 Renovação automática

Cobrança recorrente mensal no dia do primeiro pagamento. Se falhar:
- **Notificação:** SMS + push + e-mail.
- **Carência:** 3 dias para retry/novo método.
- **Após 3 dias:** `past_due` → chat suspenso.
- **Após 7 dias:** `expired` → perfil mostra "Renove assinatura".

### 5.3 Acesso condicional

| Status | Chat | Matching | Perfil visível |
|---|---|---|---|
| `active` | ✅ | ✅ | ✅ |
| `past_due` | ❌ | ❌ | ❌ |
| `expired` | ❌ | ❌ | ❌ |
| `suspended` (moderação) | ❌ | ❌ | ❌ |

### 5.4 Conta da empresa

Registrada no MP sob a **empresa titular do Sugar Dream**, não indivíduos. MCC escolhido adequadamente (ex.: 7995 — serviços digitais).

**⚠️ FASE 0 — BLOQUEANTE:** validar elegibilidade com MP. Descrição: "Plataforma de relacionamentos — assinatura digital". Se MP sinalizar "atividade restrita", plano B: **Pagar.me** ou **CCBill**.

### 5.5 Segurança webhook

- Validar `x-signature` (HMAC) sempre.
- Reconsultar API MP antes de liberar.
- Idempotência por `payment.id`.

---

## 6. ⚠️ COMPLIANCE, LEGAL & RISCOS DE LANÇAMENTO

Esta seção cataloga itens **bloqueadores de lançamento**.

### 6.1 Processador de pagamento — RISCO CRÍTICO

**Stripe proíbe "sugar dating"** em sua *Restricted Businesses list*. PayPal, adquirentes e Apple/Google têm restrições semelhantes. **Construir em Stripe coloca em risco de reprovação ou congelamento.**

**Solução:** **Mercado Pago** — aceita PIX, cartão, boleto; é brasileiro; aceita melhor "dating" desde que registrado adequadamente.

**Ação em Fase 0 (OBRIGATÓRIA):**
1. Abrir conta empresa no MP com documentação completa
2. Registrar atividade como "Plataforma de relacionamentos — assinatura digital"
3. **Validar MCC com o MP** — confirmar que não será sinalizado
4. Testar flow de cobrança/chargeback em sandbox
5. Ter plano B (Pagar.me / CCBill) se o MP disser não

**Risco residual:** mesmo validado, MP pode sinalizar a conta post-lançamento se política mudar. Monitorar avisos do MP.

### 6.2 Verificação de idade & anti-exploração

- Idade ≥ 18 **verificada** (KYC + liveness), não auto-declarada.
- **Anti-CSAM obrigatório:** escaneamento de toda mídia (PhotoDNA ou equivalente), pipeline de denúncia, retenção de evidências per LGPD + Lei. **Inegociável; precede lançamento.**
- Protocolo anti-tráfico: sinais de coerção/menoridade → bloqueio + escalação humana.

### 6.3 LGPD & direito ao esquecimento (corrigido)

- **Bases legais** documentadas; **DPO** designado; consentimento explícito para dados sensíveis (biometria de liveness).
- **Retenção:** dados de segurança/denúncia têm retenção mínima legal — não apagáveis sob demanda se houver obrigação.
- **Exclusão / "direito ao esquecimento":**
  ```python
  def delete_account(user_id):
      u = get_user(user_id)
      # Anonimização (não setar sender_id = NULL, quebra FKs)
      u.email = f"deleted+{u.id}@sugardream.invalid"
      u.phone = None
      u.first_name = "Usuário removido"
      u.status = "deleted"; u.deleted_at = now()
      # Mensagens: manter vínculo, substituir conteúdo por placeholder
      redact_messages(sender_id=user_id, placeholder="[removido a pedido]")
      # Exceções: registros sob retenção legal/denúncia ficam pseudonimizados
      # até fim da obrigação. Documentar base legal.
  ```

> Mantemos a referência e **redigimos o conteúdo** — respeita FK + integridade da conversa do outro.

### 6.4 Termos, segurança e responsabilidade

- Termos de uso + diretrizes de comunidade explícitas
- Canais de denúncia acessíveis
- Banimento de menores
- Cooperação com autoridades
- Moderação de reviews anônimas (risco de difamação)

---

## 7. SEGURANÇA (resumo técnico)

- **Trânsito:** TLS 1.3; certificate pinning nos apps (Fase 2).
- **Repouso:** SSE-KMS no S3; criptografia de coluna (envelope/KMS) para mensagens, respostas, docs.
- **Auth:** argon2id ou bcrypt(12); **2FA obrigatória para ações sensíveis** (não em todo login — UX); access token curto + refresh 7 dias com rotação/revogação.
- **OWASP Top 10:** ORM parametrizado, RBAC, headers de segurança, escaping, CSRF, `npm audit`/Snyk no CI, logging estruturado.
- **Auditoria:** logs imutáveis de ações de moderação e verificação.

---

## 8. BANCO DE DADOS (PostgreSQL real)

> v1.0 usava sintaxe MySQL (`INDEX ...` inline, `ENUM(...)` inline). Corrigido com `CREATE TYPE` e `CREATE INDEX` separados. PostGIS para geolocalização.

```sql
CREATE TYPE user_type   AS ENUM ('sugar_daddy','sugar_baby','sugar_mommy');
CREATE TYPE gender_type AS ENUM ('M','F','NB','Other');
CREATE TYPE acct_status AS ENUM ('pending','active','suspended','banned','deleted');
CREATE TYPE live_status AS ENUM ('scheduled','live','completed');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email          CITEXT UNIQUE NOT NULL,
  phone          VARCHAR(20) UNIQUE,
  password_hash  TEXT NOT NULL,
  first_name     VARCHAR(100) NOT NULL,
  user_type      user_type NOT NULL,
  gender         gender_type,
  birth_date     DATE NOT NULL,
  geo            geography(Point, 4326),
  city VARCHAR(100), state VARCHAR(2), country VARCHAR(2),
  phone_verified BOOLEAN DEFAULT FALSE,
  face_verified  BOOLEAN DEFAULT FALSE,
  document_verified BOOLEAN DEFAULT FALSE,
  background_checked BOOLEAN DEFAULT FALSE,
  status acct_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_geo       ON users USING GIST(geo);
CREATE INDEX idx_users_active    ON users(status) WHERE status = 'active';

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  plan_type VARCHAR(50),
  stripe_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50),  -- active | past_due | expired | suspended
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Outras tabelas (profiles, conversations, messages, matches, reviews, reports, lives, notifications)
-- seguem padrão similar: TIMESTAMPTZ, enums via CREATE TYPE, FKs com ON DELETE, índices separados.
```

---

## 9. LIVES (simplificadas)

- **Ao vivo:** plataforma **apenas fornece o link do Google Meet**. Sem integração de streaming embarcado.
- **Inscrição:** usuário se registra; notificação 24h e 15 min antes com o link.
- **Gravação:** publicada na **Área Educacional** (seção permanente de conteúdo on-demand) — sem expiração de 48h.

```sql
CREATE TABLE lives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  duration_min INT,
  host_id UUID REFERENCES users(id),
  meet_url TEXT,
  recording_url TEXT,
  status live_status DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 10. ROADMAP (timeline honesta)

| Fase | Duração | Entregáveis | Notas |
|---|---|---|---|
| **0 — Compliance** | Sem. 1–3 | **Validar MP (MCC)**, KYC, anti-CSAM, DPO | Gate: sem processador = modelo muda |
| **1 — Fundação** | Sem. 4–7 | Auth, cadastro, 2FA, infra, CI/CD | Checkout MP já funcional |
| **2 — Paywall + Perfil** | Sem. 8–11 | Foto, liveness, questionário, pagamento antes de acesso | Payment é bloqueante |
| **3 — Chat + Confiança** | Sem. 12–15 | Chat (prioritário), matching, reputação, moderação | Chat = ativo central |
| **4 — Admin + Hardening** | Sem. 16–18 | Admin panel, anti-CSAM em prod, lives (Meet), auditoria | Beta fechado |
| **5 — Mobile** | Sem. 19+ | React Native, push, certificate pinning | IAP vs. web-only TBD |

---

## 11. DECISÕES CONSOLIDADAS (referência)

✅ `userType` aprovado (sugar_daddy, sugar_baby, sugar_mommy)  
✅ Pagamento é bloqueante e vem **antes do perfil completo**  
✅ `userType` travado após liveness (anti-fraude)  
✅ Chat é o núcleo — única coisa relevante atrás do paywall  
✅ Renovação automática mensal; não pagar = suspenso (acesso revogado)  
✅ Cuenta MP é da empresa (não individual); MCC validado em Fase 0  
✅ Lives simplificadas (link Google Meet + gravações em Área Educacional)  
✅ Questionário é sinal de triagem, não gate determinístico  
✅ Criptografia: TLS + KMS envelope (não E2E; server pode ler para moderar)  
✅ Moderação: humano no circuito para decisões de alto risco  

---

## 12. RISCOS ABERTOS & DECISÕES PENDENTES

1. **Mercado Pago MCC (crítico):** validação de elegibilidade em Fase 0 — se MP disser não, pivota para Pagar.me/CCBill.
2. **App Store IAP:** assinatura web-only vs. IAP — decidir antes da Fase 5 (mobile).
3. **Anti-CSAM em produção:** fornecedor (PhotoDNA vs. alternativa local) e pipeline operacional.
4. **E2E real:** mantido como objetivo de Fase 3; exige re-pensar moderação.
5. **Monitoramento de MP:** alertar se conta for sinalizada post-lançamento.

---

**Sugar Dream — PRD/PLR v2.0 consolidado**  
Pronto para desenvolvimento na Fase 1 (após Fase 0 de validação de compliance).

