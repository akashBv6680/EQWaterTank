import React from 'react';
import type { ColumnData } from '../utils/waterTankSolver';

interface ColumnBreakdownTableProps {
  columns: ColumnData[];
  selectedColumnIndex: number | null;
  onSelectColumn: (index: number) => void;
}

export const ColumnBreakdownTable: React.FC<ColumnBreakdownTableProps> = ({
  columns,
  selectedColumnIndex,
  onSelectColumn,
}) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            <th className="py-2.5 px-3 font-mono">Index</th>
            <th className="py-2.5 px-3 font-mono">Height</th>
            <th className="py-2.5 px-3 font-mono">Max Left</th>
            <th className="py-2.5 px-3 font-mono">Max Right</th>
            <th className="py-2.5 px-3 font-mono">Water Level</th>
            <th className="py-2.5 px-3 font-mono text-right">Trapped Units</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
          {columns.map((col) => {
            const isSelected = selectedColumnIndex === col.index;
            return (
              <tr
                key={`breakdown-${col.index}`}
                onClick={() => onSelectColumn(col.index)}
                className={`cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 font-semibold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <td className="py-2 px-3">
                  <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    [{col.index}]
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{col.height}</span>
                </td>
                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{col.maxLeft}</td>
                <td className="py-2 px-3 text-slate-500 dark:text-slate-400">{col.maxRight}</td>
                <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                  min({col.maxLeft}, {col.maxRight}) = {col.waterLevel}
                </td>
                <td className="py-2 px-3 text-right">
                  {col.water > 0 ? (
                    <span className="font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-sm border border-sky-200/50 dark:border-sky-800/50">
                      +{col.water} u
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">0</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
