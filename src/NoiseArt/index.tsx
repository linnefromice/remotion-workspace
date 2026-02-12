import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise2D, noise3D } from "@remotion/noise";

// 10 seconds at 30fps
const DURATION = 300;

export const NoiseArt: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [DURATION - 20, DURATION], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill style={{ background: "#000", opacity }}>
      {/* Phase 1: Noise grid (0-150f) */}
      <Sequence from={0} durationInFrames={160}>
        <NoiseGrid />
      </Sequence>

      {/* Phase 2: Flow field (100-250f) */}
      <Sequence from={100} durationInFrames={160}>
        <FlowField />
      </Sequence>

      {/* Phase 3: Terrain (180-300f) */}
      <Sequence from={180} durationInFrames={120}>
        <NoiseTerrain />
      </Sequence>

      {/* Title */}
      <TitleOverlay frame={frame} />
    </AbsoluteFill>
  );
};

const TitleOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const titleOpacity = interpolate(frame, [5, 25], [0, 0.9], {
    extrapolateRight: "clamp",
  });

  let label = "";
  if (frame < 100) label = "noise2D — Grid";
  else if (frame < 180) label = "noise3D — Flow Field";
  else label = "noise2D — Terrain";

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          width: "100%",
          textAlign: "center",
          opacity: titleOpacity,
        }}
      >
        <h1
          style={{
            fontSize: 48,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "white",
            letterSpacing: 6,
            textShadow: "0 0 30px rgba(100, 255, 200, 0.4)",
          }}
        >
          NOISE ART
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          width: "100%",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.5)",
            background: "rgba(0,0,0,0.4)",
            padding: "8px 24px",
            borderRadius: 8,
          }}
        >
          {label}
        </span>
      </div>
    </AbsoluteFill>
  );
};

const GRID_COLS = 48;
const GRID_ROWS = 27;

const NoiseGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cellW = width / GRID_COLS;
  const cellH = height / GRID_ROWS;
  const time = frame * 0.03;

  const introProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fade out as flow field comes in
  const fadeOut = interpolate(frame, [130, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cells = useMemo(() => {
    const result = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        result.push({ row, col });
      }
    }
    return result;
  }, []);

  return (
    <AbsoluteFill style={{ opacity: fadeOut }}>
      {cells.map(({ row, col }) => {
        const nx = col * 0.12;
        const ny = row * 0.12;
        const n = noise2D("grid", nx + time, ny + time);
        const brightness = (n + 1) / 2; // 0-1
        const hue = 150 + n * 60;
        const size = (0.3 + brightness * 0.7) * Math.min(cellW, cellH) * 0.8;

        return (
          <div
            key={`${row}-${col}`}
            style={{
              position: "absolute",
              left: col * cellW + cellW / 2 - size / 2,
              top: row * cellH + cellH / 2 - size / 2,
              width: size * introProgress,
              height: size * introProgress,
              borderRadius: "50%",
              background: `hsla(${hue}, 70%, ${40 + brightness * 30}%, ${0.6 * brightness + 0.1})`,
              boxShadow:
                brightness > 0.7
                  ? `0 0 ${size}px hsla(${hue}, 70%, 60%, 0.3)`
                  : "none",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const PARTICLE_COUNT = 200;

const FlowField: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [130, 160], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      startX: (i % 20) * (width / 20) + width / 40,
      startY: Math.floor(i / 20) * (height / 10) + height / 20,
    }));
  }, [width, height]);

  const time = frame * 0.02;

  return (
    <AbsoluteFill style={{ opacity: introOpacity * fadeOut }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {particles.map((p) => {
          // Simulate flow using noise3D
          let x = p.startX;
          let y = p.startY;
          const points: string[] = [`${x},${y}`];

          const steps = Math.min(frame, 40);
          for (let s = 0; s < steps; s++) {
            const angle =
              noise3D("flow", x * 0.003, y * 0.003, time + s * 0.01) *
              Math.PI *
              2;
            x += Math.cos(angle) * 8;
            y += Math.sin(angle) * 8;
            points.push(`${x},${y}`);
          }

          const hue = 180 + noise2D("color", p.id * 0.1, time) * 40;

          return (
            <polyline
              key={p.id}
              points={points.join(" ")}
              fill="none"
              stroke={`hsla(${hue}, 70%, 60%, 0.6)`}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const TERRAIN_COLS = 80;
const TERRAIN_ROWS = 30;

const NoiseTerrain: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const time = frame * 0.02;
  const stepX = width / TERRAIN_COLS;
  const stepY = height / TERRAIN_ROWS;

  return (
    <AbsoluteFill style={{ opacity: introOpacity }}>
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {Array.from({ length: TERRAIN_ROWS }, (_, row) => {
          const baseY = 200 + row * stepY * 0.8;
          const points: string[] = [];

          for (let col = 0; col <= TERRAIN_COLS; col++) {
            const x = col * stepX;
            const n = noise2D("terrain", col * 0.08 + time, row * 0.15);
            const y = baseY + n * 60 - row * 8;
            points.push(`${x},${y}`);
          }

          const depth = row / TERRAIN_ROWS;
          const hue = 220 + depth * 40;
          const lightness = 30 + depth * 20;

          return (
            <polyline
              key={row}
              points={points.join(" ")}
              fill="none"
              stroke={`hsla(${hue}, 60%, ${lightness}%, ${0.3 + depth * 0.5})`}
              strokeWidth={1.5}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
