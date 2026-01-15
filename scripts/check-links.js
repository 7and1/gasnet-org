#!/usr/bin/env node

/**
 * Link validation script for Docusaurus
 * Validates internal links within markdown files and build output
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = './docs';
const BLOG_DIR = './blog';
const BUILD_DIR = './build';

// ANSI colors
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function findMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  return files;
}

function extractLinks(content) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    links.push({
      text: match[1],
      url: match[2],
    });
  }
  return links;
}

function isInternalLink(url) {
  return (
    url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')
  );
}

function validateInternalLink(link, sourceFile) {
  // Skip anchors and empty links
  if (!link || link.startsWith('#')) return { valid: true };

  // Handle Docusaurus absolute routes (/docs/...)
  if (link.startsWith('/docs/')) {
    const docPath = path.join(DOCS_DIR, link.replace('/docs/', ''));
    if (fs.existsSync(docPath)) return { valid: true };
    if (fs.existsSync(docPath + '.md')) return { valid: true };
    if (fs.existsSync(path.join(docPath, 'index.md'))) return { valid: true };
    return { valid: false, path: docPath };
  }

  // Handle /labs route
  if (link.startsWith('/labs')) {
    const labsPath = path.join('src', 'pages', 'labs.js');
    if (fs.existsSync(labsPath)) return { valid: true };
    return { valid: false, path: labsPath };
  }

  // Resolve relative path
  const sourceDir = path.dirname(sourceFile);
  let targetPath = path.resolve(sourceDir, link);

  // Remove anchor if present
  targetPath = targetPath.split('#')[0];

  // Check for .md extension or index
  if (fs.existsSync(targetPath)) return { valid: true };
  if (fs.existsSync(targetPath + '.md')) return { valid: true };
  if (fs.existsSync(path.join(targetPath, 'index.md'))) return { valid: true };

  return { valid: false, path: targetPath };
}

async function _validateBuildLinks() {
  // eslint-disable-next-line no-console
  console.log('Validating links in build output...');

  // Use html-validate or similar to check HTML
  // For now, just check that build exists
  if (!fs.existsSync(BUILD_DIR)) {
    // eslint-disable-next-line no-console
    console.log(
      `${colors.yellow}Build directory not found. Run 'npm run build' first.${colors.reset}`
    );
    return false;
  }

  return true;
}

async function main() {
  // eslint-disable-next-line no-console
  console.log(`${colors.green}Starting link validation...${colors.reset}\n`);

  const markdownDirs = [DOCS_DIR, BLOG_DIR, 'src'];
  let totalLinks = 0;
  let invalidLinks = 0;

  for (const dir of markdownDirs) {
    if (!fs.existsSync(dir)) continue;

    // eslint-disable-next-line no-console
    console.log(`Checking ${dir}/...`);
    const files = findMarkdownFiles(dir);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const links = extractLinks(content);

      for (const link of links) {
        totalLinks++;
        if (isInternalLink(link.url)) {
          const result = validateInternalLink(link.url, file);
          if (!result.valid) {
            // eslint-disable-next-line no-console
            console.log(
              `${colors.red}✗${colors.reset} ${path.relative('.', file)}: ${link.url} -> ${result.path}`
            );
            invalidLinks++;
          }
        }
      }
    }
  }

  // eslint-disable-next-line no-console
  console.log(`\n${colors.green}Checked ${totalLinks} links${colors.reset}`);

  if (invalidLinks > 0) {
    // eslint-disable-next-line no-console
    console.log(`${colors.red}Found ${invalidLinks} invalid links${colors.reset}`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`${colors.green}All links are valid!${colors.reset}`);
  process.exit(0);
}

main().catch(err => {
  console.error(`${colors.red}Error:${colors.reset}`, err);
  process.exit(1);
});
