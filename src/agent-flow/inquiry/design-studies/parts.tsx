import React from 'react';
import { Img, staticFile } from 'remotion';
import { ServiceIcon } from '../../../shared/ServiceIcon';
import type { NodeId } from '../cards/constants';
import { ACTION, ROLE, color, node } from './model';

/** これ以上の大きさなら、ラベルも一緒に大きくする */
const LARGE = 150;
/** ラベルの幅。隣のラベルと重ならない範囲でいちばん広く取る */
const LABEL_W = 260;

export const Actor: React.FC<{
  id: NodeId; x: number; y: number; size?: number; light?: boolean; active?: boolean; receiving?: number;
}> = ({ id, x, y, size = 112, light = false, active = false, receiving = 0 }) => {
  const width = size > LARGE ? 420 : LABEL_W;
  const ink = color(id, light);
  const line = ['resident', 'intake', 'reply'].includes(id);
  const gmail = id === 'vendor';
  return <div style={{ position: 'absolute', left: x - width / 2, top: y - size / 2, width, textAlign: 'center' }}>
    <div style={{ margin: '0 auto', width: size, height: size, position: 'relative', display: 'grid', placeItems: 'center',
      borderRadius: light ? 28 : '50%', border: `2px ${id === 'approval' ? 'dashed' : 'solid'} ${active ? ink : light ? '#bdc9c6' : '#405263'}`,
      background: line ? '#06c755' : gmail ? '#ffffff' : light ? '#ffffff' : '#152735', color: ink,
      boxShadow: active ? `0 0 0 7px ${light ? '#dce8e0' : '#233c49'}` : undefined }}>
      {receiving > 0 && <div style={{ position: 'absolute', inset: -8 - receiving * 14, border: `2px solid ${ink}`, borderRadius: '50%', opacity: 1 - receiving }} />}
      {line || gmail ? <Img src={staticFile(`service-icons/${gmail ? 'gmail' : 'line'}.svg`)} style={{ width: size * .5, height: size * .5 }} /> : <ServiceIcon name={node(id).icon} size={size * .47} />}
      {gmail && <div style={{ position: 'absolute', right: -9, bottom: -5, width: size * .32, height: size * .32, borderRadius: '50%', background: '#06c755', display: 'grid', placeItems: 'center', border: `3px solid ${light ? '#f6f5ed' : '#0e1c27'}` }}><Img src={staticFile('service-icons/line.svg')} style={{ width: '65%', height: '65%' }} /></div>}
    </div>
    <div style={{ fontSize: size > LARGE ? 34 : 23, fontWeight: 700, marginTop: 17, color: light ? '#183931' : '#edf4f5' }}>{ROLE[id]}</div>
    <div style={{ fontSize: size > LARGE ? 22 : 16, marginTop: 7, color: light ? '#526b63' : '#a6b9c3' }}>{ACTION[id]}</div>
  </div>;
};
