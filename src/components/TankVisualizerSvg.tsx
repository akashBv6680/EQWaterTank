import React, { useState } from 'react';
import type { ColumnData, SimulationStep } from '../utils/waterTankSolver';

interface TankVisualizerSvgProps {
  columns: ColumnData[];
  maxWallHeight: number;
  gridHeight: number;
  currentStep?: SimulationStep | null;
  onSelectColumn?: (colIndex: number) => void;
  selectedColumnIndex?: number | null;
  showOnlyWater?: boolean;
}

export const TankVisualizerSvg: React.FC<TankVisualizerSvgProps> = ({
  columns,
  gridHeight,
  currentStep,
  onSelectColumn,
  selectedColumnIndex,
  showOnlyWater = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const numCols = columns.length;
  if (numCols === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
        No columns to display.
      </div>
    );
  }

  // Layout metrics
  const cellWidth = 56;
  const cellHeight = 40;
  const paddingX = 48;
  const paddingBottom = 48;
  const paddingTop = 64; // space for pointer indicators

  const svgWidth = numCols * cellWidth + paddingX * 2;
  const svgHeight = gridHeight * cellHeight + paddingTop + paddingBottom;

  // Active step pointer positions
  const leftPointer = currentStep ? currentStep.left : null;
  const rightPointer = currentStep ? currentStep.right : null;
  const activeIndex = currentStep && currentStep.currentIndex >= 0 ? currentStep.currentIndex : null;

  return (
    <div className="relative w-full overflow-x-auto select-none rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-auto min-w-[580px] max-w-full font-sans"
        style={{ minHeight: '320px' }}
      >
        <defs>
          {/* Subtle gradient for water */}
          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.98" />
          </linearGradient>

          {/* Wall gradient matching Ever Quint Yellow */}
          <linearGradient id="wallGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <pattern id="gridPattern" width={cellWidth} height={cellHeight} patternUnits="userSpaceOnUse">
            <rect width={cellWidth} height={cellHeight} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Background Grid Pattern */}
        <g transform={`translate(${paddingX}, ${paddingTop})`}>
          {/* Horizontal Level Grid Lines & Left Axis Labels */}
          {Array.from({ length: gridHeight + 1 }).map((_, r) => {
            const y = (gridHeight - r) * cellHeight;
            return (
              <g key={`grid-line-${r}`}>
                <line
                  x1={0}
                  y1={y}
                  x2={numCols * cellWidth}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth={r === 0 ? 2 : 1}
                  className={r === 0 ? 'text-slate-400 dark:text-slate-600' : 'text-slate-200 dark:text-slate-800'}
                  strokeDasharray={r === 0 ? 'none' : '2,2'}
                />
                <text
                  x={-12}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 dark:fill-slate-500 font-mono text-[11px] font-medium"
                >
                  {r}
                </text>
              </g>
            );
          })}

          {/* Vertical Grid Lines */}
          {Array.from({ length: numCols + 1 }).map((_, c) => {
            const x = c * cellWidth;
            return (
              <line
                key={`vert-grid-${c}`}
                x1={x}
                y1={0}
                x2={x}
                y2={gridHeight * cellHeight}
                stroke="currentColor"
                strokeWidth={1}
                className="text-slate-200 dark:text-slate-800"
              />
            );
          })}

          {/* Columns Render: Wall and Water Units */}
          {columns.map((col) => {
            const x = col.index * cellWidth;
            const isHovered = hoveredIndex === col.index;
            const isSelected = selectedColumnIndex === col.index;
            const isActiveInStep = activeIndex === col.index;

            // Column water trapped in this step or total if not simulating
            const waterToShow = currentStep
              ? currentStep.trappedPerColumn[col.index] || 0
              : col.water;

            return (
              <g
                key={`col-${col.index}`}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIndex(col.index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectColumn?.(col.index)}
              >
                {/* Highlight Background on Hover or Selection */}
                {(isHovered || isSelected || isActiveInStep) && (
                  <rect
                    x={x}
                    y={0}
                    width={cellWidth}
                    height={gridHeight * cellHeight}
                    fill="currentColor"
                    className={
                      isActiveInStep
                        ? 'text-indigo-500/10 dark:text-indigo-400/15'
                        : isSelected
                        ? 'text-amber-500/10 dark:text-amber-400/15'
                        : 'text-slate-500/5 dark:text-slate-400/10'
                    }
                  />
                )}

                {/* 1. Water Cells (Rendered from wall height to wall height + water) */}
                {waterToShow > 0 && (
                  <g>
                    {Array.from({ length: waterToShow }).map((_, wIndex) => {
                      const level = (showOnlyWater ? 0 : col.height) + wIndex;
                      const y = (gridHeight - level - 1) * cellHeight;
                      return (
                        <rect
                          key={`water-${col.index}-${wIndex}`}
                          x={x + 1}
                          y={y + 1}
                          width={cellWidth - 2}
                          height={cellHeight - 2}
                          fill="url(#waterGradient)"
                          rx={3}
                          stroke="#0284c7"
                          strokeWidth="1"
                          className="transition-all duration-300"
                        />
                      );
                    })}

                    {/* Water Level Ripple Line at top of water column */}
                    <line
                      x1={x + 2}
                      y1={(gridHeight - (showOnlyWater ? 0 : col.height) - waterToShow) * cellHeight + 1}
                      x2={x + cellWidth - 2}
                      y2={(gridHeight - (showOnlyWater ? 0 : col.height) - waterToShow) * cellHeight + 1}
                      stroke="#bae6fd"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Water Count Label */}
                    <text
                      x={x + cellWidth / 2}
                      y={
                        (gridHeight - (showOnlyWater ? 0 : col.height) - waterToShow / 2) *
                          cellHeight +
                        4
                      }
                      textAnchor="middle"
                      className="fill-white font-mono text-[12px] font-bold drop-shadow-xs pointer-events-none"
                    >
                      +{waterToShow}
                    </text>
                  </g>
                )}

                {/* 2. Wall Blocks (Yellow with border, unless showOnlyWater is true) */}
                {!showOnlyWater && col.height > 0 && (
                  <g>
                    {Array.from({ length: col.height }).map((_, hIndex) => {
                      const y = (gridHeight - hIndex - 1) * cellHeight;
                      return (
                        <rect
                          key={`wall-${col.index}-${hIndex}`}
                          x={x + 1}
                          y={y + 1}
                          width={cellWidth - 2}
                          height={cellHeight - 2}
                          fill="url(#wallGradient)"
                          rx={3}
                          stroke="#ca8a04"
                          strokeWidth="1.2"
                        />
                      );
                    })}

                    {/* Top Wall Height Number */}
                    <text
                      x={x + cellWidth / 2}
                      y={(gridHeight - col.height / 2) * cellHeight + 4}
                      textAnchor="middle"
                      className="fill-amber-950 font-mono text-[12px] font-bold pointer-events-none"
                    >
                      {col.height}
                    </text>
                  </g>
                )}

                {/* 3. Bottom Axis Index Label */}
                <g transform={`translate(${x + cellWidth / 2}, ${gridHeight * cellHeight + 20})`}>
                  <rect
                    x={-14}
                    y={-12}
                    width={28}
                    height={20}
                    rx={4}
                    fill={isActiveInStep ? '#4f46e5' : isSelected ? '#ca8a04' : 'transparent'}
                    className="transition-colors"
                  />
                  <text
                    x={0}
                    y={2}
                    textAnchor="middle"
                    className={`font-mono text-[12px] font-semibold ${
                      isActiveInStep || isSelected
                        ? 'fill-white'
                        : 'fill-slate-600 dark:fill-slate-400'
                    }`}
                  >
                    [{col.index}]
                  </text>
                </g>

                {/* Height text below index */}
                <text
                  x={x + cellWidth / 2}
                  y={gridHeight * cellHeight + 38}
                  textAnchor="middle"
                  className="font-mono text-[11px] fill-slate-400 dark:fill-slate-500"
                >
                  h={col.height}
                </text>
              </g>
            );
          })}
        </g>

        {/* 4. Two-Pointer Indicators (Left and Right pointer arrows) */}
        {currentStep && (
          <g>
            {/* Left Pointer (Indigo) */}
            {leftPointer !== null && leftPointer < numCols && (
              <g
                transform={`translate(${paddingX + leftPointer * cellWidth + cellWidth / 2}, ${
                  paddingTop - 14
                })`}
                className="transition-transform duration-300 ease-out"
              >
                <rect x={-26} y={-24} width={52} height={20} rx={4} fill="#4f46e5" />
                <text x={0} y={-10} textAnchor="middle" className="fill-white font-mono text-[10px] font-bold">
                  LEFT (L)
                </text>
                <path d="M -6,-2 L 6,-2 L 0,6 Z" fill="#4f46e5" />
              </g>
            )}

            {/* Right Pointer (Emerald) */}
            {rightPointer !== null && rightPointer < numCols && (
              <g
                transform={`translate(${paddingX + rightPointer * cellWidth + cellWidth / 2}, ${
                  paddingTop - 14
                })`}
                className="transition-transform duration-300 ease-out"
              >
                <rect x={-28} y={-24} width={56} height={20} rx={4} fill="#059669" />
                <text x={0} y={-10} textAnchor="middle" className="fill-white font-mono text-[10px] font-bold">
                  RIGHT (R)
                </text>
                <path d="M -6,-2 L 6,-2 L 0,6 Z" fill="#059669" />
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
