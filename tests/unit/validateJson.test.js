/**
 * Unit Tests for src/lib/validateJson.js
 * Tests JSON schema validation and security functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  validateBenchmarkData,
  validateChartData,
  fetchValidatedJson,
} from '../../src/lib/validateJson';

// Mock global fetch
global.fetch = vi.fn();

describe('validateJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateBenchmarkData', () => {
    const validBenchmarkData = {
      cluster: 'atlas',
      nodes: 4096,
      fabric: 'HDR200',
      topology: 'dragonfly',
      metadata: {
        name: 'Atlas 4096-node Benchmark',
        date: '2024-01-15',
        hardware: {
          nodes: 4096,
          network: 'HDR200',
          topology: 'dragonfly',
        },
      },
      latency_us: [
        { size: '8B', p50: 1.2, p95: 1.6 },
        { size: '64B', p50: 1.4, p95: 1.9 },
        { size: '1KB', p50: 2.1, p95: 2.8 },
      ],
      bandwidth_gbps: [
        { size: '64KB', gbps: 92 },
        { size: '1MB', gbps: 128 },
      ],
    };

    it('should validate correct benchmark data', () => {
      const result = validateBenchmarkData(validBenchmarkData);

      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeNull();
    });

    it('should reject data with invalid size pattern', () => {
      const invalidData = {
        ...validBenchmarkData,
        latency_us: [{ size: 'invalid', p50: 1.2, p95: 1.6 }],
      };

      const result = validateBenchmarkData(invalidData);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject negative latency values', () => {
      const invalidData = {
        ...validBenchmarkData,
        latency_us: [{ size: '8B', p50: -1.2, p95: 1.6 }],
      };

      const result = validateBenchmarkData(invalidData);

      expect(result.valid).toBe(false);
    });

    it('should reject negative bandwidth values', () => {
      const invalidData = {
        ...validBenchmarkData,
        bandwidth_gbps: [{ size: '1MB', gbps: -10 }],
      };

      const result = validateBenchmarkData(invalidData);

      expect(result.valid).toBe(false);
    });

    it('should reject node count out of range', () => {
      const invalidData = {
        ...validBenchmarkData,
        nodes: 0,
      };

      const result = validateBenchmarkData(invalidData);
      expect(result.valid).toBe(false);
    });

    it('should reject excess array length', () => {
      const largeArray = Array(10001).fill({ size: '8B', p50: 1.2, p95: 1.6 });
      const invalidData = {
        ...validBenchmarkData,
        latency_us: largeArray,
      };

      const result = validateBenchmarkData(invalidData);

      expect(result.valid).toBe(false);
    });

    it('should sanitize prototype pollution keys', () => {
      const maliciousData = {
        ...validBenchmarkData,
        __proto__: { polluted: true },
        constructor: { malicious: true },
      };

      const result = validateBenchmarkData(maliciousData);

      expect(result.valid).toBe(true);
      expect(result.data.polluted).toBeUndefined();
    });

    it('should sanitize script tags in strings', () => {
      const dataWithScript = {
        ...validBenchmarkData,
        cluster: '<script>alert("xss")</script>atlas',
      };

      const result = validateBenchmarkData(dataWithScript);

      expect(result.valid).toBe(true);
      expect(result.data.cluster).not.toContain('<script>');
      expect(result.data.cluster).toContain('atlas');
    });

    it('should truncate oversized strings', () => {
      const longString = 'a'.repeat(200000);
      const dataWithLongString = {
        ...validBenchmarkData,
        cluster: longString,
      };

      const result = validateBenchmarkData(dataWithLongString);

      expect(result.valid).toBe(true);
      expect(result.data.cluster.length).toBeLessThan(200000);
    });
  });

  describe('validateChartData', () => {
    const validChartData = {
      labels: ['A', 'B', 'C', 'D'],
      datasets: [
        {
          label: 'Series 1',
          data: [1, 2, 3, 4],
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderColor: '#000000',
        },
        {
          label: 'Series 2',
          data: [5, 6, 7, 8],
          backgroundColor: null,
          borderColor: null,
        },
      ],
    };

    it('should validate correct chart data', () => {
      const result = validateChartData(validChartData);

      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeNull();
    });

    it('should allow null values in data array', () => {
      const dataWithNulls = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Series 1',
            data: [1, null, 3],
          },
        ],
      };

      const result = validateChartData(dataWithNulls);

      expect(result.valid).toBe(true);
    });

    it('should reject too many datasets', () => {
      const manyDatasets = Array(101)
        .fill(null)
        .map((_, i) => ({
          label: `Series ${i}`,
          data: [1, 2, 3],
        }));

      const invalidData = {
        labels: ['A', 'B', 'C'],
        datasets: manyDatasets,
      };

      const result = validateChartData(invalidData);

      expect(result.valid).toBe(false);
    });

    it('should allow array backgroundColor/borderColor', () => {
      const dataWithArrayColors = {
        labels: ['A', 'B', 'C'],
        datasets: [
          {
            label: 'Series 1',
            data: [1, 2, 3],
            backgroundColor: ['#fff', '#000', 'transparent'],
            borderColor: ['red', 'blue', 'green'],
          },
        ],
      };

      const result = validateChartData(dataWithArrayColors);

      expect(result.valid).toBe(true);
    });

    it('should handle missing optional fields', () => {
      const minimalData = {
        labels: ['A', 'B'],
        datasets: [
          {
            label: 'Series 1',
            data: [1, 2],
          },
        ],
      };

      const result = validateChartData(minimalData);

      expect(result.valid).toBe(true);
    });
  });

  describe('fetchValidatedJson', () => {
    const validBenchmarkData = {
      cluster: 'atlas',
      nodes: 4096,
      fabric: 'HDR200',
      topology: 'dragonfly',
      latency_us: [{ size: '8B', p50: 1.2, p95: 1.6 }],
      bandwidth_gbps: [{ size: '1MB', gbps: 128 }],
    };

    it('should fetch and validate valid data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '1000'),
        },
        json: async () => validBenchmarkData,
      });

      const result = await fetchValidatedJson('/data/benchmarks/test.json', validateBenchmarkData);

      expect(result).toEqual(validBenchmarkData);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should reject HTTP errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: vi.fn(),
        },
      });

      await expect(
        fetchValidatedJson('/data/benchmarks/missing.json', validateBenchmarkData)
      ).rejects.toThrow('HTTP 404: Not Found');
    });

    it('should reject oversized responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => (15 * 1024 * 1024).toString()),
        },
        json: async () => validBenchmarkData,
      });

      await expect(
        fetchValidatedJson('/data/benchmarks/large.json', validateBenchmarkData)
      ).rejects.toThrow('exceeds maximum');
    });

    it('should reject validation failures', async () => {
      const invalidData = {
        cluster: 'atlas',
        nodes: -1, // Invalid
        latency_us: [{ size: '8B', p50: 1.2, p95: 1.6 }],
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '1000'),
        },
        json: async () => invalidData,
      });

      await expect(
        fetchValidatedJson('/data/benchmarks/invalid.json', validateBenchmarkData)
      ).rejects.toThrow('Validation failed');
    });

    it('should pass through network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        fetchValidatedJson('/data/benchmarks/test.json', validateBenchmarkData)
      ).rejects.toThrow('Network error');
    });
  });
});
