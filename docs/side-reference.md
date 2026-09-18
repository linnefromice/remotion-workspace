# Side 一元参照シート

更新: 2026-09-18。対象の中心は `ClaimIntake-DecisionStory-Side`。似た名称のSideBySide系は比較対象として区別する。新案の判断・実装・確認は、このシートを入口にする。

## 目的と題材

**AIが緊急度を低く見積もったとき、何が担保するのか。** 判断の記録を主役に、同じ瞬間のフロー図を横に添えて説明する。題材はClaimIntakeのPoCシナリオ。Inquiry構想とは別。

| 項目 | 内容 / 正本 |
|---|---|
| 通報 | キッチン下の水漏れに「ガスのようなにおい」が併記された想定ケース |
| AI原判定 | P2（翌営業日）。保存した原値を後から上書きしない |
| 安全ルール | SAFETY_GAS_ODORによって運用上の緊急度をP1（即時）へ昇格 |
| 人 | このケースではP1を確認。降格できるのは人だけ、理由必須。架空の降格実績は描かない |
| 第2段階 | 責任区分と対応候補。5本のガードレールは候補の追加と制止のみ |
| 記録 | イベントを追記。AIの値とルールの結論を両方残す |
| 時間 | 47秒はシナリオ値。実測・保証・動画の長さではない |
| 事実の共有元 | [scenario.ts](../src/agent-flow/claim-intake/side-by-side/scenario.ts): CASE / EVENTS / ELAPSED_SECONDS |
| 寸法・工程の共有元 | [cards/constants.ts](../src/agent-flow/claim-intake/cards/constants.ts): 1920×1080 / 30fps / 840f / 7工程×120f |

これはローカル資料に基づく説明用再構成。外部PoCの現行実装を今回再監査したものではない。既存資料の「ルールがなければ誰も見ない」「当日手配」は、保証できる結末ではないため新案で断定しない。

## 現行Sideの構成

実装: [decision-story/WithMap.tsx](../src/agent-flow/claim-intake/decision-story/WithMap.tsx)。登録: [Root.tsx](../src/Root.tsx)。

| 領域 | 現行の配置 | 役割 / 制約 |
|---|---|---|
| 左・主役 | DecisionStory全体を0.68倍、x=44 / y=172.8 | 通報文、AI原値・ルール結論、工程別の帯、7工程の記録。大きな見出しまで縮む |
| 右・地図 | LogoSealを0.255倍、x=1386 / y=172.8 | 約490×275px。現在の工程を示す位置案内。細部を読む用途には小さい |
| 地図の設定 | brandIcons / hidePanel | 主役と判定値を重複させない。実際に通らない経路も残す |
| 同期 | useCurrentFrameのみ | 乱数・実時計・手動の同期処理なし |

## 関連バリエーション

| ID（ClaimIntake-以下） | 主役 / 違い |
|---|---|
| DecisionStory | 判断の記録だけ。図なし |
| DecisionStory-Side | 判断の記録＋右の小さい地図。本シートの中心 |
| DecisionStory-Stacked | 同じ内容を上下配置 |
| SideBySide | 左に0.59375倍のフロー図、右に当事者が見る画面 |
| SideBySide-Map | 左の判定パネルを非表示 |
| SideBySide-Counterfactual | 安全ルールの有無を下段で比較 |
| SideBySide-Full | Map＋比較＋経過時計 |
| SideBySide-Timeline | Map＋追記タイムライン。比較帯とは排他 |

[静止画一覧](../out/agent-flow-gallery/index.html) / [既存案の詳しい索引](presentation-site-variants.md)

## 7工程の意味と表示基準

| 工程 | 動画フレーム | シナリオ時刻 | 記録 / 主張 |
|---|---|---|---|
| 受付 | 0–119 | 0秒 | 通報を受け付ける |
| 文字起こし・入力確認 | 120–239 | 4秒 | 判断根拠を確認。既存Sideは通報文を強調し、SideBySideは音声画面を描く |
| AI判定 | 240–359 | 9秒 | P2原判定を保存 |
| ルール昇格 | 360–479 | 11秒 | P2を残して、P1とルールIDを追加 |
| 業務判断 | 480–599 | 16秒 | 対応候補と制約 |
| 人の確認 | 600–719 | 22秒 | 人がP1を確認。降格の権限を説明 |
| 出口 | 720–839 | 47秒 | 一次回答・追記された記録 |

動画上は各4秒。実時間の比例再生ではない。入力は説明用の想定で、実画面や実ログを表示するものではない。

## 新案: Side Evidence

**縮小した2枚を並べる構成から、Side専用の判断台帳へ。** 左を原寸の組版で作り、根拠→AI原値→ルール結論→人の確認を別欄に保持。右は既存の全経路を残した地図。下段は消えない7工程の記録。

- 通報文と3つの判断欄の位置を固定し、工程ごとに新しい欄だけを開く。P2をP1に置換しない。
- 大きな見出しと工程ごとの解説で「今、何を担保したか」を示す。
- 地図は現在工程の位置案内。元の全接続を保持し、再描画による経路の欠落を避ける。
- 安全ルールは白。人とAIは既存の色を継承。凡例・文言を併記する。
- 時刻は下段のみ。比較用の仮定は解説帯で明示。危険の発生や実測の速さを断定しない。
- 弱点: 全経路の細かいラベルは地図では読み取りにくい。商談の概要説明を優先する。

ID: `ClaimIntake-DecisionStory-Side-Evidence`。既存の既定値・出力は変更しない。

## 受け入れ・再生成

- 7中間フレーム（60 / 180 / 300 / 420 / 540 / 660 / 780）と境界を確認。
- ルール前にP1を表示しない。ルール後もAI原値を保持。人の確認前に確認済みを表示しない。
- 既存Side・SideBySide-Fullの同フレームPNGをバイト比較。
- TypeScriptチェック、28秒MP4の映像仕様、比較ページの画像・動画読み込み・幅を確認。
- `node scripts/side-design-studies.mjs` で参照ページ・静止画・動画を生成する。
- `pnpm gallery:agent-flow` でAgentFlow全体一覧を更新する。

背景: [依頼書](presentation-site-brief.md) / [制作手順](presentation-production-playbook.md) / [用語](agent-flow-glossary.md) / [検討ログ](presentation-site.md)

## 今回の検証結果

- TypeScriptチェックとギャラリーの3テストが成功。
- 既存8案のframe420が、変更前ギャラリーのPNGとバイト一致。
- 新案の7工程、開始・終了、ルール昇格と人の確認の前後を静止画で確認。
- MP4: 1920×1080 / 30fps / 840フレーム / 28秒 / yuv420p。レンダリング前後の登録・新案ソースSHA一致。
- 参照ページ: 24画像と全リンク、動画の読み込み・14秒へのシークが成功。320 / 768 / 1024 / 1440pxで横はみ出しなし。
- AgentFlow全38件の一覧に新案が含まれることを確認。

成果物: [参照・比較ページ](../out/side-design-studies/index.html) / [28秒動画](../out/side-design-studies/ClaimIntake-DecisionStory-Side-Evidence.mp4)
