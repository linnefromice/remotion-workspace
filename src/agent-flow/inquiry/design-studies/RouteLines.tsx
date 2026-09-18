import React from 'react';
import {LINKS, type Point} from './model';

export type StudyLink = (typeof LINKS)[number];
export const ROUTE_LEGEND = '薄い破線：その他の経路 / 強調線＋点：現在（参照・任意工程は強調線も破線）';
export const pathData = (points: Point[]) => points.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ');

/** Keep inactive edges first so the active handoff is never covered by another route. */
export const RouteLines: React.FC<{
  activeId: string;
  pointsFor: (link: StudyLink) => Point[];
  accent: string;
  muted: string;
  markerId: string;
}> = ({activeId,pointsFor,accent,muted,markerId}) => <g data-route-network="complete">
  <defs><marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="context-stroke" strokeWidth="1.5"/></marker></defs>
  {[...LINKS.filter(e=>e.id!==activeId),...LINKS.filter(e=>e.id===activeId)].map(edge=>{
    const active=edge.id===activeId;
    return <path key={edge.id} data-route-id={edge.id} data-active={active} d={pathData(pointsFor(edge))}
      fill="none" stroke={active?accent:muted} strokeWidth={active?3:1.5} strokeOpacity={active?1:.6}
      strokeDasharray={!active||edge.dashed?'6 8':undefined} strokeLinejoin="round" markerEnd={`url(#${markerId})`}/>;
  })}
</g>;
