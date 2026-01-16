import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useColorMode } from '@docusaurus/theme-common';
import Giscus from '@giscus/react';
import ErrorBoundary from './ErrorBoundary';

// Giscus configuration - uses process.env (polyfilled in src/theme/Root.js)
function GiscusComponentInner() {
  const { colorMode } = useColorMode();
  const GISCUS_REPO = process.env.GISCUS_REPO || null;
  const GISCUS_REPO_ID = process.env.GISCUS_REPO_ID || null;
  const GISCUS_CATEGORY = process.env.GISCUS_CATEGORY || 'General';
  const GISCUS_CATEGORY_ID = process.env.GISCUS_CATEGORY_ID || null;

  const isConfigured = GISCUS_REPO && GISCUS_REPO_ID && GISCUS_CATEGORY_ID;

  return (
    <BrowserOnly
      fallback={
        <div aria-live="polite" aria-busy="true">
          Loading comments...
        </div>
      }
    >
      {() =>
        isConfigured ? (
          <div role="region" aria-label="Comments section">
            <Giscus
              repo={GISCUS_REPO}
              repoId={GISCUS_REPO_ID}
              category={GISCUS_CATEGORY}
              categoryId={GISCUS_CATEGORY_ID}
              mapping="pathname"
              reactionsEnabled="1"
              emitMetadata="0"
              inputPosition="bottom"
              theme={colorMode === 'dark' ? 'transparent_dark' : 'light'}
              lang="en"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="alert alert--info" role="status">
            Comments are disabled. Configure Giscus IDs via environment variables (see
            .env.example).
          </div>
        )
      }
    </BrowserOnly>
  );
}

export default function GiscusComponent() {
  return (
    <ErrorBoundary>
      <div className="margin-top--lg">
        <GiscusComponentInner />
      </div>
    </ErrorBoundary>
  );
}
