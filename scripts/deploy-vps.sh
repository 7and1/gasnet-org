#!/bin/bash
set -e

# Deploy to VPS via rsync
# Usage: ./scripts/deploy-vps.sh
#
# Required environment variables:
#   VPS_HOST - VPS hostname
#   VPS_USER - SSH user
#   VPS_DEPLOY_PATH - Target directory on VPS
#   VPS_SSH_KEY - Path to SSH private key (optional, defaults to ~/.ssh/id_rsa)

if [ -z "$VPS_HOST" ] || [ -z "$VPS_USER" ] || [ -z "$VPS_DEPLOY_PATH" ]; then
  echo "Error: Required environment variables not set."
  echo "Required: VPS_HOST, VPS_USER, VPS_DEPLOY_PATH"
  exit 1
fi

SSH_KEY="${VPS_SSH_KEY:-$HOME/.ssh/id_rsa}"

echo "Building site..."
npm run build

echo "Deploying to VPS: $VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH"

rsync -avz --delete \
  -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
  build/ \
  "$VPS_USER@$VPS_HOST:$VPS_DEPLOY_PATH"

echo "Deployment complete!"
