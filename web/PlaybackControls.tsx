import type {RefObject} from 'react';
import type {PlayerRef} from '@remotion/player';

export function PlaybackControls({player,speed,onSpeedChange}:{player:RefObject<PlayerRef|null>;speed:number;onSpeedChange:(value:number)=>void}){
 return <div className="external-controls" role="group" aria-label="再生操作">
  <button type="button" onClick={()=>player.current?.play()}>開始／再開</button>
  <button type="button" onClick={()=>player.current?.pause()}>一時停止</button>
  <button type="button" onClick={()=>{player.current?.seekTo(0);player.current?.play();}}>最初から再生</button>
  <label>再生速度 <select value={speed} onChange={e=>onSpeedChange(Number(e.target.value))}>{[.5,1,1.5,2,3,4].map(v=><option key={v} value={v}>{v}×</option>)}</select></label>
 </div>;
}
