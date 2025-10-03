# Stooorage

## O que é o Stooorage?

Stooorage é uma plataforma de controle de estoque desenvolvida para o Hackathon da SECCOM 2025. Ela não só permite o gerenciamento eficiente de produtos, mas vai muito além, proporcionando ferramentas para análise de dados, previsão de demanda e otimização de inventário.

## Funcionalidades Principais

- **Gerenciamento de Produtos**: Adicione, edite e remova produtos do seu estoque
- **Análise de Dados**: Visualize gráficos e relatórios detalhados sobre o desempenho do seu estoque
- **Previsão de Demanda**: Descubra as tendências de consumo com a análise do assistente de IA

## Tecnologias Utilizadas

- **Conteinerização**: Docker
- **Frontend**: React
- **Backend**: FastAPI
- **Banco de Dados**: PostgreSQL

## Como executar aplicação
Pré-requisitos:
- Docker e Docker Compose instalados
- Portas 8000 (backend) e 5173 (frontend) livres

Opção 1: usando o script
```sh
chmod +x start.sh
./start.sh          # Sobe backend e frontend
./start.sh back     # Apenas backend
./start.sh front    # Apenas frontend
```

Opção 2: usando Docker Compose diretamente
```sh
docker compose up --build
# ou
docker compose up --build backend
docker compose up --build frontend
```

Acessos:
- Backend (FastAPI): http://localhost:8000
- Documentação Swagger/OpenAPI: http://localhost:8000/docs
- Frontend (Vite/React): http://localhost:5173


Notas:
- O backend inicializa e popula o banco automaticamente a partir de [backend/database/schema.sql](backend/database/schema.sql) e [backend/database/sales_transaction.csv](backend/database/sales_transaction.csv) durante o startup em [backend/app/main.py](backend/app/main.py).
- Arquivos úteis: [start.sh](start.sh), [docker-compose.yml](docker-compose.yml).

