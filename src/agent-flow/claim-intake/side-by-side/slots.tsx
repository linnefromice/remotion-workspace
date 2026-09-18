import React from 'react';
import {ElapsedClock, EventTimeline} from './panels/EventTimeline';
import {Counterfactual} from './panels/Counterfactual';

export type SlotContext = {frame:number; step:number; width:number; showElapsed:boolean};
/** 1つの表示領域に1 descriptor。経過時間を言う要素は必ず申告する。 */
export type SideSlot = {
 claims: readonly 'elapsed'[];
 render: (context:SlotContext)=>React.ReactNode;
};
export type BottomSlot = SideSlot & {top?:890|902};

/** 右上 → 下部 → 現場。帯を消さず、重複する情報だけを抑える。 */
export function resolveSlotClaims(header?:SideSlot,bottom?:SideSlot){
 const headerElapsed=header?.claims.includes('elapsed')??false;
 const bottomElapsed=!headerElapsed&&(bottom?.claims.includes('elapsed')??false);
 return {headerElapsed,bottomElapsed,sceneElapsed:!headerElapsed&&!bottomElapsed};
}
export const clockSlot:SideSlot={claims:['elapsed'],render:({frame,showElapsed})=>showElapsed?<ElapsedClock frame={frame}/>:null};
export const timelineSlot:BottomSlot={claims:['elapsed'],render:({frame,width,showElapsed})=><EventTimeline frame={frame} width={width} hideElapsed={!showElapsed}/>};
export const counterfactualSlot:BottomSlot={claims:['elapsed'],top:902,render:({step,showElapsed})=><Counterfactual step={step} hideElapsed={!showElapsed} explanatory/>};
