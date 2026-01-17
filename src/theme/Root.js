/**
 * Custom Root component for accessibility enhancements.
 * Adds skip links for keyboard navigation and analytics.
 */

import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import Root from '@theme-original/Root';
import Analytics from '@site/src/components/Analytics';
import ReadingProgress from '@site/src/components/ReadingProgress';

// Build-time environment constants (injected by webpack DefinePlugin)
// These are replaced at build time - no runtime values are exposed
// Use typeof check on global scope to avoid TDZ errors
const _ANALYTICS_ENABLED =
  typeof globalThis.ANALYTICS_ENABLED !== 'undefined' ? globalThis.ANALYTICS_ENABLED : 'false';
const _GISCUS_REPO = typeof globalThis.GISCUS_REPO !== 'undefined' ? globalThis.GISCUS_REPO : '';
const _GISCUS_REPO_ID =
  typeof globalThis.GISCUS_REPO_ID !== 'undefined' ? globalThis.GISCUS_REPO_ID : '';
const _GISCUS_CATEGORY =
  typeof globalThis.GISCUS_CATEGORY !== 'undefined' ? globalThis.GISCUS_CATEGORY : 'General';
const _GISCUS_CATEGORY_ID =
  typeof globalThis.GISCUS_CATEGORY_ID !== 'undefined' ? globalThis.GISCUS_CATEGORY_ID : '';

// Polyfill for process.env in browser environments (Cloudflare Pages compatibility)
if (typeof window === 'undefined') {
  // Server-side - use real process.env
  global.process = { env: {} };
} else {
  // Client-side - polyfill process.env with build-time values only
  // Security: No runtime defaults that expose patterns
  window.process = window.process || { env: {} };
  window.process.env = window.process.env || {};

  // Only set values if they exist (build-time injection)
  // Empty strings mean "not configured", not defaults
  if (_ANALYTICS_ENABLED) window.process.env.ANALYTICS_ENABLED = _ANALYTICS_ENABLED;
  if (_GISCUS_REPO) window.process.env.GISCUS_REPO = _GISCUS_REPO;
  if (_GISCUS_REPO_ID) window.process.env.GISCUS_REPO_ID = _GISCUS_REPO_ID;
  if (_GISCUS_CATEGORY) window.process.env.GISCUS_CATEGORY = _GISCUS_CATEGORY;
  if (_GISCUS_CATEGORY_ID) window.process.env.GISCUS_CATEGORY_ID = _GISCUS_CATEGORY_ID;

  // Also define as globals for compatibility (build-time only)
  if (typeof window.ANALYTICS_ENABLED === 'undefined')
    window.ANALYTICS_ENABLED = _ANALYTICS_ENABLED;
  if (typeof window.GISCUS_REPO === 'undefined') window.GISCUS_REPO = _GISCUS_REPO;
  if (typeof window.GISCUS_REPO_ID === 'undefined') window.GISCUS_REPO_ID = _GISCUS_REPO_ID;
  if (typeof window.GISCUS_CATEGORY === 'undefined') window.GISCUS_CATEGORY = _GISCUS_CATEGORY;
  if (typeof window.GISCUS_CATEGORY_ID === 'undefined')
    window.GISCUS_CATEGORY_ID = _GISCUS_CATEGORY_ID;
}

export default function RootWrapper(props) {
  const history = useHistory();

  useEffect(() => {
    const isEditableTarget = target => {
      if (!target) return false;
      const tagName = target.tagName;
      return (
        target.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT'
      );
    };

    const focusSearch = () => {
      const searchInput =
        document.querySelector('input[type="search"]') ||
        document.querySelector('.navbar__search input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
        return true;
      }
      return false;
    };

    const handler = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        if (isEditableTarget(event.target)) return;
        event.preventDefault();
        if (!focusSearch()) {
          history.push('/search');
        }
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        if (isEditableTarget(event.target)) return;
        const selector =
          event.key === 'ArrowLeft' ? '.pagination-nav__link--prev' : '.pagination-nav__link--next';
        const link = document.querySelector(selector);
        if (link) {
          event.preventDefault();
          link.click();
        }
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [history]);

  return (
    <>
      {/* Accessibility: Skip to main content link for keyboard users */}
      <a href="#main" className="skip-to-content">
        Skip to main content
      </a>
      <ReadingProgress />
      {/* Privacy-preserving analytics */}
      <Analytics />
      <Root {...props} />
    </>
  );
}
