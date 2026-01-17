/**
 * React hook for loading chart data from JSON files.
 * Provides loading and error states for async data fetching.
 * Implements sessionStorage caching to reduce redundant network requests.
 *
 * @module useChartData
 */

import { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { validateBenchmarkData, validateChartData } from '../lib/validateJson';

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Maximum file size to prevent ReDoS attacks
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Deduplication map for concurrent requests
const pendingRequests = new Map();

/**
 * Generate a cache key for the given data path.
 *
 * @param {string} dataPath - The data path
 * @returns {string} Cache key
 */
function getCacheKey(dataPath) {
  return `chart-data-cache-${dataPath}`;
}

/**
 * Check if cached data is still valid.
 *
 * @param {Object} cachedItem - Cached item with timestamp and data
 * @returns {boolean} True if cache is valid
 */
function isCacheValid(cachedItem) {
  if (!cachedItem) return false;
  const age = Date.now() - cachedItem.timestamp;
  return age < CACHE_DURATION;
}

/**
 * Hook for fetching chart data from a JSON file.
 * Implements caching with sessionStorage and request deduplication.
 *
 * @param {string} dataPath - Path to the JSON data file relative to /data/
 * @param {Object} options - Options
 * @param {boolean} options.enableCache - Enable caching (default: true)
 * @param {string} options.schemaType - Schema type for validation ('chart' or 'benchmark', default: 'chart')
 * @returns {Object} Object containing data, error, and loading state
 *
 * @example
 * ```jsx
 * const { data, error, isLoading } = useChartData('/benchmarks/atlas-4096.json', { schemaType: 'benchmark' });
 * if (error) return <ErrorState />;
 * if (isLoading) return <LoadingState />;
 * return <Chart data={data} />;
 * ```
 */
export function useChartData(dataPath, options = {}) {
  const { enableCache = true, schemaType = 'chart' } = options;
  const dataUrl = useBaseUrl(`/data${dataPath}`);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      const cacheKey = getCacheKey(dataPath);

      // Check cache first
      if (enableCache && typeof sessionStorage !== 'undefined') {
        try {
          const cached = sessionStorage.getItem(cacheKey);
          if (cached) {
            const cachedItem = JSON.parse(cached);
            if (isCacheValid(cachedItem)) {
              if (isMounted) {
                setData(cachedItem.data);
                setIsLoading(false);
              }
              return;
            }
          }
        } catch (e) {
          // Cache read failed, proceed with fetch
          console.warn('Cache read failed:', e);
        }
      }

      // Deduplication: return promise if request is already pending
      if (pendingRequests.has(cacheKey)) {
        try {
          const result = await pendingRequests.get(cacheKey);
          if (isMounted) {
            setData(result);
            setError(null);
          }
        } catch (err) {
          if (isMounted) {
            setError(err.message || 'Unknown error loading data');
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
        return;
      }

      // Create new fetch request
      let controller = new AbortController();

      const fetchPromise = (async () => {
        const response = await fetch(dataUrl, { signal: controller.signal });

        // Validate content size before parsing (ReDoS prevention)
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          const size = parseInt(contentLength, 10);
          if (size > MAX_FILE_SIZE) {
            throw new Error(
              `Response size (${size} bytes) exceeds maximum allowed (${MAX_FILE_SIZE} bytes)`
            );
          }
        }

        if (!response.ok) {
          throw new Error(`Failed to load chart data (${response.status}: ${response.statusText})`);
        }

        const json = await response.json();

        // Validate data structure before using (security)
        const validationResult =
          schemaType === 'benchmark' ? validateBenchmarkData(json) : validateChartData(json);

        if (!validationResult.valid) {
          throw new Error(
            `Invalid data structure: ${validationResult.errors ? validationResult.errors.join(', ') : 'Unknown validation error'}`
          );
        }

        return validationResult.data;
      })();

      // Store pending request for deduplication
      pendingRequests.set(cacheKey, fetchPromise);

      try {
        const data = await fetchPromise;

        // Cache the result
        if (enableCache && typeof sessionStorage !== 'undefined') {
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: data }));
          } catch (e) {
            // Cache write failed (e.g., quota exceeded), continue normally
            console.warn('Cache write failed:', e);
          }
        }

        if (isMounted) {
          setData(data);
          setError(null);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message || 'Unknown error loading data');
        }
      } finally {
        // Clean up pending request
        pendingRequests.delete(cacheKey);
        controller = null;
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dataUrl, dataPath, enableCache, schemaType]);

  return { data, error, isLoading };
}

/**
 * Clear cached chart data. Useful for testing or forcing refresh.
 *
 * @param {string} [dataPath] - Specific data path to clear, or clears all if undefined
 */
export function clearChartDataCache(dataPath) {
  if (typeof sessionStorage === 'undefined') return;

  if (dataPath) {
    sessionStorage.removeItem(getCacheKey(dataPath));
  } else {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('chart-data-cache-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export default useChartData;
