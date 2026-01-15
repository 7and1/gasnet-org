// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Analytics configuration - disabled in development
const isDevelopment = process.env.NODE_ENV === 'development';
const analyticsEnabled = process.env.ANALYTICS_ENABLED === 'true' && !isDevelopment;
const analyticsWebsiteId = process.env.ANALYTICS_WEBSITE_ID || '';
const analyticsHost = process.env.ANALYTICS_HOST || 'https://analytics.gasnet.org';

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
  ],

  // Set the production url of your site here
  url: 'https://gasnet.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // Used for metadata and default project links.
  organizationName: 'gasnet',
  projectName: 'gasnet.org',

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/docs',
          editUrl: undefined,
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          ignorePatterns: ['/tags/**'],
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
            'GASNet, HPC, high-performance computing, RDMA, PGAS, interconnects, supercomputing, parallel programming',
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
        { property: 'og:image:alt', content: 'Gasnet.org Social Card' },
        { property: 'og:url', content: 'https://gasnet.org' },
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
          { to: '/labs', label: 'Labs', position: 'left' },
          {
            to: '/docs/getting-started/intro',
            label: 'Start',
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
    }),
};

export default config;
