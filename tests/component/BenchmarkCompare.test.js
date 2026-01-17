/**
 * Component Tests for src/components/charts/BenchmarkCompare.js
 * Tests the benchmark comparison component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BenchmarkCompare from '../../src/components/charts/BenchmarkCompare';

// Mock validateBenchmarkData
vi.mock('../../src/lib/validateJson', () => ({
  validateBenchmarkData: vi.fn(data => ({ valid: true, data })),
}));

// Mock fetch
global.fetch = vi.fn();

const mockDatasets = {
  'atlas-4096': {
    cluster: 'atlas',
    nodes: 4096,
    fabric: 'HDR200',
    topology: 'dragonfly',
    metadata: {
      name: 'Atlas 4096-node',
      date: '2024-01-15',
      hardware: {
        nodes: 4096,
        network: 'HDR200',
        topology: 'dragonfly',
      },
    },
    latency_us: [
      { size: '8B', p50: 1.2, p95: 1.6 },
      { size: '64B', p50: 1.4, p95: 1.9 },
    ],
    bandwidth_gbps: [{ size: '1MB', gbps: 128 }],
  },
  'frontier-8192': {
    cluster: 'frontier',
    nodes: 8192,
    fabric: 'Slingshot',
    topology: 'torus',
    metadata: {
      name: 'Frontier 8192-node',
      date: '2024-02-01',
    },
    latency_us: [
      { size: '8B', p50: 1.0, p95: 1.4 },
      { size: '64B', p50: 1.2, p95: 1.7 },
    ],
    bandwidth_gbps: [{ size: '1MB', gbps: 140 }],
  },
};

describe('BenchmarkCompare', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    render(<BenchmarkCompare />);

    expect(screen.getByText(/Loading benchmark datasets/)).toBeInTheDocument();
  });

  it('should render error state on fetch failure', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });
  });

  it('should render controls and chart when data loads', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      if (url.includes('frontier')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['frontier-8192'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    // Check for dataset checkboxes
    expect(screen.getByText(/Datasets/)).toBeInTheDocument();
    expect(screen.getByText(/Atlas 4096-node/)).toBeInTheDocument();
    expect(screen.getByText(/Frontier 8192-node/)).toBeInTheDocument();

    // Check for metric selector
    expect(screen.getByText(/Metric/)).toBeInTheDocument();
  });

  it('should allow toggling datasets', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      if (url.includes('frontier')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['frontier-8192'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Find the Atlas checkbox
    const atlasCheckbox = screen.getByLabelText(/Atlas 4096-node/, { selector: 'input' });
    expect(atlasCheckbox).toBeChecked();

    // Uncheck Atlas
    await user.click(atlasCheckbox);
    expect(atlasCheckbox).not.toBeChecked();

    // Re-check Atlas
    await user.click(atlasCheckbox);
    expect(atlasCheckbox).toBeChecked();
  });

  it('should allow changing metrics', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      if (url.includes('frontier')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['frontier-8192'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Find the metric select
    const metricSelect = screen.getByLabelText(/Metric/);
    expect(metricSelect).toHaveValue('latency_p50');

    // Change to bandwidth
    await user.selectOptions(metricSelect, 'bandwidth');
    expect(metricSelect).toHaveValue('bandwidth');
  });

  it('should show empty message when no datasets selected', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const user = userEvent.setup();

    // Uncheck all datasets
    const atlasCheckbox = screen.getByLabelText(/Atlas 4096-node/, { selector: 'input' });
    await user.click(atlasCheckbox);

    await waitFor(() => {
      expect(screen.getByText(/Choose at least one dataset/)).toBeInTheDocument();
    });
  });

  it('should display metadata for active datasets', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      if (url.includes('frontier')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['frontier-8192'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    render(<BenchmarkCompare />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    // Check for metadata display
    expect(screen.getByText(/Atlas 4096-node/)).toBeInTheDocument();
  });

  it('should use custom height prop', async () => {
    global.fetch.mockImplementation(url => {
      if (url.includes('atlas')) {
        return Promise.resolve({
          ok: true,
          headers: { get: () => '1000' },
          json: async () => mockDatasets['atlas-4096'],
        });
      }
      return Promise.resolve({
        ok: true,
        headers: { get: () => '500' },
        json: async () => ({ cluster: 'test' }),
      });
    });

    const { container } = render(<BenchmarkCompare height={400} />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading/)).not.toBeInTheDocument();
    });

    const chartContainer = container.querySelector('.chart-container');
    expect(chartContainer).toHaveStyle({ height: '400px' });
  });

  it('should render with noscript fallback', async () => {
    global.fetch.mockImplementation(() => new Promise(() => {}));

    const { container } = render(<BenchmarkCompare />);

    const noscript = container.querySelector('noscript');
    expect(noscript).toBeInTheDocument();
  });
});
