# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Remotion v4 workspace for creating programmatic video compositions in React + TypeScript. Each composition is a self-contained animation registered in `src/Root.tsx`.

Most of the work here is **AgentFlow**: diagrams of where an AI agent sits in a business process,
used for sales and exhibitions. `src/examples/` is the original Remotion verification work and is
kept separate; nothing in `agent-flow/` imports from it.

Those diagrams are published as a live site that plays the compositions in the browser with
`@remotion/player` — no video files. Source in `web/`, see [`web/README.md`](./web/README.md).
Live at <https://agentflow-patterns.farleap.workers.dev>.

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

### Generated pages (all land in `out/`, which is git-ignored)

- `pnpm gallery:agent-flow` — **the list of record** for what AgentFlow compositions exist
- `pnpm catalog:side` — the Side catalog, built from `docs/side-catalog.md` plus the list
- `pnpm gallery:side-subjects` — the 9 subject × layout comparison
- `pnpm page:video` — the self-contained video page (mp4 + `<video>`), see `docs/deploy-options.md`

**A generated page reads the one before it**, so regenerate in that order. Which outputs must stay
fresh and which are throwaway is written down in `docs/presentation-site-variants.md`.

### The live site

- `pnpm web` — dev server · `pnpm web:build` — static output to `web/dist/`
- `pnpm web:deploy:check` — build and a Cloudflare dry run · `pnpm web:deploy` — publish
- `node scripts/web-review/verify.mjs` — drives a real browser over all 21 views.
  `WEB_REVIEW_URL=<url>` points it at a preview server or at the deployed site.

### Tests

- **Run them:** `pnpm test` (node:test; no linter is configured)
  - `test:gallery` — the design list's target selection, and whether the published list has gone stale
  - `test:inquiry-routes` — every Inquiry study keeps all 13 routes at every handoff boundary
  - `test:side-studies` — the Side studies keep the AI value after a rule promotion, and never show a downgrade that did not happen
  - `test:bands` — subject bands are derived from the spec, and missing endpoints fail loudly
  - `test:side-subjects` — every subject × layout stays in step with its diagram, and reads its
    decision values from that subject's own spec rather than a copy
  - `test:video` / `test:video-page` — how targets and speeds are selected for export, and which
    mp4s the video page will and will not carry

  These render the real compositions with `react-dom/server` and a stubbed `useCurrentFrame`,
  so they are fast and need no browser.

**Anything a browser has to see is checked by a `verify.mjs`, not by `pnpm test`** — they need a
generated page or a server. They share `scripts/browser.mjs`.

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
    proposal/ restoration/         Studio: AgentFlow > Proposal / Restoration
                                     one FlowSpec each; their panel rows are the single source
                                     for that subject's decision values
    design-studies/                Studio: AgentFlow > DesignStudies
      agent-diagram/ side/           trials for comparison, kept apart from what a meeting uses
                                     (their IDs are `Diagram-*` / `Side-*`, matching the folder,
                                      and carry no subject — the subject is in the frame itself)
        side/subjects/               one component renders any (subject, layout) pair, so the
                                     three base layouts exist for every subject
    reference/                     Studio: AgentFlow > Reference
      codex/ codex-reclaude/         (codex-reclaude/previews/ backs Studio's Components folder;
                                      it previews that diagram's own parts, so it stays there)
    exhibition/                    Studio: AgentFlow > Exhibition
  examples/                      Studio: Examples/
    basics/ effects/               the original Remotion verification work
```

`web/` sits beside `src/`, not inside it: the site that plays these compositions
(Vite + `@remotion/player`). It reads `src/` through the `@flow/*` alias and never the reverse.

Directories are kebab-case. Design notes for the agent-flow diagrams live in `docs/`.

When working on an agent-flow diagram, use the vocabulary in `docs/agent-flow-glossary.md`
(row/column/lane, node tone, hero panel, the four renderings). It maps each term to the
identifier in the code, so a request names exactly one thing.

## Adding a New Composition

1. Create the component under the directory its Studio folder maps to (see **Source layout**),
   e.g. `src/agent-flow/<subject>/<rendering>/index.tsx`
2. Import and register it as a `<Composition>` in `src/Root.tsx` with an `id`, `durationInFrames`, `fps`, `width`, and `height`
3. If the composition accepts props, define a Zod schema and `defaultProps` (see `DataVisualization` for the pattern)
4. **If it lives under `AgentFlow`, regenerate the design list**: `pnpm gallery:agent-flow`.
   That generated page is the list of record for what exists — it is read from `src/Root.tsx`,
   so a composition that is registered but never captured is simply missing from the list.
   Registering without regenerating is an incomplete change, and `pnpm test:gallery` fails on it.
5. **If you changed what an existing composition draws**, regenerate too — the test only compares
   IDs, so a stale picture under the right name passes. The pages built from the list
   (`catalog:side`, `page:video`) point at the capture folder of a particular run, so rebuild them after.

## Key Remotion Packages Used

- `remotion` — core (`useCurrentFrame`, `useVideoConfig`, `interpolate`, `spring`, `Sequence`, `AbsoluteFill`)
- `@remotion/player` — plays a composition in an ordinary web page; what `web/` is built on
- `@remotion/google-fonts` — the CJK font the diagrams use. It points at `fonts.gstatic.com`,
  so the weight is on first paint (~360 requests), not on whatever hosts the site
- `@remotion/bundler` / `@remotion/renderer` — used by `scripts/`, not by any composition
- `@remotion/lottie` + `lottie-web` — Lottie animations
- `@remotion/noise` — procedural noise
- `@remotion/transitions` — scene transitions
- `@remotion/shapes` / `@remotion/paths` — SVG shapes and paths
- `shiki` — syntax-highlighted code animations
- `zod` — composition prop validation schemas
