/**
 * Unit Tests for src/hooks/useChartTheme.js
 * Tests the chart theme hook
 */

import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useChartTheme } from '../../src/hooks/useChartTheme';

// Mock Docusaurus theme-common
vi.mock('@docusaurus/theme-common', () => ({
  useColorMode: () => ({ colorMode: 'light', setColorMode: vi.fn() }),
}));

describe('useChartTheme', () => {
  it('should return a color palette object', () => {
    const { result } = renderHook(() => useChartTheme());

    expect(result.current).toBeDefined();
    expect(typeof result.current).toBe('object');
  });

  it('should include all required color properties', () => {
    const { result } = renderHook(() => useChartTheme());

    expect(result.current).toHaveProperty('text');
    expect(result.current).toHaveProperty('grid');
    expect(result.current).toHaveProperty('barFill');
    expect(result.current).toHaveProperty('border');
    expect(result.current).toHaveProperty('accent');
    expect(result.current).toHaveProperty('series');
  });

  it('should return valid color values', () => {
    const { result } = renderHook(() => useChartTheme());

    expect(typeof result.current.text).toBe('string');
    expect(typeof result.current.grid).toBe('string');
    expect(typeof result.current.barFill).toBe('string');
    expect(typeof result.current.border).toBe('string');
    expect(typeof result.current.accent).toBe('string');
    expect(Array.isArray(result.current.series)).toBe(true);
  });

  it('should have series palette with 6 colors', () => {
    const { result } = renderHook(() => useChartTheme());

    expect(result.current.series).toHaveLength(6);
    result.current.series.forEach(color => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });
});
