/**
 * Component Tests for src/components/ui/LoadingState.js
 * Tests the loading state component
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState, { InlineLoading } from '../../src/components/ui/LoadingState';

describe('LoadingState', () => {
  it('should render with default message', () => {
    render(<LoadingState />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<LoadingState message="Loading data..." />);

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const { container } = render(<LoadingState className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should apply compact class when compact is true', () => {
    const { container } = render(<LoadingState compact />);

    expect(container.firstChild).toHaveClass('compact');
  });

  it('should apply custom height when provided', () => {
    const { container } = render(<LoadingState height={400} />);

    expect(container.firstChild).toHaveStyle({ height: '400px' });
  });

  it('should render spinner with aria-hidden', () => {
    const { container } = render(<LoadingState />);

    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply compact variant correctly', () => {
    const { container: compactContainer } = render(<LoadingState compact />);
    const { container: normalContainer } = render(<LoadingState />);

    expect(compactContainer.firstChild).toHaveClass('compact');
    expect(normalContainer.firstChild).not.toHaveClass('compact');
  });

  it('should not apply height style when height is not provided', () => {
    const { container } = render(<LoadingState />);

    expect(container.firstChild.style.height).toBe('');
  });

  it('should handle all props together', () => {
    const { container } = render(
      <LoadingState message="Custom message" className="my-class" compact height={200} />
    );

    expect(screen.getByText('Custom message')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('my-class');
    expect(container.firstChild).toHaveClass('compact');
    expect(container.firstChild).toHaveStyle({ height: '200px' });
  });
});

describe('InlineLoading', () => {
  it('should render as compact LoadingState', () => {
    const { container } = render(<InlineLoading message="Inline loading..." />);

    expect(screen.getByText('Inline loading...')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('compact');
  });

  it('should use default message when not provided', () => {
    render(<InlineLoading />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
