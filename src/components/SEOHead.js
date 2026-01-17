/**
 * SEO Head Component
 * Adds page-specific schema markup and meta tags
 * Can be used in individual docs or as a wrapper
 */

import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  createBreadcrumbSchema,
  createFAQSchema,
  createHowToSchema,
  createCaseStudySchema,
} from '@site/src/utils/schema';

/**
 * Add breadcrumb schema to head
 */
export function BreadcrumbSchema({ breadcrumbs }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createBreadcrumbSchema(breadcrumbs)),
        }}
      />
    </Head>
  );
}

/**
 * Add FAQ schema to head
 */
export function FAQSchema({ faqs }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createFAQSchema(faqs)),
        }}
      />
    </Head>
  );
}

/**
 * Add HowTo schema to head
 */
export function HowToSchema({ howTo }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createHowToSchema(howTo)),
        }}
      />
    </Head>
  );
}

/**
 * Add CaseStudy schema to head
 */
export function CaseStudySchema({ caseStudy }) {
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(createCaseStudySchema(caseStudy)),
        }}
      />
    </Head>
  );
}

/**
 * Generic SEO head component with canonical URL and additional meta tags
 */
export function SEOHead({
  title: _title,
  description: _description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleSection,
}) {
  const { siteConfig } = useDocusaurusContext();
  const canonical = canonicalUrl || `${siteConfig.url}${siteConfig.baseUrl}`;

  return (
    <Head>
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Additional keywords if provided */}
      {keywords && (
        <meta
          name="keywords"
          content={typeof keywords === 'string' ? keywords : keywords.join(', ')}
        />
      )}

      {/* Open Graph type override */}
      {ogType && <meta property="og:type" content={ogType} />}

      {/* OG Image override */}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Article-specific meta tags */}
      {articlePublishedTime && (
        <meta name="article:published_time" content={articlePublishedTime} />
      )}
      {articleModifiedTime && <meta name="article:modified_time" content={articleModifiedTime} />}
      {articleAuthor && <meta name="article:author" content={articleAuthor} />}
      {articleSection && <meta name="article:section" content={articleSection} />}
    </Head>
  );
}

export default SEOHead;
