# remotion-workspace

React + TypeScript によるプログラマティック動画制作のための [Remotion](https://www.remotion.dev/) v4 ワークスペースです。

## セットアップ

```bash
pnpm install
```

## 開発

Remotion Studio（ブラウザベースのプレビュー・エディタ）を起動します。

```bash
pnpm dev
```

## レンダリング

全コンポジションをレンダリング:

```bash
pnpm build
```

特定のコンポジションを指定してレンダリング:

```bash
pnpm exec remotion render <CompositionId>
```

## コンポジション一覧

Studio のサイドバーは「題材 > 見せ方」で並べている。id がそのまま表示名になるので、
題材と見せ方が id から読み取れる名前にしてある。

```
AgentFlow/
  ClaimIntake/    通報受付（実装済みPoC: farleap/tenant-claim-intake-demoapp）  28秒
    ClaimIntake-Cards / -Icons / -LogoSeal / -ActionRow
  Inquiry/        問い合わせ対応フロー（構想）                                  24秒
    Inquiry-Cards / -Icons / -LogoSeal / -ActionRow
  Reference/      Cloudflare 音声エージェント参照図                             20秒
    Reference-Cloudflare / Reference-Cloudflare-Refactored
  Exhibition/     展示会ループ                                                  20秒
    Exhibition-Loop
Components/       部品カタログ（すべて Still）
  Nodes/          Node-Service / Node-Icon / Node-Card
  Parts/          Part-Icons / Part-Connectors / Part-StepsAndLegend / Part-Misc
Examples/         Remotion の機能サンプル
  Basics/ 3D/ Effects/
```

同じ題材の4つ（`Cards` / `Icons` / `LogoSeal` / `ActionRow`）は**ノードの描き方だけが違い**、
ノード・エッジ・ステップ・判定パネルは共有している。見せ方の比較用。

### Examples の内訳

| ID | 内容 | 時間 | 主な技術 |
|----|------|------|----------|
| BasicAnimation | テキストと図形のスプリングアニメーション | 5秒 | `interpolate`, `spring`, `Sequence` |
| DataVisualization | 棒グラフのアニメーション（Zod でプロップ定義） | 7秒 | Zod schema, `spring` |
| PresentationSlides | スライドプレゼンテーション（Zod でプロップ定義） | 15秒 | `Series`, `Img`, Zod schema |
| ThreeScene | 3D シーン（カメラ軌道・回転トーラス） | 8秒 | `@remotion/three`, Three.js |
| ParticleSystem | パーティクルシステムのループアニメーション | 8秒 | `Loop`, `random` |
| AudioVisualizer | 音声データに連動するビジュアライザー | 10秒 | `@remotion/media-utils`, `Audio` |
| MotionGraphics | SVG シェイプのパスアニメーション | 10秒 | `@remotion/shapes`, `@remotion/paths` |
| TransitionDemo | 各種トランジション効果のデモ | 18秒 | `@remotion/transitions` (slide, fade, wipe, flip, clockWipe) |
| LottieDemo | Lottie アニメーションの再生 | 9秒 | `@remotion/lottie` |
| NoiseArt | プロシージャルノイズによるジェネラティブアート | 10秒 | `@remotion/noise` |
| CodeAnimation | Shiki によるシンタックスハイライト付きコード表示 | 12秒 | `shiki` |

すべてのコンポジションは 1920×1080 / 30fps です。

## 新しいコンポジションの追加方法

1. `src/<Name>/index.tsx` にコンポーネントを作成・エクスポート
2. `src/Root.tsx` に `<Composition>` を追加（`id`, `durationInFrames`, `fps`, `width`, `height` を指定）
3. プロップが必要な場合は Zod スキーマと `defaultProps` を定義（`DataVisualization` を参考）

## ベースの更新（2026-09-16）

主要ライブラリを Remotion 推奨の構成に合わせて更新した。

- `remotion` / `@remotion/*` を `4.0.421` → `4.0.525` に更新し、全パッケージのバージョンを完全一致させた
  （Remotion は `remotion` 本体と `@remotion/*` のバージョン不一致を検知すると警告を出し、実際にレンダリングが壊れる。
  `zod` も Remotion 側が要求する厳密なバージョン（`4.5.4`）に固定 — 詳細は下記「詰まった点」参照）
- `react` / `react-dom` は最新の `19.3.0` ではなく `19.2.8` に固定した。
  `@react-three/fiber@9.7.0`（ThreeScene / ParticleSystem が依存）のピア制約が `react "<19.3"` のため、
  `19.3.0` では **レンダリング時に実際にクラッシュする**（peer警告だけでなく本当に落ちる）ことを確認済み
- `three` / `@react-three/fiber` / `shiki` / `@types/*` を最新へ更新
- `typescript` は `5.9.3`（5.x 系最新）に据え置き。7.x 系（ネイティブコンパイラ）は互換性未検証のため見送り
- `@remotion/google-fonts` を追加（`AgentFlow` の Google Fonts 読み込みに使用。Remotion 公式の推奨手段）
- `remotion.config.ts` に `Config.setRspack(true)` を追加（現行テンプレートのデフォルトバンドラー）
- `tsconfig.json` を現行の `template-blank` に合わせて更新
  （`module: "Preserve"`, `moduleResolution: "Bundler"`, `noEmit: true`, `noUnusedLocals: true` など）。
  ただし `lib` は公式テンプレートの `["es2015"]` のままだと `fetch` / `console` / `padStart` 等が型エラーになるため
  `["es2020", "dom"]` に変更した（既存コンポジションが実際に使用しているため）
- 上記の `noUnusedLocals` 適用に伴い、既存コンポジションの未使用 import / 変数を削除
  （`AudioVisualizer`, `CodeAnimation`, `TransitionDemo`）

## AgentFlow: 展示会ループ「エージェント連動図」

Notion「2609向けデモ＞AIエージェント動いている風フローのデモ動画」の検証用プロンプトに基づく検証実装。
**ブランド規定（`design/tokens/farleap.tokens.json`）は本件では適用外**（参照画像に寄せた IT/サイバー質感を優先する判断のため）。
そのままデックへ転用しない。

### 実行したコマンド

```bash
# 動画（H.264 / yuv420p / 1920x1080 / 30fps / 20秒）
npx remotion render Exhibition-Loop out/agent-flow.mp4 --image-format=png --pixel-format=yuv420p

# 静止画（frame 420 = ④承認のちょうど中央、360〜479フレームの中点）
npx remotion still Exhibition-Loop out/still-approve.png --frame=420
```

`--image-format=png` と `--pixel-format=yuv420p` を明示的に付けている理由は「詰まった点」参照
（リポジトリ既定の `jpeg` のままだと `yuvj420p` になり、仕様の `yuv420p` と一致しない）。

### デザイン修正（参照キャプチャ反映、2026-09-16）

Cloudflare構成図のキャプチャ（Realtime SFU / WebSocket Adapter 等の図）を渡され、そのビジュアル言語に
寄せるよう修正依頼を受けた。当初の文面仕様（角丸0〜2px・HUD風コーナーブラケット・下部凡例）から、
実際の参照画像優先で以下を変更：

- **角丸**: ノード14px・ランタイム枠20pxに変更（コーナーブラケットは廃止）
- **カードの2トーン化**: 枠の外側ノード（①受付・④承認）は寒色（青系）の枠・背景、内側ノード（②③⑤）は
  暖色（紫系）の枠・背景を常時まとう「所属」を表す層を追加。ステップ配色（cyan/violet/orange/green）は
  従来どおり「現在アクティブか」を示すグロー層として上に重ねる（2層構造）
- **ランタイム枠**: グレー破線 → 実線の紫系ソリッド枠に変更し、ロゴ風グリフ＋「FARLEAP / AGENT RUNTIME」＋
  右側にタグライン（「入居者対応を自動化し、要所は人が確認する」）を追加
- **アイコン**: 各ノード右上の2桁カウンターを廃止し、役割を表す線画アイコン（吹き出し/虫眼鏡/鉛筆/
  チェック/リスト）に置き換え
- **ステップバー**: 中央揃えのテキストのみ → 左上に丸バッジ（番号）＋ラベル＋接続線の横並びに変更
- **凡例**: 画面下部中央 → 画面右上（ステップバーと同じ行）に移動
- **エッジ**: 矢印（`marker-end`）を追加、非アクティブなエッジには固定の中継ドットを追加

### デザイン修正 第2弾（サイズ・フォント・余白の見直し、2026-09-16）

上記の反映後にキャプチャで確認した結果、以下のフィードバックを受けて再調整した。

- **「フォント・箱が大きすぎる」**: ノードを 400×380px → 340×280px に縮小。日本語名を100px→68px、
  短文を54px→32pxに縮小した。**これは当初の文面仕様（§7「ノード名は96px以上、短文は54px以上」）から
  意図的に外れている。** 通路からの可読性より、実際にキャプチャを見た担当者の「大きすぎる」という
  判断を優先した（本人が見て判断するのが最終基準という原則に基づく）
- **「もう少しスタイリッシュなフォントに」**: 日本語を Noto Sans JP → **M PLUS 2**（幾何学的でテック
  ダッシュボード寄りの字形）に変更。ウェイトも 900→800 に落として、より軽い印象にした
- **「ノードの線をもう少し長くして状態遷移をイメージしやすく」**: ノード間ギャップを
  45px→70px（枠内）、35px→90px（枠外・横）、35px→150px（枠外・縦、④承認への落下線）に拡大。
  ノードを小さくした分の余白をそのまま線の長さに転嫁した
- **「文字がノードに被っている」の修正**: `入居者` キャプションが `受付` ノードの上端と実際に重なって
  いたバグを確認・修正。キャプションの中心座標からコンテンツの実高さ（アイコン+ギャップ+テキスト）を
  逆算して配置するように直し、マジックナンバーでのオフセット指定をやめた

### デザイン修正 第3弾（指示書ベース：タイポグラフィ・余白・接続線、2026-09-16）

「UIデザイン修正指示書」を受けて、フォント・ウェイト・余白・接続線ルーティングを指示どおり調整した。

- **フォント変更**: 和文を M PLUS 2 → **M PLUS Rounded 1c**（丸ゴシック）に変更。欧文ラベル
  （`LINE WEBHOOK` 等のヘッダー、`FARLEAP` ロゴ、ステップ番号）は JetBrains Mono（等幅）から
  **Quicksand**（丸みのあるサンセリフ）に変更し、指示書の「SF Pro Rounded／洗練されたサンセリフ」に
  近づけた。SF Pro Rounded は Apple 独自フォントで Google Fonts 経由では配布されていないため、
  同系統の丸ゴシック体で代替した
- **ノードタイトル**: Weight 800 → **300（Light）**、Size 68px → **42px**、
  Letter Spacing **0.06em** を追加、Color を **#FFFFFF** に統一（指示書の「極太禁止・300〜400」に準拠）
- **説明文**: Size 32px → **22px**、**opacity 0.7** を追加してタイトルとのメリハリをつけた
- **カード内余白**: padding 16〜18px → **26px/28px** に拡大。タイトル縮小で生まれた領域をそのまま
  余白に還元した
- **接続線**: 線幅を active 3px→**2px**、非アクティブ 2px→**1.5px** に細く統一。グロー（発光）も
  `opacity 0.55→0.35` `blur 6→5` と弱め、「薄く付与」の指示に合わせた
- **接続線のルーティング**: ④→⑤・⑤→①の2本は、これまで斜めに横切るベジェ曲線だったのを、
  **直角の折れ線（L字・コの字ルーティング、角丸コーナー半径26px）** に作り直した。
  `points: [number, number][]`（経由点の配列）を持たせ、角丸ポリライン描画関数と、経路の距離に
  沿って進行度を求める関数を新規実装（それまでの3次ベジェ専用の実装を置き換え）。
  結果として、どの接続線もノードの枠や文字を斜めに横切らなくなった

### §8 測定値

| 測るもの | 結果 |
|---|---|
| `remotion render` の実測時間 | 約10〜12秒（Apple M5 Max, 18コア / Concurrency 8x, CPU使用率 450〜640%）。複数回計測でこの範囲に収まった |
| mp4 のファイルサイズ | 515 KB（1920×1080/30fps/20秒、H.264/yuv420p） |
| 静止画の書き出し | 成功。`npx remotion still Exhibition-Loop out/still-approve.png --frame=420`（1920×1080 PNG, 約2.6秒） |
| コンポーネントの行数 | 合計 1015行（`src/AgentFlow/index.tsx` 739行 + `src/AgentFlow/constants.ts` 276行の2ファイル。指示書反映後の行数） |
| ループの継ぎ目（frame599→0） | 繋がっている。各ステップは`useCurrentFrame()`由来の純関数のみで決定しており、frame599時点で⑤(記録)がグロー安定状態・edge④→⑤のドットが⑤到達直前、frame0で⑤→①のedgeが始点(⑤)から再開するため、要素の増減やカメラの動きが一切ない設計上、視覚的なジャンプは発生しない |
| グロー・波形によるレンダー負荷 | 有り無しで比較レンダーした結果、有効時 約13.6〜14.8秒 / 無効時 約12.9〜13.6秒。**体感で1割前後の差**で、有意なボトルネックにはならなかった（`box-shadow`のCSSグローとSVG `feGaussianBlur`は常時1つのノード/エッジにしかかからない設計にしたため） |

### 詰まった点（Remotion固有）

1. **`zod` はメジャーバージョンではなく exact バージョンの一致が要求される。**
   `remotion@4.0.525` は内部で `zod@4.5.4` を要求しており、`^4.6.5`（当時の zod 最新）を入れてレンダリングすると
   「Version mismatch」エラーで停止する（`npx remotion versions` で要求バージョンを確認できる）。
   Remotion と `zod` / `@remotion/google-fonts` などのサブパッケージは、`remotion` 本体と **完全一致** させる必要がある。
2. **`@react-three/fiber` の react ピア制約が実際に壊れる。**
   `react@19.3.0` を入れると `@react-three/fiber@9.7.0`（peer: `react "<19.3"`）が
   `pnpm install` の警告だけでなく `remotion render ThreeScene` 実行時に実際にクラッシュする
   （`commitLayoutEffectOnFiber` 内で例外）。`react`/`react-dom` を `19.2.8` に固定して解消。
3. **macOS 上でこの環境の headless Chromium は素の WebGL コンテキスト生成に失敗する。**
   `ThreeScene` レンダー時に `THREE.WebGLRenderer: Error creating WebGL context` で落ちる。
   `--gl=swangle` を付けると解消した（`--gl=angle` は不十分だった）。3D 系コンポジションをこのマシンで
   レンダーする場合は `npx remotion render ThreeScene out.mp4 --gl=swangle` が必要。
4. **Noto Sans JP のような CJK フォントは `@remotion/google-fonts` 経由だと大量のリクエストになる。**
   `japanese` サブセットは 1 ウェイトあたり約120個のUnicode範囲チャンクに分割されており、
   3ウェイト読み込むと約360リクエストが走る（バンドル時にコンソール警告が出る）。
   実害はレンダー時間への影響は軽微だったが、`ignoreTooManyRequestsWarning: true` を明示しないと
   警告が大量に出力される。
5. **`Config.setVideoImageFormat("jpeg")`（本リポジトリの既定）は `yuvj420p`（フルレンジ）を生む。**
   仕様が要求する厳密な `yuv420p`（リミテッドレンジ）にするには、その回のレンダーだけ
   `--image-format=png --pixel-format=yuv420p` を明示的に指定する必要があった
   （CLI の `--pixel-format=yuv420p` 単体では `jpeg` 入力の場合に効かず、`yuvj420p` のままだった）。
6. **CSS `opacity` を持つ要素は、背後の SVG レイヤーを透過してしまう。**
   非アクティブなノードを `opacity: 0.32` で沈める実装にしたところ、背後の grid や edge の破線が
   ノードパネル越しに透けて見えるバグが発生した。ノードの背景・枠は常に不透明のままにし、
   中身のテキスト/装飾だけを内側の wrapper に包んで `opacity` を適用することで解決した。

### §10 判断ログ（仕様で決めきれなかった箇所）

- **エッジ④→⑤の色**: 凡例の対応表に明記が無かったため、「エッジの色は起点ノードの色」という
  一貫ルール（①→②=cyan, ②→③・③→④=violet, ⑤→①=green の並びから逆算）で **オレンジ** とした
- **グルーピング枠の内訳**: ②③⑤を横一列で枠内に収め、④（承認）は枠の外・下に配置。
  ①（受付）は枠の外・左に配置。人（入居者・担当者）は対応するノードのすぐそばに配置した
- **ノード・短文のフォントサイズ**: 通路から読める最低限（96px/54px）を満たしつつ、5ノード全てに
  「mono英字ラベル＋2桁カウンタ＋日本語名＋短文（＋波形）」を収める必要があったため、
  ノードサイズを 400×380px に設定。英字ラベルは仕様の 24〜28px の下限寄り（24px）にして、
  2行折り返し時でも高さ超過しないようにした
- **アクティブ切り替えの遷移**: 「同時に光るノードは常に1つ」を厳密に守るため、ノードの
  アクティブ/非アクティブはハードカット、グローだけ切り替わり後10フレーム（約0.33秒）で
  ランプインさせた（点滅の基準「1秒3回超」には遠く及ばない）

## AgentFlowCodex

参照図の Cloudflare 音声エージェント構成を再現した独立コンポジション。
既存の `AgentFlow` と同じく Examples の外に登録しています。

- 1920×1080 / 30fps / 600フレーム（20秒）、音声なし
- 各5秒：話す → AI応対 → 予約確認 → 人へ引き継ぐ
- 青＝発話、オレンジ＝返答、緑＝有人音声、破線＝制御・業務
- `src/AgentFlowCodex/constants.ts`：カード配置・配色・接続経路・時間設定
- `src/AgentFlowCodex/index.tsx`：図・ステップ表示・波形・信号アニメーション
- 全アニメーションは `useCurrentFrame()` 由来。サービス名は参照図の表記を使用。
- ロゴはSVGによる簡略表現。日本語フォントはローカルの Hiragino Sans / Noto Sans CJK JP を使用。

```bash
pnpm dev
pnpm exec remotion still Reference-Cloudflare out/AgentFlowCodex.png --frame=75
pnpm exec remotion render Reference-Cloudflare out/AgentFlowCodex.mp4
```

## AgentFlowCodexReClaude

`AgentFlowCodex` の**保守性・可読性リファクタ版**。見た目・アニメーションは意図的に
1ピクセルも変えていない（frame 0/1/40/75/149/150/220/299/300/450/500/599 で書き出した
PNG が `AgentFlowCodex` と**バイト単位で完全一致**することを確認済み）。変えたのは
「同じ数値をどう表現しているか」のみ。

- **ノード座標とエッジ経路の重複を解消**: 元実装は7ノードの `x/y/w/h` と、各エッジの
  SVGパス文字列（`'M380 306 H575'` など）を別々にベタ書きしており、ノードを動かすと
  エッジ側を手で直す必要があった（同じ位置情報が2箇所に存在＝単一の情報源になっていない）。
  ReClaude版は4列×2行の共有グリッド（`COL_*`/`ROW_*`）からノード座標を算出し、
  エッジのパス文字列も `right('user')` のようなノード参照から構築する。ノードの位置が
  変わればエッジも自動で追従する
- **ハードコードされた曲線を検証つきで解読**: `delegate`/`human-in`/`human-out` などの
  手描きS字カーブも、コーナー半径・レーンY座標を1つずつ数式で検算し、名前付き定数
  （`HUMAN_CURVE_R`, `HUMAN_IN_CHANNEL_X` 等）に分解。グリッドに沿わない値（例:
  `DELEGATE_DROP_X = 1714`）は「目視で決め打ちされた値」と正直にコメントし、
  存在しない規則性を捏造しなかった
- **色の一元管理**: JSX内に散らばっていた個別カラーコード（`#4a5d68` 等7色）を
  `COLORS` オブジェクトへ集約
- **型安全性**: `step: number` を `StepIndex = 0|1|2|3` に、`edge.d`（何のdか不明瞭）を
  `edge.path` に変更。マーカー色の解決も `LEGEND.findIndex(...)` の毎フレーム線形探索から
  `MARKER_ID_BY_COLOR` の直接引きに変更
- **フォーマット**: 1行に複数要素を詰め込む圧縮スタイルから、リポジトリの既存コンポジション
  と同じ「属性ごとに改行」スタイルに整形。`NodeCard`/`EdgeLine`/`StepBar`/`Legend`/
  `ProgressBar` 等、責務ごとに小さいコンポーネントへ分割

```bash
pnpm dev
pnpm exec remotion still Reference-Cloudflare-Refactored out/reference-refactored.png --frame=75
pnpm exec remotion render Reference-Cloudflare-Refactored out/reference-refactored.mp4
```

## コンポーネントプレビュー（Draw.io のシェイプパレット的なもの）

`Reference-Cloudflare-Refactored` を構成する部品（`Icon`, `NodeCard`, `EdgeLine`, `Legend`, `StepBar`,
`Waveform`, `CloudflareLogo`, `Label` など）を単体で確認したいとき用に、`src/AgentFlowCodexReClaude/index.tsx`
から各部品を `export` し、`src/AgentFlowCodexReClaude/previews/` 配下に部品ごとの静止画コンポジションを追加した。

Remotion Studio のサイドバーで `Components > AgentFlowCodexReClaude` を開くと一覧できる。

| コンポジション | 内容 |
|---|---|
| `Part-Icons` | 7種のノードアイコン一覧 |
| `Node-Card` | 全7ノードの非アクティブ/アクティブ両状態 |
| `Part-Connectors` | 4色×非アクティブ/アクティブの接続線スタイル |
| `Part-StepsAndLegend` | 凡例と4ステップぶんの StepBar |
| `Part-Misc` | ロゴ・ラベル・波形 |

`NodeCard`/`Legend`/`StepBar` は本体の図で使う想定の `position: absolute` 座標を内部に持ったままなので、
プレビュー側で真似ると二重オフセットで崩れる。`NodeCard` は打ち消し用のラッパー（`translate` 相当のカウンターオフセット）で、
`Legend`/`StepBar` は元の座標系と同じ幅の `position: relative` な帯（`CANVAS_W` 基準）を用意することで対応している。

これらのプレビュー用コンポジションは `Reference-Cloudflare-Refactored` 本体の見た目には一切影響しない
（`export` の追加のみで、既存コードは変更していない。frame 0/75/300/599 で本体の出力が
引き続きバイト単位で一致することを確認済み）。

### アイコン中心のノード部品

Studio: `http://localhost:3000/Node-Icon`

`src/shared/IconNode.tsx` は `card`（カード内ラベル）、
`square`（四角枠＋下部ラベル）、`circle`（丸枠＋下部ラベル）の3形状を提供します。
`service` / `role` / `color` / `active` / `ports` で表示を変更できます。
幅は208px、レイアウト側で座標を指定します。状態はpropsで渡すため、Remotionのフレームから制御できます。
`ServiceIcon` はサービス公式ロゴではなく役割を表す10種類のSVGです。
`icon` には任意のSVGや画像コンポーネントも渡せます。

```tsx
import { IconNode } from "./shared/IconNode";
import { ServiceIcon } from "./shared/ServiceIcon";

<IconNode
  variant="square"
  icon={<ServiceIcon name="calendar" />}
  service="Calendar / CRM"
  role="予約・顧客情報を照会"
  color="#77d4c9"
  active
  ports={["left", "right"]}
/>
```

### サービスノードの4バリエーション

Studio: `http://localhost:3000/Node-Service`

`src/shared/ServiceNode.tsx`:

- `logoTile`: 大きなロゴをタイルに配置
- `logoSeal`: 円形ロゴと左右の接続線
- `actionRow`: サービス名＋短い動作を横長のノードに
- `caption`: 枠を抑え、動作を大きく表示

幅は304px。`service`、`action`、任意の`detail`、`color`、`active`、`ports`を指定します。
`icon`には枠いっぱいに収まるSVG / 画像を渡します。`logoBackground`でロゴ背景のコントラストを調整できます。
文言は「資料を保存」「Issueを作成」のような短い動作を推奨します。
アイコン中心の既存フローは変更せず、比較用コンポジションとして追加しています。

```tsx
<ServiceNode
  variant="logoTile"
  icon={<Img src={staticFile("service-icons/google-drive.svg")} style={{width: "100%", height: "100%"}} />}
  service="Google Drive"
  action="資料を保存"
  detail="問い合わせの添付資料"
  active
/>
```

ロゴ素材の出典は `public/service-icons/README.md` を参照。

### 実用ノードとフローのスタイル違い

Caption以外は `ServiceNode.tsx` から個別部品としてインポートできます。

```tsx
import { LogoTileNode, LogoSealNode, ActionRowNode } from "./shared/ServiceNode";

<LogoSealNode icon={<ServiceIcon name="agent" size="100%" />} service="AI判定"
  action="緊急度を判定" color="#b398f9" logoBackground="#182537" compact active />
```

`compact` は幅208px（通常304px）。既存フローとの比較用に次の4コンポジションを追加しています。

| コンポジション | ノード | 尺 |
|---|---|---|
| Inquiry-LogoSeal | LogoSealNode | 24秒 |
| Inquiry-ActionRow | ActionRowNode | 24秒 |
| ClaimIntake-LogoSeal | LogoSealNode | 28秒 |
| ClaimIntake-ActionRow | ActionRowNode | 28秒 |

元のアイコン版とステップ・ノード・判定パネルを共有し、部品と接続経路を切り替えます。
未実装・任意工程の破線、人の判断、ルール昇格、AI生出力の保持は各版共通です。

### ブランドを強調する Icon v2

- `Inquiry-IconsV2`: LogoSeal版をもとに、入居者のLINE・LINE受付・LINE返信・業者のGmail / LINEをブランド表示。
- `ClaimIntake-IconsV2`: LINE Webhookをブランド表示。未実装の破線・注記は維持。

`src/shared/BrandSealNode.tsx` は既存コンパクトノードと同じ幅208px・ポート中心64pxで、ロゴ面とサービス名を主役にします。
ロゴはローカルSVGを使用し、アクティブ状態とブランドの見やすさを分けています。
サービスが未指定のAI・保存先にはベンダーロゴを割り当てません。元のLogoSeal版と尺・経路・判定内容を共有します。

`Components > Nodes > Node-BrandSeal` でブランドノードの通常・アクティブ・未実装状態を比較できます。
共通部品は `src/shared/BrandSealNode.tsx`。主ロゴ56px、補助ロゴ24pxに抑え、128pxの円形背景とサービス名で強調します。両Icon v2フローにも共通で反映されます。

```tsx
<BrandSealNode brand="line" role="問い合わせ受付" action="会話・写真を受け付ける" active />
<BrandSealNode brand="gmailLine" role="業者への連絡" action="現地対応を手配" active={false} />
```

## AgentFlow の静止画一覧

```bash
pnpm gallery:agent-flow                # 全AgentFlowを各動画の中間フレームで撮影
open out/agent-flow-gallery/index.html # macOSで一覧を開く（HTMLを直接開いても可）
pnpm gallery:agent-flow --frame=420    # 同じフレームで比較して再生成
pnpm test:gallery                      # 対象抽出・フレーム選択と、一覧が古くなっていないかのテスト
```

`src/Root.tsx` の `AgentFlow` フォルダ配下を自動収集し、題材別の一覧を生成します。
検索・題材の絞り込み・クリック拡大・原寸PNG表示に対応。サーバーやStudioの起動は不要です。
フレームは0始まり。指定が動画の尺を超える場合は最終フレームを撮影し、実際のフレームを各画像に表示します。

- PNGは各コンポジションの解像度で生成。既定propsを使用し、元動画を変更しません。
- 一度だけバンドルし、同じバンドル・ブラウザーを使って順に撮影します（`swangle`）。
- 全件成功後に一覧を更新。失敗時は前回の一覧を維持し、コマンドはエラー終了します。
- 出力は `out/agent-flow-gallery/`（git対象外）。`captures-*` 内の `manifest.json` に日時・フレーム・解像度を保存。
  過去の撮影フォルダは残すため、不要になったらこの出力ディレクトリを削除して再生成できます。
- 対象抽出はRoot内の静的な `<Folder name="…">` / `<Composition id="…">` 登録に対応。
  動的な名前・IDはエラーになります。別ファイルやループへ登録を移す際は抽出処理も更新してください。
- 実装: `scripts/agent-flow-gallery/`。Remotionの公開API
  [bundle](https://www.remotion.dev/docs/bundle)、
  [getCompositions](https://www.remotion.dev/docs/renderer/get-compositions)、
  [renderStill](https://www.remotion.dev/docs/renderer/render-still) を使用。

### Inquiryの新しいデザイン案

`AgentFlow > DesignStudies > AgentDiagram` に次の3案があります（各24秒）。

- `Diagram-Transit`: 明るい路線図。全体の経路を追う。
- `Diagram-Orbit`: AI判定を中心に、主体と判断基準の関係を見る。
- `Diagram-Relay`: 送り手・情報・受け手を大きく表示し、受け渡しを追う。

`pnpm gallery:agent-flow` で既存案と一緒に静止画一覧を更新できます。
設計・検証メモは [inquiry-design-studies.md](docs/inquiry-design-studies.md)。

追加案: `Diagram-Lanes`（担当別レーン）、`Diagram-Chronicle`（縦に追う処理順）、
`Diagram-Caseboard`（案件カードを中心に主体が関わる）。同じDesignStudiesフォルダにあり、
比較ページには合計6案を掲載しています。

さらに **Branches**（手配と回答への分岐）と **Terraces**（理解・伝達・判断支援を段で構成）を追加し、AgentDiagram のデザイン比較は全8案です。各案は `pnpm gallery:agent-flow` の一覧で見比べられます。

### Sideの参照シートと新案

[Side 一元参照シート](docs/side-reference.md) に、既存Sideの構成・SideBySide系との差・シナリオ・実装箇所を集約しています。新案 `Side-Evidence` は、判断の原値・ルールの結論・人の確認を別欄に蓄積するSide専用レイアウトです。

`node scripts/side-design-studies.mjs` で `out/side-design-studies/index.html`（参照シート・新案動画・工程別静止画・既存8案との比較）を生成できます。静止画だけなら `--stills-only`、そのバンドルから動画を追加するなら `--video-only` を指定します。

Sideの追加案 **Ledger**（`Side-Ledger`）も同じ比較ページに掲載しています。紙の台帳に判断を縦に積み、右の全体図は非アクティブな経路も破線で残します。既存Side・Evidence・Ledgerの3案を同じ工程で比較できます。

Sideの追加案 **Gate / Replay** も `out/side-design-studies/index.html` で確認できます。Gateは判断権限、Replayは結論から根拠をたどる振り返りが主題です。

### 動画の書き出し

```bash
pnpm video Side-Replay   # 1本
pnpm video --group Inquiry                          # 題材ごと（入れ子も含む）
pnpm video --all                                    # AgentFlow 全部
pnpm video <Id> --speed=2                           # 2倍速
pnpm video <Id> --fps=60                            # fps を直接指定
```

出力は `out/video/`（git対象外）。速度を変えたものは `<Id>-2x.mp4` のように名前が分かれるので、
等速のファイルを上書きしません。

**このリポジトリでは `remotion render` に3つのフラグが要る**（`--gl=swangle`、
`--image-format=png` と `--pixel-format=yuv420p` の両方）。`remotion.config.ts` が
JPEG 出力なので、片方だけだと pix_fmt が `yuvj420p` になります。
このスクリプトはそれを埋め込んでいるので、呼ぶ側が覚える必要はありません。
書き出したあと `ffprobe` があれば pix_fmt を実際に確かめます。

対象は `src/Root.tsx` を読んで決めるので、登録漏れが起きません。

#### 再生速度について

速度は **fps の倍率**として効きます。**コマを間引かないので、速くしても動きは滑らかなまま
尺だけが縮みます**（28秒 / 840コマ → `--speed=2` で 14秒 / 840コマ、60fps）。

AgentFlow の図は `useVideoConfig()` の fps を見ていないので、fps を変えても中身は変わりません。
遅くする場合は fps が下がるため、`--speed=0.5` あたりからカクつきが見えてきます。

Side採用候補のA/B/C試作は `out/side-prototype/index.html`。時計版、右上・下部の差し込み例、42秒の画面主体デモを比較できます。[設計と再生成手順](docs/side-prototype.md)。動画は `pnpm video Side-DemoFull`。
