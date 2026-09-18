# AgentFlow Pattern Collection

既存のRemotionコンポジションを `@remotion/player` で再生する選抜比較サイト。動画ファイルの事前生成は不要。

## メニュー

| メニュー | 掲載するパターン | 比較方法 |
|---|---|---|
| AgentDiagram | LogoSeal（推奨）、IconsV2（推奨）、Lanes、Orbit、Transit | 全てInquiryに揃える |
| Side | DemoDiagram、SlotMinimal、Stacked | ClaimIntake / Proposal / Inquiry / Restorationを切り替え |
| BusinessContents | ClaimIntake、Proposal、Inquiry、Restoration | ClaimIntake・Proposal・RestorationはIconsV2、InquiryはLogoSeal |

各表示の直下にコンセプトと特徴。左側に比較の観点。常時1つのPlayerを表示し、音声・描画の同時再生とSVG IDの衝突を避ける。再生速度、ループ、全画面、工程の中間へのシークが可能。初期表示は停止状態。

トップページは3カテゴリの説明とReference-Cloudflare-RefactoredのPlayerを表示する。比較ページのサブメニューは上部で横スクロールし、Playerは画面幅いっぱいに配置。候補保存・候補一覧は設置しない。共有ボタンは現在のメニュー・パターン・Sideの題材を含むURLをコピーする。

## 開発と検証

リポジトリルートで実行。

```sh
pnpm web
pnpm exec tsc --noEmit
pnpm web:build
pnpm web:preview
```

公開用ファイルは `web/dist/`。既存の `src/` を読み込み、Remotion Studioと動画出力は変更しない。必要なロゴSVGだけをサイトに同梱する。一部の図は既存コンポーネントのGoogle Fonts読み込みを使用する。

ブラウザ検証（previewで表示されたポートを指定）：

```sh
WEB_REVIEW_URL=http://127.0.0.1:4173/ node scripts/web-review/verify.mjs
```

全21表示、説明、画像読み込み、再生、工程シーク、キーボードフォーカス、トップページと参照図、候補一覧の非表示、横スクロール、不正なURLのフォールバック、320/768/1024/1440pxでの横溢れを検証する。スクリーンショットは `out/web-review/`。

## Cloudflareへの公開

[Workers Static Assetsの公式ガイド](https://developers.cloudflare.com/workers/static-assets/get-started/) に従い、`web/wrangler.jsonc` の `assets.directory` から静的ファイルを配信する。データベースやWorkerのアプリ処理は不要。

公開先は **Farleap アカウント**（`fh-kanri-demo` などの既存デモと同じ）。Worker名は `agentflow-patterns`。
認証には個人アカウントも載っているため、`wrangler.jsonc` に `account_id` を明示している。

```sh
# 公開せずにビルドと設定を確認
pnpm web:deploy:check

# 公開
pnpm exec wrangler whoami   # 対象アカウントの確認
pnpm web:deploy
```

CloudflareのGit連携で実行する場合は、ルートディレクトリをリポジトリルート、ビルドを `pnpm web:build`、デプロイを `pnpm exec wrangler deploy --config web/wrangler.jsonc` に設定する。複数アカウントがある場合は対象を明示する。

トップは `/` または `/#home`。URL例：`/#diagram/LogoSeal`、`/#side/Stacked/Proposal`、`/#business/Restoration`。hashルーティングなので、共有URLを直接開いても同じ選択に戻る。

## コンテンツの変更

- `catalog.tsx`：選抜案・コンセプト・特徴・比較の観点・Playerの対応
- `Home.tsx`：トップページ・カテゴリ説明・参照Player
- `main.tsx`：メニュー・Player・共有
- `style.css`：レスポンシブ表示
- `vite.config.ts`：ビルドとロゴ配信
- `wrangler.jsonc`：Cloudflareの配信設定

## 表記

サイトのヘッダ・フッタ・ページタイトルはAgentFlowに統一。Playerで使う図の旧ブランド表記も元コンポーネントから除去している。トップの説明直下には、AgentDiagramとSideの組み合わせにBusinessContentsを適用して最終成果物を作る目的と、掲載案は現時点のおすすめを中心とした型群であることを記載。
