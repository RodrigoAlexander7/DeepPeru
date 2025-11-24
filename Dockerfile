# -----------------------
# STAGE 1: Builder
# -----------------------
FROM node:22 AS builder
WORKDIR /app

# Copiamos configuración del workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig*.json ./

# Copiamos package.json del backend
COPY apps/backend/package.json apps/backend/

# Instalar pnpm y dependencias
RUN npm install -g pnpm
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
FROM node:22 AS runtime
WORKDIR /app/apps/backend

# Instalar pnpm
RUN npm install -g pnpm

# 1. Copiamos package.json
COPY apps/backend/package.json ./

# 2. Instalamos dependencias de producción
RUN pnpm install --prod --ignore-scripts

# 3. Copiamos el código compilado (dist) y el esquema Prisma
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma

# 4. SOLUCIÓN: 
# A) Instalamos Prisma 6.18.0 (Versión correcta)
# B) Ejecutamos generate con el flag "--generator client". 
#    Esto fuerza a ignorar "prisma-docs-generator" u otros plugins dev.
RUN npm install -g prisma@6.18.0 && \
   npx prisma generate --generator client && \
   npm uninstall -g prisma

EXPOSE 4000

CMD ["node", "dist/main.js"]