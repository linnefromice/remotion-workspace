# Side のベース3案（2026-09-18）

**この3つを Side パターンの土台にする。** 以後の Side は、この3つのどれかから派生させる。

図（AgentDiagram）を主役に置いたまま、**残りの面をどう使うか**が3つに分かれる。

| Composition | 図の置き方 | 残りの面に置くもの | 尺 |
|---|---|---|---|
| `Side-DemoDiagram` | 左に最大 | 右に縦の工程リスト、その右にデモ画面と解説。右上に時計 | 42秒 |
| `Side-SlotMinimal` | 左（`SideBySide` レイアウト） | 右に現場のみ。右上に時計。図下の補足・反実仮想・進捗バーを省く | 28秒 |
| `Side-Stacked` | **上70%に最大** | 下30%に横長の判断記録の帯。右カラムは無い | 28秒 |

## 3つの選び分け

- **`Side-DemoDiagram`** — 図と画面を**同時に**見せたいとき。1画面に3列入るぶん、各要素は小さい
- **`Side-SlotMinimal`** — 図を読ませることに集中したいとき。**足すものを減らした形**で、スロットで後から足せる
- **`Side-Stacked`** — **図を一番大きく出したい**とき。左右に割らないので図が広く、そのかわり縦の余地を判断記録の1帯に譲る

左右に割る版の寸法は [`side-catalog.md`](./side-catalog.md)。上下版だけ寸法の前提が違う。

## ID の整理

`Side-Stacked` はもともと `ClaimIntake-DecisionStory-Stacked-Diagram` という ID で
`ClaimIntake` 配下にあった。**役割は題材ではなくレイアウトの試行**なので、
DesignStudies の約束（`Side-*` / 題材を ID に持たない）に合わせて
`src/agent-flow/design-studies/side/Stacked.tsx` へ移した。

移設は**描画を変えていない**。frame 420 の PNG が移設前の一覧画像と `cmp` でバイト一致。

## 確認先

- `out/side-layouts/index.html`：3案×7工程の静止画
- `out/side-catalog/index.html`：完成物のカタログ
- `out/agent-flow-gallery/index.html`：全件の一覧（正本）

再生成：`node scripts/side-layouts-capture.mjs`、`pnpm gallery:agent-flow`、`pnpm catalog:side`。

## 検証

- 3案の各工程の中間フレーム21枚を確認。
- 既存45本の一覧代表PNGは変更前と `cmp` で全件バイト一致。
- `pnpm exec tsc --noEmit`、`pnpm test` 成功。
- カタログの画像、リンク、絞り込み、検索、4画面幅をブラウザ確認。

## 配置調整

- `Side-SlotMinimal` はヘッダ下の領域で図と現場をそれぞれ縦中央揃え。工程ごとの現場の高さに応じて中央位置を保つ。
- ベース3案から「説明用の再構成／実接続なし」の注記を削除。
- `Side-Stacked` は上70%／下30%。上下とも表示幅1324.8px、左端297.6pxで統一。判断ストーリーは72%の表示倍率にして文字と間隔を縮小。

## 判断ストーリーの動き（`Side-Stacked`）

工程ごとに文字だけを0.5秒でフェードインする。次工程の直前0.3秒でフェードアウトする。図・背景枠・区切り線は固定し、最後の工程はフェードアウトせず読み終えられる状態を保つ。通常表示は1工程あたり約3.2秒。動画は `out/video/Side-Stacked.mp4`。

判断ストーリーの背景枠と列の高さも固定。文字・文字色のみ透明度を変え、枠の移動や消失を防ぐ。
