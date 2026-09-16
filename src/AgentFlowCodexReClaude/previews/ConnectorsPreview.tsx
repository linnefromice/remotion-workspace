import React from "react";
import { ArrowheadDefs, EdgeLine } from "../index";
import { COLORS, LEGEND, type EdgeDef } from "../constants";
import { PreviewShell, Caption } from "./PreviewShell";

const SAMPLE_WIDTH = 220;
const SAMPLE_HEIGHT = 40;

const sampleEdge = (color: string, dashed: boolean): EdgeDef => ({
  id: `sample-${color}-${dashed}`,
  path: `M10 ${SAMPLE_HEIGHT / 2} H${SAMPLE_WIDTH - 10}`,
  color,
  step: 0,
  dashed,
});

const ConnectorSample: React.FC<{ color: string; label: string; dashed: boolean; active: boolean }> = ({
  color,
  label,
  dashed,
  active,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <svg width={SAMPLE_WIDTH} height={SAMPLE_HEIGHT}>
      <ArrowheadDefs />
      <EdgeLine edge={sampleEdge(color, dashed)} active={active} localFrame={40} />
    </svg>
    <Caption>{`${label}（${active ? "アクティブ" : "非アクティブ"}）`}</Caption>
  </div>
);

export const ConnectorsPreview: React.FC = () => (
  <PreviewShell title="EdgeLine（信号線・制御線のスタイル一覧）">
    {LEGEND.map(([color, label]) => {
      // In the real diagram, only the "制御・業務" (control) color is ever
      // drawn dashed — mirror that here rather than showing every color
      // both ways.
      const dashed = color === COLORS.control;
      return (
        <React.Fragment key={color}>
          <ConnectorSample color={color} label={label} dashed={dashed} active={false} />
          <ConnectorSample color={color} label={label} dashed={dashed} active={true} />
        </React.Fragment>
      );
    })}
  </PreviewShell>
);
