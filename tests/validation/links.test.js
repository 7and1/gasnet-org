/**
 * Validation Tests for internal links
 * Tests that all internal markdown links resolve to existing files
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';

const DOCS_DIR = join(process.cwd(), 'docs');

// Extract markdown links from content
const extractLinks = content => {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const [, text, url] = match;
    links.push({ text, url });
  }

  return links;
};

// Check if a path is external
const isExternalLink = url => {
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:');
};

// Check if a path is an anchor link
const isAnchorLink = url => {
  return url.startsWith('#');
};

// Resolve internal link to filesystem path
const resolveInternalLink = (baseDir, linkUrl) => {
  // Remove anchor
  const hashIndex = linkUrl.indexOf('#');
  const pathWithoutAnchor = hashIndex >= 0 ? linkUrl.substring(0, hashIndex) : linkUrl;

  // Handle .md extensions (explicit or implicit)
  let targetPath = pathWithoutAnchor;
  if (!targetPath.endsWith('.md')) {
    targetPath = targetPath + '.md';
  }

  return join(baseDir, targetPath);
};

// Get all markdown files recursively
const getMarkdownFiles = (dir, baseDir = dir) => {
  const files = [];

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath, baseDir));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
};

describe('Internal Link Validation', () => {
  const markdownFiles = getMarkdownFiles(DOCS_DIR);

  it('should have docs directory', () => {
    expect(existsSync(DOCS_DIR)).toBe(true);
  });

  it('should have markdown files', () => {
    expect(markdownFiles.length).toBeGreaterThan(0);
  });

  markdownFiles.forEach(filePath => {
    const relativePath = relative(DOCS_DIR, filePath);

    describe(`${relativePath}`, () => {
      let content;
      let links;
      let brokenLinks = [];

      beforeAll(() => {
        content = readFileSync(filePath, 'utf-8');
        links = extractLinks(content);

        // Check each internal link
        links.forEach(({ text, url }) => {
          if (!isExternalLink(url) && !isAnchorLink(url)) {
            const targetPath = resolveInternalLink(dirname(filePath), url);
            if (!existsSync(targetPath)) {
              brokenLinks.push({ text, url, targetPath });
            }
          }
        });
      });

      it('should have parseable content', () => {
        expect(content).toBeDefined();
        expect(typeof content).toBe('string');
      });

      it('should have no broken internal links', () => {
        if (brokenLinks.length > 0) {
          const brokenList = brokenLinks.map(({ text, url }) => `  [${text}](${url})`).join('\n');
          throw new Error(`Broken internal links found:\n${brokenList}`);
        }
      });

      it('should have valid link syntax', () => {
        const invalidLinks = links.filter(({ url }) => {
          // Check for empty URLs
          if (!url || url.trim() === '') return true;

          // Check for malformed brackets (should have been caught by regex but double-check)
          if (url.includes('[') || url.includes(']')) return true;

          return false;
        });

        expect(invalidLinks).toHaveLength(0);
      });
    });
  });

  describe('Category Files Validation', () => {
    it('should have _category_.json files in numbered directories', () => {
      const entries = readdirSync(DOCS_DIR, { withFileTypes: true });
      const numberedDirs = entries.filter(e => e.isDirectory() && /^\d{2}-/.test(e.name));

      numberedDirs.forEach(dir => {
        const categoryPath = join(DOCS_DIR, dir.name, '_category_.json');
        expect(existsSync(categoryPath), `${dir.name}/_category_.json should exist`).toBe(true);
      });
    });
  });
});
