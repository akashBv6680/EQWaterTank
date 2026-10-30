/**
 * Algorithmic engine and simulation recorder for the Water Tank Problem (Trapping Rain Water).
 */

export interface ColumnData {
  index: number;
  height: number;
  water: number;
  maxLeft: number;
  maxRight: number;
  waterLevel: number;
  totalHeight: number;
}

export interface SimulationStep {
  step: number;
  left: number;
  right: number;
  maxLeft: number;
  maxRight: number;
  activeSide: 'left' | 'right' | 'initial' | 'complete';
  currentIndex: number;
  waterAdded: number;
  totalTrapped: number;
  trappedPerColumn: number[];
  description: string;
}

export interface TankSolution {
  heights: number[];
  totalWater: number;
  columns: ColumnData[];
  maxWallHeight: number;
  gridHeight: number;
  steps: SimulationStep[];
}

/**
 * Solves the water tank problem and computes all column states + two-pointer step timeline.
 */
export function solveWaterTank(heights: number[]): TankSolution {
  const n = heights.length;
  if (n === 0) {
    return {
      heights: [],
      totalWater: 0,
      columns: [],
      maxWallHeight: 0,
      gridHeight: 4,
      steps: [],
    };
  }

  // Pre-calculate prefix max and suffix max for static breakdown
  const leftMax = new Array(n).fill(0);
  const rightMax = new Array(n).fill(0);

  let currentLeft = 0;
  for (let i = 0; i < n; i++) {
    currentLeft = Math.max(currentLeft, heights[i]);
    leftMax[i] = currentLeft;
  }

  let currentRight = 0;
  for (let i = n - 1; i >= 0; i--) {
    currentRight = Math.max(currentRight, heights[i]);
    rightMax[i] = currentRight;
  }

  let totalWater = 0;
  const columns: ColumnData[] = [];
  let maxWallHeight = 0;

  for (let i = 0; i < n; i++) {
    const h = heights[i];
    maxWallHeight = Math.max(maxWallHeight, h);
    const boundedLevel = Math.min(leftMax[i], rightMax[i]);
    const water = Math.max(0, boundedLevel - h);
    totalWater += water;

    columns.push({
      index: i,
      height: h,
      water,
      maxLeft: leftMax[i],
      maxRight: rightMax[i],
      waterLevel: boundedLevel,
      totalHeight: h + water,
    });
  }

  const gridHeight = Math.max(maxWallHeight + 1, 6);

  // Generate step-by-step two-pointer timeline
  const steps = generateSimulationSteps(heights);

  return {
    heights,
    totalWater,
    columns,
    maxWallHeight,
    gridHeight,
    steps,
  };
}

/**
 * Simulates the O(N) time and O(1) space two-pointer approach, recording each step.
 */
function generateSimulationSteps(heights: number[]): SimulationStep[] {
  const n = heights.length;
  const steps: SimulationStep[] = [];
  const trappedSoFar = new Array(n).fill(0);

  if (n < 3) {
    steps.push({
      step: 0,
      left: 0,
      right: Math.max(0, n - 1),
      maxLeft: heights[0] || 0,
      maxRight: heights[n - 1] || 0,
      activeSide: 'complete',
      currentIndex: 0,
      waterAdded: 0,
      totalTrapped: 0,
      trappedPerColumn: [...trappedSoFar],
      description: 'Tank width is too narrow (< 3 blocks) to trap water between walls.',
    });
    return steps;
  }

  let left = 0;
  let right = n - 1;
  let maxLeft = heights[left];
  let maxRight = heights[right];
  let total = 0;
  let stepCounter = 0;

  // Initial step
  steps.push({
    step: stepCounter++,
    left,
    right,
    maxLeft,
    maxRight,
    activeSide: 'initial',
    currentIndex: -1,
    waterAdded: 0,
    totalTrapped: 0,
    trappedPerColumn: [...trappedSoFar],
    description: `Initialize two pointers: Left at index 0 (h=${heights[0]}), Right at index ${n - 1} (h=${heights[n - 1]}).`,
  });

  while (left <= right) {
    if (maxLeft <= maxRight) {
      const curr = left;
      const h = heights[curr];
      let water = 0;
      let desc = '';

      if (h >= maxLeft) {
        maxLeft = h;
        desc = `Left boundary updated: maxLeft is now ${maxLeft} at index ${curr}. No water trapped at this wall.`;
      } else {
        water = maxLeft - h;
        total += water;
        trappedSoFar[curr] = water;
        desc = `Index ${curr} is bounded by maxLeft (${maxLeft}). Water added: ${maxLeft} - ${h} = ${water} units. Total: ${total}.`;
      }

      steps.push({
        step: stepCounter++,
        left,
        right,
        maxLeft,
        maxRight,
        activeSide: 'left',
        currentIndex: curr,
        waterAdded: water,
        totalTrapped: total,
        trappedPerColumn: [...trappedSoFar],
        description: desc,
      });

      left++;
    } else {
      const curr = right;
      const h = heights[curr];
      let water = 0;
      let desc = '';

      if (h >= maxRight) {
        maxRight = h;
        desc = `Right boundary updated: maxRight is now ${maxRight} at index ${curr}. No water trapped at this wall.`;
      } else {
        water = maxRight - h;
        total += water;
        trappedSoFar[curr] = water;
        desc = `Index ${curr} is bounded by maxRight (${maxRight}). Water added: ${maxRight} - ${h} = ${water} units. Total: ${total}.`;
      }

      steps.push({
        step: stepCounter++,
        left,
        right,
        maxLeft,
        maxRight,
        activeSide: 'right',
        currentIndex: curr,
        waterAdded: water,
        totalTrapped: total,
        trappedPerColumn: [...trappedSoFar],
        description: desc,
      });

      right--;
    }
  }

  // Completion step
  steps.push({
    step: stepCounter,
    left: Math.min(left, n - 1),
    right: Math.max(0, right),
    maxLeft,
    maxRight,
    activeSide: 'complete',
    currentIndex: -1,
    waterAdded: 0,
    totalTrapped: total,
    trappedPerColumn: [...trappedSoFar],
    description: `Simulation completed! Both pointers crossed. Total trapped water: ${total} Units.`,
  });

  return steps;
}

