# Analytics Configuration

This document describes the analytics setup for Gasnet.org and how to manage it.

## Overview

Gasnet.org uses **Umami Analytics** - a privacy-focused, open-source analytics platform.

### Why Umami?

- **Self-hosted**: Data stays on our own servers
- **GDPR/CCPA compliant**: No personal data collection
- **No cookies**: Uses local storage only
- **Open source**: Fully auditable code
- **Lightweight**: Minimal performance impact

## Configuration

Analytics behavior is controlled via environment variables in `.env.local`:

```bash
# Enable analytics in production
ANALYTICS_ENABLED=true

# Your Umami website ID (from Umami dashboard)
ANALYTICS_WEBSITE_ID=your-website-id-here

# Umami instance URL (default: self-hosted)
ANALYTICS_HOST=https://analytics.gasnet.org
```

## Development vs Production

- **Development**: Analytics is **always disabled**, regardless of settings
- **Production**: Analytics enabled only when `ANALYTICS_ENABLED=true`

## Setting Up Umami

### Self-Hosted Installation

For full control, self-host Umami on your own infrastructure:

```bash
# Clone Umami repository
git clone https://github.com/umami-software/umami.git
cd umami

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database settings

# Build and start
npm build
npm start
```

### Creating a Website

1. Access your Umami dashboard at your configured host
2. Click "Settings" > "Websites" > "Add website"
3. Enter details:
   - Name: `Gasnet.org`
   - Domain: `gasnet.org`
4. Copy the generated Website ID to your `.env.local`

## Search Analytics

The local search plugin (`@easyops-cn/docusaurus-search-local`) runs entirely client-side:

- **No server-side logging** of search queries
- **No data transmission** to external servers
- **Offline capable**: Search index built at build time

### Tracking Content Gaps

To understand what users are searching for, consider:

1. **User Feedback**: Add a "Did you find what you were looking for?" option
2. **Issue Template**: Create a GitHub issue template for content requests
3. **Search Events** (optional): Custom event tracking for failed searches

## Privacy Compliance

### GDPR Compliance

- No personal data collection
- No cross-site tracking
- Data stored on own servers
- 90-day data retention
- Users can opt-out via DNT

### Do Not Track Support

The analytics script respects browser DNT settings:

```javascript
// Automatic DNT detection built into Umami
if (navigator.doNotTrack === '1') {
  // Analytics disabled automatically
}
```

## Viewing Analytics

Access your analytics dashboard at `https://analytics.gasnet.org` (or your configured host).

### Key Metrics

- **Pageviews**: Total page visits
- **Unique Visitors**: Approximate unique visits
- **Bounce Rate**: Single-page sessions
- **Referrers**: Where traffic comes from
- **Pages**: Most viewed content
- **Locations**: Country-level data

## Troubleshooting

### Analytics Not Recording

1. Check `ANALYTICS_ENABLED=true` in production
2. Verify `ANALYTICS_WEBSITE_ID` is correct
3. Check browser console for script loading errors
4. Confirm analytics host is accessible

### Local Development

Analytics is intentionally disabled in development. To test:

```bash
# Force enable for testing (not recommended for commits)
NODE_ENV=production ANALYTICS_ENABLED=true npm start
```

## Disabling Analytics

To completely disable analytics:

```bash
# In .env.local
ANALYTICS_ENABLED=false
```

Or simply unset the environment variables - analytics defaults to off.

## Alternative: Simple Page Counter

If you prefer an even simpler approach, consider:

- **GoatCounter**: Privacy-focused alternative to Umami
- **Cloudflare Web Analytics**: Privacy-focused, no JavaScript required
- **No analytics**: Remove entirely - rely on server logs for basic metrics

## Resources

- [Umami Documentation](https://umami.is/docs)
- [GDPR Compliance Guide](https://umami.is/docs/gdpr-compliance)
- [Privacy Policy](/docs/operations/privacy)
