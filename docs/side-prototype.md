# Side 採用候補の試作 A / B / C

## 仕様

A: `ClaimIntake-SideBySide-Clock`。時計だけを追加し、下部は空。mapOnlyの有無は同じルール昇格フレームを比較して選ぶ。28秒、7工程。

B: 右上1要素、下部1要素の差し込みAPI。現場の7画面は固定。既存Zod/プリセットは互換アダプターとして残す。差し込み要素は表示内容を申告し、レイアウトが右上→下部→現場の順で経過時間の表示権を割り当てる。新しい要素の追加にスキーマ変更は不要。

現行ソースではFullの時計とCounterfactualが経過秒を重複表示している。既存のPNG一致要件との両立のため、既存プリセットには互換表示を残す。新しい差し込みAPIは重複を抑止する。従来の反実仮想の強い断定も旧版の互換出力に限定し、新案には引き継がない。

C: `Side-DemoFull`、AgentFlow > DesignStudies > Side。説明用の画面再構成、実システム接続なし。初案は42秒（7×6秒）、画面の切り替えと注目箇所の強調。架空のクリック・降格操作は描かない。画面が主役で、小さな全経路図を位置案内にする。CASE/EVENTSを事実の正本とする。経過秒はシナリオ値と明記する。

## 検証

`node scripts/side-prototype/capture.mjs before|a|final` は7工程を撮影し、src全体のMD5が撮影前後で変わっていないことを検査する。

- before → a: 既存5本×7場面をcmpで比較。
- a → final: 既存5本＋Clockの6本×7場面をcmpで比較。
- 型チェック、差し込みAPIの表示権テスト、pnpm test、全一覧再生成。
- Cの7場面・切り替え・動画再生と、比較ページの狭い画面を確認。

## 差し込み契約

`SideSlot` は `claims: ['elapsed']` と `render(context)` を持つ。contextにはframe/step/widthと、調停後の`showElapsed`を渡す。下部は単一descriptorのみで、配列を受け取らない。高さの許容枠は150px、上端は890px（従来の反実仮想だけ902px）。右上は幅240pxの単一要素。claimが衝突しても帯自体は消さず、その帯の経過時間表現だけを省略する。現場の出口のElapsedSummaryも同じ調停結果で消す。

旧プリセットの分岐優先順位（counterfactual優先）と旧時間表現は互換アダプター内に閉じ込める。新しい題材はこのアダプターを経由せず、Layoutにdescriptorを直接渡す。

## 実装結果

- Aは`mapOnly: true`を選択。左下の余白より、右の現場へ判断の説明を集約することを優先した。比較元は`out/side-prototype/before/*clock-map*`。
- Bは`slots.tsx`の`SideSlot`/`BottomSlot`と`ClaimIntakeSideBySideLayout`。使用例`Side-SlotExample`は時計と既存の反実仮想を移植したもの。秒数は時計だけに表示し、帯には「一次回答を記録」を残す。既存の5版とClockは従来プリセット経由で画素互換。
- Cは`src/agent-flow/design-studies/side/demo-full/`。7枚のSCENESを主画面へ拡張。出口だけはCSVの各列を縦に展開し、長い行の切れを防ぐ。小さな地図は工程を示す位置案内、詳しい文字は主画面で読む。
- Cの時計と地図は`demoMoment`で6秒の工程を従来の4秒工程へ写像して同期する。映像の42秒とシナリオ上の経過秒は別物。架空のクリックや通信・降格実績は追加していない。

### 新しい要素の追加例

```tsx
const auditSlot: BottomSlot = {
  claims: [],
  render: ({step}) => <div>{EVENTS[step].name}</div>,
};
<ClaimIntakeSideBySideLayout mapOnly headerSlot={clockSlot} bottomSlot={auditSlot}/>
```

文字列の意味を自動判定する仕組みではないため、作成者は経過時間を表示するなら`claims: ['elapsed']`を申告し、`showElapsed`を守る。`scripts/side-studies.test.cjs`は実際の画面を描画し、時計＋時間軸、時計＋反実仮想、独自スロットの重複を検査する。旧アダプターの重複を残す例外は新規利用に適用しない。

## 確認ページの再生成

1. `node scripts/side-prototype/capture.mjs final`
2. `pnpm video Side-DemoFull`
3. `node scripts/side-prototype/page.mjs`
4. `pnpm gallery:agent-flow && pnpm test`

`before`と`a`の出力は変更前の証拠なので、再生成するとその時点のソースで置き換わる。変更前の検証資料として保管する。新規環境で過去比較も再現する場合は、対応する変更前ソースから撮影する。

## 検証結果

- `pnpm exec tsc --noEmit`、`pnpm test`（28件）通過。
- A追加前後35枚、B/C変更後42枚が`cmp`で一致。全フラグ有効の非プリセット分岐も2枚一致。
- 既存41案の一覧用PNGも全て追加前とバイト一致。最終一覧は44案。
- 新案の7場面とCの切り替え前後14フレームを目視確認。撮影前後のsrc全体MD5は一致。
- 確認ページの23画像・リンク・320/768/1024/1440pxの表示を検証。
- Cの動画は1920×1080、30fps、1260フレーム、42秒、yuv420p。確認ページ上で7つの章ボタン（3/9/15/21/27/33/39秒）を操作し、全て正しい再生位置へ移動することを確認した。
