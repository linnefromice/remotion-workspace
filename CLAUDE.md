# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Remotion v4 workspace for creating programmatic video compositions in React + TypeScript. Each composition is a self-contained animation registered in `src/Root.tsx`.

## Commands

- **Dev (Remotion Studio):** `pnpm dev` — opens the browser-based preview/editor
- **Render video:** `pnpm build` — renders output via `remotion render`
- **Render specific composition:** `pnpm exec remotion render <CompositionId>` (e.g., `BasicAnimation`)
- **Upgrade Remotion:** `pnpm upgrade`
- **Install dependencies:** `pnpm install`

No test framework or linter is configured.

## Architecture

- **Entry point:** `src/index.ts` registers the root component via `registerRoot(Root)`
- **Composition registry:** `src/Root.tsx` declares all `<Composition>` entries with their IDs, dimensions (1920×1080), FPS (30), and durations
- **Composition modules:** Each directory under `src/` (e.g., `src/BasicAnimation/`, `src/ThreeScene/`) exports a single React component from `index.tsx`
- **Config:** `remotion.config.ts` sets JPEG output format and overwrite-on-render

## Adding a New Composition

1. Create `src/<Name>/index.tsx` exporting a React component
2. Import and register it as a `<Composition>` in `src/Root.tsx` with an `id`, `durationInFrames`, `fps`, `width`, and `height`
3. If the composition accepts props, define a Zod schema and `defaultProps` (see `DataVisualization` for the pattern)

## Key Remotion Packages Used

- `remotion` — core (`useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `Sequence`, `AbsoluteFill`)
- `@remotion/three` + `@react-three/fiber` + `three` — 3D scenes
- `@remotion/lottie` + `lottie-web` — Lottie animations
- `@remotion/noise` — procedural noise
- `@remotion/transitions` — scene transitions
- `@remotion/shapes` / `@remotion/paths` — SVG shapes and paths
- `shiki` — syntax-highlighted code animations
- `zod` — composition prop validation schemas
