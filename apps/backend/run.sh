#!/bin/bash

# Script para ejecutar el backend de DeepPeru
# Uso: ./run.sh [quick|full]

MODE=${1:-quick}

echo "🚀 DeepPeru Backend - Modo: $MODE"

case $MODE in
  quick)
    echo "📦 Modo rápido - Solo ejecutando aplicación..."
    pnpm start:dev
    ;;
    
  full)
    echo "📦 Modo completo - Instalando dependencias, generando clientes y ejecutando..."
    
    # Instalar dependencias
    echo "📥 Instalando dependencias..."
    pnpm install
    
    # Generar cliente Prisma
    echo "🔧 Generando cliente Prisma..."
    pnpx prisma generate
    
    # Ejecutar migraciones
    echo "🗄️  Ejecutando migraciones..."
    pnpm prisma migrate deploy
    
    # Iniciar aplicación
    echo "▶️  Iniciando aplicación..."
    pnpm start:dev
    ;;
    
  *)
    echo "❌ Modo no válido. Usa: quick o full"
    echo "Uso: ./run.sh [quick|full]"
    echo "  quick - Solo ejecuta la aplicación (por defecto)"
    echo "  full  - Instala dependencias, genera clientes y ejecuta"
    exit 1
    ;;
esac
