#!/bin/bash
set -euo pipefail

APP_DIR="${APP_DIR:-/home/academiabaile/AcademiaBaile/AWD-30716-Code-Coffee/06Code}"
APP_PORT="${APP_PORT:-8080}"
RESET_DB="${RESET_DB:-0}"

if [ ! -d "$APP_DIR" ]; then
    echo "Error: Directory $APP_DIR does not exist. Please upload your files via SFTP first."
    exit 1
fi

cd "$APP_DIR"

if command -v docker-compose >/dev/null 2>&1; then
    COMPOSE="docker-compose"
else
    COMPOSE="docker compose"
fi

echo "Building and deploying via Docker Compose..."
sudo $COMPOSE up -d --build

echo "Waiting 10 seconds for Postgres to initialize..."
sleep 10

if [ "$RESET_DB" = "1" ] && [ -f "./cleanup_db.sh" ]; then
    echo "RESET_DB=1 detected. Executing cleanup_db.sh..."
    chmod +x ./cleanup_db.sh
    ./cleanup_db.sh
else
    echo "Skipping database reset. Set RESET_DB=1 only for demo seed resets."
fi

echo "Checking local health endpoint..."
if command -v curl >/dev/null 2>&1; then
    curl --fail --silent --show-error "http://127.0.0.1:${APP_PORT}/api/health" >/dev/null
    echo "Health check passed at http://127.0.0.1:${APP_PORT}/api/health"
else
    echo "curl is not installed; manually verify http://127.0.0.1:${APP_PORT}/api/health"
fi

echo "Deployment successful. Your app is running on port ${APP_PORT}."
