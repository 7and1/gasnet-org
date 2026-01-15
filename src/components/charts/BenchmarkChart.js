/**
 * BenchmarkChart component - displays latency benchmark data as a bar chart.
 * Includes accessibility features for screen readers.
 *
 * @module charts/BenchmarkChart
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Bar } from 'react-chartjs-2';
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

  const chartData = {
    labels: data.labels,
    datasets: [createBarDataset(data.dataset.data, data.dataset.label, chartTheme)],
  };

  const options = buildBaseChartOptions(chartTheme, {
    tooltipFormat: TooltipFormats.microseconds,
  });

  // Accessibility: Generate description for screen readers
  const accessibleDescription = generateAccessibleDescription(chartData, 'Benchmark latency data');

  return (
    <div
      className="chart-container"
      style={{ height }}
      role="region"
      aria-label={ariaLabel || 'Benchmark latency chart'}
    >
      <Bar data={chartData} options={options} aria-label={accessibleDescription} />
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
      <BrowserOnly fallback={<LoadingState message="Loading benchmark chart..." />}>
        {() => <BenchmarkChartClient {...props} />}
      </BrowserOnly>
    </ErrorBoundary>
  );
}
