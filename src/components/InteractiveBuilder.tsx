import React, { useState, useEffect } from 'react';
import { PRESET_OPTIONS, generateRandomHeights, parseHeightInput } from '../utils/waterTankSolver';
import { Plus, Minus, Shuffle, RotateCcw, Sparkles, Check, AlertCircle } from 'lucide-react';

interface InteractiveBuilderProps {
  heights: number[];
  onChangeHeights: (newHeights: number[]) => void;
  selectedColumnIndex: number | null;
  onSelectColumn: (colIndex: number | null) => void;
}

export const InteractiveBuilder: React.FC<InteractiveBuilderProps> = ({
  heights,
  onChangeHeights,
  selectedColumnIndex,
  onSelectColumn,
}) => {
  const [textInput, setTextInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  // Sync text input whenever heights change externally
  useEffect(() => {
    setTextInput(`[${heights.join(', ')}]`);
    setErrorMessage(null);
  }, [heights]);

  const handleApplyText = () => {
    const result = parseHeightInput(textInput);
    if (!result.success) {
      setErrorMessage(result.error || 'Invalid array format.');
      setSuccessNotice(false);
    } else {
      setErrorMessage(null);
      onChangeHeights(result.data);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 2000);
    }
  };

  const handleColumnHeightChange = (index: number, delta: number) => {
    const newHeights = [...heights];
    const newH = Math.max(0, Math.min(15, newHeights[index] + delta));
    newHeights[index] = newH;
    onChangeHeights(newHeights);
  };

  const handleAddColumn = () => {
    if (heights.length >= 24) return;
    onChangeHeights([...heights, 0]);
  };

  const handleRemoveColumn = (index: number) => {
    if (heights.length <= 2) return;
    const newHeights = heights.filter((_, i) => i !== index);
    onChangeHeights(newHeights);
    if (selectedColumnIndex === index) {
      onSelectColumn(null);
    }
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 5) + 8; // 8 to 12
    const randoms = generateRandomHeights(len, 6);
    onChangeHeights(randoms);
  };

  return (
    <div className="space-y-5">
      {/* 1. Presets Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interview & Benchmark Presets
          </label>
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Generate Random</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {PRESET_OPTIONS.map((preset) => {
            const isMatch =
              preset.heights.length === heights.length &&
              preset.heights.every((val, i) => val === heights[i]);

            return (
              <button
                key={preset.name}
                onClick={() => onChangeHeights(preset.heights)}
                className={`p-2.5 text-left rounded-lg border transition-all text-xs flex flex-col justify-between ${
                  isMatch
                    ? 'border-amber-500 bg-amber-500/10 text-slate-900 dark:text-slate-100 font-medium ring-1 ring-amber-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-semibold truncate">{preset.name}</span>
                  <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-1.5 py-0.5 rounded-xs font-bold">
                    {preset.badge}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 truncate">
                  [{preset.heights.join(',')}]
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Direct Array Parser */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Array Input (n ≥ 0)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={textInput}
              onChange={(e) => {
                setTextInput(e.target.value);
                setErrorMessage(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApplyText();
              }}
              placeholder="e.g. 0, 4, 0, 0, 0, 6, 0, 6, 4, 0"
              className={`w-full px-3 py-2 text-sm font-mono bg-white dark:bg-slate-950 border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors ${
                errorMessage
                  ? 'border-red-400 dark:border-red-500 text-red-600 dark:text-red-400'
                  : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100'
              }`}
            />
          </div>
          <button
            onClick={handleApplyText}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shrink-0 flex items-center gap-1.5"
          >
            {successNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Updated!</span>
              </>
            ) : (
              <span>Calculate</span>
            )}
          </button>
        </div>

        {errorMessage ? (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 mt-2 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Tip: Enter comma or space-separated non-negative integers.
          </p>
        )}
      </div>

      {/* 3. Interactive Visual Height Sculptor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Interactive Column Sculptor ({heights.length} columns)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onChangeHeights([0, 4, 0, 0, 0, 6, 0, 6, 4, 0])}
              className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <button
              onClick={handleAddColumn}
              disabled={heights.length >= 24}
              className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 disabled:opacity-40"
            >
              + Add Column
            </button>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex items-end gap-2 min-w-fit pb-1 pt-2">
            {heights.map((h, index) => {
              const isSelected = selectedColumnIndex === index;
              return (
                <div
                  key={`sculpt-${index}`}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <button
                    onClick={() => handleColumnHeightChange(index, 1)}
                    title="Increase Height"
                    className="w-7 h-6 flex items-center justify-center rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:border-amber-400 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <div
                    onClick={() => onSelectColumn(index)}
                    className="w-7 py-1 text-center font-mono text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    {h}
                  </div>

                  <button
                    onClick={() => handleColumnHeightChange(index, -1)}
                    disabled={h <= 0}
                    title="Decrease Height"
                    className="w-7 h-6 flex items-center justify-center rounded-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:border-amber-400 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <div className="mt-1 flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
                    <span>[{index}]</span>
                    {heights.length > 2 && (
                      <button
                        onClick={() => handleRemoveColumn(index)}
                        title="Delete Column"
                        className="text-slate-300 hover:text-red-500 transition-colors ml-1"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
