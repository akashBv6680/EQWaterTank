import React, { useEffect, useRef } from 'react';
import type { SimulationStep } from '../utils/waterTankSolver';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, ChevronsRight, FastForward } from 'lucide-react';

interface StepPlaybackControlsProps {
  steps: SimulationStep[];
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

export const StepPlaybackControls: React.FC<StepPlaybackControlsProps> = ({
  steps,
  currentStepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
}) => {
  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;
  const isFinished = currentStepIndex >= totalSteps - 1;

  // Auto-play interval timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      if (isFinished) {
        onTogglePlay(); // stop at end
      } else {
        const intervalMs = Math.max(200, 1000 / playbackSpeed);
        timer = setInterval(() => {
          onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1));
        }, intervalMs);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, currentStepIndex, totalSteps, isFinished, playbackSpeed, onStepChange, onTogglePlay]);

  return (
    <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
      {/* 1. Header & Progress Slider */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Two-Pointer Step Simulation
        </span>
        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
          Step {currentStepIndex} / {Math.max(0, totalSteps - 1)}
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSteps - 1)}
        value={currentStepIndex}
        onChange={(e) => onStepChange(Number(e.target.value))}
        className="w-full accent-amber-500 cursor-pointer"
      />

      {/* 2. Control Buttons & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onStepChange(0)}
            title="Reset to Beginning"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            title="Previous Step"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onTogglePlay}
            className={`px-3 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold'
                : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFinished ? 'Replay' : 'Play Simulation'}</span>
              </>
            )}
          </button>
          <button
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
            disabled={isFinished}
            title="Next Step"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(totalSteps - 1)}
            disabled={isFinished}
            title="Jump to Finish"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-[11px] font-mono">
          {[0.5, 1, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => onChangeSpeed(speed)}
              className={`px-2 py-1 rounded-md transition-colors ${
                playbackSpeed === speed
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* 3. Live State Diagnostic Strip */}
      {currentStep && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 font-mono text-xs">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/50">
              <div className="text-[10px] text-indigo-700 dark:text-indigo-400 font-sans font-semibold">
                Left Pointer (L)
              </div>
              <div className="text-slate-900 dark:text-slate-100 font-bold">
                idx [{currentStep.left}]
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/50">
              <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-sans font-semibold">
                Right Pointer (R)
              </div>
              <div className="text-slate-900 dark:text-slate-100 font-bold">
                idx [{currentStep.right}]
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <div className="text-[10px] text-slate-500 font-sans font-semibold">
                Max Left / Right
              </div>
              <div className="text-slate-900 dark:text-slate-100 font-bold">
                {currentStep.maxLeft} / {currentStep.maxRight}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200/50 dark:border-sky-800/50">
              <div className="text-[10px] text-sky-700 dark:text-sky-400 font-sans font-semibold">
                Trapped So Far
              </div>
              <div className="text-sky-950 dark:text-sky-200 font-bold">
                {currentStep.totalTrapped} Units
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 leading-relaxed">
            {currentStep.description}
          </p>
        </div>
      )}
    </div>
  );
};
