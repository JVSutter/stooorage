#!/bin/bash

# Função para exibir ajuda
show_help() {
    echo "Uso: $0 [OPÇÃO]"
    echo "Inicia os serviços da aplicação usando Docker Compose"
    echo ""
    echo "Opções:"
    echo "  back      Inicia apenas o backend"
    echo "  front     Inicia apenas o frontend"
    echo "  (nenhum)  Inicia backend e frontend (padrão)"
    echo "  -h, --help  Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0           # Inicia backend e frontend"
    echo "  $0 back      # Inicia apenas o backend"
    echo "  $0 front     # Inicia apenas o frontend"
}

# Verifica se foi solicitada ajuda
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Valida o argumento
if [[ $# -gt 1 ]]; then
    echo "Erro: Muitos argumentos fornecidos."
    echo "Use '$0 --help' para ver as opções disponíveis."
    exit 1
fi

if [[ $# -eq 1 && "$1" != "back" && "$1" != "front" ]]; then
    echo "Erro: Argumento inválido '$1'."
    echo "Use '$0 --help' para ver as opções disponíveis."
    exit 1
fi

echo "--- ATENÇÃO: Iniciando limpeza radical do ambiente Docker ---"

# Find all container IDs (both running and stopped)
CONTAINER_IDS=$(docker ps -aq)

if [ -n "$CONTAINER_IDS" ]; then
    echo "Stopping and removing ALL existing containers..."
    docker stop $CONTAINER_IDS
    docker rm $CONTAINER_IDS
    echo "Containers cleaned up successfully."
else
    echo "No Docker containers found to clean up."
fi

echo "Cleaning up project-specific volumes and networks..."
docker compose down --remove-orphans

# Check command line arguments
if [ $# -eq 0 ]; then
    echo "--- Building and starting all services (backend and frontend) ---"
    docker compose up --build
elif [ "$1" = "back" ]; then
    echo "--- Building and starting only the backend ---"
    docker compose up --build backend
elif [ "$1" = "front" ]; then
    echo "--- Building and starting only the frontend ---"
    docker compose up --build frontend
else
    echo "Error: Invalid argument. Use 'back' or 'front', or omit arguments to run both."
    exit 1
fi
