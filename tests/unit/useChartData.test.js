/**
 * Unit Tests for src/hooks/useChartData.js
 * Tests the chart data fetching hook
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChartData, clearChartDataCache } from '../../src/hooks/useChartData';

// Mock global fetch
global.fetch = vi.fn();

// Mock useBaseUrl
vi.mock('@docusaurus/useBaseUrl', () => ({
  default: url => url,
}));

describe('useChartData', () => {
  const mockChartData = {
    labels: ['8B', '64B', '1KB', '8KB'],
    datasets: [
      {
        label: 'Latency',
        data: [1.2, 1.4, 2.1, 3.8],
      },
    ],
  };

  const mockBenchmarkData = {
    cluster: 'atlas',
    nodes: 4096,
    fabric: 'HDR200',
    topology: 'dragonfly',
    latency_us: [
      { size: '8B', p50: 1.2, p95: 1.6 },
      { size: '64B', p50: 1.4, p95: 1.9 },
    ],
    bandwidth_gbps: [{ size: '64KB', gbps: 92 }],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    clearChartDataCache();
  });

  afterEach(() => {
    clearChartDataCache();
  });

  describe('basic data fetching', () => {
    it('should start with loading state', () => {
      global.fetch.mockImplementation(() => new Promise(() => {}));

      const { result } = renderHook(() => useChartData('/benchmarks/test.json'));

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should fetch and return chart data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockChartData,
      });

      const { result } = renderHook(() => useChartData('/benchmarks/test.json'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toEqual(mockChartData);
      expect(result.current.error).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should fetch and validate benchmark data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockBenchmarkData,
      });

      const { result } = renderHook(() =>
        useChartData('/benchmarks/atlas.json', { schemaType: 'benchmark' })
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeDefined();
      expect(result.current.data.cluster).toBe('atlas');
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useChartData('/benchmarks/test.json'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeNull();
      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle HTTP errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: {
          get: vi.fn(),
        },
      });

      const { result } = renderHook(() => useChartData('/benchmarks/missing.json'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeNull();
      expect(result.current.error).toContain('404');
    });

    it('should handle validation errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => ({ invalid: 'data' }),
      });

      const { result } = renderHook(() =>
        useChartData('/benchmarks/invalid.json', { schemaType: 'benchmark' })
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeNull();
      expect(result.current.error).toContain('Invalid data structure');
    });
  });

  describe('caching', () => {
    it('should cache responses in sessionStorage', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockChartData,
      });

      const { result: result1 } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: true })
      );

      await waitFor(() => expect(result1.current.isLoading).toBe(false));

      // Second hook should use cache
      const { result: result2 } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: true })
      );

      // Should have data immediately from cache
      expect(result2.current.data).toEqual(mockChartData);

      await waitFor(() => expect(result2.current.isLoading).toBe(false));

      // Fetch should only be called once due to caching
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should bypass cache when enableCache is false', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockChartData,
      });

      const { result: result1 } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: false })
      );

      await waitFor(() => expect(result1.current.isLoading).toBe(false));

      const { result: result2 } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: false })
      );

      await waitFor(() => expect(result2.current.isLoading).toBe(false));

      // Fetch should be called twice when cache is disabled
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('request deduplication', () => {
    it('should deduplicate concurrent requests for same URL', async () => {
      let fetchCount = 0;
      global.fetch.mockImplementation(() => {
        fetchCount++;
        return Promise.resolve({
          ok: true,
          headers: {
            get: vi.fn(() => '500'),
          },
          json: async () => mockChartData,
        });
      });

      // Render multiple hooks for the same URL simultaneously
      const { result: result1 } = renderHook(() => useChartData('/benchmarks/test.json'));
      const { result: result2 } = renderHook(() => useChartData('/benchmarks/test.json'));
      const { result: result3 } = renderHook(() => useChartData('/benchmarks/test.json'));

      await waitFor(() => expect(result1.current.isLoading).toBe(false));
      await waitFor(() => expect(result2.current.isLoading).toBe(false));
      await waitFor(() => expect(result3.current.isLoading).toBe(false));

      // Should only fetch once despite 3 hooks
      expect(fetchCount).toBe(1);
    });
  });

  describe('clearChartDataCache', () => {
    it('should clear specific cached data', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockChartData,
      });

      const { result } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: true })
      );

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      // Clear cache
      clearChartDataCache('/benchmarks/test.json');

      // Next fetch should hit the network again
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => '500'),
        },
        json: async () => mockChartData,
      });

      const { result: result2 } = renderHook(() =>
        useChartData('/benchmarks/test.json', { enableCache: true })
      );

      await waitFor(() => expect(result2.current.isLoading).toBe(false));

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should clear all cached data when no path specified', () => {
      // Set some cache items
      sessionStorage.setItem(
        'chart-data-cache-/path1.json',
        JSON.stringify({ timestamp: Date.now(), data: {} })
      );
      sessionStorage.setItem(
        'chart-data-cache-/path2.json',
        JSON.stringify({ timestamp: Date.now(), data: {} })
      );
      sessionStorage.setItem('other-key', 'should remain');

      clearChartDataCache();

      expect(sessionStorage.getItem('chart-data-cache-/path1.json')).toBeNull();
      expect(sessionStorage.getItem('chart-data-cache-/path2.json')).toBeNull();
      expect(sessionStorage.getItem('other-key')).toBe('should remain');
    });
  });

  describe('security', () => {
    it('should reject oversized responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        headers: {
          get: vi.fn(() => (15 * 1024 * 1024).toString()),
        },
        json: async () => mockChartData,
      });

      const { result } = renderHook(() => useChartData('/benchmarks/large.json'));

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toContain('exceeds maximum');
    });
  });
});
