# Script para ejecutar el frontend de DeepPeru
# Uso: .\run.ps1 [quick|full]

param (
    [string]$Mode = "quick"
)

Write-Host "🚀 DeepPeru Frontend - Modo: $Mode"

switch ($Mode) {
    "quick" {
        Write-Host " Modo rápido - Solo ejecutando aplicación..."
        pnpm dev
    }

    "full" {
        Write-Host " Modo completo - Instalando dependencias y ejecutando..."

        # Instalar dependencias
        Write-Host " Instalando dependencias..."
        pnpm install

        # Limpiar caché de Next.js
        Write-Host " Limpiando caché..."
        if (Test-Path ".next") {
            Remove-Item -Recurse -Force ".next"
        }

        # Iniciar aplicación
        Write-Host " Iniciando aplicación en modo desarrollo..."
        pnpm dev
    }

    default {
        Write-Host "Modo no válido. Usa: quick o full"
        Write-Host "Uso: .\run.ps1 [quick|full]"
        Write-Host "  quick - Solo ejecuta la aplicación (por defecto)"
        Write-Host "  full  - Instala dependencias y ejecuta"
        exit 1
    }
}