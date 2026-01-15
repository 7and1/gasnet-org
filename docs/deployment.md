# Deployment Guide

This document describes the CI/CD setup and deployment process for the Gasnet.org Docusaurus site.

## GitHub Actions Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on every push and pull request to `main`:

- **Lint**: Runs ESLint and Prettier checks
- **Build**: Builds the site with `npm run build`
- **Test Links**: Validates internal and external markdown links
- **Bundle Size**: Reports bundle size for PRs

### Deploy Workflow (`.github/workflows/deploy.yml`)

Deploys the site to production:

- **Vercel**: Automatic deployment on push to `main`
- **VPS**: Manual deployment via `workflow_dispatch`
- **Preview**: Automatic preview deployments for PRs

### Security Workflow (`.github/workflows/security.yml`)

Runs on PRs and weekly:

- **NPM Audit**: Checks for high/critical vulnerabilities
- **CodeQL**: Static code analysis

## Required GitHub Secrets

For Vercel deployment:

| Secret              | Description                 |
| ------------------- | --------------------------- |
| `VERCEL_TOKEN`      | Vercel authentication token |
| `VERCEL_ORG_ID`     | Vercel organization ID      |
| `VERCEL_PROJECT_ID` | Vercel project ID           |

For VPS deployment:

| Secret            | Description              |
| ----------------- | ------------------------ |
| `VPS_HOST`        | VPS hostname or IP       |
| `VPS_USER`        | SSH username             |
| `VPS_SSH_KEY`     | SSH private key          |
| `VPS_DEPLOY_PATH` | Target directory path    |
| `VPS_URL`         | Site URL for environment |

## Local Deployment Scripts

### Deploy to Vercel

```bash
npm run deploy:vercel
# or for preview
npm run deploy:vercel preview
```

### Deploy to VPS

```bash
export VPS_HOST="your-vps.com"
export VPS_USER="deploy"
export VPS_DEPLOY_PATH="/var/www/gasnet"

npm run deploy:vps
```

### Validate Build

```bash
npm run validate:build
```

## Manual Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

### VPS via rsync

```bash
npm run build
rsync -avz --delete build/ user@host:/path/to/site
```

## Preview Deployments

When you create a pull request, a preview deployment is automatically created. The URL will be posted as a comment on the PR.

## Troubleshooting

### Build failures

- Check that Node.js version is >= 20
- Run `npm run validate:build` locally
- Review build logs in GitHub Actions

### Deployment failures

- Verify all secrets are correctly set
- Ensure Vercel/VPS credentials are valid
- Check network connectivity

### Link validation

```bash
# Check links locally
npm run validate
```
