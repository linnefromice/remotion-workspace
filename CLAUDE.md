# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Remotion v4 workspace for creating programmatic video compositions in React + TypeScript. Each composition is a self-contained animation registered in `src/Root.tsx`.

## Commands

- **Dev (Remotion Studio):** `pnpm dev` — opens the browser-based preview/editor
- **Render video:** `pnpm build` — renders output via `remotion render`
- **Render specific composition:** `pnpm exec remotion render <CompositionId>` (e.g., `BasicAnimation`)
- **Export AgentFlow videos:** `pnpm video <Id> | --group=<subject> | --all` — `[--speed=2]` changes the
  playback rate by changing the output fps, keeping every frame. It bakes in the three flags this repo
  needs (`--gl=swangle`, and `--image-format=png` with `--pixel-format=yuv420p`) and verifies `pix_fmt`
  afterwards, so callers do not have to remember them.
- **Upgrade Remotion:** `pnpm upgrade`
- **Install dependencies:** `pnpm install`

- **Run the tests:** `pnpm test` (node:test; no linter is configured)
  - `test:gallery` — the design list's target selection, and whether the published list has gone stale
  - `test:inquiry-routes` — every Inquiry study keeps all 13 routes at every handoff boundary
  - `test:side-studies` — the Side studies keep the AI value after a rule promotion, and never show a downgrade that did not happen

  These render the real compositions with `react-dom/server` and a stubbed `useCurrentFrame`,
  so they are fast and need no browser.

## Architecture

- **Entry point:** `src/index.ts` registers the root component via `registerRoot(Root)`
- **Composition registry:** `src/Root.tsx` declares all `<Composition>` entries with their IDs, dimensions (1920×1080), FPS (30), and durations
- **Composition modules:** each leaf directory exports a React component from `index.tsx`
- **Config:** `remotion.config.ts` sets JPEG output format and overwrite-on-render

### Source layout

`src/` mirrors the folder tree shown in Remotion Studio, so a composition's ID tells you where its source lives.

```
src/
  Root.tsx                       all <Composition> entries
  shared/                        parts used by more than one diagram
  agent-flow/                    Studio: AgentFlow/
    claim-intake/                  Studio: AgentFlow > ClaimIntake
      cards/ icons/ decision-story/ side-by-side/
    inquiry/                       Studio: AgentFlow > Inquiry
      cards/ icons/
    design-studies/                Studio: AgentFlow > DesignStudies
      agent-diagram/ side/           trials for comparison, kept apart from what a meeting uses
                                     (their IDs are `Diagram-*` / `Side-*`, matching the folder,
                                      and carry no subject — the subject is in the frame itself)
    reference/                     Studio: AgentFlow > Reference
      codex/ codex-reclaude/         (codex-reclaude/previews/ backs Studio's Components folder;
                                      it previews that diagram's own parts, so it stays there)
    exhibition/                    Studio: AgentFlow > Exhibition
  examples/                      Studio: Examples/
    basics/ 3d/ effects/
```

Directories are kebab-case. Design notes for the agent-flow diagrams live in `docs/`.

When working on an agent-flow diagram, use the vocabulary in `docs/agent-flow-glossary.md`
(row/column/lane, node tone, hero panel, the four renderings). It maps each term to the
identifier in the code, so a request names exactly one thing.

## Adding a New Composition

1. Create `src/<Name>/index.tsx` exporting a React component
2. Import and register it as a `<Composition>` in `src/Root.tsx` with an `id`, `durationInFrames`, `fps`, `width`, and `height`
3. If the composition accepts props, define a Zod schema and `defaultProps` (see `DataVisualization` for the pattern)
4. **If it lives under `AgentFlow`, regenerate the design list**: `pnpm gallery:agent-flow`.
   That generated page is the list of record for what exists — it is read from `src/Root.tsx`,
   so a composition that is registered but never captured is simply missing from the list.
   Registering without regenerating is an incomplete change, and `pnpm test:gallery` fails on it.

## Key Remotion Packages Used

- `remotion` — core (`useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `Sequence`, `AbsoluteFill`)
- `@remotion/three` + `@react-three/fiber` + `three` — 3D scenes
- `@remotion/lottie` + `lottie-web` — Lottie animations
- `@remotion/noise` — procedural noise
- `@remotion/transitions` — scene transitions
- `@remotion/shapes` / `@remotion/paths` — SVG shapes and paths
- `shiki` — syntax-highlighted code animations
- `zod` — composition prop validation schemas
