# DeepPeru

Sistema intermedio para promoción de paquetes turísticos.

## Requisitos

- Node.js 18+
- pnpm 10+
- PostgreSQL

## Instalación

```bash
pnpm install
```

## Configuración

### Backend

Crear `apps/backend/.env`:

Ejecutar migraciones:

```bash
cd apps/backend
pnpm prisma migrate dev
```

## Desarrollo

### Ejecución rápida

Para iniciar el backend en modo desarrollo:

```bash
cd apps/backend
./run.sh        # Modo rápido (por defecto)
./run.sh quick  # Modo rápido (explícito)
```

Para iniciar el frontend en modo desarrollo:

```bash
cd apps/frontend
./run.sh        # Modo rápido (por defecto)
./run.sh quick  # Modo rápido (explícito)
```

### Ejecución completa (primera vez o después de cambios)

Para backend (instala dependencias, genera cliente Prisma, ejecuta migraciones):

```bash
cd apps/backend
./run.sh full
```

Para frontend (instala dependencias, limpia caché):

```bash
cd apps/frontend
./run.sh full
```

### Comandos útiles

```bash
# Generate prisma
cd ./apps/backend
pnpx prisma generate

# Formatear código
pnpm run format

# Verificar formato
pnpm run format:check

# Tests
pnpm --filter @deepperu/backend run test
```

## Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato de código
refactor: refactorización
test: tests
chore: mantenimiento
```

## Estructura

```
apps/
├── backend/    # NestJS + Prisma
└── frontend/   # Next.js
```
