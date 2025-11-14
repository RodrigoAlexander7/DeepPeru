#!/bin/bash

# Script para ejecutar el frontend de DeepPeru
# Uso: ./run.sh [quick|full]

MODE=${1:-quick}

echo "🚀 DeepPeru Frontend - Modo: $MODE"

case $MODE in
  quick)
    echo "📦 Modo rápido - Solo ejecutando aplicación..."
    pnpm dev
    ;;
    
  full)
    echo "📦 Modo completo - Instalando dependencias y ejecutando..."
    
    # Instalar dependencias
    echo "📥 Instalando dependencias..."
    pnpm install
    
    # Limpiar caché de Next.js (opcional)
    echo "🧹 Limpiando caché..."
    rm -rf .next
    
    # Iniciar aplicación
    echo "▶️  Iniciando aplicación en modo desarrollo..."
    pnpm dev
    ;;
    
  *)
    echo "❌ Modo no válido. Usa: quick o full"
    echo "Uso: ./run.sh [quick|full]"
    echo "  quick - Solo ejecuta la aplicación (por defecto)"
    echo "  full  - Instala dependencias y ejecuta"
    exit 1
    ;;
esac
