import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { STEPS, TOTAL_FRAMES } from '../cards/constants';
import { ServiceIcon } from '../../../shared/ServiceIcon';
import { Actor } from './parts';
import { FONT, LINKS, ROLE, color, moment } from './model';

const SUMMARIES = ['入居者 → 受付', '受付 → データ化', 'データ化 ⇄ AI判定', '業者マスタを参照\n下書きなら承認', 'AI判定 → 一次回答\n→ 入居者へ', '判定 → 人 → 判断基準\n→ 次の問い合わせ'];
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
    <div style={{ position: 'absolute', left: 64, right: 64, top: 746, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
      {STEPS.map((name, i) => <div key={name} style={{ height: 206, padding: '20px 18px', borderRadius: 14,
        background: i === step ? '#173c56' : '#f6f8fa', color: i === step ? '#f6fafc' : '#334f61', border: '1px solid #cfdae0' }}>
        <div style={{ fontSize: 16, opacity: .8 }}>0{i + 1}</div><div style={{ fontSize: 26, fontWeight: 700, marginTop: 12 }}>{name}</div>
        <div style={{ fontSize: 18, lineHeight: 1.8, marginTop: 13, whiteSpace: 'pre-line' }}>{SUMMARIES[i]}</div>
      </div>)}
    </div>
    <div style={{ position: 'absolute', left: 64, right: 64, top: 987, display: 'flex', justifyContent: 'space-between', color: '#4d687a', fontSize: 18 }}>
      <span>業者連絡：自動送信 または 下書き承認　 /　 承認経路を例示</span>
      <span>人が調整するのは、AIそのものではなく判断基準。　 /　 構想の説明</span>
    </div>
    <div style={{ position: 'absolute', bottom: 0, height: 6, width: `${(frame + 1) / TOTAL_FRAMES * 100}%`, background: '#173c56' }} />
  </AbsoluteFill>;
};