export interface PresetItem {
  name: string;
  badge: string;
  heights: number[];
  description: string;
}

export const PRESET_OPTIONS: PresetItem[] = [
  {
    name: 'Ever Quint Assignment',
    badge: '18 Units',
    heights: [0, 4, 0, 0, 0, 6, 0, 6, 4, 0],
    description: 'Exact input from the interview assignment specification.',
  },
  {
    name: 'Classic LeetCode 42',
    badge: '6 Units',
    heights: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1],
    description: 'Standard multi-basin benchmark test case.',
  },
  {
    name: 'Twin Pillars Basin',
    badge: '25 Units',
    heights: [5, 0, 0, 0, 0, 0, 5],
    description: 'Deep canyon enclosed between two high outer towers.',
  },
  {
    name: 'Dual Peak Valley',
    badge: '18 Units',
    heights: [0, 5, 2, 0, 3, 1, 6, 0],
    description: 'Unequal walls with irregular internal floor heights.',
  },
  {
    name: 'Steep Gorge',
    badge: '15 Units',
    heights: [6, 1, 1, 1, 6],
    description: 'High surrounding cliffs with a broad floor.',
  },
  {
    name: 'Ascending Staircase',
    badge: '0 Units',
    heights: [1, 2, 3, 4, 5, 6],
    description: 'Monotonic ascending slope where water drains completely.',
  },
];

/**
 * Generate a random height array
 */
export function generateRandomHeights(length = 10, maxHeight = 6): number[] {
  const result: number[] = [];
  for (let i = 0; i < length; i++) {
    // 25% chance of zero floor
    if (Math.random() < 0.25) {
      result.push(0);
    } else {
      result.push(Math.floor(Math.random() * maxHeight) + 1);
    }
  }
  // Ensure endpoints occasionally have walls so water traps
  if (result.length > 2) {
    if (result[1] === 0) result[1] = Math.floor(Math.random() * (maxHeight - 1)) + 2;
    if (result[result.length - 2] === 0) result[result.length - 2] = Math.floor(Math.random() * (maxHeight - 1)) + 2;
  }
  return result;
}

/**
 * Parses a comma or space-separated string into a validated non-negative number array.
 */
