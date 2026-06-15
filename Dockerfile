# Debian slim com OpenSSL 3.x — necessário para os engines do Prisma.
FROM node:20-slim

# Prisma precisa do OpenSSL instalado no runtime.
RUN apt-get update -y \
  && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/backend

# Instala dependências (inclui devDeps para prisma/nest CLI no build).
COPY backend/package*.json ./
RUN npm ci --include=dev

# Copia o restante do código do backend.
COPY backend/ ./

# Gera o Prisma Client e compila o NestJS.
RUN npm run build

EXPOSE 3000

# Aplica as migrations e sobe a API.
CMD ["sh", "-c", "npm run db:deploy && npm run start:prod"]
