// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  schemaToHeadTag,
  createWebSiteSchema,
  createOrganizationSchema,
  createTechArticleSchema,
} from './src/utils/schema.js';

// Analytics configuration - disabled in development
const isDevelopment = process.env.NODE_ENV === 'development';
const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true' && !isDevelopment;
const analyticsWebsiteId = process.env.ANALYTICS_WEBSITE_ID || '';
const analyticsHost = process.env.ANALYTICS_HOST || 'https://analytics.gasnet.org';

// Build-time environment injection for client-side code
// Note: Docusaurus 3.x doesn't support custom webpack config via docusaurus.config.js
// Environment variables are handled through standard build process
// See src/theme/Root.js for client-side polyfill

// Sitemap priority configuration
// Custom priority mapping for SEO optimization (reserved for future use)
const _sitemapPriorityMap = new Map([
  // High priority (1.0) - Getting Started and key entry points
  ['/docs/getting-started/intro', { priority: 1.0, changefreq: 'weekly' }],
  ['/docs/getting-started/quickstart', { priority: 1.0, changefreq: 'weekly' }],
  ['/docs/programming-model/api-reference', { priority: 1.0, changefreq: 'weekly' }],
  // High priority (0.9) - Core architecture and programming
  ['/docs/programming-model/communication-primitives', { priority: 0.9, changefreq: 'weekly' }],
  ['/docs/architecture/overview', { priority: 0.9, changefreq: 'weekly' }],
  ['/docs/benchmarks/microbenchmarks', { priority: 0.9, changefreq: 'weekly' }],
  // Medium-high priority (0.8) - Important setup and reference docs
  ['/docs/getting-started/installation', { priority: 0.8, changefreq: 'monthly' }],
  ['/docs/getting-started/troubleshooting', { priority: 0.8, changefreq: 'monthly' }],
  ['/docs/architecture/transport-layers', { priority: 0.8, changefreq: 'monthly' }],
  ['/docs/programming-model/collectives', { priority: 0.8, changefreq: 'monthly' }],
  ['/faq', { priority: 0.8, changefreq: 'monthly' }],
  // Medium priority (0.7) - Case studies and interop
  ['/docs/programming-model/best-practices', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/interop/language-bindings', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/interop/runtime-integration', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/benchmarks/topology-notes', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/case-studies/atlas-fabric-tuning', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/case-studies/helios-routing-cutover', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/case-studies/orion-gpu-rdma', { priority: 0.7, changefreq: 'monthly' }],
  ['/docs/case-studies/zephyr-tcp-fallback', { priority: 0.7, changefreq: 'monthly' }],
  // Lower priority (0.3-0.5) - Supporting content
  ['/docs/glossary/terminology', { priority: 0.4, changefreq: 'monthly' }],
  ['/docs/accessibility-statement', { priority: 0.3, changefreq: 'yearly' }],
  ['/docs/privacy', { priority: 0.3, changefreq: 'yearly' }],
  // Legacy version gets lower priority
  ['/docs/1.0/', { priority: 0.3, changefreq: 'yearly' }],
]);

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Gasnet.org',
  tagline: 'Language-agnostic HPC networking knowledge for real-world systems',
  favicon: 'img/gasnet-favicon.svg',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Canonical URLs for SEO
  trailingSlash: false,
  url: 'https://gasnet.org',
  baseUrl: '/',

  // Used for metadata and default project links.
  organizationName: 'gasnet',
  projectName: 'gasnet.org',

  onBrokenLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // Performance optimization: Preconnect to external origins
  scripts: analyticsEnabled
    ? [
        {
          src: `${analyticsHost}/script.js`,
          defer: true,
          'data-website-id': analyticsWebsiteId,
          'data-domains': 'gasnet.org',
        },
      ]
    : [],
  headTags: [
    // Preconnect to Google Fonts for faster font loading
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    // Preload critical fonts with async loading for performance
    {
      tagName: 'link',
      attributes: {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        as: 'style',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
        media: 'print',
        onload: "this.media='all'",
      },
    },
    // Preconnect to KaTeX CDN
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://cdn.jsdelivr.net',
      },
    },
    // DNS prefetch for likely navigation
    {
      tagName: 'link',
      attributes: {
        rel: 'dns-prefetch',
        href: 'https://gasnet.org',
      },
    },
    // Canonical URL for homepage
    {
      tagName: 'link',
      attributes: {
        rel: 'canonical',
        href: 'https://gasnet.org/',
      },
    },
    // Alternative language link
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        hreflang: 'en',
        href: 'https://gasnet.org/',
      },
    },
    // WebSite Schema
    schemaToHeadTag(createWebSiteSchema()),
    // Organization Schema
    schemaToHeadTag(createOrganizationSchema()),
    // TechArticle Schema for main content
    schemaToHeadTag(
      createTechArticleSchema({
        headline: 'Gasnet.org HPC Networking Knowledge Base',
        description:
          'GASNet provides language-agnostic HPC networking infrastructure for real-world systems.',
        url: '/',
        keywords: [
          'GASNet',
          'HPC',
          'high-performance computing',
          'RDMA',
          'PGAS',
          'interconnects',
          'supercomputing',
          'parallel programming',
          'InfiniBand',
          'active messages',
        ],
      })
    ),
    // Additional article meta tags
    {
      tagName: 'meta',
      attributes: {
        name: 'article:published_time',
        content: '2026-01-01',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'article:modified_time',
        content: new Date().toISOString().split('T')[0],
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'article:author',
        content: 'GASNet Team',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'article:section',
        content: 'Technical Documentation',
      },
    },
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/docs',
          lastVersion: 'current',
          versions: {
            current: {
              label: '2.0 (Current)',
              path: '',
            },
            '1.0': {
              label: '1.0',
              path: '1.0',
            },
          },
          editUrl: undefined,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          ignorePatterns: ['/tags/**', '/search/**'],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: [
    '@docusaurus/theme-mermaid',
    '@docusaurus/theme-live-codeblock',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-nB0miv6/jRmo5UMMR1wu3Gz6LKsoQ25+lJG+sXpDBLPEJsRBqu0ElSy/IIvLdLAa',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/gasnet-social-card.svg',
      description:
        'GASNet provides language-agnostic HPC networking infrastructure for real-world systems. Learn about RDMA, PGAS, and high-performance computing interconnects.',
      metadata: [
        {
          name: 'keywords',
          content:
            'GASNet, HPC, high-performance computing, RDMA, PGAS, interconnects, supercomputing, parallel programming, InfiniBand, active messages, PGAS runtime, one-sided communication, remote memory access',
        },
        { name: 'theme-color', content: '#0099cc' },
        {
          name: 'description',
          content:
            'GASNet provides language-agnostic HPC networking infrastructure for real-world systems. Learn about RDMA, PGAS, and high-performance computing interconnects.',
        },
        { name: 'author', content: 'GASNet Team' },
        { name: 'robots', content: 'index, follow, max-image-preview:large' },
        // Performance hints
        { name: 'format-detection', content: 'telephone=no' },
        // Geographic targeting
        { name: 'geo.region', content: 'US' },
        { name: 'geo.placename', content: 'Global' },
        // Open Graph tags
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Gasnet.org' },
        {
          property: 'og:title',
          content: 'Gasnet.org - Language-agnostic HPC Networking',
        },
        {
          property: 'og:description',
          content:
            'GASNet provides language-agnostic HPC networking infrastructure for real-world systems. Learn about RDMA, PGAS, and high-performance computing interconnects.',
        },
        {
          property: 'og:image',
          content: 'https://gasnet.org/img/gasnet-social-card.svg',
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/svg+xml' },
        { property: 'og:image:alt', content: 'Gasnet.org Social Card' },
        { property: 'og:url', content: 'https://gasnet.org' },
        { property: 'og:locale', content: 'en_US' },
        { property: 'article:author', content: 'GASNet Team' },
        { property: 'article:publisher', content: 'https://gasnet.org' },
        // Twitter Card tags
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'Gasnet.org - Language-agnostic HPC Networking',
        },
        {
          name: 'twitter:description',
          content:
            'GASNet provides language-agnostic HPC networking infrastructure for real-world systems.',
        },
        {
          name: 'twitter:image',
          content: 'https://gasnet.org/img/gasnet-social-card.svg',
        },
        { name: 'twitter:image:alt', content: 'Gasnet.org Social Card' },
        { name: 'twitter:site', content: '@gasnet' },
        { name: 'twitter:creator', content: '@gasnet' },
      ],
      colorMode: {
        defaultMode: 'light',
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Gasnet.org',
        logo: {
          alt: 'Gasnet.org logo',
          src: 'img/gasnet-logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docs',
            position: 'left',
            label: 'Docs',
          },
          {
            type: 'docsVersionDropdown',
            position: 'left',
          },
          { to: '/labs', label: 'Labs', position: 'left' },
          { to: '/community', label: 'Community', position: 'left' },
          {
            to: '/docs/getting-started/intro',
            label: 'Start',
            position: 'left',
          },
          {
            to: '/changelog',
            label: 'Changelog',
            position: 'left',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/getting-started/intro',
              },
              {
                label: 'Programming Model',
                to: '/docs/programming-model/communication-primitives',
              },
            ],
          },
          {
            title: 'Research',
            items: [
              {
                label: 'Labs Directory',
                to: '/labs',
              },
              {
                label: 'Benchmarks',
                to: '/docs/benchmarks/microbenchmarks',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Architecture',
                to: '/docs/architecture/overview',
              },
            ],
          },
          {
            title: 'Legal',
            items: [
              {
                label: 'Accessibility',
                to: '/docs/accessibility-statement',
              },
              {
                label: 'Privacy',
                to: '/docs/privacy',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Gasnet.org.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['rust', 'python', 'cpp'],
      },
      liveCodeBlock: {
        playgroundPosition: 'bottom',
      },
    }),
};

export default config;
