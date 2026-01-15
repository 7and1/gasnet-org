/**
 * Loading state component for async data loading.
 * Provides visual feedback during data fetching operations.
 *
 * @module LoadingState
 */

import React from 'react';
import clsx from 'clsx';
import styles from './LoadingState.module.css';

/**
 * Loading state component with optional message.
 *
 * @param {Object} props
 * @param {string} props.message - Custom loading message
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.compact - Use compact variant with smaller spacing
 * @returns {JSX.Element}
 *
 * @example
 * ```jsx
 * <LoadingState message="Loading benchmark data..." />
 * <LoadingState compact />
 * ```
 */
export default function LoadingState({ message = 'Loading...', className, compact = false }) {
  return (
    <div className={clsx(styles.container, compact && styles.compact, className)}>
      <div className={styles.spinner} aria-hidden="true" />
      <span className={styles.message}>{message}</span>
    </div>
  );
}

/**
 * Inline loading state for smaller spaces (e.g., within cards).
 *
 * @param {Object} props
 * @param {string} props.message - Custom loading message
 * @returns {JSX.Element}
 */
export function InlineLoading({ message = 'Loading...' }) {
  return <LoadingState message={message} compact />;
}
