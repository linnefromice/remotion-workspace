import { RouteOverview } from './RouteOverview';
import { ROUTE_LEGEND } from './RouteLines';
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { STEPS } from '../cards/constants';
import { FONT, LINKS, ROLE, moment } from './model';
import { Mark, StudyFooter } from './StudyParts';

/**
 * 1行の高さと、見えている枠の高さ。
 * 行の描画・スクロール量・スクロールの上限の3箇所が、必ず同じ値を見るようにする。
 * （padding と下線を含めた高さになるのは、Remotion が全体に box-sizing: border-box を
 * 当てているため。依存したままにせず、行にも明示してある）
 */
const ROW_H = 110;
const VIEW_H = 660;

export const InquiryChronicle: React.FC = () => {
  const frame = useCurrentFrame();
  const { step, link, progress } = moment(frame);
  const index = LINKS.indexOf(link);
  const maxScroll = Math.max(0, LINKS.length - Math.floor(VIEW_H / ROW_H));
  const scrollAt = (i: number) => Math.max(0, Math.min(maxScroll, i - 4)) * ROW_H;
  const targetScroll = scrollAt(index);
  const previousScroll = scrollAt(index - 1);
  const scroll = interpolate(progress, [0, .25], [previousScroll, targetScroll], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#f4f0e8', color: '#2e3540', fontFamily: FONT }}>
    <div style={{ position: 'absolute', left: 64, top: 38, fontSize: 17, color: '#71695d', letterSpacing: 3 }}>FARLEAP / INQUIRY · DESIGN STUDY 05 · CHRONICLE</div>
    <div style={{ position: 'absolute', left: 64, top: 81, fontSize: 49, fontWeight: 700 }}>ひとつずつ、対応を進める。</div>
    <div style={{ position: 'absolute', right: 64, top: 99, fontSize: 20, color: '#71695d' }}>受け渡し {index + 1} / {LINKS.length}　·　工程 {step + 1} / 6</div>
    <div style={{ position: 'absolute', left: 64, top: 240, width: 1090, height: VIEW_H, border: '1px solid #d8d1c6', background: '#fffdf8', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ transform: `translateY(${-scroll}px)`, padding: '0 28px' }}>
        {LINKS.map((item, i) => {
          const active = i === index;
          const future = i > index;
          return <div key={item.id} style={{ height: ROW_H, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid #e6e0d6', borderLeft: `4px solid ${active ? '#876644' : 'transparent'}`, background: active ? '#f2e9da' : 'transparent', padding: '10px 16px' }}>
            <div style={{ width: 35, color: future ? '#aaa294' : '#876644', fontSize: 18 }}>{String(i + 1).padStart(2, '0')}</div>
            <Mark id={item.from} size={55} light /><span style={{ color: '#978d7c' }}>→</span><Mark id={item.to} size={55} light />
            <div style={{ flex: 1, marginLeft: 10 }}>
              <div style={{ fontSize: 22, fontWeight: active ? 700 : 500, color: future ? '#787873' : '#313941' }}>{item.title}</div>
              <div style={{ fontSize: 16, color: '#73716b', marginTop: 7 }}>{ROLE[item.from]} → {ROLE[item.to]}</div>
            </div>
            <div style={{ fontSize: 15, color: '#71695d', whiteSpace: 'nowrap' }}>{active ? '進行中' : future ? 'このあと' : '通過'}</div>
          </div>;
        })}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 1220, top: 232, width: 620 }}>
      <div style={{ color: '#876644', fontSize: 19, letterSpacing: 2 }}>FOCUS / {STEPS[step]}</div>
      <div style={{ fontSize: 39, fontWeight: 700, lineHeight: 1.55, marginTop: 24 }}>{link.title}。</div>
      <div style={{ borderTop: '2px solid #b99d7c', marginTop: 32, paddingTop: 24 }}>
        <div style={{ fontSize: 18, color: '#71695d' }}>受け渡す情報</div>
        <div style={{ fontSize: 31, marginTop: 14 }}>{link.payload}</div>
      </div>
      <div style={{ marginTop: 40, display: 'flex', gap: 22, alignItems: 'center' }}><Mark id={link.from} size={88} light /><span style={{ fontSize: 30, color: '#876644' }}>→</span><Mark id={link.to} size={88} light /></div>
      <div style={{marginTop:28,fontSize:16,color:'#71695d'}}>全体経路 / ※ 承認は下書きの場合のみ</div>
      <div style={{height:235,marginTop:12}}><RouteOverview link={link} progress={progress} id="chronicle"/></div>
    </div>
    <div style={{position:'absolute',left:64,top:177,fontSize:16,color:'#71695d'}}>説明用の処理順 / 実際の監査ログや時刻を示すものではありません</div>
    <StudyFooter step={step} light note={ROUTE_LEGEND} />
  </AbsoluteFill>;
};
