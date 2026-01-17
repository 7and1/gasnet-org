/**
 * Component Tests for src/components/ErrorBoundary.js
 * Tests the error boundary component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../src/components/ErrorBoundary';

// Component that throws an error for testing
const ThrowError = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console.error for expected errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should catch and display errors', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/An error occurred while rendering/)).toBeInTheDocument();
  });

  it('should display error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/error/i)).toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not display error details in production mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/error details/i)).not.toBeInTheDocument();

    process.env.NODE_ENV = originalEnv;
  });

  it('should have "Try Again" button that resets the error state', () => {
    const { rerender: _rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error should be displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Click Try Again
    const tryAgainButton = screen.getByLabelText('Try again');
    fireEvent.click(tryAgainButton);

    // Re-render with no error - should show children now
    _rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should have "Reload Page" button', () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: reloadSpy },
    });

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const reloadButton = screen.getByLabelText('Reload page');
    fireEvent.click(reloadButton);

    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('should apply correct ARIA attributes', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const alertDiv = screen.getByRole('alert');
    expect(alertDiv).toHaveAttribute('aria-live', 'assertive');
  });

  it('should handle nested children', () => {
    const { container: _container } = render(
      <ErrorBoundary>
        <div>
          <span>Child 1</span>
          <span>Child 2</span>
        </div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  it('should handle multiple error boundaries independently', () => {
    render(
      <>
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
        <ErrorBoundary>
          <div>Second boundary content</div>
        </ErrorBoundary>
      </>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Second boundary content')).toBeInTheDocument();
  });
});
