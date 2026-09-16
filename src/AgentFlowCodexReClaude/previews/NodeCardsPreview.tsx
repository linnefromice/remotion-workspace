import React from "react";
import { NodeCard } from "../index";
import { NODES, type NodeDef, type StepIndex } from "../constants";
import { PreviewShell, Caption } from "./PreviewShell";

const ALL_STEPS: StepIndex[] = [0, 1, 2, 3];

/** The first step that does NOT light this node up, used to render its
 * "inactive" swatch. Every node here is inactive for at least one step. */
const inactiveStepFor = (node: NodeDef): StepIndex =>
  ALL_STEPS.find((step) => !node.steps.includes(step)) ?? 0;

// NodeCard positions itself with `position: absolute; left: node.x; top:
// node.y` — coordinates meant for the full 1920x1080 diagram, not a small
// swatch. This wrapper cancels that offset so the card renders at (0,0)
// inside a box sized to just that card.
const NodeCardFrame: React.FC<{ node: NodeDef; step: StepIndex; caption: string }> = ({
  node,
  step,
  caption,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ position: "relative", width: node.w, height: node.h }}>
      <div style={{ position: "absolute", top: -node.y, left: -node.x }}>
        <NodeCard node={node} frame={40} step={step} />
      </div>
    </div>
    <Caption>{caption}</Caption>
  </div>
);

export const NodeCardsPreview: React.FC = () => (
  <PreviewShell title="NodeCard（非アクティブ / アクティブの両状態）">
    {NODES.map((node) => (
      <React.Fragment key={node.id}>
        <NodeCardFrame node={node} step={inactiveStepFor(node)} caption={`${node.id}（非アクティブ）`} />
        <NodeCardFrame node={node} step={node.steps[0]} caption={`${node.id}（アクティブ）`} />
      </React.Fragment>
    ))}
  </PreviewShell>
);
