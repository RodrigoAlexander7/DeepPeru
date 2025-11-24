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

# Generar prisma client (para que el build de NestJS no falle por tipos faltantes)
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
# Esto baja @prisma/client (vacío/ligero)
RUN pnpm install --prod --ignore-scripts

# 3. Copiamos el código compilado (dist) y el esquema Prisma
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma

# 4. SOLUCIÓN CLAVE: Regenerar Prisma en Runtime
# En lugar de copiar archivos complejos de pnpm, instalamos el CLI temporalmente,
# generamos el cliente en el entorno final y borramos el CLI.
# Esto garantiza que el binario sea correcto para el sistema (Debian) y la ruta sea la correcta.
RUN npm install -g prisma && \
   npx prisma generate && \
   npm uninstall -g prisma

EXPOSE 4000

CMD ["node", "dist/main.js"]