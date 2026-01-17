/**
 * Schema.org markup utilities for SEO
 * Generates structured data for various content types
 */

const SITE_URL = 'https://gasnet.org';

/**
 * Generate BreadcrumbList schema for page hierarchy
 * @param {Array} breadcrumbs - Array of {name, url} objects
 * @returns {Object} BreadcrumbList structured data
 */
export function createBreadcrumbSchema(breadcrumbs) {
  const itemListElement = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: `${SITE_URL}${crumb.url}`,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Generate FAQPage schema for FAQ content
 * @param {Array} faqs - Array of {question, answer} objects
 * @returns {Object} FAQPage structured data
 */
export function createFAQSchema(faqs) {
  const mainEntity = faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity,
  };
}

/**
 * Generate HowTo schema for tutorial content
 * @param {Object} howTo - HowTo data
 * @returns {Object} HowTo structured data
 */
export function createHowToSchema({ name, description, steps, estimatedTime, tool = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    estimatedTime: estimatedTime
      ? {
          '@type': 'Duration',
          text: estimatedTime,
        }
      : undefined,
    tool: tool.length > 0 ? tool : undefined,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Generate CaseStudy schema for case study content
 * @param {Object} caseStudy - Case study data
 * @returns {Object} CaseStudy structured data
 */
export function createCaseStudySchema({
  name,
  description,
  about,
  author,
  datePublished,
  dateModified,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CaseStudy',
    name,
    text: description,
    about: {
      '@type': 'Thing',
      name: about || 'High-Performance Computing',
    },
    author: {
      '@type': author?.type || 'Organization',
      name: author?.name || 'GASNet Team',
      url: author?.url || SITE_URL,
    },
    datePublished: datePublished || new Date().toISOString().split('T')[0],
    dateModified: dateModified || new Date().toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'GASNet Team',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/img/gasnet-logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': SITE_URL,
    },
  };
}

/**
 * Generate TechArticle schema for technical documentation
 * @param {Object} article - Article data
 * @returns {Object} TechArticle structured data
 */
export function createTechArticleSchema({
  headline,
  description,
  author,
  datePublished,
  dateModified,
  url,
  keywords = [],
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    author: {
      '@type': author?.type || 'Organization',
      name: author?.name || 'GASNet Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GASNet Team',
      url: SITE_URL,
    },
    datePublished: datePublished || '2026-01-01',
    dateModified: dateModified || new Date().toISOString().split('T')[0],
    url: `${SITE_URL}${url}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`,
    },
    inLanguage: 'en',
    keywords: keywords.join(', '),
  };
}

/**
 * Generate SoftwareSourceCode schema for API reference pages
 * @param {Object} code - Code documentation data
 * @returns {Object} SoftwareSourceCode structured data
 */
export function createAPISchema({ name, description, programmingLanguage, codeSample }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name,
    description,
    programmingLanguage: programmingLanguage || 'C',
    codeSampleType: 'code snippet',
    sampleType: 'full code',
    text: codeSample,
    runtime: 'GASNet-EX',
    author: {
      '@type': 'Organization',
      name: 'GASNet Team',
    },
  };
}

/**
 * Generate Organization schema
 * @returns {Object} Organization structured data
 */
export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GASNet Team',
    url: SITE_URL,
    logo: `${SITE_URL}/img/gasnet-logo.svg`,
    description:
      'GASNet provides language-agnostic HPC networking infrastructure for real-world systems.',
    sameAs: [],
  };
}

/**
 * Generate WebSite schema for site-level SEO
 * @returns {Object} WebSite structured data
 */
export function createWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gasnet.org',
    url: SITE_URL,
    description: 'Language-agnostic HPC networking knowledge for real-world systems',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'GASNet Team',
    },
  };
}

/**
 * Render schema as JSON-LD script tag
 * @param {Object} schema - Schema object
 * @returns {Object} Script tag config for Docusaurus headTags
 */
export function schemaToHeadTag(schema) {
  return {
    tagName: 'script',
    attributes: { type: 'application/ld+json' },
    innerHTML: JSON.stringify(schema),
  };
}
