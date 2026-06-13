#!/bin/bash
set -euo pipefail

echo "--- Resetting ALCSystem Database to Clean Seed State ---"

DB_CONTAINER="${DB_CONTAINER:-postgres}"
DB_USER="${DB_USER:-user}"
DB_NAME="${DB_NAME:-appdb}"

# 1. Drop and recreate public schema (Extreme but guaranteed cleanup)
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Re-apply the canonical schema and seed data
docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < ./backend/database/schema.sql

echo "--- Database Reset Completed Successfully ---"
