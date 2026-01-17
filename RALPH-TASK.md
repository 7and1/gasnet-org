# Task: Deploy Gasnet.org to Cloudflare Pages Production

## Goal

Deploy the current main branch of Gasnet.org to Cloudflare Pages production environment with zero downtime and all assets properly served. Pre-deployment check confirms Cloudflare production environment is healthy.

## Requirements

- [ ] Verify `build/` directory exists and contains valid built assets
- [ ] Run `npm run build` and ensure no build errors or warnings
- [ ] Verify Cloudflare API credentials are configured (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)
- [ ] Deploy to Cloudflare Pages using Wrangler CLI to project `gasnet-org`
- [ ] Verify deployment succeeded (no errors in wrangler output)
- [ ] Confirm site is accessible at https://gasnet.org
- [ ] Run basic smoke tests: homepage loads, key pages (docs, labs) return 200
- [ ] Verify analytics scripts are loaded (if ANALYTICS_ENABLED)

## Success Criteria

- Build completes successfully with exit code 0
- Wrangler deployment reports "Published" or similar success message
- https://gasnet.org returns 200 status
- Key pages (/docs, /labs, /community) are accessible
- No console errors on homepage
- Git commit deployed matches current HEAD

## Process

1. Check current git status and note HEAD commit
2. Run `npm run build` - if fails, fix build errors before proceeding
3. Run `npm run lint` - if fails, fix lint errors before proceeding
4. Deploy using: `wrangler pages deploy build --project-name=gasnet-org --branch=main`
5. Wait for deployment completion (check for success message)
6. Smoke test production URL: `curl -s -o /dev/null -w "%{http_code}" https://gasnet.org`
7. Test key endpoints: /docs, /labs, /community
8. Verify deployment in Cloudflare Dashboard if needed

## Stuck Protocol

After 3 failed deployment attempts:

- Check CLOUDFLARE_API_TOKEN validity and permissions
- Verify CLOUDFLARE_ACCOUNT_ID matches the correct account
- Ensure `build/` directory exists and contains index.html
- Check Cloudflare Pages status page for outages
- Try `wrangler pages deploy --verbose` for detailed error output
- Fall back: Trigger GitHub Actions workflow manually via `gh workflow run`

## Important Notes

- Production environment is confirmed healthy (pre-check passed)
- Project name: `gasnet-org`
- Build output directory: `build/`
- Branch: `main`
- Do NOT proceed if build or lint fails - fix first

<promise>DONE</promise>
