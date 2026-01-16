/**
 * Chart.js setup and registration.
 * Ensures components are registered once for all chart modules.
 *
 * @module chartSetup
 */

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js/auto';

/**
 * Register Chart.js components.
 */
export function registerChartComponents() {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
  );
}

// Auto-register on import.
registerChartComponents();
