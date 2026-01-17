/**
 * Vitest Setup File
 * Global test configuration and mocks
 */

import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Docusaurus BrowserOnly
vi.mock('@docusaurus/BrowserOnly', () => ({
  default: ({ children, fallback }) => (children ? children() : fallback),
}));

// Mock useBaseUrl
vi.mock('@docusaurus/useBaseUrl', () => ({
  default: url => url,
}));

// Mock Docusaurus theme common
vi.mock('@docusaurus/theme-common', () => ({
  useColorMode: () => ({ colorMode: 'light', setColorMode: vi.fn() }),
}));

// Mock Giscus component
vi.mock('@giscus/react', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock Chart.js
vi.mock('chart.js/auto', () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  BarElement: vi.fn(),
  LineElement: vi.fn(),
  PointElement: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
  Filler: vi.fn(),
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => (
    <div data-testid="chart-bar" data-chart-data={JSON.stringify(data)}>
      Chart Bar
    </div>
  ),
  Line: ({ data }) => (
    <div data-testid="chart-line" data-chart-data={JSON.stringify(data)}>
      Chart Line
    </div>
  ),
}));

// Mock Umami analytics
vi.mock('@umami/node', () => ({
  init: vi.fn(),
  trackEvent: vi.fn(),
  trackPageView: vi.fn(),
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: index => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  sessionStorageMock.clear();
});
