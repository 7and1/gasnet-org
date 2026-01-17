/**
 * BenchmarkChart component - displays latency benchmark data as a bar chart.
 * Includes accessibility features for screen readers.
 * Uses lazy loading for Chart.js to reduce initial bundle size.
 *
 * @module charts/BenchmarkChart
 */

import React, { useMemo, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { useChartTheme } from '../../hooks/useChartTheme';
import { useChartData } from '../../hooks/useChartData';
import {
  buildBaseChartOptions,
  createBarDataset,
  TooltipFormats,
  generateAccessibleDescription,
} from '../../lib/chartUtils';
import LoadingState from '../ui/LoadingState';
import ErrorBoundary from '../ErrorBoundary';

// Lazy load Chart.js components for code splitting
const Bar = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Bar })));

/**
 * Props for the BenchmarkChart component.
 *
 * @typedef {Object} BenchmarkChartProps
 * @property {string} [dataPath] - Path to benchmark JSON data (default: /benchmarks/default.json)
 * @property {number} [height] - Chart height in pixels (default: 320)
 * @property {string} [ariaLabel] - Custom ARIA label for the chart
 */

/**
 * Client-side chart component that renders the actual chart.
 *
 * @param {BenchmarkChartProps} props
 * @returns {JSX.Element}
 */
function BenchmarkChartClient({ dataPath = '/benchmarks/default.json', height = 320, ariaLabel }) {
  const chartTheme = useChartTheme();
  const { data, error, isLoading } = useChartData(dataPath);

  const chartData = useMemo(() => {
    if (!data) {
      return { labels: [], datasets: [] };
    }

    if (data.labels && data.dataset) {
      return {
        labels: data.labels,
        datasets: [createBarDataset(data.dataset.data, data.dataset.label, chartTheme)],
      };
    }

    if (data.latency_us) {
      const labels = data.latency_us.map(point => point.size);
      const values = data.latency_us.map(point => point.p50 ?? point.value ?? 0);
      const label = data.cluster ? `${data.cluster} latency (µs)` : 'Latency (µs)';
      return {
        labels,
        datasets: [createBarDataset(values, label, chartTheme)],
      };
    }

    return { labels: [], datasets: [] };
  }, [data, chartTheme]);

  const options = useMemo(
    () =>
      buildBaseChartOptions(chartTheme, {
        tooltipFormat: TooltipFormats.microseconds,
      }),
    [chartTheme]
  );

  if (error) {
    return (
      <div
        style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        role="alert"
        aria-live="polite"
      >
        <span style={{ color: 'var(--ifm-color-danger)' }}>
          Error loading benchmark data: {error}
        </span>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading benchmark chart..." />;
  }

  // Accessibility: Generate description for screen readers
  const accessibleDescription = generateAccessibleDescription(chartData, 'Benchmark latency data');

  return (
    <div
      className="chart-container"
      style={{ height }}
      role="region"
      aria-label={ariaLabel || 'Benchmark latency chart'}
    >
      <Suspense fallback={<LoadingState message="Loading chart..." height={height} />}>
        <Bar data={chartData} options={options} aria-label={accessibleDescription} />
      </Suspense>
      <span
        className="sr-only"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {accessibleDescription}
      </span>
    </div>
  );
}

/**
 * BenchmarkChart component with BrowserOnly wrapper for SSR compatibility.
 *
 * @param {BenchmarkChartProps} props
 * @returns {JSX.Element}
 *
 * @example
 * ```jsx
 * <BenchmarkChart />
 * <BenchmarkChart dataPath="/benchmarks/custom.json" height={400} />
 * ```
 */
export default function BenchmarkChart(props) {
  return (
    <ErrorBoundary>
      <noscript>
        <div className="noscript-chart-fallback">
          <h4>Benchmark Latency Data</h4>
          <p>Interactive chart requires JavaScript. Below is a summary of the benchmark data:</p>
          <table>
            <thead>
              <tr>
                <th>Message Size</th>
                <th>p50 Latency</th>
                <th>p95 Latency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>8B</td>
                <td>1.2 µs</td>
                <td>1.6 µs</td>
              </tr>
              <tr>
                <td>64B</td>
                <td>1.4 µs</td>
                <td>1.9 µs</td>
              </tr>
              <tr>
                <td>1KB</td>
                <td>2.1 µs</td>
                <td>2.8 µs</td>
              </tr>
              <tr>
                <td>8KB</td>
                <td>3.8 µs</td>
                <td>4.9 µs</td>
              </tr>
              <tr>
                <td>64KB</td>
                <td>8.6 µs</td>
                <td>10.4 µs</td>
              </tr>
              <tr>
                <td>1MB</td>
                <td>14.2 µs</td>
                <td>18.0 µs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </noscript>
      <BrowserOnly fallback={<LoadingState message="Loading benchmark chart..." />}>
        {() => <BenchmarkChartClient {...props} />}
      </BrowserOnly>
    </ErrorBoundary>
  );
}
