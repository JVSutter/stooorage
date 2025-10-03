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

echo "--- Construindo e iniciando a aplicação ---"
docker compose up --build
