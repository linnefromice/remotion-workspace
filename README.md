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

すべてのコンポジションは 1920×1080 / 30fps です。

## 新しいコンポジションの追加方法

1. `src/<Name>/index.tsx` にコンポーネントを作成・エクスポート
2. `src/Root.tsx` に `<Composition>` を追加（`id`, `durationInFrames`, `fps`, `width`, `height` を指定）
3. プロップが必要な場合は Zod スキーマと `defaultProps` を定義（`DataVisualization` を参考）
