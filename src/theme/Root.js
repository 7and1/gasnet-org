/**
 * Custom Root component for accessibility enhancements.
 * Adds skip links for keyboard navigation and analytics.
 */

import React, { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';
import Root from '@theme-original/Root';
import Analytics from '@site/src/components/Analytics';
import ReadingProgress from '@site/src/components/ReadingProgress';

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