export function parseHeightInput(input: string): { success: boolean; data: number[]; error?: string } {
  const trimmed = input.trim().replace(/^\[|\]$/g, '');
  if (!trimmed) {
    return { success: false, data: [], error: 'Array cannot be empty. Enter numbers like 0,4,0,0,0,6,0,6,4,0' };
  }

  const parts = trimmed.split(/[\s,]+/);
  const numbers: number[] = [];

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (!p) continue;
    const num = Number(p);
    if (isNaN(num)) {
      return { success: false, data: [], error: `Invalid number "${p}" at position ${i + 1}.` };
    }
    if (!Number.isInteger(num)) {
      return { success: false, data: [], error: `Heights must be integers. Found "${p}".` };
    }
    if (num < 0) {
      return { success: false, data: [], error: `Heights must be greater than -1 (n >= 0). Found "${p}".` };
    }
    if (num > 20) {
      return { success: false, data: [], error: `Height ${num} exceeds maximum visual limit (20).` };
    }
    numbers.push(num);
  }

  if (numbers.length === 0) {
    return { success: false, data: [], error: 'Please enter at least one height value.' };
  }
  if (numbers.length > 30) {
    return { success: false, data: [], error: 'Maximum supported array length for visualization is 30.' };
  }

  return { success: true, data: numbers };
}

/**
 * Generates ready-to-use Vanilla JavaScript & HTML/CSS code snippet
 * matching the Ever Quint interview assignment requirements.
 */
export function generateVanillaJsCode(heights: number[]): string {
  const heightsStr = JSON.stringify(heights);
  return `<!-- Water Tank Problem - Vanilla JavaScript & HTML/CSS Solution -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Water Tank Problem - Vanilla JS Solution</title>
  <style>
    :root {
      --wall-color: #facc15;
      --water-color: #0284c7;
      --cell-border: #94a3b8;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      padding: 2rem;
      background: #f8fafc;
      color: #0f172a;
    }
    h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .meta { font-family: monospace; font-size: 1rem; margin-bottom: 1.5rem; }
    .tank-table {
      border-collapse: collapse;
      margin-top: 1.5rem;
      background: #ffffff;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .tank-table td {
      width: 48px;
      height: 36px;
      border: 1px solid var(--cell-border);
      text-align: center;
      transition: background-color 0.3s ease;
    }
    .cell-wall { background-color: var(--wall-color); }
    .cell-water { background-color: var(--water-color); }
    .cell-empty { background-color: #ffffff; }
  </style>
</head>
<body>
  <h1>Water Tank Problem</h1>
  <div class="meta" id="info"></div>
  <div id="tank-container"></div>
  <h2 style="margin-top: 2rem; font-size: 1.25rem;">Isolated Water Representation</h2>
  <div id="water-container"></div>

  <script>
    // 1. Algorithmic Computation: Trapping Rain Water (Two Pointers - O(N) Time, O(1) Space)
    function computeWaterTrapped(heights) {
      let left = 0, right = heights.length - 1;
      let maxLeft = 0, maxRight = 0;
      let totalUnits = 0;
      const waterPerCol = new Array(heights.length).fill(0);

      while (left <= right) {
        if (heights[left] <= heights[right]) {
          if (heights[left] >= maxLeft) {
            maxLeft = heights[left];
          } else {
            const trapped = maxLeft - heights[left];
            totalUnits += trapped;
            waterPerCol[left] = trapped;
          }
          left++;
        } else {
          if (heights[right] >= maxRight) {
            maxRight = heights[right];
          } else {
            const trapped = maxRight - heights[right];
            totalUnits += trapped;
            waterPerCol[right] = trapped;
          }
          right--;
        }
      }
      return { totalUnits, waterPerCol };
    }

    // 2. DOM Grid Matrix Renderer
    function renderGrid(containerId, heights, waterPerCol, showWalls) {
      const container = document.getElementById(containerId);
      const maxHeight = Math.max(...heights, 0);
      const gridRows = Math.max(maxHeight + 1, 6);
      const cols = heights.length;

      const table = document.createElement('table');
      table.className = 'tank-table';

      // Build rows from top (highest level) to bottom (level 1)
      for (let r = gridRows; r >= 1; r--) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
          const td = document.createElement('td');
          const wallHeight = heights[c];
          const waterAmount = waterPerCol[c];

          if (showWalls && r <= wallHeight) {
            td.className = 'cell-wall';
          } else if (r <= wallHeight + waterAmount && r > (showWalls ? wallHeight : 0)) {
            td.className = 'cell-water';
          } else {
            td.className = 'cell-empty';
          }
          tr.appendChild(td);
        }
        table.appendChild(tr);
      }
      container.innerHTML = '';
      container.appendChild(table);
    }

    // Execution
    const inputHeights = ${heightsStr};
    const result = computeWaterTrapped(inputHeights);

    document.getElementById('info').textContent = 
      'Input: [' + inputHeights.join(',') + '] | Output: ' + result.totalUnits + ' Units';

    renderGrid('tank-container', inputHeights, result.waterPerCol, true);
    renderGrid('water-container', inputHeights, result.waterPerCol, false);
  </script>
</body>
</html>`;
}
