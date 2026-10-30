import React from 'react';
import type { ColumnData, SimulationStep } from '../utils/waterTankSolver';

interface TankTableViewProps {
  columns: ColumnData[];
  gridHeight: number;
  currentStep?: SimulationStep | null;
  onSelectColumn?: (colIndex: number) => void;
  selectedColumnIndex?: number | null;
  showIsolatedOnly?: boolean;
}

export const TankTableView: React.FC<TankTableViewProps> = ({
  columns,
  gridHeight,
  currentStep,
  onSelectColumn,
  selectedColumnIndex,
  showIsolatedOnly = false,
}) => {
  const numCols = columns.length;
  if (numCols === 0) return null;

  // Build rows from top (level = gridHeight) down to 1
  const rows = [];
  for (let r = gridHeight; r >= 1; r--) {
    rows.push(r);
  }

  const activeIndex = currentStep && currentStep.currentIndex >= 0 ? currentStep.currentIndex : null;

  return (
    <div className="overflow-x-auto rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-4 shadow-xs">
      <div className="min-w-fit flex flex-col items-center">
        <table className="border-collapse border border-slate-300 dark:border-slate-700 select-none">
          <thead>
            <tr>
              <th className="w-10 h-7 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-400 font-normal">
                Lvl
              </th>
              {columns.map((col) => {
                const isSelected = selectedColumnIndex === col.index;
                const isActive = activeIndex === col.index;
                const isLeftPtr = currentStep && currentStep.left === col.index;
                const isRightPtr = currentStep && currentStep.right === col.index;

                return (
                  <th
                    key={`header-${col.index}`}
                    onClick={() => onSelectColumn?.(col.index)}
                    className={`w-12 h-7 border border-slate-300 dark:border-slate-700 text-center font-mono text-[11px] font-semibold cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : isSelected
                        ? 'bg-amber-500 text-slate-950'
                        : isLeftPtr
                        ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300'
                        : isRightPtr
                        ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {isLeftPtr && isRightPtr
                      ? 'L/R'
                      : isLeftPtr
                      ? 'L'
                      : isRightPtr
                      ? 'R'
                      : `[${col.index}]`}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((rowLevel) => (
              <tr key={`row-${rowLevel}`}>
                <td className="w-10 h-8 border border-slate-200 dark:border-slate-800 text-center font-mono text-[10px] text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
                  {rowLevel}
                </td>
                {columns.map((col) => {
                  const wallHeight = col.height;
                  const waterAmount = currentStep
                    ? currentStep.trappedPerColumn[col.index] || 0
                    : col.water;

                  const isWall = !showIsolatedOnly && rowLevel <= wallHeight;
                  const isWater =
                    showIsolatedOnly
                      ? rowLevel <= waterAmount
                      : rowLevel > wallHeight && rowLevel <= wallHeight + waterAmount;

                  const isColSelected = selectedColumnIndex === col.index;

                  return (
                    <td
                      key={`cell-${col.index}-${rowLevel}`}
                      onClick={() => onSelectColumn?.(col.index)}
                      className={`w-12 h-8 border border-slate-300 dark:border-slate-700 text-center transition-all cursor-pointer ${
                        isWall
                          ? 'bg-yellow-400 dark:bg-yellow-500'
                          : isWater
                          ? 'bg-sky-500 dark:bg-sky-600 animate-pulse-once'
                          : isColSelected
                          ? 'bg-amber-50/50 dark:bg-amber-950/20'
                          : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                      title={`Col [${col.index}]: Level ${rowLevel} ${
                        isWall ? '(Wall Block)' : isWater ? '(Trapped Water Unit)' : '(Air)'
                      }`}
                    >
                      {isWater && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="w-10 h-7 border border-slate-200 dark:border-slate-800 text-center font-mono text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/40">
                h
              </td>
              {columns.map((col) => (
                <td
                  key={`footer-${col.index}`}
                  className="w-12 h-7 border border-slate-300 dark:border-slate-700 text-center font-mono text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-50/80 dark:bg-slate-800/40"
                >
                  {col.height}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>

        {/* Legend for Table View */}
        <div className="flex items-center gap-6 mt-3 text-xs text-slate-600 dark:text-slate-400 font-sans">
          {!showIsolatedOnly && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-xs bg-yellow-400 dark:bg-yellow-500 border border-yellow-600" />
              <span>Block Wall</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-sky-500 dark:bg-sky-600 border border-sky-700" />
            <span>Trapped Water Unit</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700" />
            <span>Empty Air</span>
          </div>
        </div>
      </div>
    </div>
  );
};
