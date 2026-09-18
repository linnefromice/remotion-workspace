# Side × Proposal / Inquiry / Restoration

3題材と3配置の組み合わせを9本追加。既存Sideは変更しない。

| 題材 | 元の図 | DemoDiagram | SlotMinimal / Stacked |
|---|---|---|---|
| Proposal | Proposal-IconsV2 | 7工程・42秒 | 7工程・28秒 |
| Inquiry | Inquiry-LogoSeal | 6工程・36秒 | 6工程・24秒 |
| Restoration | Restoration-IconsV2 | 7工程・42秒 | 7工程・28秒 |

IDは `<題材>-Side-<配置>`。各題材のフォルダに登録。

- DemoDiagram：図を主役とし、右に縦工程、その右に現場と解説。右上は映像の経過時間。
- SlotMinimal：図と現場をヘッダ下で縦中央に配置。下部の比較帯や外側の進捗バーなし。
- Stacked：上70%が図、下30%が判断ストーリー。上下幅1324.8px。背景枠は固定、文字だけフェード。

題材データは `src/agent-flow/design-studies/side/subjects/data.ts`。ProposalとRestorationの判断値は既存FlowSpecのpanel.rowsを直接参照。Inquiryは既存の6工程と説明に合わせ、P1/P2等の別題材の値を持ち込まない。未到達の判断値を先出ししない。右側の画面は各題材の工程・入力・判断記録を表示する。

DemoDiagramは6秒を元の図の4秒へ対応させて同期する。業務の所要時間は正本にないため、時計は映像時間を表示する。InquiryはLogoSealの指定を守り、brandIconsを有効にしない。非アクティブの線も破線で残す。図内の説明パネルは外側の判断記録と重複しないよう非表示。

## 確認先と再生成

- `out/side-subjects/index.html`：9案の比較・全60工程の画像
- `pnpm gallery:side-subjects`：比較ページ生成
- `pnpm gallery:agent-flow`：全57本の一覧生成
- `pnpm catalog:side`：Sideカタログ更新（完成物24件）
- `pnpm video Proposal-Side-Stacked` 等：必要なIDの動画出力

今回は9コンポジションと静止画一覧を作成。9本のMP4一括書き出しは行っていない。

## 検証

型チェック、全テスト成功。新規テストは全題材×全配置の工程境界・同期・破線保持・値の参照を確認。既存48本の代表PNGはcmpでバイト一致。比較ページは9カード・69画像（代表9＋全工程60）、工程の展開、390/1440px幅をブラウザ確認。カタログの32画像、リンク、絞り込みも確認。
