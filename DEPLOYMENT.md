# Gasnet.org Deployment Guide

This guide covers deploying the Gasnet.org Docusaurus site with security headers configured.

## Deployment Options

- **Cloudflare Pages** (primary) - See below
- **Vercel** - Use `server-configs/vercel.json`
- **Netlify** - Use `server-configs/netlify.toml`
- **nginx/Apache** - Use `server-configs/nginx.conf` or `server-configs/apache-htaccess.conf`

---

## Cloudflare Pages Deployment (Recommended)

### GitHub Actions CI/CD

The repository uses GitHub Actions for automated deployment to Cloudflare Pages.

#### Required GitHub Secrets

Configure these in your repository settings: **Settings > Secrets and variables > Actions**

| Secret                  | Description                           | How to get it                                                                                                    |
| ----------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | API token with Pages edit permissions | Cloudflare Dashboard > My Profile > API Tokens > Create Token > Custom Token > Account > Cloudflare Pages > Edit |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID            | Cloudflare Dashboard > URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/pages/view` or Workers & Pages page        |

#### Optional GitHub Secrets

For enabling Giscus comments:

| Secret               | Description                              |
| -------------------- | ---------------------------------------- |
| `GISCUS_REPO`        | GitHub repository (e.g., `org/repo`)     |
| `GISCUS_REPO_ID`     | Repository ID from https://giscus.app    |
| `GISCUS_CATEGORY`    | Discussion category (default: `General`) |
| `GISCUS_CATEGORY_ID` | Category ID from Giscus                  |

### Setting up Cloudflare

1. **Create a Pages Project** (first time only):

   ```bash
   # Using Wrangler CLI
   npx wrangler pages project create gasnet-org --production-branch=main
   ```

2. **Or set up via Dashboard**:
   - Go to https://dash.cloudflare.com
   - Navigate to Workers & Pages
   - Create application > Pages > Upload assets
   - Project name: `gasnet-org`

3. **Connect GitHub Repository** (optional):
   - In Cloudflare Dashboard > Pages > gasnet-org
   - Go to Settings > Builds & deployments
   - Connect to Git (this allows Cloudflare to auto-deploy on push)

### Deployment Workflow

The `.github/workflows/deploy-cloudflare.yml` workflow handles:

- **Production**: Automatic on push to `main` branch
- **Preview**: Automatic for pull requests
- **Manual**: Via `workflow_dispatch` in GitHub Actions tab

#### Quality Gates (run before deployment)

1. ESLint validation
2. Prettier formatting check
3. Internal link validation
4. Benchmark dataset validation
5. Build verification
6. Bundle size reporting

#### Smoke Tests (run after deployment)

1. Homepage HTTP status check
2. Sitemap availability check

### Local Deployment Script

For local testing or manual deployment:

```bash
# One-time: export your credentials
export CLOUDFLARE_API_TOKEN="your_token_here"
export CLOUDFLARE_ACCOUNT_ID="your_account_id_here"

# Or use .env.local (never commit this file)
cat > .env.local << EOF
CLOUDFLARE_API_TOKEN=your_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
EOF

# Deploy to production
./scripts/deploy-cloudflare.sh production

# Deploy to preview
./scripts/deploy-cloudflare.sh preview
```

### Rollback Procedure

If a deployment causes issues:

1. **Via Cloudflare Dashboard**:
   - Go to Workers & Pages > gasnet-org > Deployments
   - Find the previous working deployment
   - Click "Rollback" or view and promote

2. **Via Wrangler CLI**:

   ```bash
   # List recent deployments
   npx wrangler pages deployment list --project-name=gasnet-org

   # Rollback to a specific deployment (get deployment-id from list above)
   npx wrangler pages deployment rollback --project-name=gasnet-org --deployment-id=<id>
   ```

3. **Via Git Revert**:
   ```bash
   git revert HEAD
   git push origin main
   # GitHub Actions will auto-deploy the revert
   ```

---

## Vercel Deployment

### 1. Repository setup

- Ensure `main` (or your default branch) contains the Docusaurus project.
- Confirm `package.json` scripts include `build` and `start`.
- Commit the latest buildable state.

### 2. Vercel project creation

1. Open Vercel Dashboard -> **Add New Project**.
2. Import your GitHub repository.
3. Framework preset: **Docusaurus** (or "Other").
4. Build Command: `npm run build`.
5. Output Directory: `build`.

### 3. Security headers setup

**IMPORTANT**: Copy `server-configs/vercel.json` to your repository root before deploying.

This file configures:

- Content-Security-Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security

### 4. Environment variables

Set these in Vercel Project Settings:

| Variable             | Description                                  |
| -------------------- | -------------------------------------------- |
| `GISCUS_REPO`        | GitHub repository (e.g., `org/repo`)         |
| `GISCUS_REPO_ID`     | Giscus repository ID from https://giscus.app |
| `GISCUS_CATEGORY`    | Discussion category (default: `General`)     |
| `GISCUS_CATEGORY_ID` | Giscus category ID                           |

### 5. Domain configuration

1. Go to **Project -> Settings -> Domains**.
2. Add `gasnet.org` and `www.gasnet.org`.
3. Update DNS:
   - Apex: add A record (Vercel-provided).
   - `www`: add CNAME to `cname.vercel-dns.com`.
4. Wait for SSL to provision.

---

## Post-Deployment Validation

After any deployment, verify:

```bash
# Check site loads
curl -I https://gasnet.org

# Check sitemap
curl -I https://gasnet.org/sitemap.xml

# Check specific doc page
curl -I https://gasnet.org/docs/getting-started/intro
```

### Manual Checklist

- [ ] Homepage loads with styles
- [ ] `/docs/getting-started/intro` is reachable
- [ ] `/docs/features-demo` renders Mermaid, KaTeX, Chart.js
- [ ] Search works from the navbar
- [ ] Giscus loads at the bottom of docs (if configured)
- [ ] Security headers are present

---

## Security Headers Verification

After deployment, verify security headers using:

```bash
curl -I https://gasnet.org
```

Expected headers:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`

---

## Environment Variables Reference

### Giscus Comments

| Variable             | Required | Default   | Description                          |
| -------------------- | -------- | --------- | ------------------------------------ |
| `GISCUS_REPO`        | Yes      | -         | GitHub repository (e.g., `org/repo`) |
| `GISCUS_REPO_ID`     | Yes      | -         | Repository ID from giscus.app        |
| `GISCUS_CATEGORY`    | No       | `General` | Discussion category name             |
| `GISCUS_CATEGORY_ID` | No       | -         | Category ID from giscus.app          |

### Cloudflare Pages

| Variable                | Required | Description                           |
| ----------------------- | -------- | ------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Yes      | API token with Pages edit permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Yes      | Your Cloudflare account ID            |
