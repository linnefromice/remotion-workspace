import React from "react";
import { AbsoluteFill } from "remotion";
import { IconNode } from "../../shared/IconNode";
import { ServiceIcon, type ServiceIconName } from "../../shared/ServiceIcon";
import { COLORS } from "../constants";

const callNodes: {service: string; role: string; icon: ServiceIconName; color: string}[] = [
  {service: "Incoming call", role: "着信を受け付ける", icon: "phone", color: "#82d893"},
  {service: "AI Listen", role: "音声を理解する", icon: "wave", color: "#b395f8"},
  {service: "Calendar / CRM", role: "予約・顧客情報を照会", icon: "calendar", color: "#77d4c9"},
  {service: "Confirm", role: "予約内容を確認", icon: "check", color: "#eac85c"},
  {service: "Hand off", role: "担当者へ引き継ぐ", icon: "people", color: "#7ca7ff"},
];
const serviceNodes: {service: string; role: string; icon: ServiceIconName; color: string}[] = [
  {service: "AI Agent", role: "Tools Agent", icon: "agent", color: "#d4dcf0"},
  {service: "Postgres", role: "Chat Memory", icon: "database", color: "#8cbbdf"},
  {service: "Is manager?", role: "条件分岐 / Router", icon: "branch", color: "#82d893"},
  {service: "Jira Software", role: "create: user", icon: "tool", color: "#7ca7ff"},
  {service: "Slack", role: "Add to channel", icon: "message", color: "#77d4c9"},
];

export const IconNodesPreview: React.FC = () => (
  <AbsoluteFill style={{background: COLORS.bg, backgroundImage: "radial-gradient(#344252 1px, transparent 1px)", backgroundSize: "24px 24px", fontFamily: '"Hiragino Sans", sans-serif', color: COLORS.text, padding: "40px 64px", boxSizing: "border-box"}}>
    <div style={{fontSize: 32, fontWeight: 700}}>Icon Nodes <span style={{fontSize: 20, color: COLORS.muted, marginLeft: 18}}>サービスと役割を、アイコン中心に</span></div>
    <div style={{fontSize: 16, color: COLORS.muted, marginTop: 12}}>再利用できる3つの形状 · 左右の接続ポート / 下部のツール接続ポート · アクティブ状態</div>
    {(["card", "square", "circle"] as const).map((variant, row) => {
      const nodes = row === 0 ? callNodes : serviceNodes;
      const top = [163, 502, 800][row];
      return <React.Fragment key={variant}>
        <div style={{position: "absolute", left: 64, top: top + 16, width: 230}}>
          <div style={{fontSize: 14, color: "#7ca7ff", letterSpacing: 2}}>0{row + 1}</div>
          <div style={{fontSize: 25, marginTop: 12}}>{["Icon Card", "Service Tile", "Tool Circle"][row]}</div>
          <div style={{fontSize: 17, color: COLORS.muted, marginTop: 12, lineHeight: 1.7}}>{["一連の処理・ステップ\nラベルをカード内に配置", "サービス・分岐ノード\nラベルをアイコン枠の下に", "モデル・メモリ・ツール\n補助ノードの接続に"][row].split("\n").map(line => <div key={line}>{line}</div>)}</div>
        </div>
        {row === 0 && <svg width="1920" height="1080" style={{position: "absolute", inset: 0}}><path d="M440 263H1616" stroke="#587cae" strokeWidth="2"/></svg>}
        <div style={{position: "absolute", left: 336, top, display: "flex", gap: 80}}>
          {nodes.map((node, i) => <IconNode key={node.service} {...node} icon={<ServiceIcon name={node.icon}/>} variant={variant} active={row === 0 || i === 2} ports={row === 0 ? ["left", "right"] : row === 1 ? ["left", "right", "bottom"] : ["bottom"]}/>)}
        </div>
      </React.Fragment>;
    })}
  </AbsoluteFill>
);
