# 採用候補のメモ

2026-09-18 時点で、商談・展示会に出す候補として挙がっているもの。
**まだ決定ではない。** 全45本の一覧は `pnpm gallery:agent-flow`。

実装に渡すための依頼書は [`next-build-brief.md`](./next-build-brief.md)。

## AgentDiagram（図そのもの）

| 候補 | ID | 置き場 | 題材 |
|---|---|---|---|
| **LogoSeal** | `<題材>-LogoSeal` | 各題材のフォルダ | ClaimIntake / Inquiry / Restoration / Proposal の**4つすべて** |
| **IconsV2** | `<題材>-IconsV2` | 同上 | 同上 |
| **Lanes** | `Diagram-Lanes` | DesignStudies > AgentDiagram | **Inquiry のみ** |
| **Orbit** | `Diagram-Orbit` | 同上 | **Inquiry のみ** |
| **Transit** | `Diagram-Transit` | 同上 | **Inquiry のみ** |

### ここが割れている

**LogoSeal / IconsV2 は規定の4版の一部**で、4題材すべてに揃っている。
**Lanes / Orbit / Transit は試作**で、Inquiry の1題材にしか無い。

採用するなら、**他の題材にも展開する作業が要る**。
Lanes / Orbit / Transit は座標を `design-studies/agent-diagram/model.ts` に
自前で持っていて、題材ごとのグリッド（`cards/constants.ts`）とは別系統なので、
展開は「ノードの位置を題材ぶん書く」作業になる。ここは安くない。

### 方針（2026-09-18・意図の記録）

**規定の4版に、Transit などを5版目として加えたい。** まだ着手していない。

そうすると、その版は**4題材すべてに揃える**ことになる（規定とはそういう意味）。
ここで効いてくるのが座標の持ち方で、**いまの Lanes / Orbit / Transit は
自前の `model.ts` に座標を手書きしている**。規定に入れるなら、
`FlowDiagram` の `variant` のように**題材のグリッドから描ける形に寄せる**必要がある。

つまり実際の作業は「4題材ぶん座標を書く」ではなく、
**「見せ方をデータから描けるようにする」**ほうになる。
そちらに寄せられれば、題材が増えても自動で付いてくる
（[2] §6 と `shared/FlowDiagram.tsx` が既にその形）。

寄せられるかは見せ方による。Transit は路線図なので行と列から導けそうだが、
Orbit の同心円や Lanes のレーンは、いまのグリッドの外にある。
**どこまで寄せられるかを見てから、何を5版目にするかを決める。**

調査の依頼書は [`fifth-variant-brief.md`](./fifth-variant-brief.md)。
**作りきる依頼ではなく、判断がつけば終わり**の形にしてある。

### 着手前に見えている非対称

**いまの4版と Transit は、変えているものが違う。**

| | 何を変えるか | ノードの位置 |
|---|---|---|
| Cards / LogoSeal / IconsV2 / ActionRow | ノードの**描き方** | **同じ**（`spec.nodes[].cx/cy` を共有） |
| Transit / Orbit / Lanes | ノードの**置き場所** | **違う**（自前の座標表） |

`FlowDiagram` の `variant` は描き方だけを切り替えていて、位置は spec のものを使う。
Transit は位置も変えるので、**`variant` とは別の概念になる可能性が高い**。
「5版目」と呼んでいるが、既存の4版と同じ種類のものではないかもしれない。

### Transit調査結果（2026-09-18）

**結論：Transitはノードの描画版ではなく、別の配置レイアウトとして扱う必要がある。**
既存の`variant`へ5つ目を足す方針は、現時点では採らない。規定は4版、
`Diagram-Transit`はInquiryの試作として維持する。
これは「自動配置は不可能」という判断ではない。現在のデータから、既存Transitの意味を保つ
配置と配線を汎用的に導けることはまだ実証していない。

#### 調べた範囲と、根拠

描画側の`FlowDiagram`/`FlowSpec`、既存Transitの`model.ts`/`Network.tsx`、
1題材の具体例としてRestorationの全15ノード・13経路をソース上で確認した。

