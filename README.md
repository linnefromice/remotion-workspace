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
| AgentFlow | 展示会ループ用「エージェント連動図」（賃貸管理 AI エージェントの5ステップを巡回） | 20秒（シームレスループ） | SVG ベジェパス, `@remotion/google-fonts` |

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
npx remotion render AgentFlow out/agent-flow.mp4 --image-format=png --pixel-format=yuv420p

# 静止画（frame 420 = ④承認のちょうど中央、360〜479フレームの中点）
npx remotion still AgentFlow out/still-approve.png --frame=420
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
| 静止画の書き出し | 成功。`npx remotion still AgentFlow out/still-approve.png --frame=420`（1920×1080 PNG, 約2.6秒） |
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
