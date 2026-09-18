# 調査依頼：Transit を5版目にできるか

**作りきる依頼ではない。判断がつけば終わり。**
このファイルだけ読めば着手できるように書いてある。2026-09-18 時点。

背景は [`adoption-candidates.md`](./adoption-candidates.md) の「AgentDiagram」、
図の作法は [`agent-flow-diagram-patterns.md`](./agent-flow-diagram-patterns.md)、
言葉は [`agent-flow-glossary.md`](./agent-flow-glossary.md)。

---

## 1. 確かめたいこと

> **Transit の見せ方を、題材のグリッドから描けるか。**

描けるなら規定の5版目にする。描けないなら、規定は4版のままにして
Transit は Inquiry 専用の試作として使う。**どちらでもよい。知りたいのは答え。**

---

## 2. 先に知っておいてほしい非対称

**いまの4版と Transit は、変えているものが違う。**

| | 何を変えるか | ノードの位置 |
|---|---|---|
| Cards / LogoSeal / IconsV2 / ActionRow | **ノードの描き方** | **同じ**。`spec.nodes[].cx/cy` を共有 |
| Transit / Orbit / Lanes | **ノードの置き場所** | **違う**。自前の座標表を持つ |

`shared/FlowDiagram.tsx` の `variant` は**描き方だけ**を切り替えている
（`NodeCard` の中で分岐し、位置は `node.cx / node.cy` をそのまま使う）。
Transit を同じ枠に入れようとすると、**位置も切り替える必要がある**ので、
`variant` とは別の概念になる可能性が高い。

**ここを最初に見極めてほしい。** 「5版目」と呼んでいるが、
既存の4版と同じ種類のものではないかもしれない。
違う種類だと分かったら、そう言ってくれてよい（それも答えのひとつ）。

---

## 3. やってほしいこと

### 手1：1題材で試す

**ClaimIntake か Restoration のどちらか1つで、Transit の見せ方を
`FlowSpec` から描けるか試す。** 両方はやらなくてよい。

いま Transit が持っている形はこう（`design-studies/agent-diagram/model.ts` と `Network.tsx`）。

- 3本の帯に分ける。帯の見出しは
  **「01 — 受け付ける・手配する」「02 — 判断して返す」「03 — 人が基準を育てる」**
- 帯の中で横に並べる
- 明るい地

> **訂正（2026-09-18）**: 依頼書の初版は帯を「外部チャネル / エージェント / 人・参照情報」と
> 書いていたが、**それは Transit ではなく Lanes の帯**だった。
> Transit の帯は上のとおり**役割別**で、上段に承認者、中段に業者マスタが入る。
> つまり `tone`（主体）とは一致しない。調査で指摘されたので直した。

これを、**題材の `constants.ts` が持っている情報から導けるか**を見る。

### 手2：判断する

手1の結果で、次のどれかを選ぶ。

| 結果 | 次にすること |
|---|---|
| **導けた** | 5版目として規定に入れる。4題材すべてに出す |
| **導けるが、題材ごとに手当てが要る** | 手当ての量を書く。規定に入れるかは相談 |
| **導けない** | 理由を書いて終わり。規定は4版のまま |

---

## 4. 終わってよい条件

**次のどれかが言えたら、そこで止めてよい。**

- 1題材で Transit が `FlowSpec` から描けた（静止画を1枚出す）
- 描けない理由が具体的に言える（「`tone` だけでは帯を決められない。
  ◯◯の情報が要る」のように）
- **`variant` とは別の概念が要ると分かった**（そう書いて終わりでよい）

**完成度は要らない。** 線が少しズレていても、位置が導けているかが分かれば十分。
4題材ぶん作る必要も、既存の Transit を置き換える必要もない。

---

## 5. やらなくていいこと

- **Orbit と Lanes。** 同心円とレーンは、いまのグリッドの外にある。
  Transit が通ってから考える
- **既存の `Diagram-Transit` を消す/置き換える。** 残したまま、別に試す
- **4題材ぶん作る。** 1つで判断がつく
- **見た目の作り込み。** 判断がついたら止める

---

## 6. 守ること

### 既存の出力を変えない

**既存のコンポジションに手を入れるときは、既定値で従来どおりになるフラグを足す。**
`hidePanel` / `inactiveDashed` / `frameOverride` がその形。

変えていないことは**同じフレームのPNGを `cmp` でバイト比較**して示す。

```sh
pnpm exec remotion still <Id> before.png --frame=420 --gl=swangle
# ...変更...
pnpm exec remotion still <Id> after.png --frame=420 --gl=swangle
cmp before.png after.png
```

レンダーの前後でソースの `md5` も取る（実行中に書き換えて偽の差分を出したことがある）。

### 図の作法

- **座標を2箇所に書かない。** この調査の主題そのもの
- **主体に色を割り当てる**（工程ではない）。決定論のルールは白
- **通らない経路を消さない**。破線で残す
- **上書きのアニメーションを作らない**

### コンポジションを足したら

```sh
pnpm gallery:agent-flow   # 一覧を作り直す。忘れると pnpm test:gallery が落ちる
pnpm test                 # 28件
```

**試しに1本足すだけなら、登録せずに済ませてもよい。**
登録するなら一覧の作り直しまでが1つの変更。

---

## 7. 残してほしいもの

**コードより、判断の根拠を残してほしい。**

`docs/adoption-candidates.md` の「AgentDiagram」節に追記する形で、

- どちらの結果だったか
- そう言える根拠（試した範囲・出した静止画・詰まった箇所）
- 次にやるなら何から

を書く。**「できなかった」なら、何が足りなかったかが一番の成果になる。**

---

## 8. 参考：いまの形

```
src/shared/
  FlowDiagram.tsx     spec を受け取って描く。variant は描き方だけを切り替える
  flowTheme.ts        FlowSpec / NodeDef / EdgeDef の型と、主体の色

src/agent-flow/<題材>/
  cards/constants.ts  題材のグリッドと NODES / EDGES（ClaimIntake / Inquiry）
  constants.ts        同上（Restoration / Proposal。こちらは FlowSpec を直接組む）

src/agent-flow/design-studies/agent-diagram/
  model.ts            Transit / Orbit の座標表。今回の比較対象
  Network.tsx         Transit と Orbit の描画（orbit の真偽で切り替え）
```

**Restoration / Proposal の `constants.ts` は既に `FlowSpec` を組んでいる**ので、
そちらのほうが試しやすいかもしれない。
ClaimIntake / Inquiry は先に作ったぶん自前の描画を持っている。
