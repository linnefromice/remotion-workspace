import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";

const AUDIO_SRC = staticFile("sample-audio.wav");
const BAR_COUNT = 64;

export const AudioVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioData = useAudioData(AUDIO_SRC);

  // Fade in/out
  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [280, 300], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  if (!audioData) {
    return null;
  }

  const visualization = visualizeAudio({
    audioData,
    frame,
    fps,
    numberOfSamples: BAR_COUNT,
  });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 100%, #1a0a2e, #000)",
        opacity,
      }}
    >
      <Audio src={AUDIO_SRC} />
      <Title frame={frame} />
      <BarVisualizer values={visualization} frame={frame} />
      <MirrorBarVisualizer values={visualization} frame={frame} />
      <CircularVisualizer values={visualization} frame={frame} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const titleOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        width: "100%",
        textAlign: "center",
        opacity: titleOpacity,
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: 48,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "white",
          letterSpacing: 6,
          textShadow: "0 0 30px rgba(150, 100, 255, 0.6)",
        }}
      >
        AUDIO VISUALIZER
      </h1>
    </div>
  );
};

const BarVisualizer: React.FC<{ values: number[]; frame: number }> = ({
  values,
  frame,
}) => {
  const barWidth = 1920 / values.length;
  const introProgress = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {values.map((v, i) => {
        const height = v * 500 * introProgress;
        const hue = 260 + (i / values.length) * 60;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * barWidth,
              bottom: 540,
              width: barWidth - 2,
              height,
              background: `linear-gradient(180deg, hsla(${hue}, 80%, 65%, 0.9), hsla(${hue}, 80%, 40%, 0.3))`,
              borderRadius: "4px 4px 0 0",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const MirrorBarVisualizer: React.FC<{ values: number[]; frame: number }> = ({
  values,
  frame,
}) => {
  const barWidth = 1920 / values.length;
  const introProgress = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {values.map((v, i) => {
        const height = v * 300 * introProgress;
        const hue = 260 + (i / values.length) * 60;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: i * barWidth,
              top: 540,
              width: barWidth - 2,
              height,
              background: `linear-gradient(0deg, hsla(${hue}, 80%, 65%, 0.4), hsla(${hue}, 80%, 40%, 0.1))`,
              borderRadius: "0 0 4px 4px",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const CircularVisualizer: React.FC<{ values: number[]; frame: number }> = ({
  values,
  frame,
}) => {
  const introProgress = interpolate(frame, [20, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rotation = frame * 0.3;
  const centerX = 960;
  const centerY = 540;
  const baseRadius = 150;

  return (
    <AbsoluteFill style={{ opacity: introProgress * 0.6 }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {values.map((v, i) => {
          const angle =
            (i / values.length) * Math.PI * 2 + (rotation * Math.PI) / 180;
          const r = baseRadius + v * 200;
          const x1 = centerX + Math.cos(angle) * baseRadius;
          const y1 = centerY + Math.sin(angle) * baseRadius;
          const x2 = centerX + Math.cos(angle) * r;
          const y2 = centerY + Math.sin(angle) * r;
          const hue = 260 + (i / values.length) * 60;

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`hsla(${hue}, 80%, 65%, 0.7)`}
              strokeWidth={2}
              strokeLinecap="round"
            />
          );
        })}
        {/* Center circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={baseRadius}
          fill="none"
          stroke="rgba(150, 100, 255, 0.3)"
          strokeWidth={1}
        />
      </svg>
    </AbsoluteFill>
  );
};
