import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Lottie, getLottieMetadata } from "@remotion/lottie";
import type { LottieAnimationData } from "@remotion/lottie";

export const LottieDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [animationData, setAnimationData] =
    useState<LottieAnimationData | null>(null);
  const [handle] = useState(() => delayRender("Loading Lottie animation"));

  useEffect(() => {
    fetch(staticFile("sample-animation.json"))
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        continueRender(handle);
      })
      .catch((err) => {
        console.error("Failed to load Lottie data:", err);
        continueRender(handle);
      });
  }, [handle]);

  if (!animationData) {
    return null;
  }

  const metadata = getLottieMetadata(animationData);

  // Fade in/out
  const opacity = Math.min(
    interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" }),
    interpolate(frame, [250, 270], [1, 0], {
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
      {/* Title */}
      <Sequence from={0} durationInFrames={270}>
        <Title frame={frame} fps={fps} />
      </Sequence>

      {/* Main Lottie animation */}
      <Sequence from={20} durationInFrames={250}>
        <LottiePlayer animationData={animationData} frame={frame} fps={fps} />
      </Sequence>

      {/* Metadata display */}
      <Sequence from={40} durationInFrames={230}>
        <MetadataPanel metadata={metadata} frame={frame} />
      </Sequence>

      {/* Direction demo: forward + backward side by side */}
      <Sequence from={100} durationInFrames={170}>
        <DirectionComparison animationData={animationData} frame={frame} />
      </Sequence>
    </AbsoluteFill>
  );
};

const Title: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        width: "100%",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: 56,
          fontFamily: "Arial, sans-serif",
          fontWeight: "bold",
          color: "white",
          transform: `scale(${scale})`,
          textShadow: "0 0 30px rgba(150, 100, 255, 0.5)",
          letterSpacing: 4,
        }}
      >
        Lottie Animation
      </h1>
    </div>
  );
};

const LottiePlayer: React.FC<{
  animationData: LottieAnimationData;
  frame: number;
  fps: number;
}> = ({ animationData, frame, fps }) => {
  const scale = spring({
    frame,
    fps,
    delay: 0,
    config: { damping: 10, stiffness: 80, mass: 1 },
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 100,
      }}
    >
      <div
        style={{
          width: 350,
          height: 350,
          transform: `scale(${scale})`,
          filter: "drop-shadow(0 0 40px rgba(150, 100, 255, 0.3))",
        }}
      >
        <Lottie
          animationData={animationData}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </AbsoluteFill>
  );
};

const MetadataPanel: React.FC<{
  metadata: ReturnType<typeof getLottieMetadata>;
  frame: number;
}> = ({ metadata, frame }) => {
  const localFrame = frame - 40;
  if (localFrame < 0 || !metadata) return null;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const items = [
    { label: "FPS", value: String(metadata.fps) },
    { label: "Duration", value: `${metadata.durationInSeconds.toFixed(1)}s` },
    { label: "Frames", value: String(metadata.durationInFrames) },
    { label: "Size", value: `${metadata.width}×${metadata.height}` },
  ];

  return (
    <div
      style={{
        position: "absolute",
        right: 80,
        top: 200,
        opacity,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3
        style={{
          fontSize: 24,
          color: "rgba(255,255,255,0.6)",
          fontFamily: "monospace",
          margin: 0,
          marginBottom: 8,
        }}
      >
        getLottieMetadata()
      </h3>
      {items.map((item, i) => {
        const itemOpacity = interpolate(
          localFrame,
          [i * 8, i * 8 + 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={item.label}
            style={{
              opacity: itemOpacity,
              background: "rgba(255,255,255,0.08)",
              padding: "10px 20px",
              borderRadius: 8,
              borderLeft: "3px solid rgba(150, 100, 255, 0.6)",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
              }}
            >
              {item.label}:{" "}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "white",
                fontWeight: "bold",
                fontFamily: "monospace",
              }}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const DirectionComparison: React.FC<{
  animationData: LottieAnimationData;
  frame: number;
}> = ({ animationData, frame }) => {
  const localFrame = frame - 100;
  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 80,
        opacity,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 150,
            height: 150,
            filter: "drop-shadow(0 0 20px rgba(100, 200, 255, 0.3))",
          }}
        >
          <Lottie
            animationData={animationData}
            direction="forward"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "monospace",
            marginTop: 8,
            display: "block",
          }}
        >
          direction: &quot;forward&quot;
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 150,
            height: 150,
            filter: "drop-shadow(0 0 20px rgba(255, 100, 150, 0.3))",
          }}
        >
          <Lottie
            animationData={animationData}
            direction="backward"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <span
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.6)",
            fontFamily: "monospace",
            marginTop: 8,
            display: "block",
          }}
        >
          direction: &quot;backward&quot;
        </span>
      </div>
    </div>
  );
};
