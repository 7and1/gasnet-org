/**
 * ClientOnly HOC - Wraps components for client-side only rendering.
 * Provides Suspense boundary with loading state and noscript fallback.
 *
 * @module client/ClientOnly
 */

import React, { Suspense } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import LoadingState from '../ui/LoadingState';

/**
 * Default loading fallback component.
 */
const DefaultFallback = ({ message, height }) => <LoadingState message={message} height={height} />;

/**
 * HOC that wraps a component with BrowserOnly and Suspense boundaries.
 * This enables code splitting with React.lazy() while maintaining SSR compatibility.
 */
export function withClientOnly(Component, options = {}) {
  const { fallbackMessage = 'Loading...', height, noscriptFallback = null } = options;

  function WrappedComponent(props) {
    return (
      <>
        <noscript>
          {noscriptFallback || (
            <div className="client-only-noscript">
              <p>
                This content requires JavaScript. Please enable JavaScript to view the interactive
                chart.
              </p>
            </div>
          )}
        </noscript>
        <BrowserOnly fallback={<DefaultFallback message={fallbackMessage} height={height} />}>
          {() => (
            <Suspense fallback={<DefaultFallback message={fallbackMessage} height={height} />}>
              <Component {...props} />
            </Suspense>
          )}
        </BrowserOnly>
      </>
    );
  }

  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withClientOnly(${displayName})`;

  return WrappedComponent;
}

/**
 * Wrap a chart component with chart-specific defaults.
 */
export function withChartLoading(Component, options = {}) {
  return withClientOnly(Component, {
    fallbackMessage: 'Loading chart...',
    height: 320,
    ...options,
  });
}

/**
 * Create a noscript table fallback for chart data.
 */
export function createTableFallback(data, title = 'Data Table') {
  if (!data || !data.labels || !data.datasets) {
    return (
      <div className="noscript-fallback">
        <h3>{title}</h3>
        <p>Data visualization requires JavaScript.</p>
      </div>
    );
  }

  return (
    <div className="noscript-fallback">
      <table>
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>Label</th>
            {data.datasets.map((ds, i) => (
              <th key={i}>{ds.label || `Series ${i + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.labels.map((label, rowIdx) => (
            <tr key={rowIdx}>
              <td>{label}</td>
              {data.datasets.map((ds, colIdx) => (
                <td key={colIdx}>{ds.data?.[rowIdx] ?? '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default withClientOnly;
