/**
 * Unit Tests for src/lib/chartUtils.js
 * Tests chart configuration builders and utility functions
 */

import { describe, it, expect, vi } from 'vitest';
import {
  TooltipFormats,
  buildBaseChartOptions,
  createBarDataset,
  createLineDataset,
  generateAccessibleDescription,
} from '../../src/lib/chartUtils';

describe('chartUtils', () => {
  const mockColors = {
    text: '#0a1419',
    grid: 'rgba(0, 0, 0, 0.1)',
    barFill: 'rgba(0, 153, 204, 0.6)',
    border: '#007aa3',
    accent: '#b07d00',
    series: ['#007aa3', '#b07d00', '#1f7a4d'],
  };

  describe('TooltipFormats', () => {
    it('should be a frozen object', () => {
      expect(Object.isFrozen(TooltipFormats)).toBe(true);
    });

    it('should have microseconds format', () => {
      const context = { parsed: { y: 42 } };
      expect(TooltipFormats.microseconds(context)).toBe('42 µs');
    });

    it('should have bandwidth format', () => {
      const context = { parsed: { y: 12.5 } };
      expect(TooltipFormats.bandwidth(context)).toBe('12.5 GB/s');
    });

    it('should have raw format', () => {
      const context = { parsed: { y: 100 } };
      expect(TooltipFormats.raw(context)).toBe('100');
    });

    it('should handle decimal values in microseconds', () => {
      const context = { parsed: { y: 1.25 } };
      expect(TooltipFormats.microseconds(context)).toBe('1.25 µs');
    });
  });

  describe('buildBaseChartOptions', () => {
    it('should build base options with colors', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options).toHaveProperty('responsive', true);
      expect(options).toHaveProperty('maintainAspectRatio', false);
      expect(options).toHaveProperty('plugins');
      expect(options).toHaveProperty('scales');
    });

    it('should include title when provided', () => {
      const options = buildBaseChartOptions(mockColors, {
        title: 'Test Chart',
      });

      expect(options.plugins.title).toBeDefined();
      expect(options.plugins.title.text).toBe('Test Chart');
      expect(options.plugins.title.display).toBe(true);
    });

    it('should not include title when not provided', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options.plugins.title).toBeUndefined();
    });

    it('should use custom tooltip format when provided', () => {
      const customFormat = vi.fn(() => 'custom');
      const options = buildBaseChartOptions(mockColors, {
        tooltipFormat: customFormat,
      });

      expect(options.plugins.tooltip.callbacks.label).toBe(customFormat);
    });

    it('should use default raw format when no tooltip format provided', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options.plugins.tooltip.callbacks.label).toBe(TooltipFormats.raw);
    });

    it('should merge additional plugins', () => {
      const options = buildBaseChartOptions(mockColors, {
        additionalPlugins: {
          customPlugin: { enabled: true },
        },
      });

      expect(options.plugins.customPlugin).toBeDefined();
      expect(options.plugins.customPlugin.enabled).toBe(true);
    });

    it('should configure x-axis with colors', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options.scales.x.ticks.color).toBe(mockColors.text);
      expect(options.scales.x.grid.color).toBe(mockColors.grid);
      expect(options.scales.x.title).toBeDefined();
    });

    it('should configure y-axis with colors', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options.scales.y.ticks.color).toBe(mockColors.text);
      expect(options.scales.y.grid.color).toBe(mockColors.grid);
      expect(options.scales.y.title).toBeDefined();
    });

    it('should configure legend colors', () => {
      const options = buildBaseChartOptions(mockColors);

      expect(options.plugins.legend.labels.color).toBe(mockColors.text);
    });
  });

  describe('createBarDataset', () => {
    it('should create bar dataset with required properties', () => {
      const data = [1, 2, 3, 4];
      const label = 'Test Dataset';
      const dataset = createBarDataset(data, label, mockColors);

      expect(dataset).toHaveProperty('label', label);
      expect(dataset).toHaveProperty('data', data);
      expect(dataset).toHaveProperty('backgroundColor', mockColors.barFill);
      expect(dataset).toHaveProperty('borderColor', mockColors.border);
      expect(dataset).toHaveProperty('borderWidth', 1);
    });

    it('should merge additional options', () => {
      const dataset = createBarDataset([1, 2], 'Test', mockColors, {
        borderWidth: 2,
        customProp: 'value',
      });

      expect(dataset.borderWidth).toBe(2);
      expect(dataset.customProp).toBe('value');
    });

    it('should allow overriding default properties', () => {
      const dataset = createBarDataset([1, 2], 'Test', mockColors, {
        borderWidth: 3,
      });

      expect(dataset.borderWidth).toBe(3);
    });
  });

  describe('createLineDataset', () => {
    it('should create line dataset with required properties', () => {
      const data = [1, 2, 3, 4];
      const label = 'Test Dataset';
      const dataset = createLineDataset(data, label, mockColors);

      expect(dataset).toHaveProperty('label', label);
      expect(dataset).toHaveProperty('data', data);
      expect(dataset).toHaveProperty('borderColor', mockColors.border);
      expect(dataset).toHaveProperty('backgroundColor', 'transparent');
      expect(dataset).toHaveProperty('tension', 0.3);
    });

    it('should use accent color when useAccent is true', () => {
      const dataset = createLineDataset([1, 2], 'Test', mockColors, {
        useAccent: true,
      });

      expect(dataset.borderColor).toBe(mockColors.accent);
    });

    it('should apply dashed border when dashed is true', () => {
      const dataset = createLineDataset([1, 2], 'Test', mockColors, {
        dashed: true,
      });

      expect(dataset.borderDash).toEqual([6, 6]);
    });

    it('should apply both useAccent and dashed options', () => {
      const dataset = createLineDataset([1, 2], 'Test', mockColors, {
        useAccent: true,
        dashed: true,
      });

      expect(dataset.borderColor).toBe(mockColors.accent);
      expect(dataset.borderDash).toEqual([6, 6]);
    });

    it('should merge additional options', () => {
      const dataset = createLineDataset([1, 2], 'Test', mockColors, {
        tension: 0.5,
        pointRadius: 5,
      });

      expect(dataset.tension).toBe(0.5);
      expect(dataset.pointRadius).toBe(5);
    });
  });

  describe('generateAccessibleDescription', () => {
    it('should handle null/undefined data', () => {
      expect(generateAccessibleDescription(null, 'Test')).toBe('Interactive chart displaying Test');
      expect(generateAccessibleDescription(undefined)).toBe('Interactive chart displaying data');
    });

    it('should handle data without datasets or labels', () => {
      const data = {};
      expect(generateAccessibleDescription(data, 'Test')).toBe('Interactive chart displaying Test');
    });

    it('should describe single dataset chart', () => {
      const data = {
        labels: ['A', 'B', 'C'],
        datasets: [{ label: 'Series 1', data: [1, 2, 3] }],
      };

      const result = generateAccessibleDescription(data, 'Test Chart');
      expect(result).toContain('Test Chart');
      expect(result).toContain('3 data points');
      expect(result).toContain('Series 1');
    });

    it('should describe multi-dataset chart', () => {
      const data = {
        labels: ['A', 'B', 'C', 'D'],
        datasets: [
          { label: 'Series 1', data: [1, 2, 3, 4] },
          { label: 'Series 2', data: [5, 6, 7, 8] },
        ],
      };

      const result = generateAccessibleDescription(data, 'Comparison');
      expect(result).toContain('4 data points');
      expect(result).toContain('2 series');
      expect(result).toContain('Series 1');
      expect(result).toContain('Series 2');
    });

    it('should handle datasets without labels', () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [{ data: [1, 2] }],
      };

      const result = generateAccessibleDescription(data);
      expect(result).toContain('2 data points');
    });

    it('should filter out null/undefined dataset labels', () => {
      const data = {
        labels: ['A', 'B'],
        datasets: [
          { label: 'Series 1', data: [1, 2] },
          { data: [3, 4] },
          { label: null, data: [5, 6] },
        ],
      };

      const result = generateAccessibleDescription(data);
      expect(result).toContain('Series 1');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
    });

    it('should handle empty labels array', () => {
      const data = {
        labels: [],
        datasets: [{ label: 'Series 1', data: [] }],
      };

      const result = generateAccessibleDescription(data);
      expect(result).toContain('0 data points');
    });
  });
});
