import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath, interpolatePath } from "@remotion/paths";
import { makeCircle, makeRect, makeStar, makePolygon } from "@remotion/shapes";

// 10 seconds at 30fps
const DURATION = 300;

export const MotionGraphics: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = Math.min(
    interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [DURATION - 15, DURATION], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        opacity,
      }}
    >
      {/* Phase 1: Shape drawing (0-90f) */}
      <Sequence from={0} durationInFrames={120}>
        <ShapeDrawing />
      </Sequence>

      {/* Phase 2: Shape morphing (90-180f) */}
      <Sequence from={90} durationInFrames={120}>
        <ShapeMorphing />
      </Sequence>

      {/* Phase 3: Animated path composition (180-300f) */}
      <Sequence from={180} durationInFrames={120}>
        <PathComposition />
      </Sequence>

      {/* Title overlay */}
      <TitleOverlay frame={frame} />
    </AbsoluteFill>
  );
};

const TitleOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase labels
  let label = "";
  if (frame < 90) label = "evolvePath — Drawing";
  else if (frame < 180) label = "interpolatePath — Morphing";
  else label = "Composition";

  const labelOpacity = interpolate(
    frame % 90,
    [0, 15],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 40,
          width: "100%",
          textAlign: "center",
          opacity,
        }}
      >
        <h1
          style={{
            fontSize: 42,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            color: "white",
            letterSpacing: 4,
            textShadow: "0 0 20px rgba(100, 100, 255, 0.5)",
          }}
        >
          MOTION GRAPHICS
        </h1>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 50,
          width: "100%",
          textAlign: "center",
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontFamily: "monospace",
            color: "rgba(255,255,255,0.6)",
            background: "rgba(0,0,0,0.3)",
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

