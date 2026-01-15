/**
 * Common utilities and default options for Chart.js configurations.
 * Centralizes chart registration and option builders.
 * Includes accessibility enhancements for screen readers.
 *
 * @module chartUtils
 */

// Tree-shakeable Chart.js imports - only what we need
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js/auto';
// import { getChartColors } from './colors'; // eslint-disable-line

/**
 * Register Chart.js components. Should be called once during app initialization.
 */
export function registerChartComponents() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
  );
}

// Auto-register on import
registerChartComponents();

/**
 * Default tooltip callback formats.
 */
export const TooltipFormats = Object.freeze({
  /** Format values as microseconds */
  microseconds: context => `${context.parsed.y} µs`,
  /** Format values as GB/s */
  bandwidth: context => `${context.parsed.y} GB/s`,
  /** Format values as raw numbers */
  raw: context => context.parsed.y.toString(),
});

/**
 * Build base chart options with common configuration.
 * Includes accessibility settings for screen readers.
 *
 * @param {Object} colors - Color palette from useChartTheme
 * @param {Object} options - Additional chart options
 * @param {string} options.title - Chart title text
 * @param {Function} options.tooltipFormat - Custom tooltip format function
 * @param {Object} options.additionalPlugins - Additional plugins configuration
 * @returns {Object} Chart.js options object
 */
export function buildBaseChartOptions(colors, options = {}) {
  const { title, tooltipFormat, additionalPlugins = {} } = options;

  return {
    responsive: true,
    maintainAspectRatio: false,
    // Accessibility: Enable screen reader support
    plugins: {
      legend: {
        labels: {
          color: colors.text,
        },
      },
      tooltip: {
        callbacks: {
          label: tooltipFormat || TooltipFormats.raw,
        },
      },
      ...(title && {
        title: {
          display: true,
          text: title,
          color: colors.text,
          align: 'start',
          font: {
            size: 14,
            weight: '600',
          },
        },
      }),
      ...additionalPlugins,
    },
    scales: {
      x: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
        // Accessibility: Label the x-axis
        title: {
          display: false,
          text: 'Categories',
        },
      },
      y: {
        ticks: { color: colors.text },
        grid: { color: colors.grid },
        // Accessibility: Label the y-axis
        title: {
          display: false,
          text: 'Values',
        },
      },
    },
  };
}

/**
 * Create a bar chart dataset with theme colors.
 *
 * @param {Array} data - Data array for the dataset
 * @param {string} label - Dataset label
 * @param {Object} colors - Color palette from useChartTheme
 * @param {Object} additionalOptions - Additional dataset options
 * @returns {Object} Chart.js dataset object
 */
export function createBarDataset(data, label, colors, additionalOptions = {}) {
  return {
    label,
    data,
    backgroundColor: colors.barFill,
    borderColor: colors.border,
    borderWidth: 1,
    ...additionalOptions,
  };
}

/**
 * Create a line chart dataset with theme colors.
 *
 * @param {Array} data - Data array for the dataset
 * @param {string} label - Dataset label
 * @param {Object} colors - Color palette from useChartTheme
 * @param {Object} additionalOptions - Additional dataset options
 * @param {boolean} additionalOptions.useAccent - Use accent color instead of primary
 * @param {boolean} additionalOptions.dashed - Apply dashed line style
 * @returns {Object} Chart.js dataset object
 */
export function createLineDataset(data, label, colors, additionalOptions = {}) {
  const { useAccent = false, dashed = false, ...rest } = additionalOptions;

  return {
    label,
    data,
    borderColor: useAccent ? colors.accent : colors.border,
    backgroundColor: 'transparent',
    ...(dashed && { borderDash: [6, 6] }),
    tension: 0.3,
    ...rest,
  };
}

/**
 * Generate accessible description for chart data.
 * Helps screen reader users understand chart contents.
 *
 * @param {Object} data - Chart data object
 * @param {string} chartTitle - Chart title
 * @returns {string} Accessible description
 */
export function generateAccessibleDescription(data, chartTitle = '') {
  if (!data || !data.datasets || !data.labels) {
    return `Interactive chart displaying ${chartTitle || 'data'}`;
  }

  const datasetCount = data.datasets.length;
  const labelCount = data.labels.length;
  const datasetLabels = data.datasets
    .map(ds => ds.label)
    .filter(Boolean)
    .join(', ');

  let description = `${chartTitle ? `Chart: ${chartTitle}.` : ''} `;
  description += `Showing ${labelCount} data points`;
  if (datasetCount > 1) {
    description += ` across ${datasetCount} series`;
  }
  if (datasetLabels) {
    description += `: ${datasetLabels}`;
  }

  return description;
}
