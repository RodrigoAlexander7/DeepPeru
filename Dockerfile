FROM node:22-alpine AS builder
WORKDIR /app

# Copiamos archivos del workspace para aprovechar cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig*.json ./

# Aseguramos la carpeta y copiamos package.json del backend
RUN mkdir -p apps/backend
COPY apps/backend/package.json apps/backend/package.json

# Instalar pnpm y deps (solo backend usando filter)
RUN npm install -g pnpm
RUN pnpm install --filter ./apps/backend...

# Copiamos el resto del repo
COPY . .

WORKDIR /app/apps/backend

# Prisma: generar client (necesario antes del build si importas Prisma)
RUN npx prisma generate

# Build (asegúrate que el script "build" en apps/backend/package.json compile a /dist)
RUN pnpm run build

# Verificación explícita: aseguramos que el build generó dist/main.js
RUN if [ -f dist/main.js ]; then echo "✔ dist/main.js encontrado"; else echo "ERROR: dist/main.js NO existe"; ls -la dist || true; exit 1; fi

# ---------------------------
# Stage: runtime (producción, más pequeño)
# ---------------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# Copiamos package files necesarios para instalar solo deps de producción
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/package.json

# Instalar pnpm y sólo las dependencias de producción del backend
RUN npm install -g pnpm
RUN pnpm install --prod --filter ./apps/backend...

# Copiamos únicamente los artefactos de build desde el builder
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist

WORKDIR /app/apps/backend

EXPOSE 4000

# Ejecutar el archivo compilado explícitamente
CMD ["node", "dist/main.js"]
