import React from 'react';
import {ClaimIntakeSideBySideLayout} from '../../claim-intake/side-by-side';
import {clockSlot,counterfactualSlot} from '../../claim-intake/side-by-side/slots';
/** フラグを増やさず、時計と既存パネルを差し込む使用例。 */
export const SideSlotExample:React.FC=()=> <>
 <ClaimIntakeSideBySideLayout mapOnly headerSlot={clockSlot} bottomSlot={counterfactualSlot}/>
 <div style={{position:'absolute',left:60,top:167,fontSize:15,color:'#a9b9cc',fontFamily:'sans-serif'}}>差し込み例 / 説明用の再構成・実接続なし / 経過秒はシナリオ値・実測ではありません</div>
</>;

/** 下部の比較・補足・進捗を省いた版。時計と現場を残す。 */
export const SideSlotMinimal:React.FC=()=>
 <ClaimIntakeSideBySideLayout mapOnly headerSlot={clockSlot} hideMapCaption hideProgress centerContent/>;
