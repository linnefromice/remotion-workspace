import React from "react";
import { z } from "zod";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const barDataSchema = z.object({
  label: z.string(),
  value: z.number(),
  color: z.string(),
});

export const dataVisualizationSchema = z.object({
  title: z.string(),
  data: z.array(barDataSchema),
});

type DataVisualizationProps = z.infer<typeof dataVisualizationSchema>;

const CHART_LEFT = 250;
const CHART_RIGHT = 1670;
const CHART_TOP = 200;
const CHART_BOTTOM = 800;
const CHART_WIDTH = CHART_RIGHT - CHART_LEFT;
const CHART_HEIGHT = CHART_BOTTOM - CHART_TOP;

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  title,
  data,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #0f172a, #1e293b)",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Title (0-30f) */}
      <Sequence from={0} durationInFrames={210}>
        <ChartTitle title={title} frame={frame} />
      </Sequence>

      {/* Axis lines (30-60f) */}
      <Sequence from={30} durationInFrames={180}>
        <AxisLines frame={frame} />
      </Sequence>

      {/* Bars (60-150f) */}
      <Sequence from={60} durationInFrames={150}>
        <Bars data={data} maxValue={maxValue} frame={frame} fps={fps} />
      </Sequence>

      {/* Total count-up (150-180f) */}
      <Sequence from={150} durationInFrames={60}>
        <TotalValue data={data} frame={frame} />
      </Sequence>

      {/* Fade out (180-210f) */}
      <FadeOut frame={frame} />
    </AbsoluteFill>
  );
};

const ChartTitle: React.FC<{ title: string; frame: number }> = ({
  title,
  frame,
}) => {
  const opacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [0, 25], [-30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 80,
        width: "100%",
        textAlign: "center",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <h1
        style={{
          fontSize: 56,
          color: "white",
          fontWeight: "bold",
          margin: 0,
        }}
      >
        {title}
      </h1>
    </div>
  );
};

const AxisLines: React.FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - 30;
  if (localFrame < 0) return null;

  const yAxisProgress = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const xAxisProgress = interpolate(localFrame, [10, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Y Axis */}
      <div
        style={{
          position: "absolute",
          left: CHART_LEFT,
          top: CHART_TOP,
          width: 3,
          height: CHART_HEIGHT * yAxisProgress,
          background: "rgba(255,255,255,0.5)",
        }}
      />
      {/* X Axis */}
      <div
        style={{
          position: "absolute",
          left: CHART_LEFT,
          top: CHART_BOTTOM,
          width: CHART_WIDTH * xAxisProgress,
          height: 3,
          background: "rgba(255,255,255,0.5)",
        }}
      />
    </AbsoluteFill>
  );
};

const Bars: React.FC<{
  data: DataVisualizationProps["data"];
  maxValue: number;
  frame: number;
  fps: number;
}> = ({ data, maxValue, frame, fps }) => {
  const localFrame = frame - 60;
  if (localFrame < 0) return null;

  const barCount = data.length;
  const barGap = 20;
  const barWidth = (CHART_WIDTH - barGap * (barCount + 1)) / barCount;

  return (
    <AbsoluteFill>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * CHART_HEIGHT * 0.85;
        const barSpring = spring({
          frame: localFrame,
          fps,
          delay: index * 8,
          config: { damping: 12, stiffness: 80, mass: 0.8 },
        });

        const x = CHART_LEFT + barGap + index * (barWidth + barGap);
        const y = CHART_BOTTOM - barHeight * barSpring;

        return (
          <React.Fragment key={item.label}>
            {/* Bar */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y,
                width: barWidth,
                height: barHeight * barSpring,
                background: `linear-gradient(180deg, ${item.color}, ${item.color}88)`,
                borderRadius: "8px 8px 0 0",
                boxShadow: `0 0 20px ${item.color}44`,
              }}
            />
            {/* Label */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: CHART_BOTTOM + 15,
                width: barWidth,
                textAlign: "center",
                color: "rgba(255,255,255,0.8)",
                fontSize: 22,
                opacity: barSpring,
              }}
            >
              {item.label}
            </div>
            {/* Value */}
            <div
              style={{
                position: "absolute",
                left: x,
                top: y - 35,
                width: barWidth,
                textAlign: "center",
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                opacity: barSpring,
              }}
            >
              {Math.round(item.value * barSpring)}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

const TotalValue: React.FC<{
  data: DataVisualizationProps["data"];
  frame: number;
}> = ({ data, frame }) => {
  const localFrame = frame - 150;
  if (localFrame < 0) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const progress = interpolate(localFrame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const displayValue = Math.round(total * progress);

  const opacity = interpolate(localFrame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        width: "100%",
        textAlign: "center",
        opacity,
      }}
    >
      <span
        style={{
          fontSize: 40,
          color: "rgba(255,255,255,0.7)",
        }}
      >
        合計:{" "}
      </span>
      <span
        style={{
          fontSize: 56,
          color: "white",
          fontWeight: "bold",
        }}
      >
        ¥{displayValue.toLocaleString()}
      </span>
      <span
        style={{
          fontSize: 32,
          color: "rgba(255,255,255,0.5)",
          marginLeft: 8,
        }}
      >
        万
      </span>
    </div>
  );
};

const FadeOut: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `rgba(15, 23, 42, ${opacity})`,
      }}
    />
  );
};

export const defaultDataVisualizationProps: DataVisualizationProps = {
  title: "月別売上データ",
  data: [
    { label: "1月", value: 450, color: "#3b82f6" },
    { label: "2月", value: 320, color: "#8b5cf6" },
    { label: "3月", value: 580, color: "#06b6d4" },
    { label: "4月", value: 420, color: "#10b981" },
    { label: "5月", value: 690, color: "#f59e0b" },
    { label: "6月", value: 510, color: "#ef4444" },
  ],
};
