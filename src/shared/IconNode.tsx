import React from "react";
import { NODE_PALETTE } from "./nodePalette";

export type IconNodeProps = {
  icon: React.ReactNode;
  service: string;
  role?: string;
  color?: string;
  variant?: "card" | "square" | "circle";
  active?: boolean;
  ports?: readonly ("left" | "right" | "bottom")[];
};

/** Flow-diagram node. Place its 208px-wide wrapper in the diagram layout.
 * Icons can be SVG components or images; labels wrap below the icon.
 * Port centers: card (0/208, 100), square/circle (40/168, 64), bottom (104, 128).
 */
export const IconNode: React.FC<IconNodeProps> = ({
  icon, service, role, color = NODE_PALETTE.defaultAccent, variant = "square", active = false, ports = [],
}) => {
  const card = variant === "card";
  const port = (side: "left" | "right" | "bottom"): React.CSSProperties => ({
    position: "absolute", width: 12, height: 12,
    background: active ? color : "#a5b2c4", border: `3px solid ${NODE_PALETTE.backdrop}`,
    boxSizing: "content-box", borderRadius: side === "bottom" ? 2 : "50%",
    ...(side === "bottom"
      ? {left: "50%", bottom: -9, transform: "translateX(-50%) rotate(45deg)"}
      : {[side]: -9, top: card ? 100 : 64, transform: "translateY(-50%)"}),
  });
  const emblem = <div style={{width: card ? 100 : 128, height: card ? 100 : 128,
    display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box",
    borderRadius: card || variant === "circle" ? "50%" : 16,
    border: `2px solid ${active || card ? color : "#82909f"}`,
    background: card ? `${color}24` : "#18212d",
    boxShadow: active ? `0 0 24px ${color}28` : "none", color,
  }}><div style={{width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center"}}>{icon}</div></div>;
  const labels = <div style={{textAlign: "center", padding: "0 8px", marginTop: card ? 22 : 18}}>
    <div style={{fontSize: 23, lineHeight: 1.3, fontWeight: 600, overflowWrap: "anywhere"}}>{service}</div>
    {role && <div style={{fontSize: 17, lineHeight: 1.4, marginTop: 7, color: NODE_PALETTE.muted, overflowWrap: "anywhere"}}>{role}</div>}
  </div>;
  return <div role="img" aria-label={`${service}${role ? `：${role}` : ""}${active ? "（アクティブ）" : ""}`} style={{width: 208, color: NODE_PALETTE.text, fontFamily: '"Hiragino Sans", sans-serif'}}>
    {card ? <div style={{position: "relative", minHeight: 280, boxSizing: "border-box", padding: "28px 8px 34px", border: `2px solid ${active ? color : "#394959"}`, borderRadius: 20, background: "#101e2d", display: "flex", alignItems: "center", flexDirection: "column"}}>
      {emblem}{labels}
      <span style={{position: "absolute", right: 18, bottom: 17, width: 11, height: 11, borderRadius: "50%", background: color, opacity: active ? 1 : .45}}/>
      {ports.map(side => <span key={side} style={port(side)}/>)}
    </div> : <>
      <div style={{position: "relative", width: 128, height: 128, margin: "0 auto"}}>
        {emblem}{ports.map(side => <span key={side} style={port(side)}/>)}
      </div>{labels}
    </>}
  </div>;
};
