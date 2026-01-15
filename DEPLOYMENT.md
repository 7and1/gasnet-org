# Gasnet.org Deployment Guide

This guide covers deploying the Gasnet.org Docusaurus site with security headers configured.

## Deployment Options

- **Vercel** (recommended) - See below
- **Netlify** - Use `server-configs/netlify.toml`
- **nginx/Apache** - Use `server-configs/nginx.conf` or `server-configs/apache-htaccess.conf`

## Vercel Deployment Checklist

### 1. Repository setup

- Ensure `main` (or your default branch) contains the Docusaurus project.
- Confirm `package.json` scripts include `build` and `start`.
- Commit the latest buildable state.

## 2. Vercel project creation

1. Open Vercel Dashboard → **Add New Project**.
2. Import your GitHub repository.
3. Framework preset: **Docusaurus** (or “Other”).
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

1. Go to **Project → Settings → Domains**.
2. Add `gasnet.org` and `www.gasnet.org`.
3. Update DNS:
   - Apex: add A record (Vercel-provided).
   - `www`: add CNAME to `cname.vercel-dns.com`.
4. Wait for SSL to provision.

## 5. Sitemap verification

- After deploy, confirm `https://gasnet.org/sitemap.xml` loads.
- Submit the sitemap URL in Google Search Console.

## 6. Post-deploy validation

- `/` homepage loads with styles.
- `/docs/getting-started/intro` is reachable.
- `/docs/features-demo` renders Mermaid, KaTeX, Chart.js.
- Search works from the navbar.
- Giscus loads at the bottom of docs (once IDs are wired).
- Security headers are present (check browser DevTools Network tab).

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
