/**
 * Vitest Configuration for Gasnet.org
 * Optimized for Docusaurus 3.9 + React 19
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.jsx'],
    include: ['tests/**/*.{test,spec}.{js,jsx}'],
    exclude: ['node_modules', 'build', '.docusaurus'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*{.,-}{test,spec}.{js,jsx}',
        'src/**/{index,dts}.{js,jsx}',
        'src/theme/**',
        'src/pages/index.js',
        'src/pages/404.js',
        'src/pages/community.js',
        'src/pages/labs/**',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 50,
        statements: 60,
      },
      // Per-module thresholds for critical code
      perFile: true,
    },
    // Mock CSS modules
    css: {
      modules: {
        classNameStrategy: 'non-scoped',
      },
    },
    // Aliases for Docusaurus imports
    alias: {
      '@docusaurus/BrowserOnly': path.resolve(__dirname, './tests/mocks/BrowserOnly.js'),
      '@docusaurus/useBaseUrl': path.resolve(__dirname, './tests/mocks/useBaseUrl.js'),
      '@docusaurus/theme-common': path.resolve(__dirname, './tests/mocks/theme-common.js'),
      '@docusaurus/Link': path.resolve(__dirname, './tests/mocks/Link.js'),
      '@theme/CodeBlock': path.resolve(__dirname, './tests/mocks/CodeBlock.js'),
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
    },
  },
});
