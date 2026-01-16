/**
 * Custom Root component for accessibility enhancements.
 * Adds skip links for keyboard navigation and analytics.
 */

import React from 'react';
import Root from '@theme-original/Root';
import Analytics from '@site/src/components/Analytics';

// Polyfill for process.env in browser environments (Cloudflare Pages compatibility)
if (typeof window === 'undefined') {
  // Server-side - use real process.env
  global.process = { env: {} };
} else {
  // Client-side - polyfill process.env with build-time values
  window.process = window.process || { env: {} };
  window.process.env = window.process.env || {};

  // Set default values (can be overridden by webpack DefinePlugin at build time)
  window.process.env.NODE_ENV = window.process.env.NODE_ENV || 'production';
  window.process.env.ANALYTICS_ENABLED = window.process.env.ANALYTICS_ENABLED || 'false';
  window.process.env.GISCUS_REPO = window.process.env.GISCUS_REPO || '';
  window.process.env.GISCUS_REPO_ID = window.process.env.GISCUS_REPO_ID || '';
  window.process.env.GISCUS_CATEGORY = window.process.env.GISCUS_CATEGORY || 'General';
  window.process.env.GISCUS_CATEGORY_ID = window.process.env.GISCUS_CATEGORY_ID || '';

  // Also define as globals for compatibility
  window.NODE_ENV = window.process.env.NODE_ENV;
  window.ANALYTICS_ENABLED = window.process.env.ANALYTICS_ENABLED;
  window.GISCUS_REPO = window.process.env.GISCUS_REPO;
  window.GISCUS_REPO_ID = window.process.env.GISCUS_REPO_ID;
  window.GISCUS_CATEGORY = window.process.env.GISCUS_CATEGORY;
  window.GISCUS_CATEGORY_ID = window.process.env.GISCUS_CATEGORY_ID;
}

export default function RootWrapper(props) {
  return (
    <>
      {/* Accessibility: Skip to main content link for keyboard users */}
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>
      {/* Privacy-preserving analytics */}
      <Analytics />
      <Root {...props} />
    </>
  );
}