| 確認点 | 実装上の事実 | 判断への影響 |
|---|---|---|
| 既存の版 | `DiagramVariant`は`cards / logoSeal / actionRow`。IconsV2は`logoSeal + brandIcons`。`NodeCard`は`node.cx/cy`をそのまま使用する | 配置を変える責任は現在の`variant`にない |
| Transitの配置 | `TRANSIT`はInquiryのノードIDごとの別座標表。`route()`にも経路IDごとの曲がり方がある | FlowSpecのノード座標だけ変えても既存のpointsは追従しない。ノード位置と経路を同時に生成する段階が必要 |
| 3本の帯の意味 | 実際の帯名は「受け付ける・手配する」「判断して返す」「人が基準を育てる」。上段には承認者`approval`も入り、中段には`vendorDb`も入る | 依頼書の「外部チャネル／エージェント／人・参照情報」という主体別3帯とは一致しない。`tone`による分類は、既存Transitの再現ではなく新しい構成になる |
| Restorationの入力主体 | `tenant / walkthrough / photos / vendor`は全て`tone: input`。外部の退去者、内部の受付工程、任意の添付、業者からの受領を含む | `tone`だけでは外部チャネル帯と内部工程帯を分けられない |
| 既存グリッドの限界 | `vendor`は説明文では外部主体だが、座標は内部工程と同じCOL_D・ROW_2で`spec.frame`内にある | 枠の内外や元の行を、そのまま意味上の帯の判定に使えない。`cx/cy`は帯内の並び順の候補には使える |
| 線の接続先 | `EdgeDef`には`points`はあるが、接続先ノードの`from/to`がない。`staff-resolved`の実際の接続先は`recResolved`、`special-clause`はclassify→staff | IDの分割では一般化できない。端点の近さで推定することは可能でも、正本として保証された接続関係ではない |

参照ソース：
[描画とvariant](../src/shared/FlowDiagram.tsx)、
[FlowSpec・NodeDef・EdgeDef](../src/shared/flowTheme.ts)、
[Restorationの定義](../src/agent-flow/restoration/constants.ts)、
[Transitの座標・経路](../src/agent-flow/design-studies/agent-diagram/model.ts)、
[3帯の描画と見出し](../src/agent-flow/design-studies/agent-diagram/Network.tsx)。

#### 方針（2026-09-18・決定）

**主体別3帯の新しいレイアウトを作る。** 既存 Transit の役割別3帯は追わない。
つまり `Diagram-Transit` の再現ではなく別物で、`Diagram-Transit` は試作として残す。

実装の依頼書は [`subject-bands-brief.md`](./subject-bands-brief.md)。

その後に分かったことが1つある。**帯の割り当てに必要な情報は、実は揃っている。**

```
外部の登場人物 = tone が "input" かつ、水平方向に枠の外
```

3題材とも外部の登場人物を `OUTSIDE_CX = 150`（枠は `x = 320` から）に置いていて、
内部の受付工程は枠の中にある。**「トーンだけでは分けられない」は、位置を併せれば解ける。**
新しい注釈は要らない。

足りないのは**エッジの端点**だけ（`EdgeDef` に `from` / `to` が無い）。
手当ての単位はさらに小さくなって、「各エッジの端点2つ」になる。

#### 次に進めるなら（調査時点のメモ）

1. まず、**既存Transitの役割別3帯を守るか、主体別3帯の新レイアウトにするか**を決める。
   ここが決まらないと、帯への自動割り当ての正解を判定できない。
   → **主体別3帯に決定（上記）**
2. 元の題材定義へ、線の`from/to`と、必要なノードの意味上の所属（外部入力／内部処理／参照など）を追加する。
   別の座標表は作らず、曖昧なノードだけ意味を補う。既存の`points`は旧表示の互換用に保持する。
   手当ての単位は「題材ごとの座標一式」ではなく「各経路の端点2つ＋自動分類できないノードの所属」。
   Restorationならまず13経路の端点を明示し、上記4つのinputノードの所属を確認する。
   4題材全体の注釈量や線の衝突回避の工数は今回未評価。
3. `layout = grid | transit`のような別軸（名称は仮）で、意味データと元の並び順から
   ノード座標・配線・帯をまとめて算出する。色を決める`tone`と、帯を決める役割は混同しない。
   明るい背景も描画版とは別のテーマ上の判断として扱う。
4. Restorationの1枚だけで、全15ノード・13経路が残ること、非通過経路の破線、白いルール、
   ノードと配線の追従を確認してから、規定化を再判断する。

#### 今回の終了点

依頼書§4の「**variantとは別の概念が要ると分かった**」で終了。
静止画による自動配置の試作はしていない。描画コード・既存コンポジション・一覧は変更していないため、
レンダー、PNGのcmp、一覧の再生成は実施していない。成果はこの判断と具体的な不足データの記録。

### 主体別3帯の実装結果（2026-09-18）

