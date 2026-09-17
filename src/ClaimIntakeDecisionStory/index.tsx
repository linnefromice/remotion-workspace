import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { z } from "zod";

export const decisionStorySchema = z.object({ showComparison: z.boolean() });
export const decisionStoryDefaults = { showComparison: true };
const steps = ["通報受付", "入力の確認", "AIの原判定", "安全ルール", "次の対応", "担当者の確認", "記録と一次回答"];
const titles = ["この一文を、見逃さない。", "判断の根拠は、通報の中に。", "AIは、翌営業日と判断した。", "安全ルールが、即時対応を要求。", "対応候補にも、制約を。", "下げる判断は、人にしかできない。", "違う判断も、同じ記録に残る。"];
const notes = ["写真付きの通報を受け付ける", "ガスのにおいという記述を次の判定へ渡す", "AIの生出力を保存。この値は後から書き換えない", "SAFETY_GAS_ODOR が発火。別の値としてP1を保持", "第2段階は責任区分と次の対応候補を判定", "このケースでは、昇格したP1を担当者が確認", "受付から一次回答まで47秒のシナリオ"];
const events = ["通報を受付", "入力を確認", "AI : P2 を保存", "ルール : P1 を追加", "対応候補を提示", "担当者が確認", "一次回答を記録"];
const c = { bg: "#101619", panel: "#1a2327", line: "#3c494f", text: "#f3f3ea", muted: "#a8b6bb", ai: "#c2adff", human: "#8ecbff" };
const label: React.CSSProperties = { fontSize: 20, letterSpacing: 2, color: c.muted };
const card: React.CSSProperties = { boxSizing: "border-box", background: c.panel, border: `1px solid ${c.line}`, borderRadius: 18, padding: 30 };

