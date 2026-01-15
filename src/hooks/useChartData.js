/**
 * React hook for loading chart data from JSON files.
 * Provides loading and error states for async data fetching.
 *
 * @module useChartData
 */

import { useState, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

/**
 * Hook for fetching chart data from a JSON file.
 *
 * @param {string} dataPath - Path to the JSON data file relative to /data/
 * @returns {Object} Object containing data, error, and loading state
 *
 * @example
 * ```jsx
 * const { data, error, isLoading } = useChartData('/benchmarks/atlas-4096.json');
 * if (error) return <ErrorState />;
 * if (isLoading) return <LoadingState />;
 * return <Chart data={data} />;
 * ```
 */
export function useChartData(dataPath) {
  const dataUrl = useBaseUrl(`/data${dataPath}`);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let controller = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(dataUrl, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to load chart data (${response.status}: ${response.statusText})`);
        }

        const json = await response.json();

        if (isMounted) {
          setData(json);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && isMounted) {
          setError(err.message || 'Unknown error loading data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dataUrl]);

  return { data, error, isLoading };
}

export default useChartData;