const ShapeDrawing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shapes = [
    { make: () => makeCircle({ radius: 80 }), cx: 350, cy: 450, color: "#4fc3f7", delay: 0 },
    { make: () => makeRect({ width: 150, height: 150, cornerRadius: 16 }), cx: 750, cy: 450, color: "#e040fb", delay: 10 },
    { make: () => makeStar({ points: 5, innerRadius: 40, outerRadius: 80 }), cx: 1150, cy: 450, color: "#ffca28", delay: 20 },
    { make: () => makePolygon({ points: 6, radius: 80 }), cx: 1550, cy: 450, color: "#66bb6a", delay: 30 },
  ];

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {shapes.map((shape, i) => {
          const info = shape.make();
          const drawProgress = interpolate(
            frame,
            [shape.delay, shape.delay + 40],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const { strokeDasharray, strokeDashoffset } = evolvePath(
            drawProgress,
            info.path
          );
          const fillOpacity = interpolate(
            frame,
            [shape.delay + 30, shape.delay + 50],
            [0, 0.3],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const scale = spring({
            frame: Math.max(0, frame - shape.delay - 35),
            fps,
            config: { damping: 12, stiffness: 100, mass: 0.5 },
            from: 0.8,
            to: 1,
          });

          return (
            <g
              key={i}
              transform={`translate(${shape.cx - info.width / 2}, ${shape.cy - info.height / 2}) scale(${scale})`}
              style={{ transformOrigin: `${info.width / 2}px ${info.height / 2}px` }}
            >
              <path
                d={info.path}
                stroke={shape.color}
                strokeWidth={3}
                fill={shape.color}
                fillOpacity={fillOpacity}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ShapeMorphing: React.FC = () => {
  const frame = useCurrentFrame();

  // Morph circle → star → hexagon → rect → circle
  const circle = makeCircle({ radius: 100 });
  const star = makeStar({ points: 5, innerRadius: 50, outerRadius: 100 });
  const hexagon = makePolygon({ points: 6, radius: 100 });
  const rect = makeRect({ width: 200, height: 200, cornerRadius: 20 });

  const paths = [circle.path, star.path, hexagon.path, rect.path, circle.path];
  const segmentDuration = 30;

  // Determine which segment we're in
  const localFrame = frame;
  const segmentIndex = Math.min(
    Math.floor(localFrame / segmentDuration),
    paths.length - 2
  );
  const segmentProgress = Math.min(
    (localFrame % segmentDuration) / segmentDuration,
    1
  );

  // Smooth easing
  const eased =
    segmentProgress < 0.5
      ? 2 * segmentProgress * segmentProgress
      : 1 - Math.pow(-2 * segmentProgress + 2, 2) / 2;

  const fromPath = paths[segmentIndex];
  const toPath = paths[Math.min(segmentIndex + 1, paths.length - 1)];
  const morphedPath = interpolatePath(eased, fromPath, toPath);

  const hue = interpolate(localFrame, [0, 120], [200, 360], {
    extrapolateRight: "clamp",
  });
  const rotation = localFrame * 1.5;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg width={400} height={400} viewBox="-10 -10 220 220">
        <g transform={`rotate(${rotation}, 100, 100)`}>
          <path
            d={morphedPath}
            stroke={`hsl(${hue}, 80%, 65%)`}
            strokeWidth={3}
            fill={`hsla(${hue}, 80%, 65%, 0.2)`}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const PathComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multiple shapes arranged in a pattern
  const shapes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 250;
    const cx = 960 + Math.cos(angle + frame * 0.02) * radius;
    const cy = 540 + Math.sin(angle + frame * 0.02) * radius;
    const shapeInfo =
      i % 3 === 0
        ? makeCircle({ radius: 30 })
        : i % 3 === 1
          ? makeStar({ points: 5, innerRadius: 15, outerRadius: 30 })
          : makePolygon({ points: 6, radius: 30 });

    return { cx, cy, info: shapeInfo, index: i };
  });

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Connecting lines */}
        {shapes.map((s, i) => {
          const next = shapes[(i + 1) % shapes.length];
          const lineProgress = interpolate(frame, [i * 5, i * 5 + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={`line-${i}`}
              x1={s.cx}
              y1={s.cy}
              x2={s.cx + (next.cx - s.cx) * lineProgress}
              y2={s.cy + (next.cy - s.cy) * lineProgress}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
            />
          );
        })}

        {/* Shapes */}
        {shapes.map((s) => {
          const drawProgress = interpolate(
            frame,
            [s.index * 5, s.index * 5 + 25],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const { strokeDasharray, strokeDashoffset } = evolvePath(
            drawProgress,
            s.info.path
          );
          const scale = spring({
            frame: Math.max(0, frame - s.index * 5),
            fps,
            config: { damping: 10, stiffness: 120, mass: 0.5 },
          });
          const hue = 200 + s.index * 20;

          return (
            <g
              key={s.index}
              transform={`translate(${s.cx - s.info.width / 2}, ${s.cy - s.info.height / 2}) scale(${scale})`}
            >
              <path
                d={s.info.path}
                stroke={`hsl(${hue}, 70%, 65%)`}
                strokeWidth={2}
                fill={`hsla(${hue}, 70%, 65%, ${0.15 * drawProgress})`}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
              />
            </g>
          );
        })}

        {/* Center shape */}
        <CenterShape frame={frame} fps={fps} />
      </svg>
    </AbsoluteFill>
  );
};

const CenterShape: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const star = makeStar({
    points: 8,
    innerRadius: 30,
    outerRadius: 60,
  });

  const scale = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 8, stiffness: 80, mass: 1 },
  });

  const drawProgress = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    drawProgress,
    star.path
  );
  const rotation = frame * 0.5;

  return (
    <g
      transform={`translate(${960 - star.width / 2}, ${540 - star.height / 2}) scale(${scale}) rotate(${rotation}, ${star.width / 2}, ${star.height / 2})`}
    >
      <path
        d={star.path}
        stroke="#ffca28"
        strokeWidth={2}
        fill={`rgba(255, 202, 40, ${0.2 * drawProgress})`}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
      />
    </g>
  );
};
