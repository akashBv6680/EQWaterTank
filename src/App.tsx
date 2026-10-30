/**
 * Water Tank Problem Solver & Algorithmic Visualizer
 * Fully responsive simulation of Trapping Rain Water with SVG and Table Grid views.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { solveWaterTank } from './utils/waterTankSolver';
import { TankVisualizerSvg } from './components/TankVisualizerSvg';
import { TankTableView } from './components/TankTableView';
import { InteractiveBuilder } from './components/InteractiveBuilder';
import { StepPlaybackControls } from './components/StepPlaybackControls';
import { ColumnBreakdownTable } from './components/ColumnBreakdownTable';
import { CodeExportModal } from './components/CodeExportModal';
import {
  Waves,
  Sun,
  Moon,
  Code2,
  Table,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  BookOpen,
  ArrowRight,
  Droplet,
  SplitSquareVertical,
} from 'lucide-react';

export default function App() {
  // Initial default: exact assignment example [0,4,0,0,0,6,0,6,4,0] -> 18 units
  const [heights, setHeights] = useState<number[]>([0, 4, 0, 0, 0, 6, 0, 6, 4, 0]);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'svg' | 'table' | 'dual'>('svg');
  const [showIsolatedWater, setShowIsolatedWater] = useState<boolean>(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Simulation playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      );
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Compute algorithmic solution whenever heights change
  const solution = useMemo(() => {
    return solveWaterTank(heights);
  }, [heights]);

  // Reset simulation to step 0 when heights change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [heights]);

  const currentStep = solution.steps[currentStepIndex] || null;

  const handleSelectColumn = (index: number | null) => {
    setSelectedColumnIndex((prev) => (prev === index ? null : index));
  };

  const selectedColumn =
    selectedColumnIndex !== null && selectedColumnIndex < solution.columns.length
      ? solution.columns[selectedColumnIndex]
      : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 1. Top Bar Contract (1-line Brand wordmark, concise links, 1 primary CTA) */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Waves className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-950 dark:text-slate-50">
              AquaTank
            </span>
          </div>

          {/* Zone 2: Clean single-line nav anchors */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#visualizer" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
              Tank Simulation
            </a>
            <a href="#breakdown" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
              Column Analysis
            </a>
            <a href="#algorithm-guide" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap shrink-0">
              Two-Pointer Logic
            </a>
          </nav>

          {/* Zone 3: 1 primary action button + theme toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsDark(!isDark)}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsExportOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Export Solution</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* KPI & Summary Strip */}
        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Ever Quint Interview Specification</span>
                <span aria-hidden="true">·</span>
                <span>Vanilla JS Frontend Algorithm</span>
                <span aria-hidden="true">·</span>
                <span>Trapping Rain Water</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
                Water Tank Problem Visualizer
              </h1>
            </div>

            {/* Total Units Metric Card */}
            <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-3 sm:px-5 sm:py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Total Water Trapped
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono text-sky-600 dark:text-sky-400 tabular-nums">
                  {solution.totalWater} <span className="text-base font-semibold">Units</span>
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="text-xs font-mono text-slate-600 dark:text-slate-400 space-y-0.5">
                <div>Max Wall: <span className="font-bold text-amber-600 dark:text-amber-400">{solution.maxWallHeight}</span></div>
                <div>Width: <span className="font-bold">{solution.heights.length} cols</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* Two-Zone Layout: Interactive Stage (Left 65%) vs Control & Concept Deck (Right 35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Zone 1: Interactive Stage (8 cols) */}
          <div id="visualizer" className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* View Mode & Isolated Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('svg')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'svg'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  SVG Graphic (Preferred)
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Table Grid (PDF Spec)
                </button>
                <button
                  onClick={() => setViewMode('dual')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                    viewMode === 'dual'
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  Dual View
                </button>
              </div>

              <div className="flex items-center gap-2 pr-2">
                <label className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showIsolatedWater}
                    onChange={(e) => setShowIsolatedWater(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded-sm border-slate-300 dark:border-slate-700 focus:ring-sky-500"
                  />
                  <span className="font-medium">Show Isolated Water Tank</span>
                </label>
              </div>
            </div>

            {/* Primary Visualization Area */}
            <div className="space-y-6">
              {/* Primary Tank */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Combined Tank: Walls (Yellow) + Water (Blue)
                  </h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Input: [{heights.join(',')}]
                  </span>
                </div>

                {viewMode === 'svg' && (
                  <TankVisualizerSvg
                    columns={solution.columns}
                    maxWallHeight={solution.maxWallHeight}
                    gridHeight={solution.gridHeight}
                    currentStep={currentStep}
                    onSelectColumn={handleSelectColumn}
                    selectedColumnIndex={selectedColumnIndex}
                  />
                )}

                {viewMode === 'table' && (
                  <TankTableView
                    columns={solution.columns}
                    gridHeight={solution.gridHeight}
                    currentStep={currentStep}
                    onSelectColumn={handleSelectColumn}
                    selectedColumnIndex={selectedColumnIndex}
                  />
                )}

                {viewMode === 'dual' && (
                  <div className="space-y-4">
                    <TankVisualizerSvg
                      columns={solution.columns}
                      maxWallHeight={solution.maxWallHeight}
                      gridHeight={solution.gridHeight}
                      currentStep={currentStep}
                      onSelectColumn={handleSelectColumn}
                      selectedColumnIndex={selectedColumnIndex}
                    />
                    <TankTableView
                      columns={solution.columns}
                      gridHeight={solution.gridHeight}
                      currentStep={currentStep}
                      onSelectColumn={handleSelectColumn}
                      selectedColumnIndex={selectedColumnIndex}
                    />
                  </div>
                )}
              </div>

              {/* Secondary Diagram: Isolated Water Units (Fulfills second diagram in PDF) */}
              {showIsolatedWater && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-4 h-4 text-sky-500" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Isolated Water Units Matrix (Spec Diagram 2)
                      </h2>
                    </div>
                    <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-semibold">
                      Total: {solution.totalWater} Units
                    </span>
                  </div>

                  {viewMode === 'table' ? (
                    <TankTableView
                      columns={solution.columns}
                      gridHeight={solution.gridHeight}
                      currentStep={currentStep}
                      onSelectColumn={handleSelectColumn}
                      selectedColumnIndex={selectedColumnIndex}
                      showIsolatedOnly={true}
                    />
                  ) : (
                    <TankVisualizerSvg
                      columns={solution.columns}
                      maxWallHeight={solution.maxWallHeight}
                      gridHeight={solution.gridHeight}
                      currentStep={currentStep}
                      onSelectColumn={handleSelectColumn}
                      selectedColumnIndex={selectedColumnIndex}
                      showOnlyWater={true}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Selected Column Detail Callout */}
            {selectedColumn && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-amber-900 dark:text-amber-200">
                    Column [{selectedColumn.index}] Detailed Inspection
                  </span>
                  <button
                    onClick={() => setSelectedColumnIndex(null)}
                    className="text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Clear selection
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Wall Height</div>
                    <div className="font-bold text-amber-600 dark:text-amber-400">{selectedColumn.height}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Max Left Barrier</div>
                    <div className="font-bold">{selectedColumn.maxLeft}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Max Right Barrier</div>
                    <div className="font-bold">{selectedColumn.maxRight}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-sans">Trapped Water</div>
                    <div className="font-bold text-sky-600 dark:text-sky-400">+{selectedColumn.water} Units</div>
                  </div>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300 font-sans">
                  Formula:{' '}
                  <code className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded-xs">
                    max(0, min({selectedColumn.maxLeft}, {selectedColumn.maxRight}) - {selectedColumn.height}) = {selectedColumn.water}
                  </code>
                </p>
              </div>
            )}

            {/* Column Breakdown Table Section */}
            <div id="breakdown" className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Per-Column Algorithmic Breakdown
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {solution.columns.length} columns analyzed
                </span>
              </div>
              <ColumnBreakdownTable
                columns={solution.columns}
                selectedColumnIndex={selectedColumnIndex}
                onSelectColumn={handleSelectColumn}
              />
            </div>
          </div>

          {/* Zone 2: Control & Concept Deck (4 cols on lg, 4 on xl) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Step Playback Simulation Controller */}
            <StepPlaybackControls
              steps={solution.steps}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
            />

            {/* Interactive Builder (Presets, Input, Height Sculptor) */}
            <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                Input Configuration & Sculptor
              </h2>
              <InteractiveBuilder
                heights={heights}
                onChangeHeights={setHeights}
                selectedColumnIndex={selectedColumnIndex}
                onSelectColumn={handleSelectColumn}
              />
            </div>

            {/* Algorithmic Complexity & Interview Guide Card */}
            <div id="algorithm-guide" className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Two-Pointer Algorithm Invariants
                </h2>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Rather than creating auxiliary prefix and suffix maximum arrays which cost $O(N)$ extra space,
                the optimal two-pointer approach maintains two pointers moving inward from both ends.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                    1. Invariant Boundary Principle
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    If <code className="font-mono font-semibold">maxLeft &lt; maxRight</code>, the water trapped at the left pointer depends entirely on <code className="font-mono">maxLeft</code>, regardless of unknown heights in between.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mb-0.5">
                    2. Optimal Efficiency
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                    Time: O(N) · Single linear pass
                    <br />
                    Space: O(1) · In-place pointers
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsExportOpen(true)}
                className="w-full mt-2 py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Vanilla JS & HTML Source</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span>Water Tank Problem Frontend Solution · Ever Quint Assignment</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
            >
              Export Git Snippets
            </button>
            <span>·</span>
            <span>O(N) Time / O(1) Space</span>
          </div>
        </div>
      </footer>

      {/* Code Export Modal */}
      <CodeExportModal
        heights={heights}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
