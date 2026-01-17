/**
 * Component Tests for src/components/charts/CaseStudyCharts.js
 * Tests the case study charts component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import CaseStudyCharts from '../../src/components/charts/CaseStudyCharts';

// Mock useChartData
const mockBenchmarkData = {
  cluster: 'atlas',
  nodes: 4096,
  fabric: 'HDR200',
  topology: 'dragonfly',
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

vi.mock('../../src/hooks/useChartData', () => ({
  useChartData: vi.fn(() => ({
    data: null,
    error: null,
    isLoading: true,
  })),
}));

describe('CaseStudyCharts', () => {
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

    render(<CaseStudyCharts />);

    expect(screen.getByText(/Loading benchmark dataset/)).toBeInTheDocument();
  });

  it('should render error state when fetch fails', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: null,
      error: 'Network error',
      isLoading: false,
    });

    render(<CaseStudyCharts />);

    expect(screen.getByText(/Dataset error/)).toBeInTheDocument();
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
  });

  it('should render both charts when data is loaded', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<CaseStudyCharts />);

    const lineChart = container.querySelector('[data-testid="chart-line"]');
    const barChart = container.querySelector('[data-testid="chart-bar"]');

    expect(lineChart).toBeInTheDocument();
    expect(barChart).toBeInTheDocument();
  });

  it('should use custom dataPath prop', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    render(<CaseStudyCharts dataPath="/custom/data.json" />);

    expect(useChartData).toHaveBeenCalledWith('/custom/data.json', undefined);
  });

  it('should use custom chartHeight prop', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<CaseStudyCharts chartHeight={350} />);

    const chartContainers = container.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
      expect(container).toHaveStyle({ height: '350px' });
    });
  });

  it('should render with noscript fallback', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<CaseStudyCharts />);

    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });

  it('should render accessible descriptions for both charts', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<CaseStudyCharts />);

    const srOnlyElements = container.querySelectorAll('.sr-only');
    expect(srOnlyElements.length).toBeGreaterThanOrEqual(2);
  });

  it('should have proper ARIA labels on chart regions', () => {
    const { useChartData } = require('../../src/hooks/useChartData');
    useChartData.mockReturnValue({
      data: mockBenchmarkData,
      error: null,
      isLoading: false,
    });

    const { container } = render(<CaseStudyCharts />);

    const chartRegions = container.querySelectorAll('[role="region"]');
    expect(chartRegions.length).toBeGreaterThanOrEqual(2);
  });
});
