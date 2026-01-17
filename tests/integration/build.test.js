/**
 * Integration Tests for build process
 * Tests that the site builds successfully and generates expected files
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'child_process';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const BUILD_DIR = join(process.cwd(), 'build');

describe('Build Integration Tests', () => {
  beforeAll(() => {
    // Clean build directory if exists
    if (existsSync(BUILD_DIR)) {
      execSync(`rm -rf "${BUILD_DIR}"`, { stdio: 'inherit' });
    }

    // Run build
    try {
      execSync('npm run build', {
        stdio: 'pipe',
        timeout: 180000, // 3 minutes
      });
    } catch (error) {
      console.error('Build failed:', error.message);
      throw error;
    }
  }, 200000);

  afterAll(() => {
    // Optional: keep build for inspection
  });

  it('should create build directory', () => {
    expect(existsSync(BUILD_DIR)).toBe(true);
  });

  it('should generate index.html', () => {
    const indexPath = join(BUILD_DIR, 'index.html');
    expect(existsSync(indexPath)).toBe(true);

    const content = readFileSync(indexPath, 'utf-8');
    expect(content).toContain('<!DOCTYPE html>');
  });

  it('should generate static assets directory', () => {
    const staticDir = join(BUILD_DIR, 'static');
    expect(existsSync(staticDir)).toBe(true);
  });

  it('should include JavaScript bundles', () => {
    const jsDir = join(BUILD_DIR, 'js');
    expect(existsSync(jsDir)).toBe(true);

    const files = readdirSync(jsDir);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    expect(jsFiles.length).toBeGreaterThan(0);
  });

  it('should include CSS files', () => {
    const cssDir = join(BUILD_DIR, 'static', 'css');
    expect(existsSync(cssDir)).toBe(true);

    const files = readdirSync(cssDir);
    const cssFiles = files.filter(f => f.endsWith('.css'));
    expect(cssFiles.length).toBeGreaterThan(0);
  });

  it('should copy data files to build', () => {
    const dataDir = join(BUILD_DIR, 'static', 'data');
    expect(existsSync(dataDir)).toBe(true);

    const benchmarkDir = join(dataDir, 'benchmarks');
    if (existsSync(benchmarkDir)) {
      const files = readdirSync(benchmarkDir);
      expect(files.length).toBeGreaterThan(0);
    }
  });

  it('should generate sitemap.xml', () => {
    const sitemapPath = join(BUILD_DIR, 'sitemap.xml');
    expect(existsSync(sitemapPath)).toBe(true);

    const content = readFileSync(sitemapPath, 'utf-8');
    expect(content).toContain('<?xml');
  });

  it('should generate robots.txt', () => {
    const robotsPath = join(BUILD_DIR, 'robots.txt');
    expect(existsSync(robotsPath)).toBe(true);
  });

  it('should bundle chart.js dependencies', () => {
    const jsDir = join(BUILD_DIR, 'js');
    const files = readdirSync(jsDir);

    // Check for chart-related chunks
    const chartFiles = files.filter(f => f.includes('chart') || f.includes('Chart'));
    // Charts are lazy loaded, so there should be separate chunks
    expect(chartFiles.length).toBeGreaterThan(0);
  });
});
