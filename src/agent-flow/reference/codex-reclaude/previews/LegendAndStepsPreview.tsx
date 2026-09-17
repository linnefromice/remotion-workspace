import React from "react";
import { AbsoluteFill } from "remotion";
import { Legend, StepBar } from "../index";
import { CANVAS_W, COLORS, STEPS, type StepIndex } from "../constants";
import { Caption } from "./PreviewShell";

const JP_FONT = '"Hiragino Sans", "Noto Sans CJK JP", sans-serif';

// Legend/StepBar position themselves with `position: absolute; left/right:
// 68; top: 66-67` — offsets meant to be read against the full diagram
// canvas. Rather than fighting that with a counter-offset wrapper (which
// just adds a second absolute context and breaks the math), each band below
// recreates that same canvas-width, `position: relative` context directly,
// so the components resolve their own offsets exactly as they do in the
// real diagram.
const BAND_WIDTH = CANVAS_W - 80; // the 1920 canvas minus this page's 40px side padding
const BAND_HEIGHT = 130;

const Band: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div
      style={{
        position: "relative",
        width: BAND_WIDTH,
        height: BAND_HEIGHT,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${COLORS.internalBorder}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {children}
    </div>
    <div style={{ marginTop: 8 }}>
      <Caption>{label}</Caption>
    </div>
  </div>
);

export const LegendAndStepsPreview: React.FC = () => {
  const stepIndices: StepIndex[] = [0, 1, 2, 3];
  return (
    <AbsoluteFill style={{ background: COLORS.bg, padding: 40, boxSizing: "border-box" }}>
      <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, marginBottom: 24, fontFamily: JP_FONT }}>
        Legend / StepBar
      </div>

      <Band label="Legend">
        <Legend />
      </Band>

      {stepIndices.map((step) => (
        <Band key={step} label={`StepBar（現在地: ${STEPS[step]}）`}>
          <StepBar step={step} />
        </Band>
      ))}
    </AbsoluteFill>
  );
};
