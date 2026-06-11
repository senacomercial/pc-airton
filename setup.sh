#!/bin/bash
set -e

echo "🚀 Iniciando setup do Sugar Dream..."

# 1. Subir containers
echo "📦 Iniciando Docker containers (PostgreSQL + Redis)..."
docker compose up -d

# Aguardar banco ficar pronto
echo "⏳ Aguardando PostgreSQL ficar pronto..."
sleep 5

# 2. Instalar dependências do backend
echo "📥 Instalando dependências do backend..."
cd backend
npm install

# 3. Gerar Prisma Client
echo "🔧 Gerando Prisma Client..."
npx prisma generate

# 4. Executar migrations
echo "🗄️ Executando migrations do banco de dados..."
npx prisma migrate dev --name initial

# 5. Seed (opcional)
# echo "🌱 Seedando dados iniciais..."
# npx prisma db seed

echo "✅ Setup concluído!"
echo ""
echo "🎯 Próximos passos:"
echo "  cd backend"
echo "  npm run start:dev"
echo ""
echo "API rodará em: http://localhost:3000"
echo "Docs: http://localhost:3000/api-docs"
