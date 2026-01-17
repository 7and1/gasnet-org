/**
 * Unit Tests for src/lib/colors.js
 * Tests WCAG-compliant color constants and utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  DARK_COLORS,
  LIGHT_COLORS,
  getChartColors,
  getTextColor,
  getGridColor,
  getBarFillColor,
  getBorderColor,
  getAccentColor,
} from '../../src/lib/colors';

describe('colors', () => {
  describe('DARK_COLORS', () => {
    it('should be a frozen object', () => {
      expect(Object.isFrozen(DARK_COLORS)).toBe(true);
    });

    it('should have all required color properties', () => {
      expect(DARK_COLORS).toHaveProperty('text');
      expect(DARK_COLORS).toHaveProperty('grid');
      expect(DARK_COLORS).toHaveProperty('barFill');
      expect(DARK_COLORS).toHaveProperty('border');
      expect(DARK_COLORS).toHaveProperty('accent');
      expect(DARK_COLORS).toHaveProperty('series');
    });

    it('should have valid hex/rgba colors', () => {
      expect(DARK_COLORS.text).toMatch(/^#[0-9a-f]{6}$/i);
      expect(DARK_COLORS.border).toMatch(/^#[0-9a-f]{6}$/i);
      expect(DARK_COLORS.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(DARK_COLORS.grid).toMatch(/^rgba\(/);
      expect(DARK_COLORS.barFill).toMatch(/^rgba\(/);
    });

    it('should have series palette with 6 colors', () => {
      expect(DARK_COLORS.series).toHaveLength(6);
      DARK_COLORS.series.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('LIGHT_COLORS', () => {
    it('should be a frozen object', () => {
      expect(Object.isFrozen(LIGHT_COLORS)).toBe(true);
    });

    it('should have all required color properties', () => {
      expect(LIGHT_COLORS).toHaveProperty('text');
      expect(LIGHT_COLORS).toHaveProperty('grid');
      expect(LIGHT_COLORS).toHaveProperty('barFill');
      expect(LIGHT_COLORS).toHaveProperty('border');
      expect(LIGHT_COLORS).toHaveProperty('accent');
      expect(LIGHT_COLORS).toHaveProperty('series');
    });

    it('should have valid hex/rgba colors', () => {
      expect(LIGHT_COLORS.text).toMatch(/^#[0-9a-f]{6}$/i);
      expect(LIGHT_COLORS.border).toMatch(/^#[0-9a-f]{6}$/i);
      expect(LIGHT_COLORS.accent).toMatch(/^#[0-9a-f]{6}$/i);
      expect(LIGHT_COLORS.grid).toMatch(/^rgba\(/);
      expect(LIGHT_COLORS.barFill).toMatch(/^rgba\(/);
    });

    it('should have series palette with 6 colors', () => {
      expect(LIGHT_COLORS.series).toHaveLength(6);
      LIGHT_COLORS.series.forEach(color => {
        expect(color).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });
  });

  describe('getChartColors', () => {
    it('should return DARK_COLORS for dark mode', () => {
      const result = getChartColors('dark');
      expect(result).toEqual(DARK_COLORS);
    });

    it('should return LIGHT_COLORS for light mode', () => {
      const result = getChartColors('light');
      expect(result).toEqual(LIGHT_COLORS);
    });

    it('should default to LIGHT_COLORS for unknown mode', () => {
      const result = getChartColors('unknown');
      expect(result).toEqual(LIGHT_COLORS);
    });

    it('should return frozen objects', () => {
      const dark = getChartColors('dark');
      const light = getChartColors('light');
      expect(Object.isFrozen(dark)).toBe(true);
      expect(Object.isFrozen(light)).toBe(true);
    });
  });

  describe('getTextColor', () => {
    it('should return dark text color for dark mode', () => {
      expect(getTextColor('dark')).toBe(DARK_COLORS.text);
    });

    it('should return light text color for light mode', () => {
      expect(getTextColor('light')).toBe(LIGHT_COLORS.text);
    });
  });

  describe('getGridColor', () => {
    it('should return dark grid color for dark mode', () => {
      expect(getGridColor('dark')).toBe(DARK_COLORS.grid);
    });

    it('should return light grid color for light mode', () => {
      expect(getGridColor('light')).toBe(LIGHT_COLORS.grid);
    });
  });

  describe('getBarFillColor', () => {
    it('should return dark bar fill for dark mode', () => {
      expect(getBarFillColor('dark')).toBe(DARK_COLORS.barFill);
    });

    it('should return light bar fill for light mode', () => {
      expect(getBarFillColor('light')).toBe(LIGHT_COLORS.barFill);
    });
  });

  describe('getBorderColor', () => {
    it('should return dark border for dark mode', () => {
      expect(getBorderColor('dark')).toBe(DARK_COLORS.border);
    });

    it('should return light border for light mode', () => {
      expect(getBorderColor('light')).toBe(LIGHT_COLORS.border);
    });
  });

  describe('getAccentColor', () => {
    it('should return dark accent for dark mode', () => {
      expect(getAccentColor('dark')).toBe(DARK_COLORS.accent);
    });

    it('should return light accent for light mode', () => {
      expect(getAccentColor('light')).toBe(LIGHT_COLORS.accent);
    });
  });

  describe('color immutability', () => {
    it('should not allow modification of DARK_COLORS', () => {
      expect(() => {
        DARK_COLORS.text = '#ffffff';
      }).toThrow();
    });

    it('should not allow modification of LIGHT_COLORS', () => {
      expect(() => {
        LIGHT_COLORS.text = '#000000';
      }).toThrow();
    });

    it('should not allow adding properties to DARK_COLORS', () => {
      expect(() => {
        DARK_COLORS.newColor = '#ff0000';
      }).toThrow();
    });
  });
});
