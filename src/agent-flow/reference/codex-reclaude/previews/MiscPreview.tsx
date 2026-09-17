import React from "react";
import { CloudflareLogo, Label, Waveform } from "../index";
import { COLORS } from "../constants";
import { PreviewShell, Swatch } from "./PreviewShell";

export const MiscPreview: React.FC = () => (
  <PreviewShell title="その他の部品">
    <Swatch label="CloudflareLogo" width={140} height={80}>
      <CloudflareLogo />
    </Swatch>

    <Swatch label="Label（dark）" width={140} height={80}>
      <div style={{ position: "relative", width: 100, height: 30 }}>
        <Label x={0} y={0} dark>
          WebRTC
        </Label>
      </div>
    </Swatch>

    <Swatch label="Label（cloud）" width={140} height={80}>
      <div style={{ position: "relative", width: 100, height: 30 }}>
        <Label x={0} y={0}>音声</Label>
      </div>
    </Swatch>

    <Swatch label="Waveform（非アクティブ）" width={220} height={80}>
      <Waveform width={180} frame={40} color={COLORS.blue} active={false} />
    </Swatch>

    <Swatch label="Waveform（アクティブ）" width={220} height={80}>
      <Waveform width={180} frame={40} color={COLORS.blue} active={true} />
    </Swatch>
  </PreviewShell>
);
