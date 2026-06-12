FROM node:20-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/

# Copy prisma schema
COPY backend/prisma ./backend/prisma/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci

# Copy backend source code
COPY backend/src ./src/
COPY backend/tsconfig.json ./

# Build backend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
