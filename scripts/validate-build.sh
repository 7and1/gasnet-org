#!/bin/bash
set -e

# Pre-build validation script
# Usage: ./scripts/validate-build.sh

echo "Running pre-build validation..."

echo "Checking for Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "Error: Node.js 20 or higher required. Current: $(node -v)"
  exit 1
fi

echo "Running ESLint..."
npm run lint

echo "Checking Prettier formatting..."
npm run format:check

echo "Validating markdown links..."
find . -name "*.md" -not -path "./node_modules/*" -not -path "./build/*" | \
  xargs -n1 npx markdown-link-check -q || true

echo "Building site for validation..."
npm run build

echo "Checking build output..."
if [ ! -d "build" ]; then
  echo "Error: Build directory not found"
  exit 1
fi

echo "Build validation passed!"
