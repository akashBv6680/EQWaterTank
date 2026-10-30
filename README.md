# Water Tank Problem — Trapping Rain Water Solver & Visualizer

> Frontend Solution for the **Ever Quint Interview Assignment** (Water Tank Problem).

Live Demo on GitHub Pages: [https://akashbv6680.github.io/EQWaterTank/](https://akashbv6680.github.io/EQWaterTank/)

---

## Problem Statement

Given an array of non-negative integers $n \ge 0$, representing block heights, compute the total units of water stored in-between the blocks.

### Example
- **Input**: `[0, 4, 0, 0, 0, 6, 0, 6, 4, 0]`
- **Output**: `18 Units`

---

## Features

- **Interactive SVG Shape Visualizer (Preferred)**: Pixel-precise vector rendering of walls (yellow) and water (blue) with smooth ripple accents and grid coordinate lines.
- **Table Grid Spec View**: Complete HTML table matrix matching the exact interview assignment layout.
- **Isolated Water Representation**: Displays the secondary visual matrix of trapped water units in isolation.
- **Interactive Column Sculptor**: Click or tap to increment/decrement heights directly, or paste custom arrays.
- **Two-Pointer Simulation Playback**: Step-by-step scrubber with pointer markers ($L$ and $R$), live invariant explanations, and speed controls ($0.5\times$ to $2\times$).
- **Vanilla JavaScript & HTML/CSS Export**: Built-in modal providing standalone vanilla JS code ready to run locally or embed.
- **Dark / Light Mode**: Full theme support with Tailwind CSS.

---

## Algorithmic Complexity

- **Time Complexity**: $\mathcal{O}(N)$ — Single pass two-pointer sweep where pointers advance inward.
- **Space Complexity**: $\mathcal{O}(1)$ — In-place computation requiring only pointers and max height scalar trackers.

---

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: GitHub Pages via GitHub Actions & `gh-pages` branch

---

## Local Development

```bash
# 1. Clone repository
git clone https://github.com/akashBv6680/EQWaterTank.git
cd EQWaterTank

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build
```
