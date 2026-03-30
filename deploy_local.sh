#!/bin/bash

set -e

# ------------------------------------------------
# Ensure script runs from project root
# ------------------------------------------------

cd "$(dirname "$0")"

echo "Starting Clairva deployment..."

# ------------------------------------------------
# Activate virtual environment
# ------------------------------------------------

if [ -d ".venv" ]; then
    source .venv/bin/activate
else
    echo "ERROR: .venv not found"
    exit 1
fi

# Ensure Python can find the app module
export PYTHONPATH=$(pwd)

# ------------------------------------------------
# Initialize database
# ------------------------------------------------

echo "Initializing database..."
python3 -m app.scripts.init_database

# ------------------------------------------------
# Stop existing server
# ------------------------------------------------

echo "Stopping existing server..."

pkill -f "uvicorn app.main:app" 2>/dev/null || true

sleep 2

# ------------------------------------------------
# Start API Server
# ------------------------------------------------

echo "Starting Clairva API..."

uvicorn app.main:app \
    --host 0.0.0.0 \
    --port 8000 \
    --workers 4
