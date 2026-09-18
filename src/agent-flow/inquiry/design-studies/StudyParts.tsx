import React from 'react';
import { Img, staticFile } from 'remotion';
import { ServiceIcon } from '../../../shared/ServiceIcon';
import { STEPS, type NodeId } from '../cards/constants';
import { color, node } from './model';

/** Compact actor mark for the additional studies; existing variants are unchanged. */
export const Mark: React.FC<{ id: NodeId; size?: number; light?: boolean }> = ({ id, size = 58, light = false }) => {
  const line = ['resident', 'intake', 'reply'].includes(id);
  const gmail = id === 'vendor';
  return <div style={{ width: size, height: size, flexShrink: 0, borderRadius: '50%', position: 'relative', display: 'grid', placeItems: 'center',
    background: line ? '#06c755' : gmail ? '#ffffff' : light ? '#ebe7f0' : '#243c42', color: color(id, light) }}>
    {line || gmail ? <Img src={staticFile(`service-icons/${gmail ? 'gmail' : 'line'}.svg`)} style={{ width: '55%', height: '55%' }} /> : <ServiceIcon name={node(id).icon} size={size * .53} />}
    {gmail && <div style={{ position: 'absolute', right: -3, bottom: -3, width: size * .33, height: size * .33, background: '#06c755', borderRadius: '50%', display: 'grid', placeItems: 'center', border: '2px solid white' }}><Img src={staticFile('service-icons/line.svg')} style={{ width: '65%', height: '65%' }} /></div>}
  </div>;
};

export const StudyFooter: React.FC<{ step: number; light?: boolean; note: string }> = ({ step, light = false, note }) => <>
  <div style={{ position: 'absolute', left: 64, right: 64, top: 983, display: 'flex', justifyContent: 'space-between', color: light ? '#605e69' : '#a6bdc3', fontSize: 16 }}>
    <span>{note}</span><span>Inquiry構想 / 下書き承認の経路を例示</span>
  </div>
  <div style={{ position: 'absolute', left: 64, right: 64, top: 1021, display: 'flex', gap: 14 }}>
    {STEPS.map((name, i) => <div key={name} style={{ flex: 1, paddingTop: 10, borderTop: `3px solid ${i === step ? light ? '#705290' : '#b5e4c3' : light ? '#d8d2dc' : '#355058'}`, color: light ? '#514d5d' : '#c3d6d8', fontSize: 16 }}>{i + 1} / {name}</div>)}
  </div>
</>;
