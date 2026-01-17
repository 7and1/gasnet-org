/**
 * Validation Tests for images
 * Tests that all referenced images exist and have alt text
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, relative, dirname } from 'path';

const DOCS_DIR = join(process.cwd(), 'docs');
const STATIC_IMG_DIR = join(process.cwd(), 'static', 'img');

// Extract image references from markdown
const extractImages = content => {
  // Match markdown images: ![alt](src)
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const images = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    const [, alt, src] = match;
    images.push({ alt, src });
  }

  return images;
};

// Get all markdown files recursively
const getMarkdownFiles = dir => {
  const files = [];
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
};

describe('Image Validation', () => {
  const markdownFiles = getMarkdownFiles(DOCS_DIR);

  it('should have docs directory', () => {
    expect(existsSync(DOCS_DIR)).toBe(true);
  });

  it('should have static/img directory', () => {
    expect(existsSync(STATIC_IMG_DIR)).toBe(true);
  });

  markdownFiles.forEach(filePath => {
    const relativePath = relative(DOCS_DIR, filePath);

    describe(`${relativePath}`, () => {
      let content;
      let images;
      let imagesWithoutAlt = [];
      let missingImages = [];

      beforeAll(() => {
        content = readFileSync(filePath, 'utf-8');
        images = extractImages(content);

        images.forEach(({ alt, src }) => {
          // Check for missing alt text
          if (!alt || alt.trim() === '') {
            imagesWithoutAlt.push({ src });
          }

          // Check if image file exists (for static images)
          if (!src.startsWith('http://') && !src.startsWith('https://')) {
            // Resolve relative path from docs directory
            const imgDir = dirname(filePath);
            const imgPath = join(DOCS_DIR, imgDir, src);

            // Also check in static/img
            const staticPath = join(STATIC_IMG_DIR, src);

            if (!existsSync(imgPath) && !existsSync(staticPath)) {
              missingImages.push({ src, alt });
            }
          }
        });
      });

      it('should have parseable content', () => {
        expect(content).toBeDefined();
        expect(typeof content).toBe('string');
      });

      it('should have alt text for all images', () => {
        if (imagesWithoutAlt.length > 0) {
          const list = imagesWithoutAlt.map(i => `  ![](${i.src})`).join('\n');
          throw new Error(`Images missing alt text:\n${list}`);
        }
      });

      it('should have all referenced image files', () => {
        const localMissing = missingImages.filter(m => !m.src.startsWith('http'));

        if (localMissing.length > 0) {
          const list = localMissing.map(m => `  ${m.src}`).join('\n');
          throw new Error(`Missing image files:\n${list}`);
        }
      });

      it('should not use deprecated image syntax', () => {
        // Check for <img> tags (should use markdown syntax instead)
        const imgTagRegex = /<img\s+[^>]*>/gi;
        const imgTags = content.match(imgTagRegex) || [];

        expect(imgTags).toHaveLength(0);
      });
    });
  });

  describe('Image File Integrity', () => {
    const getImageFiles = dir => {
      const files = [];
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          files.push(...getImageFiles(fullPath));
        } else if (/\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(entry.name)) {
          files.push(fullPath);
        }
      }

      return files;
    };

    it('should have image files in static/img', () => {
      const imageFiles = getImageFiles(STATIC_IMG_DIR);
      expect(imageFiles.length).toBeGreaterThan(0);
    });

    it('should have favicon', () => {
      const favicon = join(STATIC_IMG_DIR, 'favicon.ico');
      const faviconPng = join(STATIC_IMG_DIR, 'favicon.png');

      expect(
        existsSync(favicon) || existsSync(faviconPng),
        'favicon.ico or favicon.png should exist'
      ).toBe(true);
    });
  });
});
