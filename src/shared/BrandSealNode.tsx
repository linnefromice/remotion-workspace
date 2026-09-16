import React from 'react';
import { Img, staticFile } from 'remotion';

export type ChannelBrand = 'line' | 'gmailLine';
const BRANDS = {
  line: {name: 'LINE', color: '#06c755', background: '#06c755', file: 'line.svg'},
  gmailLine: {name: 'Gmail / LINE', color: '#ef7770', background: '#ffffff', file: 'gmail.svg'},
};

/** Same 208px footprint and port centers (0/208, 64) as compact LogoSealNode.
 * Brand visibility is independent of active state; planned integrations remain labeled.
 */
export const BrandSealNode: React.FC<{
  brand: ChannelBrand; role: string; action: string; active: boolean; planned?: boolean;
}> = ({brand, role, action, active, planned = false}) => {
  const info = BRANDS[brand];
  return <div role="img" aria-label={`${info.name}：${role}。${action}${planned ? '（未実装・設計済み）' : ''}${active ? '（アクティブ）' : ''}`} style={{position: 'relative', width: 208, textAlign: 'center', fontFamily: '"Hiragino Sans", sans-serif'}}>
    <div style={{height: 128, position: 'relative', display: 'flex', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 64, height: 2, background: active ? info.color : '#526078'}}/>
      {(['left', 'right'] as const).map(side => <span key={side} style={{position: 'absolute', [side]: -5, top: 59, width: 10, height: 10, borderRadius: '50%', background: active ? info.color : '#8291a5', outline: '4px solid #0b1421'}}/>)}
      <div style={{width: 128, height: 128, padding: 7, boxSizing: 'border-box', border: `2px ${planned ? 'dashed' : 'solid'} ${info.color}`, borderRadius: '50%', background: '#101a28', position: 'relative', boxShadow: active ? `0 0 25px ${info.color}35` : 'none'}}>
        <div style={{width: '100%', height: '100%', borderRadius: '50%', background: info.background, display: 'grid', placeItems: 'center'}}>
          <Img src={staticFile(`service-icons/${info.file}`)} style={{width: 56, height: 56, objectFit: 'contain'}}/>
        </div>
        {brand === 'gmailLine' && <div style={{position: 'absolute', right: -8, bottom: -4, width: 45, height: 45, background: '#06c755', border: '4px solid #101a28', borderRadius: '50%', display: 'grid', placeItems: 'center'}}><Img src={staticFile('service-icons/line.svg')} style={{width: 24, height: 24}}/></div>}
      </div>
    </div>
    <div style={{fontSize: 25, fontWeight: 700, color: '#f3f7fc', marginTop: 18, letterSpacing: -.5}}>{info.name}</div>
    <div style={{fontSize: 17, color: info.color, marginTop: 7, fontWeight: 600}}>{role}</div>
    <div style={{fontSize: 14, color: '#afc0d4', marginTop: 7, lineHeight: 1.5}}>{planned ? '未実装・設計済み' : action}</div>
  </div>;
};
