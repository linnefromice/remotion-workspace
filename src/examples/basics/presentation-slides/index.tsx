import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Img,
  Series,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const slideSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export const presentationSlidesSchema = z.object({
  slides: z.array(slideSchema),
});

type PresentationSlidesProps = z.infer<typeof presentationSlidesSchema>;
type SlideData = z.infer<typeof slideSchema>;

const SLIDE_DURATION = 150; // 5 seconds per slide at 30fps

export const PresentationSlides: React.FC<PresentationSlidesProps> = ({
  slides,
}) => {
  return (
    <AbsoluteFill
      style={{
        background: "#0f172a",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Series>
        {slides.map((slide, index) => (
          <Series.Sequence key={index} durationInFrames={SLIDE_DURATION}>
            <Slide data={slide} slideIndex={index} totalSlides={slides.length} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};

const Slide: React.FC<{
  data: SlideData;
  slideIndex: number;
  totalSlides: number;
}> = ({ data, slideIndex, totalSlides }) => {
  const frame = useCurrentFrame();

  // Fade in/out for transitions
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [SLIDE_DURATION - 15, SLIDE_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Choose slide layout
  if (slideIndex === 0) {
    return <TitleSlide data={data} frame={frame} opacity={opacity} />;
  }
  if (data.bullets && data.bullets.length > 0) {
    return <BulletSlide data={data} frame={frame} opacity={opacity} />;
  }
  return (
    <SummarySlide
      data={data}
      frame={frame}
      opacity={opacity}
      slideIndex={slideIndex}
      totalSlides={totalSlides}
    />
  );
};

const TitleSlide: React.FC<{
  data: SlideData;
  frame: number;
  opacity: number;
}> = ({ data, frame, opacity }) => {
  const titleY = interpolate(frame, [5, 30], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const subtitleOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        background: "linear-gradient(135deg, #1e3a5f, #0f172a, #1a1a3e)",
      }}
    >
      <h1
        style={{
          fontSize: 90,
          color: "white",
          fontWeight: "bold",
          textAlign: "center",
          transform: `translateY(${titleY}px)`,
          textShadow: "0 4px 30px rgba(59, 130, 246, 0.5)",
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {data.title}
      </h1>
      {data.subtitle && (
        <p
          style={{
            fontSize: 36,
            color: "rgba(255,255,255,0.7)",
            marginTop: 30,
            opacity: subtitleOpacity,
            textAlign: "center",
          }}
        >
          {data.subtitle}
        </p>
      )}
      {data.image && (
        <Img
          src={staticFile(data.image)}
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            width: 200,
            opacity: subtitleOpacity,
          }}
        />
      )}
      {/* Decorative line */}
      <div
        style={{
          position: "absolute",
          bottom: 300,
          width: interpolate(frame, [15, 40], [0, 400], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 3,
          background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

const BulletSlide: React.FC<{
  data: SlideData;
  frame: number;
  opacity: number;
}> = ({ data, frame, opacity }) => {
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        padding: "100px 150px",
        opacity,
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
      }}
    >
      <h2
        style={{
          fontSize: 60,
          color: "white",
          fontWeight: "bold",
          marginBottom: 60,
          opacity: titleOpacity,
          borderBottom: "3px solid #3b82f6",
          paddingBottom: 20,
        }}
      >
        {data.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        {data.bullets?.map((bullet, index) => {
          const bulletDelay = 20 + index * 15;
          const bulletOpacity = interpolate(
            frame,
            [bulletDelay, bulletDelay + 15],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );
          const bulletX = interpolate(
            frame,
            [bulletDelay, bulletDelay + 15],
            [-40, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#3b82f6",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 38,
                  color: "rgba(255,255,255,0.9)",
                  lineHeight: 1.4,
                }}
              >
                {bullet}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SummarySlide: React.FC<{
  data: SlideData;
  frame: number;
  opacity: number;
  slideIndex: number;
  totalSlides: number;
}> = ({ data, frame, opacity }) => {
  const scale = interpolate(frame, [10, 35], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        background: "linear-gradient(135deg, #1a1a3e, #0f172a, #1e3a5f)",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transform: `scale(${scale})`,
        }}
      >
        <h2
          style={{
            fontSize: 70,
            color: "white",
            fontWeight: "bold",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {data.title}
        </h2>
        {data.subtitle && (
          <p
            style={{
              fontSize: 32,
              color: "rgba(255,255,255,0.7)",
              marginTop: 30,
              opacity: ctaOpacity,
            }}
          >
            {data.subtitle}
          </p>
        )}
      </div>
      {/* CTA button */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          opacity: ctaOpacity,
        }}
      >
        <div
          style={{
            padding: "20px 60px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
            borderRadius: 50,
            fontSize: 28,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Get Started
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const defaultPresentationSlidesProps: PresentationSlidesProps = {
  slides: [
    {
      title: "Remotion で動画制作",
      subtitle: "React の力でプログラマティックに動画を作る",
    },
    {
      title: "主な特徴",
      bullets: [
        "React コンポーネントで動画を構成",
        "TypeScript で型安全な動画制作",
        "プレビュー & ホットリロード対応",
        "MP4 / WebM へのレンダリング",
      ],
    },
    {
      title: "さあ、始めよう",
      subtitle: "Remotion で新しい動画体験を",
    },
  ],
};
