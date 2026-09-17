/**
 * 共有ノードが使う最小限の色。
 *
 * もとは `AgentFlowCodexReClaude/constants.ts` の `COLORS` を参照していたが、
 * 全フローが使う部品が特定の図のパレットに依存しているのは向きが逆なので、
 * 実際に使う4色だけをここへ持たせた。値は元のまま（見た目を変えないため）。
 */
export const NODE_PALETTE = {
	/** ポートの縁取り。図の地の色に合わせた濃紺 */
	backdrop: "#0b1a24",
	text: "#edf3f6",
	muted: "#adbdc7",
	/** color を渡さなかったときの既定 */
	defaultAccent: "#83cdf7",
} as const;
