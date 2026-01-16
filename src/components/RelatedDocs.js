import React, { useMemo } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import { useAllDocsData, useDoc } from '@docusaurus/plugin-content-docs/client';

const FALLBACK_MAP = {
  '/docs/architecture/overview': [
    { title: 'Transport Layers', path: '/docs/architecture/transport-layers' },
    { title: 'Getting Started', path: '/docs/getting-started/intro' },
  ],
  '/docs/programming-model/communication-primitives': [
    { title: 'API Reference', path: '/docs/programming-model/api-reference' },
    { title: 'Microbenchmarks', path: '/docs/benchmarks/microbenchmarks' },
  ],
};

function buildDocMap(allDocsData) {
  const defaultPlugin = allDocsData?.default;
  if (!defaultPlugin?.versions) {
    return new Map();
  }

  const map = new Map();
  defaultPlugin.versions.forEach(version => {
    version.docs.forEach(doc => {
      map.set(doc.permalink, doc.title);
    });
  });

  return map;
}

export default function RelatedDocs() {
  const { metadata } = useDoc();
  const location = useLocation();
  const allDocsData = useAllDocsData();

  const docMap = useMemo(() => buildDocMap(allDocsData), [allDocsData]);

  const frontMatterRelated = metadata.frontMatter?.related || [];
  const fallbackRelated = FALLBACK_MAP[location.pathname] || [];

  const related = frontMatterRelated.length ? frontMatterRelated : fallbackRelated;

  if (!related.length) {
    return null;
  }

  const normalized = related
    .map(item => {
      if (typeof item === 'string') {
        return { path: item, title: docMap.get(item) };
      }
      return {
        path: item.path,
        title: item.title || docMap.get(item.path),
      };
    })
    .filter(item => item.path);

  if (!normalized.length) {
    return null;
  }

  return (
    <div className="related-docs">
      <h4>Related Documentation</h4>
      <ul>
        {normalized.map(doc => (
          <li key={doc.path}>
            <Link to={doc.path}>{doc.title || doc.path}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
