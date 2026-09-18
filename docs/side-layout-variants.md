# Side の図主体レイアウト（2026-09-18）

既存版を残し、比較用の3本を追加した。

| Composition | 配置 | 尺 |
|---|---|---|
| Side-DemoDiagram | 左に最大の図、右に縦工程、その右に画面／説明。右上に時計。画面下部の進捗バーなし | 42秒 |
| Side-SlotMinimal | SlotExampleから図下の補足、反実仮想、画面下部の進捗バーを省く。時計と現場を維持 | 28秒 |
| ClaimIntake-DecisionStory-Stacked-Diagram | 上756pxが図、下324pxが横長の判断記録。見出し・判断値・工程説明を表示 | 28秒 |

図の縦横比を保つため、上下版の図は上段中央に配置。DecisionStoryは全画面の縮小ではなく横長に再配置し、既存の工程文言と説明部品を共有する。図内部の進捗表示は維持する。

## 確認先

- `out/side-layouts/index.html`：3案×7工程の静止画
- `out/side-catalog/index.html`：完成物15件のカタログ
- `out/agent-flow-gallery/index.html`：全48件

再生成：`node scripts/side-layouts-capture.mjs`、`pnpm gallery:agent-flow`、`pnpm catalog:side`。

## 検証

- 3案の各工程の中間フレーム21枚を確認。
- 既存45本の一覧代表PNGは変更前と `cmp` で全件バイト一致。
- `pnpm exec tsc --noEmit`、`pnpm test`（37件）成功。
- カタログの23画像、リンク、絞り込み、検索、4画面幅をブラウザ確認。

## 配置調整

- SlotMinimalはヘッダ下の領域で図と現場をそれぞれ縦中央揃え。工程ごとの現場の高さに応じて中央位置を保つ。
- 追加3案から「説明用の再構成／実接続なし」の注記を削除。
- Stacked-Diagramは上70%／下30%。上下とも表示幅1324.8px、左端297.6pxで統一。判断ストーリーは72%の表示倍率にして文字と間隔を縮小。

## 判断ストーリーの動き

工程ごとに文字だけを0.5秒でフェードインする。次工程の直前0.3秒でフェードアウトする。図・背景枠・区切り線は固定し、最後の工程はフェードアウトせず読み終えられる状態を保つ。通常表示は1工程あたり約3.2秒。動画は `out/video/ClaimIntake-DecisionStory-Stacked-Diagram.mp4`。

判断ストーリーの背景枠と列の高さも固定。文字・文字色のみ透明度を変え、枠の移動や消失を防ぐ。
