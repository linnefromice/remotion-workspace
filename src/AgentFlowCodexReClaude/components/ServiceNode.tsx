import React from 'react';

export type ServiceNodeVariant = 'logoTile' | 'logoSeal' | 'actionRow' | 'caption';
export type ServiceNodeProps = {
  /** Supply an SVG or an Img with width/height 100%. */
  icon: React.ReactNode;
  service: string;
  action: string;
  detail?: string;
  color?: string;
  variant?: ServiceNodeVariant;
  active?: boolean;
  compact?: boolean;
  ports?: boolean;
  /** Logo tile surface: choose a contrasting color for the supplied logo. */
  logoBackground?: string;
};

/** 304px footprint (208px with compact). Content-driven height.
 * Side port Y: logoTile 96, logoSeal 84 (compact: 64), actionRow 52, caption 36.
 * Pure presentation: drive active from useCurrentFrame() in the parent.
 */
export const ServiceNode: React.FC<ServiceNodeProps> = ({icon, service, action, detail, color = '#86b7ff', variant = 'logoTile', active = false, ports = true, compact = false, logoBackground = '#f4f7fb'}) => {
  const tile = variant === 'logoTile';
  const seal = variant === 'logoSeal';
  const row = variant === 'actionRow';
  const sealSize = compact ? 128 : 168;
  const portY = tile ? 96 : seal ? sealSize / 2 : row ? 52 : 36;
  const logoSize = tile ? 88 : seal ? (compact ? 60 : 76) : row ? (compact ? 28 : 36) : 44;
  const logo = <div aria-hidden="true" style={{width: logoSize, height: logoSize, display: 'grid', placeItems: 'center', flexShrink: 0, color}}>{icon}</div>;
  const title = <div style={{fontSize: compact ? (seal ? 21 : 18) : tile || seal ? 25 : 21, fontWeight: 600, letterSpacing: -.5, lineHeight: 1.3, overflowWrap: 'anywhere'}}>{service}</div>;
  const actionLabel = <div style={{fontSize: compact ? 14 : 18, color: tile || seal ? '#b7c7d9' : color, marginTop: 7, lineHeight: 1.45}}>{action}</div>;
  return <div role="img" aria-label={`${service}：${action}${detail ? `。${detail}` : ''}${active ? '（アクティブ）' : ''}`} style={{position: 'relative', width: compact ? 208 : 304, boxSizing: 'border-box', color: '#f0f4fa', fontFamily: '"Hiragino Sans", sans-serif'}}>
    {ports && (['left', 'right'] as const).map(side => <span key={side} style={{position: 'absolute', [side]: -5, top: portY - 5, width: 10, height: 10, borderRadius: '50%', background: active ? color : '#63758b', outline: '4px solid #101a28', zIndex: 1}}/>)}
    {tile ? <>
      <div style={{height: 192, border: `1px solid ${active ? color : '#37465c'}`, borderRadius: 24, display: 'grid', placeItems: 'center', background: '#182537', position: 'relative'}}>
        <div style={{width: 144, height: 144, borderRadius: 28, background: logoBackground, display: 'grid', placeItems: 'center', boxShadow: '0 8px 20px #00000020'}}>{logo}</div>
        <span style={{position: 'absolute', right: 18, top: 17, fontSize: 11, color: active ? color : '#a0afc2', letterSpacing: 1.5}}>{active ? 'ACTIVE' : 'READY'}</span>
      </div>
      <div style={{textAlign: 'center', marginTop: 20}}>{title}{actionLabel}</div>
    </> : seal ? <>
      <div style={{height: sealSize, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: sealSize / 2, height: 1, background: '#37465c'}}/>
        <div style={{width: sealSize, height: sealSize, boxSizing: 'border-box', border: `1px solid ${active ? color : '#526078'}`, borderRadius: '50%', padding: 10, background: '#101a28', position: 'relative'}}>
          <div style={{width: '100%', height: '100%', borderRadius: '50%', background: logoBackground, display: 'grid', placeItems: 'center'}}>{logo}</div>
          <span style={{position: 'absolute', right: 4, bottom: 21, width: 18, height: 18, border: '5px solid #101a28', borderRadius: '50%', background: active ? color : '#63758b'}}/>
        </div>
      </div>
      <div style={{textAlign: 'center', marginTop: 22}}>{title}{actionLabel}</div>
    </> : row ? <div style={{minHeight: 104, boxSizing: 'border-box', padding: compact ? '16px 12px' : '22px 22px', border: `1px solid ${active ? color : '#37465c'}`, borderLeft: `4px solid ${color}`, borderRadius: 12, background: '#182537', display: 'flex', gap: compact ? 10 : 18, alignItems: 'center'}}>
      {logo}<div style={{minWidth: 0}}>{title}{actionLabel}</div>
    </div> : <div style={{padding: '12px 20px 20px', borderBottom: `2px solid ${active ? color : '#37465c'}`}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 15}}>{logo}{title}</div>
      <div style={{marginTop: 22, fontSize: 27, fontWeight: 500, letterSpacing: -.7, lineHeight: 1.4}}>{action}</div>
    </div>}
    {detail && <div style={{color: '#93a7c0', fontSize: compact ? 13 : 15, lineHeight: 1.6, marginTop: 12, textAlign: tile || seal ? 'center' : 'left', padding: tile || seal ? '0 10px' : '0 20px'}}>{detail}</div>}
  </div>;
};

export type NamedServiceNodeProps = Omit<ServiceNodeProps, 'variant'>;
export const LogoTileNode: React.FC<NamedServiceNodeProps> = props => <ServiceNode {...props} variant="logoTile"/>;
export const LogoSealNode: React.FC<NamedServiceNodeProps> = props => <ServiceNode {...props} variant="logoSeal"/>;
export const ActionRowNode: React.FC<NamedServiceNodeProps> = props => <ServiceNode {...props} variant="actionRow"/>;
