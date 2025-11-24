FROM node:22-alpine

WORKDIR /app

# Copiamos sólo los archivos del workspace necesarios para resolver deps y aprovechar cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY tsconfig*.json ./

# Aseguramos que exista la carpeta destino y copiamos el package.json del backend
RUN mkdir -p apps/backend
COPY apps/backend/package.json apps/backend/package.json

# Instalamos pnpm y las deps (sólo las del backend usando el workspace)
RUN npm install -g pnpm
RUN pnpm install --filter ./apps/backend...

# Ahora copiamos el resto del repo
COPY . .

WORKDIR /app/apps/backend

# Prisma: generar client antes del build
RUN npx prisma generate

# Build y run
RUN pnpm run build

EXPOSE 4000
CMD ["pnpm", "start:prod"]
