#!/bin/bash

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
