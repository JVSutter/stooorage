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

# Define quais serviços serão iniciados
SERVICES=""
if [[ $# -eq 0 ]]; then
    echo "--- Iniciando backend e frontend ---"
    SERVICES=""  # Vazio significa todos os serviços
elif [[ "$1" == "back" ]]; then
    echo "--- Iniciando apenas o backend ---"
    SERVICES="backend"
elif [[ "$1" == "front" ]]; then
    echo "--- Iniciando apenas o frontend ---"
    SERVICES="frontend"
fi

echo "--- ATENÇÃO: Iniciando limpeza radical do ambiente Docker ---"

# Encontra todos os IDs de containers (ativos e inativos)
CONTAINER_IDS=$(docker ps -aq)

if [ -n "$CONTAINER_IDS" ]; then
    echo "Parando e removendo TODOS os containers existentes..."
    docker stop $CONTAINER_IDS
    docker rm $CONTAINER_IDS
    echo "Containers limpos com sucesso."
else
    echo "Nenhum container Docker encontrado para limpar."
fi

echo "Limpando volumes e redes específicas do projeto..."
docker compose down --remove-orphans

# Verifica argumentos de linha de comando
if [ $# -eq 0 ]; then
    echo "--- Construindo e iniciando todos os serviços (backend e frontend) ---"
    docker compose up --build
elif [ "$1" = "back" ]; then
    echo "--- Construindo e iniciando apenas o backend ---"
    docker compose up --build backend
elif [ "$1" = "front" ]; then
    echo "--- Construindo e iniciando apenas o frontend ---"
    docker compose up --build frontend
else
    echo "Erro: Argumento inválido. Use 'back' ou 'front', ou não passe argumentos para rodar ambos."
    exit 1
fi
