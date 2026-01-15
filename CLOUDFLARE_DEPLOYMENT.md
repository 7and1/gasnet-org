# Cloudflare Pages Deployment Guide

## Quick Start

```bash
# Build the site
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy build --project-name=gasnet-org
```

## URLs

- **Preview**: https://f565d7aa.gasnet-org.pages.dev
- **Production**: https://gasnet-org.pages.dev (after first deployment)
- **Custom Domain**: gasnet.org (needs DNS configuration)

## GitHub Actions CI/CD

The site is automatically deployed to Cloudflare Pages on push to `main` branch.

### Required GitHub Secrets

| Secret                  | Description                | How to Get                                                 |
| ----------------------- | -------------------------- | ---------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API Token       | https://dash.cloudflare.com/profile/api-tokens             |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | https://dash.cloudflare.com -> Workers & Pages -> Overview |

### API Token Permissions

Required scopes:

- Account > Cloudflare Pages > Edit
- Account > Account Settings > Read

## Custom Domain Setup

1. Go to https://dash.cloudflare.com
2. Navigate to Workers & Pages > gasnet-org
3. Click "Custom domains"
4. Add `gasnet.org` and `www.gasnet.org`
5. Update DNS records:

```
Type: CNAME
Name: gasnet.org (or www)
Target: gasnet-org.pages.dev
Proxy: On (orange cloud)
```

## Local Development

```bash
npm install
npm run start  # http://localhost:3000
```

## Environment Variables

For local development with analytics or comments:

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**Never commit `.env` or `.env.local` files.**
