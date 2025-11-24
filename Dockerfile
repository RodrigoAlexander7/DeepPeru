# -----------------------
# STAGE 1: Builder
# -----------------------
FROM node:22-alpine AS builder
WORKDIR /app

# Copiamos archivos de workspace y lock
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig*.json ./

# Copiamos backend package.json
COPY apps/backend/package.json apps/backend/

# Instalar pnpm
RUN npm install -g pnpm

# Instalar dependencias
RUN pnpm install --filter ./apps/backend...

# Copiar todo el repo
COPY . .

# Generar prisma client
# Nota: Esto genera el cliente en /app/node_modules/.prisma debido al hoisting de pnpm
RUN cd apps/backend && npx prisma generate

# Build del backend
RUN cd apps/backend && pnpm run build

# -----------------------
# STAGE 2: Runtime
# -----------------------
FROM node:22-alpine AS runtime
WORKDIR /app

# ### FIX 1: Instalar OpenSSL para que Prisma Engine funcione en Alpine
RUN apk add --no-cache openssl

# Instalar pnpm
RUN npm install -g pnpm

# Copiamos package.json del backend
# (Para producción es mejor mantener la estructura de carpetas si es posible, pero lo dejaremos como lo tienes)
WORKDIR /app/apps/backend
COPY apps/backend/package.json ./

# Solo produciton deps + sin scripts
RUN pnpm install --prod --ignore-scripts

# Copiamos los artefactos del builder
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/prisma ./prisma

# ### FIX 2: Copiar el Cliente de Prisma Generado
# En el builder (monorepo), pnpm suele guardar esto en la raíz /app/node_modules/.prisma
# Lo copiamos a la carpeta node_modules local del backend en runtime
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# ### FIX 3: Asegurar que @prisma/client apunte al lugar correcto
# A veces pnpm necesita también el paquete wrapper. 
# Normalmente 'pnpm install --prod' ya trae @prisma/client, pero el 'engine' viene del paso anterior.

EXPOSE 4000

CMD ["node", "dist/main.js"]