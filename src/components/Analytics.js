/**
 * Privacy-preserving analytics component.
 * Respects Do Not Track (DNT) browser settings.
 */

import { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function Analytics() {
  useEffect(() => {
    // Only run in production and in browser
    if (
      !ExecutionEnvironment.canUseDOM ||
      process.env.NODE_ENV !== 'production' ||
      process.env.ANALYTICS_ENABLED !== 'true'
    ) {
      return;
    }

    // Respect Do Not Track setting
    if (
      navigator.doNotTrack === '1' ||
      window.doNotTrack === '1' ||
      navigator.msDoNotTrack === '1'
    ) {
      // eslint-disable-next-line no-console
      console.info('[Analytics] Disabled due to Do Not Track setting');
      return;
    }

    // Analytics script is already injected via docusaurus.config.js
    // This component can be extended for custom event tracking
    const analyticsEnabled = true;

    // Log for debugging (production builds exclude console.log)
    if (analyticsEnabled) {
      // eslint-disable-next-line no-console
      console.info('[Analytics] Privacy-preserving analytics active');
      // eslint-disable-next-line no-console
      console.info('[Analytics] To opt out, enable Do Not Track in your browser');
    }

    // Optional: Track custom events
    const trackCustomEvent = (eventName, payload) => {
      if (window.umami) {
        window.umami.track(eventName, payload);
      }
    };

    // Example: Track external link clicks
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      link.addEventListener('click', () => {
        trackCustomEvent('external-link', { url: link.href });
      });
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}

/**
 * Helper function to track events manually
 * @param {string} eventName - Name of the event
 * @param {object} payload - Event data
 */
export function trackEvent(eventName, payload = {}) {
  if (
    typeof window !== 'undefined' &&
    window.umami &&
    process.env.ANALYTICS_ENABLED === 'true' &&
    navigator.doNotTrack !== '1'
  ) {
    window.umami.track(eventName, payload);
  }
}
