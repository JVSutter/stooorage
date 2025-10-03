#!/bin/bash

# Function to display help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo "Starts application services using Docker Compose"
    echo ""
    echo "Options:"
    echo "  back      Starts only the backend"
    echo "  front     Starts only the frontend"
    echo "  (none)    Starts backend and frontend (default)"
    echo "  -h, --help  Shows this help"
    echo ""
    echo "Examples:"
    echo "  $0           # Starts backend and frontend"
    echo "  $0 back      # Starts only the backend"
    echo "  $0 front     # Starts only the frontend"
}

# Check if help was requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Validate arguments
if [[ $# -gt 1 ]]; then
    echo "Error: Too many arguments provided."
    echo "Use '$0 --help' to see available options."
    exit 1
fi

if [[ $# -eq 1 && "$1" != "back" && "$1" != "front" ]]; then
    echo "Error: Invalid argument '$1'."
    echo "Use '$0 --help' to see available options."
    exit 1
fi

# Define which services will be started
SERVICES=""
if [[ $# -eq 0 ]]; then
    echo "--- Starting backend and frontend ---"
    SERVICES=""  # Empty means all services
elif [[ "$1" == "back" ]]; then
    echo "--- Starting only the backend ---"
    SERVICES="backend"
elif [[ "$1" == "front" ]]; then
    echo "--- Starting only the frontend ---"
    SERVICES="frontend"
fi

echo "--- WARNING: Starting radical cleanup of Docker environment ---"

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

# Start services based on arguments
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