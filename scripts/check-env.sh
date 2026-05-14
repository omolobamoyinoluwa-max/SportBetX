#!/usr/bin/env bash
# scripts/check-env.sh
# Validates that all required environment variables are set before startup.
# Usage: ./scripts/check-env.sh
# Exit code 1 if any required variable is missing.

set -euo pipefail

REQUIRED_VARS=(
  "NODE_ENV"
  "PORT"
  "DATABASE_URL"
  "REDIS_URL"
  "JWT_SECRET"
  "STELLAR_NETWORK"
  "STELLAR_HORIZON_URL"
  "CORS_ALLOWED_ORIGINS"
)

# In production, these additional vars must also be set
PRODUCTION_VARS=(
  "STELLAR_CONTRACT_ADDRESS"
  "STELLAR_SECRET_KEY"
)

missing=0

for var in "${REQUIRED_VARS[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "ERROR: Required environment variable '$var' is not set." >&2
    missing=1
  fi
done

if [[ "${NODE_ENV:-}" == "production" ]]; then
  for var in "${PRODUCTION_VARS[@]}"; do
    if [[ -z "${!var:-}" ]]; then
      echo "ERROR: Production environment variable '$var' is not set." >&2
      missing=1
    fi
  done

  # Disallow hardcoded fallback JWT secret in production
  if [[ "${JWT_SECRET:-}" == "your-super-secret-jwt-key-change-in-production" ]]; then
    echo "ERROR: JWT_SECRET must be changed from the default value in production." >&2
    missing=1
  fi
fi

if [[ $missing -ne 0 ]]; then
  echo "Startup aborted: fix the missing environment variables above." >&2
  exit 1
fi

echo "Environment check passed."
