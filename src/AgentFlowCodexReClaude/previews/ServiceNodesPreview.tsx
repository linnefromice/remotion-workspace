import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { ServiceNode, type ServiceNodeVariant } from '../../shared/ServiceNode';

const VARIANTS: {id: ServiceNodeVariant; name: string; description: string}[] = [
  {id: 'logoTile', name: 'Logo Tile', description: '明るい面で、サービスロゴを主役に。'},
  {id: 'logoSeal', name: 'Logo Seal', description: '円形のバッジで、外部接点を示す。'},
  {id: 'actionRow', name: 'Action Row', description: 'サービス名と動作を、一目で読む。'},
  {id: 'caption', name: 'Caption', description: '枠を減らし、短い言葉を際立たせる。'},
];

export const ServiceNodesPreview: React.FC = () => <AbsoluteFill style={{background: '#101a28', color: '#f0f4fa', fontFamily: '"Hiragino Sans", sans-serif'}}>
  <div style={{position: 'absolute', left: 72, top: 42, fontSize: 15, letterSpacing: 3, color: '#8ba2bd'}}>NODE DESIGN STUDIES / 04</div>
  <div style={{position: 'absolute', left: 72, top: 80, fontSize: 36, fontWeight: 600}}>サービスを見せる。役割を伝える。</div>
  <div style={{position: 'absolute', right: 72, top: 99, fontSize: 17, color: '#93a7c0'}}>上段：アクティブ　/　下段：通常</div>
  {VARIANTS.map((variant, i) => <React.Fragment key={variant.id}>
    <div style={{position: 'absolute', left: 72 + i * 465, top: 182, width: 360}}>
      <div style={{fontSize: 14, letterSpacing: 2, color: i < 2 ? '#91b9f5' : '#a5d7bf'}}>{i < 2 ? 'SERVICE ICON' : 'LABEL & ACTION'} / 0{i + 1}</div>
      <div style={{fontSize: 27, marginTop: 13}}>{variant.name}</div>
      <div style={{fontSize: 16, color: '#93a7c0', marginTop: 10}}>{variant.description}</div>
    </div>
    {[0, 1].map(row => <div key={row} style={{position: 'absolute', left: 90 + i * 465, top: row === 0 ? 330 : 704}}>
      <ServiceNode
        variant={variant.id}
        service={row === 0 ? 'Google Drive' : 'GitHub'}
        action={row === 0 ? '資料を保存' : 'Issueを作成'}
        detail={row === 0 ? '問い合わせの添付資料' : '対応タスクをチームへ'}
        color={row === 0 ? '#83b3ff' : '#c8b8f4'}
        active={row === 0}
        logoBackground={row === 0 ? '#f4f7fb' : '#242936'}
        icon={<Img src={staticFile(`service-icons/${row === 0 ? 'google-drive' : 'github'}.svg`)} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>}
      />
    </div>)}
    {i < 3 && <div style={{position: 'absolute', left: 495 + i * 465, top: 185, bottom: 64, width: 1, background: '#283649'}}/>}
  </React.Fragment>)}
  <div style={{position: 'absolute', left: 72, bottom: 25, fontSize: 13, color: '#738aa5'}}>同じ情報を4つの形で比較 · ロゴ、サービス名、動作、補足、状態、接続ポートを差し替え可能</div>
</AbsoluteFill>;
