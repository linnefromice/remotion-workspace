# 採用候補のメモ

2026-09-18 時点で、商談・展示会に出す候補として挙がっているもの。
**まだ決定ではない。** 全41本の一覧は `pnpm gallery:agent-flow`。

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

規定の4版に **Transit などを5版目として加える**のか、
試作のまま Inquiry 専用で使うのかは決まっていない。

## Side（図の横に置くもの）

| 候補 | ID | 置き場 |
|---|---|---|
| **SideBySide（時間込み）** | ← 要確認 | ClaimIntake |
| **Side-Ledger** | `Side-Ledger` | DesignStudies > Side |

### 「時間込み」がどちらか確認したい

該当しそうなものが2つある。

| ID | 時間の出し方 |
|---|---|
| `ClaimIntake-SideBySide-Full` | ヘッダ右に**経過時計**（受付からの秒数が走る）＋ 下段に反実仮想 |
| `ClaimIntake-SideBySide-Timeline` | 下段が**時間軸**。イベントが左から積まれ、0〜22秒に6件・そこから47秒まで空く |

`-Full` は「いま何秒か」、`-Timeline` は「時間がどこに使われているか」を見せる。
**別のことを言っているので、どちらかを選ぶ必要がある。**

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
