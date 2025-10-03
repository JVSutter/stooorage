#!/bin/bash

echo "--- WARNING: Starting aggressive Docker environment cleanup ---"

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
