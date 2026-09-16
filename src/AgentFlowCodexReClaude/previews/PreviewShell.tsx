import React from "react";
import { AbsoluteFill } from "remotion";
import { COLORS } from "../constants";

// This file is a browsing aid for Remotion Studio's sidebar (see the
// "Components" folder in Root.tsx) — a Draw.io-style palette of every
// building block AgentFlowCodexReClaude is made of. It is NOT part of that
// composition's own rendered output, so none of the "preserve output
// exactly" discipline from the ReClaude refactor applies here.

const JP_FONT = '"Hiragino Sans", "Noto Sans CJK JP", sans-serif';

export const PreviewShell: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <AbsoluteFill style={{ background: COLORS.bg, padding: 40, boxSizing: "border-box" }}>
    <div style={{ color: COLORS.text, fontSize: 28, fontWeight: 700, marginBottom: 24, fontFamily: JP_FONT }}>
      {title}
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 32 }}>
      {children}
    </div>
  </AbsoluteFill>
);

/** A labeled, bordered box for previewing a self-contained component
 * (one that doesn't rely on the full diagram's absolute coordinates). */
export const Swatch: React.FC<{
  label: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ label, width, height, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: `1px solid ${COLORS.internalBorder}`,
        borderRadius: 8,
        background: "rgba(255,255,255,0.02)",
        padding: 12,
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
    <Caption>{label}</Caption>
  </div>
);

export const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ color: COLORS.muted, fontSize: 16, fontFamily: JP_FONT, textAlign: "center" }}>
    {children}
  </div>
);
