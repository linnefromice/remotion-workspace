import { RouteOverview } from './RouteOverview';
import { ROUTE_LEGEND } from './RouteLines';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { STEPS, TOTAL_FRAMES } from '../../inquiry/cards/constants';
import { ServiceIcon } from '../../../shared/ServiceIcon';
import { Actor } from './parts';
import { FONT, LINKS, ROLE, color, moment } from './model';


export const Relay: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const accent = color(link.from, true);
  const passage = interpolate(progress, [0, .15, .75, 1], [0, 0, 1, 1]);
  const lift = Math.sin(passage * Math.PI) * 18;
  const hops = LINKS.filter((edge) => edge.step === step);
  return <AbsoluteFill style={{ background: '#e7edf2', color: '#162f45', fontFamily: FONT }}>
    <div style={{ position: 'absolute', inset: '0 0 auto', height: 222, background: '#173c56', color: '#f7fafc', padding: '36px 64px' }}>
      <div style={{ fontSize: 17, letterSpacing: 3, color: '#b5d0e1' }}>FARLEAP / INQUIRY · DESIGN STUDY 03 · RELAY</div>
      <div style={{ fontSize: 49, fontWeight: 700, marginTop: 19 }}>{link.title}。</div>
      <div style={{ position: 'absolute', right: 64, top: 55, fontSize: 24, color: '#c6dfed' }}>{String(step + 1).padStart(2, '0')} / {STEPS[step]}</div>
      <div style={{ fontSize: 19, marginTop: 15, color: '#b5d0e1' }}>いま、誰から誰へ、何が渡ったか。</div>
    </div>
    <div style={{ position: 'absolute', left: 64, top: 256, width: 1792, height: 462, borderRadius: 26, background: '#f9faf8' }} />
    <div style={{ position: 'absolute', left: 112, top: 286, fontSize: 17, letterSpacing: 2, color: '#607684' }}>HANDOFF {hops.indexOf(link) + 1} / {hops.length}</div>
    <div style={{ position: 'absolute', right: 110, top: 286, fontSize: 18, color: '#607684' }}>
      {link.from === 'approval' || link.to === 'approval' ? '下書きの場合のみ、人が確認して送る' : link.from === 'policy' ? '次の問い合わせで参照' : link.dashed ? '参照・非同期の受け渡し' : '情報の受け渡し'}
    </div>
    <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0 }}>
      <path d="M480 445 H1430" stroke="#bfd0d8" strokeWidth={3} strokeDasharray={link.dashed ? '8 12' : undefined} />
      <path d="M1414 433 L1430 445 L1414 457" stroke={accent} strokeWidth={3} fill="none" />
      <circle cx={500 + passage * 910} cy={445} r={8} fill={accent} />
    </svg>
    <Actor id={link.from} x={350} y={444} size={188} light active />
    <Actor id={link.to} x={1570} y={444} size={188} light active={progress >= .75} receiving={progress >= .75 ? (progress - .75) * 4 : 0} />
    <div style={{ position: 'absolute', left: 688 + (passage - .5) * 145, top: 365 - lift, width: 545, height: 177,
      borderRadius: 16, background: '#ffffff', border: `2px solid ${accent}`, padding: '24px 30px', boxShadow: '0 14px 28px #173c5610' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: accent, fontSize: 16, letterSpacing: 2 }}><ServiceIcon name="inbox" size={26} />受け渡されるもの</div>
      <div style={{ fontSize: 33, fontWeight: 700, marginTop: 21, whiteSpace: 'nowrap' }}>{link.payload}</div>
    </div>
    <div style={{ position: 'absolute', left: 660, top: 604, width: 600, textAlign: 'center', fontSize: 20, color: '#607684' }}>
      {ROLE[link.from]} → {ROLE[link.to]}
    </div>
    <div style={{position:'absolute',left:64,top:744,width:940,height:218}}><RouteOverview link={link} progress={progress} id="relay"/></div>
    <div style={{position:'absolute',left:1070,top:785,width:740,fontSize:22,lineHeight:1.9,color:'#334f61'}}>全体の経路を残し、現在の受け渡しを拡大。<br/>薄い破線は、この瞬間に強調していない経路。<br/>※ 承認は下書きの場合のみ。</div>
    <div style={{ position: 'absolute', left: 64, right: 64, top: 987, display: 'flex', justifyContent: 'space-between', color: '#4d687a', fontSize: 18 }}>
      <span>{ROUTE_LEGEND}</span>
      <span>構想の説明 / 下書き承認を例示</span>
    </div>
    <div style={{ position: 'absolute', bottom: 0, height: 6, width: `${(frame + 1) / TOTAL_FRAMES * 100}%`, background: '#173c56' }} />
  </AbsoluteFill>;
};
