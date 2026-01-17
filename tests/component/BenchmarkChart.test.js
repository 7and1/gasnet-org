/**
 * Component Tests for src/components/charts/BenchmarkChart.js
 * Tests the benchmark chart component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import BenchmarkChart from '../../src/components/charts/BenchmarkChart';

// Mock useChartData
const mockData = {
  labels: ['8B', '64B', '1KB', '8KB'],
  dataset: {
    data: [1.2, 1.4, 2.1, 3.8],
    label: 'Latency (µs)',
  },
};

vi.mock('../../src/hooks/useChartData', () => ({
  useChartData: vi.fn(() => ({
    data: null,
    error: null,
    isLoading: true,
  })),
}));

describe('BenchmarkChart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(<BenchmarkChart />);

    expect(screen.getByText(/Loading/)).toBeInTheDocument();
  });

  it('should render error state when fetch fails', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: null,
      error: 'Failed to load data',
      isLoading: false,
    });

    render(<BenchmarkChart />);

    expect(screen.getByText(/Error loading benchmark data/)).toBeInTheDocument();
    expect(screen.getByText(/Failed to load data/)).toBeInTheDocument();
  });

  it('should render chart when data is loaded', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart />);

    const chart = container.querySelector('[data-testid="chart-bar"]');
    expect(chart).toBeInTheDocument();
  });

  it('should use custom dataPath prop', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    render(<BenchmarkChart dataPath="/custom/path.json" />);

    expect(useChartData).toHaveBeenCalledWith('/custom/path.json', undefined);
  });

  it('should use custom height prop', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart height={400} />);

    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveStyle({ height: '400px' });
  });

  it('should render with noscript fallback', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart />);

    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });

  it('should render accessible description', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart />);

    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
  });

  it('should handle latency_us data format', () => {
    const latencyData = {
      cluster: 'test-cluster',
      latency_us: [
        { size: '8B', p50: 1.2, p95: 1.6 },
        { size: '64B', p50: 1.4, p95: 1.9 },
      ],
    };

    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: latencyData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart />);

    const chart = container.querySelector('[data-testid="chart-bar"]');
    expect(chart).toBeInTheDocument();
  });

  it('should use custom ariaLabel', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<BenchmarkChart ariaLabel="Custom chart label" />);

    const chartRegion = container.querySelector('[role="region"]');
    expect(chartRegion).toHaveAttribute('aria-label', 'Custom chart label');
  });
});
