import React from 'react';
import { AbsoluteFill } from 'remotion';
import { BrandSealNode, type ChannelBrand } from '../../shared/BrandSealNode';

const STATES = [
  {label: '通常', active: false, planned: false},
  {label: 'アクティブ', active: true, planned: false},
  {label: '未実装 / 設計済み', active: false, planned: true},
];

export const BrandSealNodesPreview: React.FC = () => <AbsoluteFill style={{background: '#0b1421', color: '#edf3fa', fontFamily: '"Hiragino Sans", sans-serif'}}>
  <div style={{position: 'absolute', left: 80, top: 54, fontSize: 34, fontWeight: 600}}>Brand Seal Node</div>
  <div style={{position: 'absolute', left: 80, top: 108, fontSize: 19, color: '#a7b8cc'}}>ブランドの配色とサービス名を主役に。ロゴは余白を持たせた56px。</div>
  {STATES.map((state, column) => <div key={state.label} style={{position: 'absolute', left: 510 + column * 455, top: 201, width: 208, textAlign: 'center', color: '#a7b8cc', fontSize: 20}}>{state.label}</div>)}
  {(['line', 'gmailLine'] as ChannelBrand[]).map((brand, row) => <React.Fragment key={brand}>
    <div style={{position: 'absolute', left: 80, top: 312 + row * 360}}>
      <div style={{fontSize: 25}}>{brand === 'line' ? 'LINE' : 'Gmail / LINE'}</div>
      <div style={{fontSize: 17, color: '#93a7c0', marginTop: 12}}>{brand === 'line' ? '単一サービス' : '複数の連絡チャネル'}</div>
    </div>
    {STATES.map((state, column) => <div key={state.label} style={{position: 'absolute', left: 510 + column * 455, top: 284 + row * 360}}>
      <BrandSealNode brand={brand} role={brand === 'line' ? '問い合わせ受付' : '業者への連絡'} action={brand === 'line' ? '会話・写真を受け付ける' : '現地対応を手配'} active={state.active} planned={state.planned}/>
    </div>)}
  </React.Fragment>)}
  <div style={{position: 'absolute', left: 80, bottom: 60, fontSize: 16, color: '#93a7c0'}}>幅208px · 円形背景128px · ロゴ56px · 補助ロゴ24px · 接続ポートの位置は既存Logo Sealと共通</div>
</AbsoluteFill>;
