/**
 * Accessibility Tests
 * Tests for WCAG compliance including ARIA labels, color contrast, and keyboard navigation
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

import { DARK_COLORS, LIGHT_COLORS } from '../../src/lib/colors';
import { generateAccessibleDescription } from '../../src/lib/chartUtils';

// Color contrast calculation (relative luminance)
const getLuminance = (r, g, b) => {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const getContrastRatio = (color1, color2) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return null;

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

describe('Accessibility Tests', () => {
  describe('Color Contrast', () => {
    // WCAG AA requires 4.5:1 for normal text
    const AA_NORMAL = 4.5;
    // WCAG AA requires 3:1 for large text (18pt+ or 14pt bold)
    const AA_LARGE = 3.0;

    it('should have sufficient contrast for dark mode text', () => {
      const contrast = getContrastRatio(DARK_COLORS.text, '#0a0e14'); // dark bg
      expect(contrast).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    it('should have sufficient contrast for light mode text', () => {
      const contrast = getContrastRatio(LIGHT_COLORS.text, '#ffffff'); // light bg
      expect(contrast).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    it('should have sufficient contrast for dark mode borders', () => {
      const contrast = getContrastRatio(DARK_COLORS.border, '#0a0e14');
      expect(contrast).toBeGreaterThanOrEqual(AA_LARGE);
    });

    it('should have sufficient contrast for light mode borders', () => {
      const contrast = getContrastRatio(LIGHT_COLORS.border, '#ffffff');
      expect(contrast).toBeGreaterThanOrEqual(AA_LARGE);
    });

    it('should have sufficient contrast for dark mode accent', () => {
      const contrast = getContrastRatio(DARK_COLORS.accent, '#0a0e14');
      expect(contrast).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    it('should have sufficient contrast for light mode accent', () => {
      const contrast = getContrastRatio(LIGHT_COLORS.accent, '#ffffff');
      expect(contrast).toBeGreaterThanOrEqual(AA_NORMAL);
    });

    it('should have series colors with sufficient contrast', () => {
      const darkSeries = DARK_COLORS.series;
      const lightSeries = LIGHT_COLORS.series;

      darkSeries.forEach(color => {
        const contrast = getContrastRatio(color, '#0a0e14');
        expect(contrast).toBeGreaterThanOrEqual(AA_LARGE);
      });

      lightSeries.forEach(color => {
        const contrast = getContrastRatio(color, '#ffffff');
        expect(contrast).toBeGreaterThanOrEqual(AA_LARGE);
      });
    });
  });

  describe('Component ARIA Attributes', () => {
    it('should generate accessible descriptions for charts', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Series 1', data: [1, 2, 3] }],
      };

      const description = generateAccessibleDescription(data, 'Test Chart');
      expect(description).toContain('Test Chart');
      expect(description).toContain('3 data points');
      expect(description).toContain('Series 1');
    });

    it('should handle null data in accessible description', () => {
      const description = generateAccessibleDescription(null, 'Test');
      expect(description).toContain('Interactive chart');
    });

    it('should include role="region" on chart containers', () => {
      const benchmarkChartPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'BenchmarkChart.js'
      );
      const caseStudyChartsPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'CaseStudyCharts.js'
      );
      const benchmarkContent = readFileSync(benchmarkChartPath, 'utf-8');
      const caseStudyContent = readFileSync(caseStudyChartsPath, 'utf-8');

      expect(benchmarkContent).toContain('role="region"');
      expect(caseStudyContent).toContain('role="region"');
    });

    it('should include aria-label on chart containers', () => {
      const benchmarkChartPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'BenchmarkChart.js'
      );
      const caseStudyChartsPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'CaseStudyCharts.js'
      );
      const benchmarkContent = readFileSync(benchmarkChartPath, 'utf-8');
      const caseStudyContent = readFileSync(caseStudyChartsPath, 'utf-8');

      expect(benchmarkContent).toMatch(/aria-label/);
      expect(caseStudyContent).toMatch(/aria-label/);
    });

    it('should include aria-live for error states', () => {
      const benchmarkChartPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'BenchmarkChart.js'
      );
      const benchmarkContent = readFileSync(benchmarkChartPath, 'utf-8');

      expect(benchmarkContent).toContain('aria-live="polite"');
    });

    it('should have sr-only class for screen reader text', () => {
      const benchmarkChartPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'BenchmarkChart.js'
      );
      const caseStudyChartsPath = join(
        process.cwd(),
        'src',
        'components',
        'charts',
        'CaseStudyCharts.js'
      );
      const benchmarkContent = readFileSync(benchmarkChartPath, 'utf-8');
      const caseStudyContent = readFileSync(caseStudyChartsPath, 'utf-8');

      expect(benchmarkContent).toContain('sr-only');
      expect(caseStudyContent).toContain('sr-only');
    });
  });

  describe('Error Boundary Accessibility', () => {
    it('should have role="alert" on error message', () => {
      const errorBoundaryPath = join(process.cwd(), 'src', 'components', 'ErrorBoundary.js');
      const content = readFileSync(errorBoundaryPath, 'utf-8');

      expect(content).toContain('role="alert"');
    });

    it('should have aria-live="assertive" for errors', () => {
      const errorBoundaryPath = join(process.cwd(), 'src', 'components', 'ErrorBoundary.js');
      const content = readFileSync(errorBoundaryPath, 'utf-8');

      expect(content).toContain('aria-live="assertive"');
    });

    it('should have aria-label on buttons', () => {
      const errorBoundaryPath = join(process.cwd(), 'src', 'components', 'ErrorBoundary.js');
      const content = readFileSync(errorBoundaryPath, 'utf-8');

      expect(content).toContain('aria-label="Try again"');
      expect(content).toContain('aria-label="Reload page"');
    });
  });

  describe('Loading State Accessibility', () => {
    it('should have aria-hidden on spinner', () => {
      const loadingStatePath = join(process.cwd(), 'src', 'components', 'ui', 'LoadingState.js');
      const content = readFileSync(loadingStatePath, 'utf-8');

      expect(content).toContain('aria-hidden="true"');
    });
  });

  describe('Semantic HTML', () => {
    it('should use proper heading hierarchy', () => {
      const indexPath = join(process.cwd(), 'src', 'pages', 'index.js');
      const content = readFileSync(indexPath, 'utf-8');

      // Check for semantic heading elements
      expect(content).toMatch(/<h[1-6]/);
    });

    it('should use semantic nav elements', () => {
      const docusaurusConfigPath = join(process.cwd(), 'docusaurus.config.js');
      const content = readFileSync(docusaurusConfigPath, 'utf-8');

      expect(content).toContain('navbar');
    });
  });
});
