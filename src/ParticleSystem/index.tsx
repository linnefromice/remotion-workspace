import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Loop,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// 8 seconds at 30fps
const PARTICLE_COUNT = 120;
const LOOP_DURATION = 120; // 4-second loop

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  hue: number;
  delay: number;
  wobbleSpeed: number;
  wobbleAmount: number;
};

export const ParticleSystem: React.FC = () => {
  const frame = useCurrentFrame();

  // Global fade in/out
  const opacity = Math.min(
    interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [210, 240], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #0d1b2a, #000000)",
        opacity,
      }}
    >
      {/* Title */}
      <Title frame={frame} />

      {/* Looping particle layer */}
      <Loop durationInFrames={LOOP_DURATION}>
        <ParticleLayer seed="main" count={PARTICLE_COUNT} />
      </Loop>

      {/* Second offset layer for density */}
      <Loop durationInFrames={LOOP_DURATION}>
        <ParticleLayer seed="secondary" count={60} />
      </Loop>

      {/* Central glow */}
      <CentralGlow frame={frame} />
    </AbsoluteFill>
  );
};

const Title: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [10, 40], [0.8, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <h1
        style={{
          fontSize: 64,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "white",
          opacity,
          transform: `scale(${scale})`,
          textShadow: "0 0 40px rgba(100, 200, 255, 0.5)",
          letterSpacing: 8,
        }}
      >
        PARTICLES
      </h1>
    </AbsoluteFill>
  );
};

const ParticleLayer: React.FC<{ seed: string; count: number }> = ({
  seed,
  count,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: random(`${seed}-x-${i}`) * width,
      y: random(`${seed}-y-${i}`) * height,
      size: 2 + random(`${seed}-size-${i}`) * 6,
      speed: 0.5 + random(`${seed}-speed-${i}`) * 2,
      hue: 180 + random(`${seed}-hue-${i}`) * 60, // Cyan-blue range
      delay: random(`${seed}-delay-${i}`) * LOOP_DURATION,
      wobbleSpeed: 0.02 + random(`${seed}-wobble-${i}`) * 0.05,
      wobbleAmount: 20 + random(`${seed}-wamount-${i}`) * 40,
    }));
  }, [seed, count, width, height]);

  return (
    <AbsoluteFill>
      {particles.map((p) => {
        // Vertical movement (bottom to top, looping)
        const progress = ((frame + p.delay) % LOOP_DURATION) / LOOP_DURATION;
        const py = height * (1 - progress) + (p.y % (height * 0.3));

        // Horizontal wobble
        const px =
          p.x + Math.sin(frame * p.wobbleSpeed + p.id) * p.wobbleAmount;

        // Fade based on vertical position
        const fadeProgress = Math.sin(progress * Math.PI);
        const particleOpacity = fadeProgress * 0.8;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `hsla(${p.hue}, 80%, 70%, ${particleOpacity})`,
              boxShadow: `0 0 ${p.size * 2}px hsla(${p.hue}, 80%, 60%, ${particleOpacity * 0.5})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const CentralGlow: React.FC<{ frame: number }> = ({ frame }) => {
  const pulse = Math.sin(frame * 0.08) * 0.3 + 0.7;
  const size = 300 + Math.sin(frame * 0.05) * 50;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(100, 200, 255, ${0.15 * pulse}), transparent 70%)`,
          filter: "blur(20px)",
        }}
      />
    </AbsoluteFill>
  );
};
