#!/bin/bash

# Função para exibir ajuda
show_help() {
    echo "Uso: $0 [OPÇÃO] [--prod]"
    echo "Inicia os serviços da aplicação usando Docker Compose"
    echo ""
    echo "Opções:"
    echo "  back      Inicia apenas o backend"
    echo "  front     Inicia apenas o frontend"
    echo "  (nenhum)  Inicia backend e frontend (padrão)"
    echo "  --prod    Executa o backend em modo produção"
    echo "  -h, --help  Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0           # Inicia backend e frontend (backend em desenvolvimento)"
    echo "  $0 --prod    # Inicia backend e frontend (backend em produção)"
    echo "  $0 back      # Inicia apenas o backend em desenvolvimento"
    echo "  $0 back --prod # Inicia apenas o backend em produção"
}

# Verifica se há mais de um argumento (não válido)
if [ $# -gt 2 ]; then
    echo "Erro: Muitos argumentos fornecidos."
    echo "Use '$0 --help' para ver as opções disponíveis."
    exit 1
fi

# Parse dos argumentos
PROD_MODE=false
SERVICE=""

for arg in "$@"; do
    case $arg in
        --prod)
            PROD_MODE=true
            ;;
        back|front)
            if [[ -n "$SERVICE" ]]; then
                echo "Erro: Apenas um serviço pode ser especificado."
                exit 1
            fi
            SERVICE="$arg"
            ;;
        *)
            echo "Erro: Argumento inválido '$arg'."
            echo "Use '$0 --help' para ver as opções disponíveis."
            exit 1
            ;;
    esac
done

# Define o ambiente para o backend
if [[ "$PROD_MODE" == true ]]; then
    echo "--- Backend em modo PRODUÇÃO ---"
    export ENV=production
else
    echo "--- Backend em modo DESENVOLVIMENTO ---"
    export ENV=development
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

# Define quais serviços serão iniciados
SERVICES=""
if [[ -z "$SERVICE" ]]; then
    echo "--- Iniciando backend e frontend ---"
    SERVICES=""  # Vazio significa todos os serviços
elif [[ "$SERVICE" == "back" ]]; then
    echo "--- Iniciando apenas o backend ---"
    SERVICES="backend"
elif [[ "$SERVICE" == "front" ]]; then
    echo "--- Iniciando apenas o frontend ---"
    SERVICES="frontend"
fi

echo "--- Construindo e iniciando a aplicação ---"
if [[ -z "$SERVICES" ]]; then
    docker compose up --build
else
    docker compose up --build $SERVICES
fi
