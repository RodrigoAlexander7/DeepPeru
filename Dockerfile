FROM node:22-alpine AS builder
WORKDIR /app

# Copiamos archivos de workspace y lock
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig*.json ./

# Copiamos backend package.json
COPY apps/backend/package.json apps/backend/

# Instalar pnpm
RUN npm install -g pnpm

# Instalar TODAS las dependencias necesarias para build
RUN pnpm install --filter ./apps/backend...

# Copiar todo el repo
COPY . .

# Generar prisma client
RUN cd apps/backend && npx prisma generate

# Build del backend
RUN cd apps/backend && pnpm run build

# -----------------------
# STAGE 2: Runtime
# -----------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiamos package.json del backend
COPY apps/backend/package.json ./apps/backend/

# Solo produciton deps + sin scripts (evita husky)
RUN pnpm install --prod --filter ./apps/backend... --ignore-scripts

# Copiamos los artefactos del builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

WORKDIR /app/apps/backend
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/main.js"]
