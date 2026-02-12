import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

const SLIDE_DURATION = 90; // 3 seconds per slide
const TRANSITION_DURATION = 20;

type SlideContent = {
  title: string;
  subtitle: string;
  bgGradient: string;
  emoji: string;
};

const slides: SlideContent[] = [
  {
    title: "Slide Transition",
    subtitle: "slide({ direction: 'from-right' })",
    bgGradient: "linear-gradient(135deg, #667eea, #764ba2)",
    emoji: "➡️",
  },
  {
    title: "Fade Transition",
    subtitle: "fade()",
    bgGradient: "linear-gradient(135deg, #f093fb, #f5576c)",
    emoji: "✨",
  },
  {
    title: "Wipe Transition",
    subtitle: "wipe({ direction: 'from-top-left' })",
    bgGradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    emoji: "🌊",
  },
  {
    title: "Flip Transition",
    subtitle: "flip({ direction: 'from-right' })",
    bgGradient: "linear-gradient(135deg, #43e97b, #38f9d7)",
    emoji: "🔄",
  },
  {
    title: "Clock Wipe",
    subtitle: "clockWipe({ width, height })",
    bgGradient: "linear-gradient(135deg, #fa709a, #fee140)",
    emoji: "🕐",
  },
  {
    title: "Spring Timing",
    subtitle: "springTiming({ config: { damping: 200 } })",
    bgGradient: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
    emoji: "🎯",
  },
];

export const TransitionDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* Slide 1 → 2: slide */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[0]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Slide 2 → 3: fade */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[1]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Slide 3 → 4: wipe */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[2]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-top-left" })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Slide 4 → 5: flip */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[3]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={flip({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Slide 5 → 6: clockWipe */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[4]} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1920, height: 1080 })}
          timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
        />

        {/* Slide 6: springTiming */}
        <TransitionSeries.Sequence durationInFrames={SLIDE_DURATION}>
          <SlideCard content={slides[5]} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

const SlideCard: React.FC<{ content: SlideContent }> = ({ content }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const emojiScale = spring({
    frame,
    fps,
    delay: 10,
    config: { damping: 8, stiffness: 150, mass: 0.8 },
  });

  return (
    <AbsoluteFill
      style={{
        background: content.bgGradient,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Emoji */}
      <div
        style={{
          fontSize: 80,
          marginBottom: 20,
          transform: `scale(${emojiScale})`,
        }}
      >
        {content.emoji}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 72,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          transform: `scale(${titleScale})`,
          textShadow: "0 4px 20px rgba(0,0,0,0.3)",
          margin: 0,
        }}
      >
        {content.title}
      </h1>

      {/* Subtitle (code) */}
      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.8)",
          marginTop: 24,
          opacity: subtitleOpacity,
          fontFamily: "monospace",
          background: "rgba(0,0,0,0.2)",
          padding: "12px 28px",
          borderRadius: 12,
        }}
      >
        {content.subtitle}
      </p>
    </AbsoluteFill>
  );
};