[主体別3帯の依頼](./subject-bands-brief.md)に従い、既存Transitとは別の
`Diagram-Bands`をAgentFlow > DesignStudies > AgentDiagramに追加した。
既定はRestoration。**1題材から位置を導けた。共通コードは3題材で動き、Inquiryは情報不足で止まる。**
規定の5版目への採用はまだ決めていない。

確認用：[3題材の比較ページ](../out/subject-bands/index.html) /
[Restorationの静止画](../out/subject-bands/after/restoration-420.png)。
Studioの`subject`で`restoration / proposal / claimIntake`を切り替えられる。

| 題材 | ノード / 経路 | 同じコードでの結果 |
|---|---|---|
| Restoration | 15 / 13 | 描画できた。全ノード・全経路を保持。7工程を撮影 |
| Proposal | 17 / 16 | 描画できた。在庫の3入力元も含め、元のcx順で整列 |
| ClaimIntake | 16 / 12 | 描画できた。既存定数を構造に合わせる薄いアダプターだけ追加。座標・主体は複製しない |
| Inquiry | 11 / 13 | 適用不可。NodeDefにtoneがなく、全11ノードの主体が未定義。全13経路のfrom/toもない。internalだけではAI・人・記録などを区別できず、推測で補わない |

**帯の割り当て**

- `record: true`を最優先で記録列へ置く。元のcy順で積む。
- 第1帯：`tone: input`かつ中心xが元の`frame.x`より左、または`tone: record`の非チップ。
  見出しは「入力元・結果」に変更した。Proposalの「落ちた候補」もrecordだが外部へ出すものではないため。
- 第2帯：それ以外のinputとai。上下・右側の枠外という理由では外部扱いにしない。
  Restorationのvendorは依頼書の方針どおり、枠内の受領工程としてここへ置く。
- 第3帯：ruleとhuman。ruleは白、humanは橙のまま同居する。
- planned：明示した経路で隣接するノードの帯を借りる。複数なら元の距離が近いものを優先、
  同距離ならID順。記録列は候補から外す。ClaimIntakeのLINEは受付、追加質問はAI判定の帯へ入る。
  帯を決められる隣接先がない場合は、黙って配置せずエラーにする。
- 帯内の並びは元のcx、同じcxならcy、最後にIDで決める。座標と新しい経路はこの結果から一度だけ生成する。

**実装と互換性**

[共通配置](../src/agent-flow/design-studies/agent-diagram/bands/layout.ts)、
[描画](../src/agent-flow/design-studies/agent-diagram/bands/index.tsx)、
[題材の接続](../src/agent-flow/design-studies/agent-diagram/bands/specs.ts)。

共有EdgeDefとClaimIntakeのEdgeDefに任意のfrom/toを足し、3題材の元エッジ定義に端点を明記した。
`staff-resolved → recResolved`、`special-clause: classify → staff`なども明示しており、ID分割や座標近傍からの推測は使わない。
旧pointsを保持し、新レイアウトだけが端点から直角の経路を作る。既存Transit・Orbit・Lanesは変更しない。
非アクティブ経路は常設の破線。元のdashed経路とplannedノードは強調時も破線を保つ。
ノードを入れ替えたりAIの値を書き換えたりする演出は加えていない。

**検証と限界**

- 3題材それぞれ、元定義と描画のノード・経路数が一致。工程切り替え前後の全経路保持、ルールの白、破線を実コンポーネントの描画テストで確認。
- 元の3題材×4版とDiagram-Transitの13枚を、同一フレームで変更前後に撮影し、`cmp`で全てバイト一致。
  src全体のMD5も各撮影の前後で一致。検証ファイルは`out/subject-bands/before`と`after`。
- 再撮影は`node scripts/subject-bands/capture.mjs before|after`。beforeは変更前の証拠なので上書きに注意。
  afterは比較も実行する。ページ生成は`node scripts/subject-bands/page.mjs`。
- 新規テストは`pnpm test:bands`（9件）。型チェックと`pnpm test`全37件が通過。一覧は45案へ更新済み。
  既存44案の一覧画像も全てバイト一致。比較ページは10画像・リンク・4画面幅を確認済み。
- 配線の障害物回避は未実装で、交差・カード背面の通過がある。Proposalの第3帯は6ノードと密度が高い。
  長い文字の折り返しも含めて、商談用の完成デザインとしては未調整。今回の判定は位置を導けることまで。

次はInquiryの主体を原定義で明示し、13経路の端点を足して同じ配置を再検証する。
そのあと規定化するなら、交差・文字量・帯ごとの密度への対処を検討する。4題材に共通する新しい座標表は不要。

## Side（図の横に置くもの）

