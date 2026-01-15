#!/bin/bash
set -e

# Deploy to Vercel
# Usage: ./scripts/deploy-vercel.sh [prod|preview]

ENV=${1:-prod}

echo "Deploying to Vercel (environment: $ENV)..."

if [ "$ENV" = "prod" ]; then
  vercel --prod
else
  vercel
fi

echo "Deployment complete!"
