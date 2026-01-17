/**
 * Components exports index.
 * Provides backward compatibility for imports from the components directory.
 *
 * @module components
 */

// Chart components - re-exported for backward compatibility
export { default as BenchmarkChart } from './charts/BenchmarkChart';
export { default as BenchmarkCompare } from './charts/BenchmarkCompare';
export { default as CaseStudyCharts } from './charts/CaseStudyCharts';

// UI components
export { default as LoadingState } from './ui/LoadingState';
export { InlineLoading } from './ui/LoadingState';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as GiscusComponent } from './GiscusComponent';
export { default as CodeTabs } from './CodeTabs';

// Client wrapper components
export { withClientOnly, withChartLoading, createTableFallback } from './client/ClientOnly';
export { default as ClientOnly } from './client/ClientOnly';