試作を実装済み: ClockはmapOnly=true、差し込み例は`Side-SlotExample`、画面主体の42秒版は`Side-DemoFull`。[設計・検証結果](./side-prototype.md)。以下の未実装メモは依頼時点の経緯として残す。

| 候補 | ID | 置き場 |
|---|---|---|
| **SideBySide（時間込み）** | `ClaimIntake-SideBySide-Clock` | ClaimIntake |
| **Side-Ledger** | `Side-Ledger` | DesignStudies > Side |

### 「時間込み」の中身（2026-09-18・確認済み）

**規定は SideBySide そのもの**（左に図、右にデモ画面やデータイメージ）。
そこに**右上の経過時計だけを足したもの**が欲しい、という意図。

つまり `-Full` でも `-Timeline` でもない。

| | 下段 | 右上 |
|---|---|---|
| `-Full` | 反実仮想 | 時計 |
| `-Timeline` | 時間軸 | なし |
| **欲しいもの** | **なし** | **時計** |

**この組み合わせのコンポジションはまだ登録されていない。**
props（`clock: true` だけ）で作れるので、Studio の props パネルからは今すぐ見られる。
`mapOnly` を併せるかは未決（併せないと、左のパネルと右が同じ値を2回言う）。

## 方針：SideBySide を枠組みにする（2026-09-18・意図の記録）

**右上と下部を、題材ごとに中身を差し替えられる場所として規格化したい。**

```
┌──────────────┬──────────┐
│              │ 【右上】  │ ← 既定は経過時計。題材ごとに差し替える
│   フロー図     ├──────────┤
│              │  現場     │ ← ここが本体。デモ画面・データイメージ
└──────────────┴──────────┘
  【下部】                    ← 題材ごとに足す。いまは反実仮想／時間軸
```

いまの実装は**決め打ちのフラグ4つ**（`mapOnly` / `counterfactual` / `timeline` / `clock`）で、
「用意したものから選ぶ」形になっている。枠組みにするなら、
**そこへ好きな要素を差し込める形**に変える必要がある。

### 変えるときに引き継ぐ制約

- **下部に置けるのは1つだけ。** 1920×1080 に左右2カラムを置くと、
  縦に積める余地が1帯ぶんしかない（実測。だから反実仮想と時間軸は排他にしてある）
- **右上も1つだけ。** ヘッダの右は時計1つでちょうどの幅
- **足すたびに重複を確認する。** 「47秒」が時計・現場の出口・反実仮想の3箇所に
  出た事故があり、いまはフラグで抑えている。差し込み式にすると、
  **抑える判断を誰が持つかを決め直す**必要がある

---

## メモ（次にやりたいこと）

### 1. デモの図面やイメージデータを見せる形が良い

SideBySide が**そういう形**になっている。右側に、その工程で実際に出ている画面
（入居者のスマホ・AIの生出力のJSON・管理画面・CSVの1行）を出す。

> 「AIがP2と言った」は抽象だが、JSONに `"P2"` と書いてあるのを見せると現実になる。

この方向を他の案にも広げるなら、**[1] の引き渡し票 §6「1件の具体シナリオ」を
値つきで埋めておく**ことが前提になる。現場の中身はそこから作る
（[`agent-flow-discovery.md`](./agent-flow-discovery.md)）。

### 2. フルでデモの画面が流れるものを作りたい

**まだ無い。** いまあるのは「図の横に画面を添える」形だけで、
画面そのものが主役になって流れるものは作っていない。

作るなら決めることがある。

- **どこまで作るか。** 実際のアプリの画面を再現するのか、説明用に組み直すのか。
  既存の Side 系はすべて「説明用の画面再構成 / 実システムへの接続なし」と
  画面に明記している。同じ線を引くのか、実物を録るのか
- **尺。** いまは28秒に7工程。画面を流すなら1画面あたりの滞在が短すぎるかもしれない
- **操作の見せ方。** クリックやスクロールを描くのか、画面の切り替えだけにするのか
- **図をどこに置くか。** 出さない／小さく地図として置く／最初と最後だけ出す

置き場は `DesignStudies > Side` でよさそう（図の横ではなく図の代わりだが、
比べる対象は Side の候補と同じため）。

---

## 決まったら

採用が決まったものは **DesignStudies から出す**。
試作と成果物を置き場で分けてあるので、採用＝移動になる
（[`presentation-site-variants.md`](./presentation-site-variants.md)）。

移動するとIDの接頭辞も変わる（`Diagram-Transit` → `<題材>-Transit`）ので、
**一覧の作り直しまで含めて1つの変更**にする。
