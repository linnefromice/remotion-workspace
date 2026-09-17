import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const BasicAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Background color transition
  const bgHue = interpolate(frame, [0, 150], [220, 320], {
    extrapolateRight: "clamp",
  });

  // Overall rotation (90-150f)
  const rotation = interpolate(frame, [90, 150], [0, 360], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, hsl(${bgHue}, 60%, 20%), hsl(${bgHue + 40}, 70%, 30%))`,
        justifyContent: "center",
        alignItems: "center",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Title: fade in + spring scale (0-30f) */}
      <Sequence from={0} durationInFrames={150}>
        <Title frame={frame} fps={fps} />
      </Sequence>

      {/* Subtitle: slide in from bottom (30-60f) */}
      <Sequence from={30} durationInFrames={120}>
        <Subtitle frame={frame} fps={fps} />
      </Sequence>

      {/* Decorative shapes: spring entrance (60-90f) */}
      <Sequence from={60} durationInFrames={90}>
        <DecorativeShapes frame={frame} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
      }}
    >
      <h1
        style={{
          fontSize: 80,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          opacity,
          transform: `scale(${scale})`,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        Remotion Demo
      </h1>
    </AbsoluteFill>
  );
};

const Subtitle: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const localFrame = frame - 30;
  if (localFrame < 0) return null;

  const translateY = interpolate(localFrame, [0, 20], [60, 0], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingTop: 100,
      }}
    >
      <p
        style={{
          fontSize: 36,
          fontFamily: "Arial, sans-serif",
          color: "rgba(255,255,255,0.85)",
          textAlign: "center",
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        Basic Animation Sample
      </p>
    </AbsoluteFill>
  );
};

const DecorativeShapes: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const localFrame = frame - 60;
  if (localFrame < 0) return null;

  const circleScale = spring({
    frame: localFrame,
    fps,
    config: { damping: 8, stiffness: 150, mass: 0.8 },
  });

  const squareScale = spring({
    frame: localFrame,
    fps,
    delay: 5,
    config: { damping: 8, stiffness: 150, mass: 0.8 },
  });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      {/* Circle */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 200,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(255, 200, 100, 0.6)",
          transform: `scale(${circleScale})`,
          boxShadow: "0 0 40px rgba(255, 200, 100, 0.4)",
        }}
      />
      {/* Square */}
      <div
        style={{
          position: "absolute",
          right: 300,
          bottom: 200,
          width: 100,
          height: 100,
          borderRadius: 16,
          background: "rgba(100, 200, 255, 0.6)",
          transform: `scale(${squareScale}) rotate(45deg)`,
          boxShadow: "0 0 40px rgba(100, 200, 255, 0.4)",
        }}
      />
      {/* Triangle (CSS) */}
      <div
        style={{
          position: "absolute",
          left: 250,
          bottom: 300,
          width: 0,
          height: 0,
          borderLeft: "50px solid transparent",
          borderRight: "50px solid transparent",
          borderBottom: "90px solid rgba(200, 100, 255, 0.6)",
          transform: `scale(${squareScale})`,
          filter: "drop-shadow(0 0 20px rgba(200, 100, 255, 0.4))",
        }}
      />
    </AbsoluteFill>
  );
};
