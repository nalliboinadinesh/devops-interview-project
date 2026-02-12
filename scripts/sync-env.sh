#!/usr/bin/env bash
# Sync root .env into backend/.env and frontend .env.local files
# Usage: ./scripts/sync-env.sh

set -euo pipefail
ROOT_ENV="$(pwd)/.env"
if [ ! -f "$ROOT_ENV" ]; then
  echo ".env file not found at project root. Create one from .env.example first." >&2
  exit 1
fi

echo "Syncing $ROOT_ENV -> backend/.env"
cp "$ROOT_ENV" backend/.env

echo "Syncing $ROOT_ENV -> admin-app/.env.local"
cp "$ROOT_ENV" admin-app/.env.local

echo "Syncing $ROOT_ENV -> user-app/.env.local"
cp "$ROOT_ENV" user-app/.env.local

echo "Done. Remember: frontends only read REACT_APP_* variables. Run a rebuild if needed."
