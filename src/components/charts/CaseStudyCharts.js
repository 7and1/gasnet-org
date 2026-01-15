/**
 * CaseStudyCharts component - displays latency and bandwidth charts for case studies.
 *
 * @module charts/CaseStudyCharts
 */

import React, { useMemo } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Bar, Line } from 'react-chartjs-2';
import { useChartTheme } from '../../hooks/useChartTheme';
import { useChartData } from '../../hooks/useChartData';
import {
  buildBaseChartOptions,
  createBarDataset,
  createLineDataset,
  generateAccessibleDescription,
} from '../../lib/chartUtils';
import LoadingState from '../ui/LoadingState';
import ErrorBoundary from '../ErrorBoundary';

/**
 * Props for the CaseStudyCharts component.
 *
 * @typedef {Object} CaseStudyChartsProps
 * @property {string} [dataPath] - Path to benchmark JSON data (default: /benchmarks/atlas-4096.json)
 * @property {number} [chartHeight] - Individual chart height in pixels (default: 280)
 */

/**
 * Client-side charts component that renders the latency and bandwidth charts.
 *
 * @param {CaseStudyChartsProps} props
 * @returns {JSX.Element}
 */
function CaseStudyChartsClient({ dataPath = '/benchmarks/atlas-4096.json', chartHeight = 280 }) {
  const chartTheme = useChartTheme();
  const { data, error, isLoading } = useChartData(dataPath);

  const latencyChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.latency_us.map(point => point.size),
      datasets: [
        createLineDataset(
          data.latency_us.map(point => point.p50),
          'p50 latency (µs)',
          chartTheme
        ),
        createLineDataset(
          data.latency_us.map(point => point.p95),
          'p95 latency (µs)',
          chartTheme,
          { useAccent: true, dashed: true }
        ),
      ],
    };
  }, [data, chartTheme]);

  const bandwidthChart = useMemo(() => {
    if (!data) return null;

    return {
      labels: data.bandwidth_gbps.map(point => point.size),
      datasets: [
        createBarDataset(
          data.bandwidth_gbps.map(point => point.gbps),
          'Sustained bandwidth (GB/s)',
          chartTheme
        ),
      ],
    };
  }, [data, chartTheme]);

  if (error) {
    return (
      <div role="alert" aria-live="polite">
        Dataset error: {error}
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState message="Loading benchmark dataset..." />;
  }

  // Accessibility: Generate descriptions for screen readers
  const latencyDescription = generateAccessibleDescription(
    latencyChart,
    'Latency distribution by message size'
  );
  const bandwidthDescription = generateAccessibleDescription(
    bandwidthChart,
    'Bandwidth scaling by message size'
  );

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <div
        className="chart-container"
        style={{ height: chartHeight }}
        role="region"
        aria-label="Latency distribution chart showing p50 and p95 latency across message sizes"
      >
        <Line
          data={latencyChart}
          options={buildBaseChartOptions(chartTheme, { title: 'Latency distribution' })}
        />
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
          {latencyDescription}
        </span>
      </div>
      <div
        className="chart-container"
        style={{ height: chartHeight }}
        role="region"
        aria-label="Bandwidth scaling chart showing sustained bandwidth in GB/s"
      >
        <Bar
          data={bandwidthChart}
          options={buildBaseChartOptions(chartTheme, { title: 'Bandwidth scaling' })}
        />
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
          {bandwidthDescription}
        </span>
      </div>
    </div>
  );
}

/**
 * CaseStudyCharts component with BrowserOnly wrapper for SSR compatibility.
 *
 * @param {CaseStudyChartsProps} props
 * @returns {JSX.Element}
 *
 * @example
 * ```jsx
 * <CaseStudyCharts />
 * <CaseStudyCharts dataPath="/benchmarks/custom.json" chartHeight={320} />
 * ```
 */
export default function CaseStudyCharts(props) {
  return (
    <ErrorBoundary>
      <BrowserOnly fallback={<LoadingState message="Loading benchmark charts..." />}>
        {() => <CaseStudyChartsClient {...props} />}
      </BrowserOnly>
    </ErrorBoundary>
  );
}
