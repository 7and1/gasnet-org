# Gasnet.org

Gasnet.org is a Docusaurus-powered knowledge base for HPC networking, PGAS
runtimes, and performance engineering.

## Requirements

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Local development

```bash
npm run start
```

## Production build

```bash
npm run build
```

## Search & comments setup

- Local search is enabled via the Docusaurus search-local theme.
- Update the Giscus repository identifiers in `src/components/GiscusComponent.js`.

## Feature validation

Use `/docs/features-demo` to validate Mermaid, KaTeX, Chart.js, search, and
comments.
