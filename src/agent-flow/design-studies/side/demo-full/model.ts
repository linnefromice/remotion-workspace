import {STEP_LEN} from '../../../claim-intake/cards/constants';
import {SCENES} from '../../../claim-intake/side-by-side/scenes';
export const DEMO_STEP_FRAMES=180;
export const DEMO_FRAMES=SCENES.length*DEMO_STEP_FRAMES;
export function demoMoment(frame:number){
 const bounded=Math.max(0,Math.min(DEMO_FRAMES-1,frame));
 const step=Math.floor(bounded/DEMO_STEP_FRAMES);
 const local=bounded%DEMO_STEP_FRAMES;
 return {step,local,sourceFrame:step*STEP_LEN+local*STEP_LEN/DEMO_STEP_FRAMES};
}
export const DEMO_NOTES=[
 ['届いた情報を、そのまま残す','会話と添付を受け付け、受付番号で1件にひも付けます。'],
 ['音声も、判断できる入力に','文字に起こされた内容を、会話の1ターンとして保持します。'],
 ['AIの原判定を保存する','このあとのルール判断が加わっても、AIの出力は書き換えません。'],
 ['原値と現在値を分ける','においの記述に安全ルールが発火。2つの判断を並べて保持します。'],
 ['次の対応を、候補として提示','ガードレールは追加と制止のみ。表示は手配済みの実績ではありません。'],
 ['担当者が理由を確認する','今回は現在値を確認。降格は人だけができ、理由が必須です。'],
 ['判断の根拠を、出口にも','AI原判定と発火ルールを別の列に残し、あとから理由を追えるようにします。'],
] as const;
