/**
 * BenchmarkCompare component - compare multiple benchmark datasets.
 * Provides metric switching and dataset selection.
 * Uses lazy loading for Chart.js to reduce initial bundle size.
 *
 * @module charts/BenchmarkCompare
 */

import React, { useMemo, useState, useEffect, lazy, Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { useChartTheme } from '../../hooks/useChartTheme';
import {
  buildBaseChartOptions,
  createLineDataset,
  TooltipFormats,
  generateAccessibleDescription,
} from '../../lib/chartUtils';
import LoadingState from '../ui/LoadingState';
import ErrorBoundary from '../ErrorBoundary';
import { validateBenchmarkData } from '../../lib/validateJson';

// Lazy load Chart.js components for code splitting
const Line = lazy(() => import('react-chartjs-2').then(m => ({ default: m.Line })));

const DATASET_DEFS = [
  {
    id: 'atlas-4096',
    label: 'Atlas 4096-node (HDR 200)',
    path: '/benchmarks/atlas-4096.json',
  },
  {
    id: 'frontier-8192',
    label: 'Frontier 8192-node (Slingshot)',
    path: '/benchmarks/frontier-8192.json',
  },
  {
    id: 'neptune-2048',
    label: 'Neptune 2048-node (HDR 200)',
    path: '/benchmarks/neptune-2048.json',
  },
];

const METRIC_DEFS = {
  latency_p50: {
    label: 'Latency p50 (µs)',
    source: 'latency_us',
    key: 'p50',
    axisLabel: 'Latency (µs)',
    tooltipFormat: TooltipFormats.microseconds,
  },
  latency_p95: {
    label: 'Latency p95 (µs)',
    source: 'latency_us',
    key: 'p95',
    axisLabel: 'Latency (µs)',
    tooltipFormat: TooltipFormats.microseconds,
  },
  bandwidth: {
    label: 'Bandwidth (GB/s)',
    source: 'bandwidth_gbps',
    key: 'gbps',
    axisLabel: 'Bandwidth (GB/s)',
    tooltipFormat: TooltipFormats.bandwidth,
  },
};

const SIZE_MULTIPLIERS = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

function parseSizeLabel(label) {
  if (!label) return Number.POSITIVE_INFINITY;
  const match = label.trim().match(/(\d+(?:\.\d+)?)(B|KB|MB|GB)/i);
  if (!match) return Number.POSITIVE_INFINITY;
  const value = Number.parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  const multiplier = SIZE_MULTIPLIERS[unit] || 1;
  return value * multiplier;
}

function getSeriesColor(theme, index) {
  if (theme.series && theme.series.length > 0) {
    return theme.series[index % theme.series.length];
  }
  return index % 2 === 0 ? theme.border : theme.accent;
}

function buildMetadataRows(dataset) {
  const metadata = dataset?.metadata || {};
  const hardware = metadata.hardware || {};

  const rows = [
    { label: 'System', value: metadata.name || dataset.cluster },
    { label: 'Nodes', value: hardware.nodes || dataset.nodes },
    { label: 'Network', value: hardware.network || dataset.fabric },
    { label: 'Topology', value: hardware.topology || dataset.topology },
    { label: 'Measured', value: metadata.date },
  ];

  return rows.filter(row => row.value !== undefined && row.value !== null && row.value !== '');
}

/**
 * Client-side component that renders the comparison chart.
 *
 * @param {Object} props
 * @param {number} [props.height] - Chart height in pixels
 * @returns {JSX.Element}
 */
function BenchmarkCompareClient({ height = 360 }) {
  const chartTheme = useChartTheme();
  const dataRoot = useBaseUrl('/data');
  const datasetUrls = useMemo(
    () =>
      DATASET_DEFS.map(definition => ({
        ...definition,
        url: `${dataRoot}${definition.path}`,
      })),
    [dataRoot]
  );

  const [selected, setSelected] = useState(['atlas-4096', 'frontier-8192']);
  const [metric, setMetric] = useState('latency_p50');
  const [datasets, setDatasets] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchDatasets = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          datasetUrls.map(async definition => {
            const response = await fetch(definition.url, { signal: controller.signal });

            // Validate content size before parsing (ReDoS prevention)
            const contentLength = response.headers.get('content-length');
            if (contentLength) {
              const size = parseInt(contentLength, 10);
              const MAX_SIZE = 10 * 1024 * 1024; // 10MB
              if (size > MAX_SIZE) {
                throw new Error(`Dataset ${definition.label} exceeds maximum size (${size} bytes)`);
              }
            }

            if (!response.ok) {
              throw new Error(
                `Failed to load ${definition.label} (${response.status}: ${response.statusText})`
              );
            }
            const json = await response.json();

            // Validate data structure before using (security)
            const validationResult = validateBenchmarkData(json);
            if (!validationResult.valid) {
              throw new Error(
                `Invalid data in ${definition.label}: ${validationResult.errors.join(', ')}`
              );
            }

            return [definition.id, validationResult.data];
          })
        );

        if (isMounted) {
          setDatasets(Object.fromEntries(results));
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to load benchmark datasets');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDatasets();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [datasetUrls]);

  const toggleDataset = id => {
    setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const metricDef = METRIC_DEFS[metric];
  const activeDatasets = datasetUrls
    .filter(definition => selected.includes(definition.id))
    .map(definition => ({
      ...definition,
      data: datasets[definition.id],
    }))
    .filter(definition => definition.data && definition.data && definition.data[metricDef.source]);

  const sizeLabels = useMemo(() => {
    const sizes = new Set();
    activeDatasets.forEach(definition => {
      if (definition.data && definition.data[metricDef.source]) {
        definition.data[metricDef.source].forEach(point => sizes.add(point.size));
      }
    });
    return Array.from(sizes).sort((a, b) => parseSizeLabel(a) - parseSizeLabel(b));
  }, [activeDatasets, metricDef]);

  const chartData = useMemo(() => {
    if (!activeDatasets.length) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: sizeLabels,
      datasets: activeDatasets.map((definition, index) => {
        const valueMap = new Map(
          definition.data[metricDef.source].map(point => [point.size, point[metricDef.key]])
        );
        const seriesColor = getSeriesColor(chartTheme, index);
        const values = sizeLabels.map(label => (valueMap.has(label) ? valueMap.get(label) : null));

        return createLineDataset(values, definition.label, chartTheme, {
          borderColor: seriesColor,
          pointBackgroundColor: seriesColor,
          pointRadius: 3,
          spanGaps: true,
        });
      }),
    };
  }, [activeDatasets, chartTheme, metricDef, sizeLabels]);

  const options = useMemo(() => {
    const base = buildBaseChartOptions(chartTheme, {
      tooltipFormat: metricDef.tooltipFormat,
    });

    base.scales.x.title = {
      display: true,
      text: 'Message size',
      color: chartTheme.text,
    };
    base.scales.y.title = {
      display: true,
      text: metricDef.axisLabel,
      color: chartTheme.text,
    };
    base.plugins.legend.position = 'bottom';

    return base;
  }, [chartTheme, metricDef]);

  if (isLoading) {
    return <LoadingState message="Loading benchmark datasets..." />;
  }

  if (error) {
    return (
      <div role="alert" aria-live="polite">
        {error}
      </div>
    );
  }

  const accessibleDescription = generateAccessibleDescription(
    chartData,
    `Benchmark comparison: ${metricDef.label}`
  );

  return (
    <div className="benchmark-compare">
      <div className="benchmark-compare__controls">
        <div className="benchmark-compare__group">
          <span className="benchmark-compare__label">Datasets</span>
          <div className="benchmark-compare__options">
            {datasetUrls.map(definition => (
              <label key={definition.id} className="benchmark-compare__option">
                <input
                  type="checkbox"
                  checked={selected.includes(definition.id)}
                  onChange={() => toggleDataset(definition.id)}
                />
                {definition.label}
              </label>
            ))}
          </div>
        </div>
        <div className="benchmark-compare__group">
          <label className="benchmark-compare__label" htmlFor="metric-select">
            Metric
          </label>
          <select
            id="metric-select"
            className="benchmark-compare__select"
            value={metric}
            onChange={event => setMetric(event.target.value)}
          >
            {Object.entries(METRIC_DEFS).map(([key, def]) => (
              <option key={key} value={key}>
                {def.label}
              </option>
            ))}
          </select>
          <span className="benchmark-compare__hint">Select at least one dataset.</span>
        </div>
      </div>

      {activeDatasets.length === 0 ? (
        <div className="benchmark-compare__empty" role="status">
          Choose at least one dataset to render the comparison.
        </div>
      ) : (
        <div
          className="chart-container"
          style={{ height }}
          role="region"
          aria-label="Benchmark comparison chart"
        >
          <Suspense fallback={<LoadingState message="Loading chart..." height={height} />}>
            <Line data={chartData} options={options} aria-label={accessibleDescription} />
          </Suspense>
          <span className="sr-only">{accessibleDescription}</span>
        </div>
      )}

      {activeDatasets.length > 0 && (
        <div className="benchmark-compare__meta">
          {activeDatasets.map(definition => {
            const rows = buildMetadataRows(definition.data);
            return (
              <div key={definition.id} className="benchmark-compare__meta-card">
                <div className="benchmark-compare__meta-title">{definition.label}</div>
                {rows.length > 0 ? (
                  <ul>
                    {rows.map(row => (
                      <li key={row.label}>
                        <strong>{row.label}:</strong> {row.value}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No metadata provided.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * BenchmarkCompare component with SSR-safe wrapper.
 *
 * @param {Object} props
 * @returns {JSX.Element}
 */
export default function BenchmarkCompare(props) {
  return (
    <ErrorBoundary>
      <noscript>
        <div className="noscript-chart-fallback">
          <h4>Benchmark Comparison</h4>
          <p>Interactive comparison requires JavaScript. Select datasets and metrics above.</p>
        </div>
      </noscript>
      <BrowserOnly fallback={<LoadingState message="Loading benchmark comparison..." />}>
        {() => <BenchmarkCompareClient {...props} />}
      </BrowserOnly>
    </ErrorBoundary>
  );
}
