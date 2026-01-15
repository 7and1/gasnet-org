# Security Documentation

This document outlines the security measures implemented for the Gasnet.org Docusaurus site.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Required variables:

| Variable             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `GISCUS_REPO`        | GitHub repository for comments (e.g., `org/repo`) |
| `GISCUS_REPO_ID`     | Giscus repository ID from https://giscus.app      |
| `GISCUS_CATEGORY`    | Discussion category name (default: `General`)     |
| `GISCUS_CATEGORY_ID` | Giscus category ID                                |

## Security Headers

The following security headers are configured via `docusaurus.config.js`:

### Content Security Policy (CSP)

```javascript
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net https://giscus.app; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https://giscus.app; frame-src https://giscus.app;
```

### Additional Headers

| Header                   | Value                             | Purpose                       |
| ------------------------ | --------------------------------- | ----------------------------- |
| `X-Content-Type-Options` | `nosniff`                         | Prevents MIME type sniffing   |
| `X-Frame-Options`        | `DENY`                            | Prevents clickjacking         |
| `Referrer-Policy`        | `strict-origin-when-cross-origin` | Controls referrer information |
| `Permissions-Policy`     | See below                         | Restricts browser features    |

### Permissions Policy

```javascript
geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()
```

## Subresource Integrity (SRI)

External resources use SRI hashes:

- **KaTeX CSS**: `sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM`

## Dependency Security

### Audit Scripts

```bash
npm run audit       # Check for vulnerabilities
npm run audit:fix   # Auto-fix vulnerabilities where possible
```

### Automated Updates

Dependabot is configured to:

- Check for updates weekly (Mondays)
- Group Docusaurus dependencies separately
- Group production dependencies
- Limit to 10 open PRs

### Security Review Process

1. **Before Deployment**: Run `npm audit` to check for vulnerabilities
2. **Monthly**: Review Dependabot alerts and PRs
3. **After Updates**: Test site functionality after dependency updates
4. **Critical Vulnerabilities**: Patch immediately and redeploy

## Client-Side Security

- All client-side components wrapped in `BrowserOnly` to prevent SSR issues
- Environment variables not exposed to client (server-side only)
- No inline event handlers in markdown files
- Data fetching uses relative URLs with proper error handling

## Deployment Security

1. **Environment Variables**: Set in hosting platform (Vercel/Netlify), never commit
2. **Build Artifacts**: `.gitignore` prevents committing `build/` directory
3. **API Keys**: Never stored in code, use environment variables
4. **HTTPS Only**: Site enforces HTTPS in production

## Best Practices

1. Keep dependencies updated via Dependabot
2. Review security advisories for used packages
3. Use `npm audit` regularly
4. Never commit `.env` files
5. Review third-party scripts before adding
6. Enable security headers on hosting platform
