#!/bin/bash
set -e

################################################################################
# Cloudflare Pages Deployment Script
################################################################################
#
# Usage:
#   ./scripts/deploy-cloudflare.sh [production|preview]
#
# Environment Variables (REQUIRED):
#   CLOUDFLARE_API_TOKEN - Your Cloudflare API token
#   CLOUDFLARE_ACCOUNT_ID - Your Cloudflare account ID
#
# Optional Environment Variables:
#   GISCUS_REPO - GitHub repository for comments
#   GISCUS_REPO_ID - Giscus repository ID
#   GISCUS_CATEGORY - Discussion category (default: General)
#   GISCUS_CATEGORY_ID - Giscus category ID
#
################################################################################

ENV=${1:-production}
PROJECT_NAME="gasnet-org"

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate required environment variables
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    log_error "CLOUDFLARE_API_TOKEN environment variable is required"
    echo ""
    echo "Set it with:"
    echo "  export CLOUDFLARE_API_TOKEN=your_token_here"
    echo ""
    echo "Or create a .env.local file with:"
    echo "  CLOUDFLARE_API_TOKEN=your_token_here"
    echo "  CLOUDFLARE_ACCOUNT_ID=your_account_id"
    exit 1
fi

if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    log_error "CLOUDFLARE_ACCOUNT_ID environment variable is required"
    echo ""
    echo "Set it with:"
    echo "  export CLOUDFLARE_ACCOUNT_ID=your_account_id"
    exit 1
fi

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    log_info "Installing Wrangler CLI..."
    npm install -g wrangler
fi

# Set branch name based on environment
if [ "$ENV" = "production" ]; then
    BRANCH="main"
    log_info "Deploying to PRODUCTION (branch: main)"
else
    BRANCH="preview-$(date +%s)"
    log_info "Deploying to PREVIEW (branch: $BRANCH)"
fi

# Run pre-deployment validation
log_info "Running pre-deployment validation..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    log_error "Node.js 20 or higher required. Current: $(node -v)"
    exit 1
fi

# Lint check
log_info "Running ESLint..."
npm run lint

# Format check
log_info "Checking code formatting..."
npm run format:check

# Link validation
log_info "Validating internal links..."
npm run validate || true

# Benchmark validation
log_info "Validating benchmark datasets..."
npm run validate:benchmarks

# Build the site
log_info "Building site..."
GISCUS_REPO="${GISCUS_REPO:-}" \
GISCUS_REPO_ID="${GISCUS_REPO_ID:-}" \
GISCUS_CATEGORY="${GISCUS_CATEGORY:-General}" \
GISCUS_CATEGORY_ID="${GISCUS_CATEGORY_ID:-}" \
npm run build

if [ ! -d "build" ]; then
    log_error "Build directory not found after build"
    exit 1
fi

# Deploy to Cloudflare Pages
log_info "Deploying to Cloudflare Pages..."
log_info "Project: $PROJECT_NAME"
log_info "Branch: $BRANCH"

DEPLOY_OUTPUT=$(wrangler pages deploy build \
    --project-name="$PROJECT_NAME" \
    --branch="$BRANCH" \
    2>&1)

echo "$DEPLOY_OUTPUT"

# Extract deployment URL
DEPLOY_URL=$(echo "$DEPLOY_OUTPUT" | grep -oP 'https://[a-zA-Z0-9.-]*\.pages\.dev/[a-zA-Z0-9.-]*' | head -1)

if [ -n "$DEPLOY_URL" ]; then
    log_info "Deployment successful!"
    echo ""
    echo "Deployment URL: $DEPLOY_URL"
    echo ""

    # Run smoke tests
    log_info "Running smoke tests..."
    sleep 3

    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" || echo "000")
    if [ "$HTTP_STATUS" = "200" ]; then
        log_info "Homepage smoke test passed (200 OK)"
    else
        log_warn "Homepage returned status $HTTP_STATUS"
    fi

    SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/sitemap.xml" || echo "000")
    if [ "$SITEMAP_STATUS" = "200" ]; then
        log_info "Sitemap smoke test passed (200 OK)"
    else
        log_warn "Sitemap returned status $SITEMAP_STATUS"
    fi
else
    log_warn "Could not extract deployment URL from output"
fi

log_info "Deployment complete!"
