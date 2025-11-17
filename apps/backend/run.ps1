# Script para ejecutar el backend de DeepPeru
# Uso: .\run.ps1 [quick|full]

param (
    [string]$Mode = "quick"
)

Write-Host "DeepPeru Backend - Modo: $Mode"

switch ($Mode) {
    "quick" {
        Write-Host "Modo rápido - Solo ejecutando aplicación..."
        pnpm start:dev
    }

    "full" {
        Write-Host "Modo completo - Instalando dependencias, generando clientes y ejecutando..."

        # Instalar dependencias
        Write-Host "Instalando dependencias..."
        pnpm install

        # Generar cliente Prisma
        Write-Host "Generando cliente Prisma..."
        pnpx prisma generate

        # Ejecutar migraciones
        Write-Host "Ejecutando migraciones..."
        pnpm prisma migrate deploy

        # Iniciar aplicación
        Write-Host "Iniciando aplicación..."
        pnpm start:dev
    }

    default {
        Write-Host "Modo no válido. Usa: quick o full"
        Write-Host "Uso: .\run.ps1 [quick|full]"
        Write-Host "  quick - Solo ejecuta la aplicación (por defecto)"
        Write-Host "  full  - Instala dependencias, genera clientes y ejecuta"
        exit 1
    }
}