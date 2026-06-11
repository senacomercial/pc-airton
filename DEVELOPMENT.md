# Guia de Desenvolvimento — Sugar Dream

## Pré-requisitos

- Node.js 20+
- Docker + Docker Compose
- PostgreSQL 16 (ou via Docker)
- Redis (ou via Docker)

## Setup local

```bash
# 1. Clone o repositório
git clone https://github.com/senacomercial/pc-airton.git
cd pc-airton

# 2. Execute o script de setup
chmod +x setup.sh
./setup.sh

# 3. Inicie o servidor de desenvolvimento
cd backend
npm run start:dev
```

A API estará disponível em `http://localhost:3000`.

## Estrutura do backend

```
backend/
├── src/
│   ├── auth/           # Autenticação (register, login, JWT)
│   │   ├── dto/        # Data Transfer Objects
│   │   ├── guards/     # JWT Auth Guard
│   │   ├── strategies/ # Passport JWT Strategy
│   │   └── auth.{service,controller,module}.ts
│   ├── users/          # Gerenciamento de usuários
│   │   └── users.{service,controller,module}.ts
│   ├── prisma/         # Configuração do Prisma
│   ├── app.module.ts   # Módulo raiz
│   └── main.ts         # Entry point
├── prisma/
│   ├── schema.prisma   # Schema do banco
│   └── migrations/     # Migrations automáticas
├── .env.example        # Variáveis de ambiente (copie para .env)
├── tsconfig.json       # Configuração TypeScript
└── package.json
```

## Rotas da API (MVP v1.0)

### Autenticação

- `POST /api/v1/auth/register` — Cadastro (cadastro mínimo + status AWAITING_PAYMENT)
- `POST /api/v1/auth/login` — Login
- `POST /api/v1/auth/refresh` — Refresh token
- `GET /api/v1/auth/me` — Obter dados do usuário autenticado (com JWT)

### Usuários

- `GET /api/v1/users/me` — Dados do usuário (com JWT)
- `GET /api/v1/users/profile` — Perfil completo (com JWT)
- `PUT /api/v1/users/profile` — Atualizar perfil (com JWT)

### Saúde

- `GET /health` — Health check da API

## Exemplo de requisição

```bash
# 1. Registrar
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123",
    "phone": "+5511999999999",
    "firstName": "João",
    "userType": "sugar_daddy",
    "birthDate": "1990-01-15",
    "gender": "M"
  }'

# Resposta:
# {
#   "userId": "uuid...",
#   "status": "AWAITING_PAYMENT",
#   "token": "jwt...",
#   "refreshToken": "jwt...",
#   "expiresIn": 3600,
#   "nextStep": "checkout"
# }

# 2. Login com o token recebido
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer jwt_token_aqui"
```

## Migrations do Prisma

```bash
# Criar nova migration (após alterar schema.prisma)
npx prisma migrate dev --name nome_da_migration

# Visualizar estado do banco
npx prisma studio

# Resetar banco (cuidado!)
npx prisma migrate reset
```

## Variáveis de ambiente necessárias

Copie `.env.example` para `.env` e atualize:

```
DATABASE_URL="postgresql://sugardream:sugardream_dev@localhost:5432/sugardream"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-in-production"
NODE_ENV="development"
API_PORT=3000
```

## Próximas features (Fase 1)

- [ ] **Verificação de telefone** — `POST /api/v1/auth/verify-phone`
- [ ] **Verificação de liveness** — `POST /api/v1/verification/liveness`
- [ ] **Questionário comportamental** — `POST /api/v1/questionnaire/submit`
- [ ] **Integração Mercado Pago** — `POST /api/v1/subscriptions/create` + webhook
- [ ] **Matching** — `GET /api/v1/matches`
- [ ] **Chat (WebSocket)** — `wss://...`

## Testes

```bash
npm run test           # Rodar todos os testes
npm run test:watch    # Modo watch
```

## Build para produção

```bash
npm run build
NODE_ENV=production npm start
```

## Troubleshooting

### Erro: "connect ECONNREFUSED localhost:5432"
O PostgreSQL não está rodando. Verifique:
```bash
docker compose ps
docker compose logs postgres
```

### Erro: "Unexpected token in JSON"
Verifique se o `.env` está configurado corretamente e se as credenciais do banco estão presentes.

### Erro na migration
Se a migration falhar:
```bash
npx prisma migrate resolve --rolled-back <migration_name>
npx prisma migrate dev
```

## Documentação do Produto

Veja `docs/PRD.md` para especificação completa de features, arquitetura, compliance e roadmap.
