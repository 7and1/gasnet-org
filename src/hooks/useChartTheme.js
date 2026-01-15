/**
 * React hook for accessing chart theme colors based on Docusaurus color mode.
 *
 * @module useChartTheme
 */

import { useColorMode } from '@docusaurus/theme-common';
import { getChartColors } from '../lib/colors';

/**
 * Hook that provides chart colors based on the current Docusaurus color mode.
 * Automatically updates when the theme changes between light and dark modes.
 *
 * @returns {Object} Color palette object with text, grid, barFill, border, accent
 *
 * @example
 * ```jsx
 * const chartTheme = useChartTheme();
 * // chartTheme.text, chartTheme.grid, etc.
 * ```
 */
export function useChartTheme() {
  const { colorMode } = useColorMode();
  return getChartColors(colorMode);
}

export default useChartTheme;
