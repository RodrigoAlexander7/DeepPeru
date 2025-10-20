# DeepPeru

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

```env
DATABASE_URL="postgresql://user:password@localhost:5432/deepperu"
```

Ejecutar migraciones:

```bash
cd apps/backend
pnpm prisma migrate dev
```

## Desarrollo

### Iniciar todo

```bash
# Backend (puerto 3000)
pnpm --filter @deepperu/backend run dev

# Frontend (puerto 4000)
pnpm --filter @deepperu/frontend run dev
```

### Comandos útiles

```bash
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
