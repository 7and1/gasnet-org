/**
 * Custom Root component for accessibility enhancements.
 * Adds skip links for keyboard navigation and analytics.
 */

import React from 'react';
import Root from '@theme-original/Root';
import Analytics from '@site/src/components/Analytics';

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