export const ClaimIntakeDecisionStory: React.FC<z.infer<typeof decisionStorySchema>> = ({ showComparison }) => {
  const frame = useCurrentFrame();
  const step = Math.min(6, Math.floor(frame / 120));
  const enter = interpolate(frame % 120, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: c.bg, color: c.text, fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif', padding: "48px 64px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", ...label }}>
      <span>CLAIM INTAKE / 判断の記録</span><span>PoC シナリオ再現 · 28秒</span>
    </div>
    <h1 style={{ fontSize: 58, letterSpacing: -2, margin: "30px 0 12px" }}>{titles[step]}</h1>
    <div style={{ fontSize: 25, color: c.muted }}>{notes[step]}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 40 }}>
      <div style={{ ...card, height: 430 }}>
        <div style={label}>01 / 入居者から届いた内容</div>
        <div style={{ fontSize: 35, lineHeight: 1.85, marginTop: 30 }}>
          キッチンの下から水が漏れています。<br />
          <span style={{ borderBottom: step >= 1 ? "3px solid white" : "3px solid transparent", paddingBottom: 7 }}>ガスのようなにおい</span>も少しします。
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 35, alignItems: "center" }}>
          <div style={{ border: `1px dashed ${c.line}`, borderRadius: 8, padding: "15px 22px", fontSize: 23 }}>添付写真 × 1</div>
          <span style={{ fontSize: 20, color: c.muted }}>通報文・写真付きの想定ケース</span>
        </div>
        <div style={{ marginTop: 26, fontSize: 22, color: c.muted }}>着目点：水漏れの記述に、ガスのにおいが併記されている。</div>
      </div>
      <div style={{ ...card, height: 430 }}>
        <div style={label}>02 / 判断を別々に保持する</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24 }}>
          <div style={{ borderTop: `3px solid ${c.ai}`, paddingTop: 16 }}>
            <div style={{ color: c.ai, fontSize: 23 }}>AIの原判定</div>
            <div style={{ fontSize: 68, fontWeight: 700, margin: "4px 0" }}>{step >= 2 ? "P2" : "—"}</div>
            <div style={{ fontSize: 24 }}>{step >= 2 ? "翌営業日" : "判定待ち"}</div>
            <div style={{ fontSize: 19, color: c.muted, marginTop: 14 }}>urgency_ai / 原値を保存</div>
          </div>
          <div style={{ borderTop: `3px solid ${c.text}`, paddingTop: 16 }}>
            <div style={{ fontSize: 23 }}>安全ルールの結論</div>
            <div style={{ fontSize: 68, fontWeight: 700, margin: "4px 0" }}>{step >= 3 ? "P1" : "—"}</div>
            <div style={{ fontSize: 24 }}>{step >= 3 ? "即時対応" : "評価待ち"}</div>
            <div style={{ fontSize: 19, color: c.muted, marginTop: 14 }}>{step >= 3 ? "SAFETY_GAS_ODOR" : "決定論のルールで評価"}</div>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${c.line}`, marginTop: 18, paddingTop: 12, fontSize: 25, color: step >= 5 ? c.human : c.text }}>
          {step >= 5 ? "担当者がP1を確認 ／ 降格には理由が必要" : step >= 3 ? "P2は残る。運用上の緊急度はP1へ。" : "判断が出た順に、記録を積み重ねる。"}
        </div>
      </div>
    </div>
    <div style={{ marginTop: 24, height: 132, ...card, padding: "22px 30px" }}>
      <div style={{ opacity: enter }}>
        {step < 3 ? <><div style={label}>問い / AIが緊急度を低く見積もったら？</div><div style={{ fontSize: 32, marginTop: 15 }}>その判断だけで、対応を決めてよいのか。</div></> :
          step === 3 && showComparison ? <div style={{ display: "flex", gap: 70 }}>
            <div><div style={label}>比較用の仮定 / 安全ルールがなければ</div><div style={{ fontSize: 30, marginTop: 16 }}>P2のまま → 翌営業日の対応判断</div></div>
            <div style={{ borderLeft: `2px solid ${c.text}`, paddingLeft: 35 }}><div style={label}>このケース / 安全ルールあり</div><div style={{ fontSize: 30, marginTop: 16 }}>P1へ昇格 → 即時対応の判断</div></div>
          </div> : step === 4 ? <><div style={label}>第2段階 / 5本のガードレール</div><div style={{ fontSize: 31, marginTop: 15 }}>対応候補への追加と制止だけ。候補を削る経路はない。</div></> : step === 5 ? <><div style={{ ...label, color: c.human }}>権限の非対称</div><div style={{ fontSize: 31, marginTop: 15 }}>昇格はルールが強制。降格は人だけが、理由を残して行う。</div></> : step === 6 ? <><div style={label}>追跡可能な記録 / 追記のみ</div><div style={{ fontSize: 29, marginTop: 15, fontFamily: "monospace" }}>AI: P2　 /　 RULE: SAFETY_GAS_ODOR → P1　 /　 担当者確認</div></> : <><div style={label}>安全ルール / 昇格を強制</div><div style={{ fontSize: 31, marginTop: 15 }}>AIの原判定を保持したまま、別の結論を追加する。</div></>}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12, marginTop: 25 }}>
      {steps.map((name, i) => <div key={name} style={{ borderTop: `3px ${i <= step ? "solid" : "dashed"} ${i <= step ? c.text : c.line}`, paddingTop: 14 }}>
        <div style={{ fontSize: 18, color: c.muted }}>{String(i + 1).padStart(2, "0")} / {name}</div>
        <div style={{ fontSize: 20, marginTop: 12, color: i <= step ? c.text : c.muted }}>{i <= step ? events[i] : "記録待ち"}</div>
      </div>)}
    </div>
    <div style={{ position: "absolute", bottom: 30, left: 64, right: 64, display: "flex", justifyContent: "space-between", fontSize: 18, color: c.muted }}>
      <span>説明用の画面再構成 / 実システムへの接続なし</span><span>47秒はシナリオ値であり、実測・性能保証ではありません</span>
    </div>
  </AbsoluteFill>;
};
