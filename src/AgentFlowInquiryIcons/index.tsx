import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { IconNode } from '../AgentFlowCodexReClaude/components/IconNode';
import { ServiceIcon } from '../AgentFlowCodexReClaude/components/ServiceIcon';
import { EDGES, STEPS, STEP_LEN, TOTAL_FRAMES, type StepIndex } from '../AgentFlowInquiry/constants';
import { ICON_NODES, ROUTES, nodeColor } from './constants';

const PALETTE = ['#71d7ef', '#b398f9', '#b398f9', '#70dbb0', '#70dbb0', '#ffb17c'];
const Tag: React.FC<{x: number; y: number; children: React.ReactNode; color?: string}> = ({x, y, children, color = '#acbbcd'}) =>
  <div style={{position: 'absolute', left: x, top: y, padding: '5px 10px', background: '#0b1421', color, borderRadius: 6, fontSize: 17, whiteSpace: 'nowrap'}}>{children}</div>;

export const AgentFlowInquiryIcons: React.FC = () => {
  const frame = useCurrentFrame();
  const step = Math.min(STEPS.length - 1, Math.floor(frame / STEP_LEN)) as StepIndex;
  const localFrame = frame % STEP_LEN;
  return <AbsoluteFill style={{background: '#0b1421', backgroundImage: 'radial-gradient(#273445 1px, transparent 1px)', backgroundSize: '24px 24px', color: '#edf3fa', fontFamily: '"Hiragino Sans", "Noto Sans CJK JP", sans-serif'}}>
    <div style={{position: 'absolute', left: 60, top: 36, fontSize: 32, fontWeight: 700}}>問い合わせ対応 <span style={{fontSize: 18, marginLeft: 20, color: '#93a7be', fontWeight: 400}}>FARLEAP / INQUIRY FLOW</span></div>
    <div style={{position: 'absolute', left: 60, top: 100, display: 'flex', gap: 28}}>
      {STEPS.map((label, i) => <div key={label} style={{display: 'flex', gap: 10, alignItems: 'center', fontSize: 20, color: i === step ? PALETTE[i] : '#8291a5'}}><span style={{border: '1px solid', borderRadius: '50%', width: 28, height: 28, display: 'grid', placeItems: 'center', background: i === step ? `${PALETTE[i]}20` : 'transparent'}}>{i + 1}</span>{label}</div>)}
    </div>
    <div style={{position: 'absolute', right: 60, top: 48, color: '#a7b8cc', fontSize: 17}}>問い合わせを構造化し、判断の基準を人が育てる</div>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <rect x="310" y="166" width="980" height="853" rx="24" fill="#111b2a" fillOpacity=".85" stroke="#3a4963" strokeWidth="2"/>
      <defs>{PALETTE.map((color, i) => <marker key={i} id={`inquiry-icon-arrow-${i}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke={color} strokeWidth="1.5"/></marker>)}</defs>
      {EDGES.map(edge => {
        const active = step === edge.step && localFrame >= (edge.delay ?? 0);
        const color = edge.id === 'vendorDb-dispatch' ? '#a5b6ca' : PALETTE[edge.step];
        return <g key={edge.id}>
          <path d={ROUTES[edge.id]} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" opacity={active ? .9 : .38} strokeDasharray={edge.dashed ? '7 8' : undefined} markerEnd={`url(#inquiry-icon-arrow-${edge.step})`}/>
          {active && <path d={ROUTES[edge.id]} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 42" strokeDashoffset={-(localFrame - (edge.delay ?? 0)) * 3}/>}
        </g>;
      })}
    </svg>
    <Tag x={335} y={151}>AGENT RUNTIME</Tag>
    <Tag x={535} y={222}>会話・写真</Tag>
    <Tag x={571} y={424}>データ ↓</Tag>
    <Tag x={843} y={424}>↑ 判定結果</Tag>
    <Tag x={917} y={222}>手配</Tag>
    <Tag x={1310} y={150} color="#ffb17c">下書きのときだけ承認</Tag>
    <Tag x={537} y={514}>初期対応方針</Tag>
    <Tag x={1120} y={580}>業者を参照</Tag>
    <Tag x={340} y={748} color="#ffb17c">判定結果をレビュー</Tag>
    <Tag x={381} y={800} color="#ffb17c">ルール・文脈を調整</Tag>
    <Tag x={921} y={711} color="#ffb17c">次の判定へ</Tag>
    {ICON_NODES.map(node => {
      const [x, y] = node.position;
      const color = nodeColor(node.id);
      return <div key={node.id} style={{position: 'absolute', left: x - 104, top: y - 64}}>
        {node.optional && <div style={{position: 'absolute', left: 35, top: -5, width: 138, height: 138, border: `1px dashed ${color}`, borderRadius: 21, boxSizing: 'border-box'}}/>}
        <IconNode icon={<ServiceIcon name={node.icon}/>} service={`${node.num ? `${node.num}  ` : ''}${node.jp}`} role={node.en} variant={['policy', 'vendorDb', 'staff', 'resident', 'vendor'].includes(node.id) ? 'circle' : 'square'} color={color} active={node.steps.includes(step)} ports={['left', 'right']}/>
        <div style={{textAlign: 'center', color: '#99adc4', fontSize: 15, marginTop: 9, whiteSpace: 'nowrap'}}>{node.desc}</div>
      </div>;
    })}
    <div style={{position: 'absolute', left: 1340, top: 580, width: 500, borderTop: '1px solid #334356', paddingTop: 24}}>
      <div style={{fontSize: 20, color: PALETTE[step]}}>{String(step + 1).padStart(2, '0')} / {STEPS[step]}</div>
      <div style={{fontSize: 18, color: '#a7b8cc', lineHeight: 1.9, marginTop: 16}}>{['入居者から届いた会話と写真を受け付けます。', '問い合わせを物件・症状・緊急度に分解します。', 'AIが優先度と初期対応方針を判定し、データへ書き戻します。', '業者マスタを参照して連絡。下書きの場合のみ承認を経て送信します。', 'AIの方針をもとに、入居者へLINEで一次回答を返します。', '担当者が判定をレビューし、ルールと文脈を調整。次の問い合わせの判断に反映します。'][step]}</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 35, color: '#a7b8cc', fontSize: 15}}>{[['#71d7ef','入力'],['#b398f9','AI判定'],['#70dbb0','送信'],['#ffb17c','人の介在']].map(([color, label]) => <span key={label}><span style={{color}}>━ </span>{label}</span>)}</div>
      <div style={{fontSize: 15, color: '#a7b8cc', marginTop: 16}}>破線：参照・非同期・任意の工程</div>
    </div>
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 24, height: 3, background: '#263346'}}><div style={{width: `${(frame + 1) / TOTAL_FRAMES * 100}%`, height: '100%', background: PALETTE[step]}}/></div>
  </AbsoluteFill>;
};
