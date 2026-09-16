import React from "react";
import { Icon } from "../index";
import { COLORS } from "../constants";
import { PreviewShell, Swatch } from "./PreviewShell";

const ICON_IDS = ["user", "sfu", "adapter", "ai", "human", "state", "business"] as const;

export const IconsPreview: React.FC = () => (
  <PreviewShell title="Icon（ノードごとの線画アイコン）">
    {ICON_IDS.map((id) => (
      <Swatch key={id} label={id} width={110} height={110}>
        <Icon id={id} color={COLORS.text} />
      </Swatch>
    ))}
  </PreviewShell>
);
