import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BrandSealNode, type ChannelBrand } from '../../../shared/BrandSealNode';
import { FlowServiceNode, type FlowNodeVariant } from '../../../shared/FlowServiceNode';
import { claimServiceRoutes } from '../../../shared/serviceFlowRoutes';
import { IconNode } from '../../../shared/IconNode';
import { ServiceIcon } from '../../../shared/ServiceIcon';
import {
  EDGES,
  STEPS,
  STEP_LEN,
  TOTAL_FRAMES,
  PANEL_ROWS,
  PANEL_FOOTER,
  PANEL_SUBTITLE,
  type StepIndex,
} from '../cards/constants';
import { ICON_NODES, ROUTES, STEP_TONES, TONES } from './constants';

/** 実ロゴを出すチャネル。それ以外はピクトグラムのまま */
const BRAND_CHANNELS: Partial<Record<string, ChannelBrand>> = {line: 'line'};

/** ノードに添える短い動作。カード版の desc より短く言い切る */
const ACTIONS: Record<string, string> = {
  resident: '音声・テキストで通報',
  line: '未実装・設計済み',
  intake: '受付番号を発行',
  stt: '音声を文字に',
  judge: '緊急度を判定',
  safety: '昇格のみ・5ルール',
  followup: '音声1回・P1除外',
  work: '次の対応を提案',
  guardrails: '追加と制止のみ',
  staff: '降格には理由が必要',
  csv: 'AI値とルールを出力',
};

const Tag: React.FC<{x: number; y: number; children: React.ReactNode; color?: string}> = ({
  x,
  y,
  children,
  color = '#acbbcd',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      background: '#0b1421',
      padding: '4px 8px',
      color,
      fontSize: 15,
      borderRadius: 5,
    }}
  >
    {children}
  </div>
);

/** 記録層のチップ。フローのノードとは別の見た目にする */
const RecordChip: React.FC<{
  x: number;
  y: number;
  jp: string;
  en: string;
  color: string;
  active: boolean;
}> = ({x, y, jp, en, color, active}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 160,
      top: y - 38,
      width: 320,
      height: 76,
      boxSizing: 'border-box',
      border: `1px solid ${active ? color : '#3a4963'}`,
      borderRadius: 12,
      background: active ? '#112b25' : '#111b26',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 16px',
    }}
  >
    <div style={{color, transform: 'scale(.55)', width: 36, height: 40, display: 'grid', placeItems: 'center'}}>
      <ServiceIcon name="database" />
    </div>
    <div>
      <div style={{fontSize: 21, color: active ? color : '#c2cedb'}}>{jp}</div>
      <div style={{fontSize: 13, color: '#9db1c6', marginTop: 6}}>{en}</div>
    </div>
  </div>
);

export const AgentFlowClaimIntakeIcons: React.FC<{
  nodeVariant?: FlowNodeVariant;
  brandIcons?: boolean;
  /**
   * 判定の非対称パネルを出さない。
   * この図を縮小して他の構図に埋め込むとき、埋め込み先が同じことを
   * 言っていると重複するため（docs/presentation-site.md §4-2）。
   */
  hidePanel?: boolean;
}> = ({nodeVariant, brandIcons = false, hidePanel = false}) => {
  const frame = useCurrentFrame();
  const step = Math.min(STEPS.length - 1, Math.floor(frame / STEP_LEN)) as StepIndex;
  const localFrame = frame % STEP_LEN;
  const routes = nodeVariant ? claimServiceRoutes(nodeVariant) : ROUTES;

  return (
    <AbsoluteFill
      style={{
        background: '#0b1421',
        backgroundImage: 'radial-gradient(#273445 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        color: '#edf3fa',
        fontFamily: '"Hiragino Sans", "Noto Sans CJK JP", sans-serif',
      }}
    >
      <div style={{position: 'absolute', left: 60, top: 32, fontSize: 32, fontWeight: 700}}>
        通報受付{' '}
        <span style={{fontSize: 18, marginLeft: 20, color: '#93a7be', fontWeight: 400}}>
          FARLEAP / CLAIM INTAKE{brandIcons ? ' / ICON V2' : ''}
        </span>
      </div>
      <div style={{position: 'absolute', right: 60, top: 42, fontSize: 20, color: '#d5dce6'}}>
        昇格はルールが強制し、降格は人だけができる
      </div>

      <div style={{position: 'absolute', left: 60, top: 100, display: 'flex', gap: 24}}>
        {STEPS.map((label, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              gap: 9,
              alignItems: 'center',
              color: i === step ? STEP_TONES[i] : '#8291a5',
              fontSize: 20,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                border: '1px solid',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              {i + 1}
            </span>
            {label}
          </div>
        ))}
      </div>

      <div style={{position: 'absolute', right: 60, top: 110, display: 'flex', gap: 16, fontSize: 15}}>
        {(
          [
            ['input', '入力'],
            ['ai', 'AI'],
            ['rule', 'ルール'],
            ['human', '人'],
            ['record', '記録'],
          ] as const
        ).map(([tone, label]) => (
          <span key={tone} style={{color: TONES[tone]}}>
            ━ {label}
          </span>
        ))}
      </div>

      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <rect x="315" y="167" width="1090" height="586" rx="24" fill="#111b2a" stroke="#3a4963" strokeWidth="2" />
        <defs>
          {[...STEP_TONES, TONES.planned].map((color, i) => (
            <marker
              key={i}
              id={`claim-icons-${i}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M1 1L9 5L1 9" fill="none" stroke={color} strokeWidth="1.5" />
            </marker>
          ))}
        </defs>
        {EDGES.map(edge => {
          const active = edge.step !== null && edge.step === step && localFrame >= (edge.delay ?? 0);
          // step が null のエッジ（未実装・通らない経路）は専用の色と末尾のマーカーを使う
          const index = edge.step ?? 7;
          const color = edge.step === null ? TONES.planned : STEP_TONES[edge.step];
          return (
            <g key={edge.id}>
              <path
                d={routes[edge.id]}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinejoin="round"
                opacity={active ? .9 : .35}
                strokeDasharray={edge.dashed ? '7 8' : undefined}
                markerEnd={`url(#claim-icons-${index})`}
              />
              {active && (
                <path
                  d={routes[edge.id]}
                  fill="none"
                  stroke={color}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="2 42"
                  strokeDashoffset={-(localFrame - (edge.delay ?? 0)) * 3}
                />
              )}
            </g>
          );
        })}
      </svg>

      <Tag x={340} y={152}>AGENT RUNTIME</Tag>
      <Tag x={775} y={nodeVariant ? 178 : 222}>別リクエスト</Tag>
      <Tag x={1515} y={154} color={TONES.record}>RECORDS / 履歴と現在値</Tag>
      <Tag x={1080} y={438}>ルール適用後に業務判断</Tag>
      <Tag x={1300} y={818} color={TONES.human}>override</Tag>
      <Tag x={65} y={900} color={TONES.human}>SLA内に折り返す<br/>（アプリ外）</Tag>
      <Tag x={62} y={737}>破線：未実装・通らない経路</Tag>

      {ICON_NODES.map(node => {
        const [x, y] = node.position;
        const brand = brandIcons ? BRAND_CHANNELS[node.id] : undefined;
        const color = TONES[node.tone];
        // 記録層は最後のステップ（出口）でも点灯させる
        const active = node.steps.includes(step) || (node.record === true && step === 6);

        if (node.record) {
          return <RecordChip key={node.id} x={x} y={y} jp={node.jp} en={node.en} color={color} active={active} />;
        }

        return (
          <div
            key={node.id}
            style={{
              position: 'absolute',
              left: x - 104,
              top: y - (nodeVariant === 'actionRow' ? 52 : 64),
              opacity: node.dashed && !brand ? .65 : 1,
            }}
          >
            {brand ? (
              <BrandSealNode
                brand={brand}
                role={'Webhook / 外部チャネル'}
                action={ACTIONS[node.id] ?? node.desc}
                active={node.steps.includes(step)}
                planned={node.dashed}
              />
            ) : nodeVariant ? (
              <FlowServiceNode
                variant={nodeVariant}
                icon={node.icon ?? 'database'}
                title={node.jp}
                action={ACTIONS[node.id] ?? node.desc}
                service={node.en}
                color={color}
                active={active}
                dashed={node.dashed}
              />
            ) : (
              <>
                {node.dashed && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 35,
                      top: -5,
                      width: 138,
                      height: 138,
                      border: `1px dashed ${color}`,
                      borderRadius: 21,
                      boxSizing: 'border-box',
                    }}
                  />
                )}
                <IconNode
                  icon={<ServiceIcon name={node.icon ?? 'database'} />}
                  service={node.jp}
                  role={node.en}
                  variant={['resident', 'staff', 'csv'].includes(node.id) ? 'circle' : 'square'}
                  color={color}
                  active={active}
                  ports={['left', 'right']}
                />
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: '#9db1c6',
                    marginTop: 8,
                    textAlign: 'center',
                    padding: '0 4px',
                  }}
                >
                  {node.desc}
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* 判定の非対称。AIの生出力とルールの結論を並べ、両方が残ることを見せる */}
      {!hidePanel && (
        <div
          style={{
            position: 'absolute',
            left: 320,
            top: 785,
            width: 495,
            padding: '18px 22px',
            boxSizing: 'border-box',
            border: '1px solid #42516a',
            background: '#182233',
            borderRadius: 16,
          }}
        >
          <div style={{fontSize: 21, fontWeight: 700}}>判定の非対称</div>
          <div style={{fontSize: 13, color: '#a7b8cc', marginTop: 5}}>{PANEL_SUBTITLE}</div>
          {PANEL_ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginTop: 10,
                fontSize: 14,
                color: step >= row.revealStep ? (i === 0 ? TONES.ai : TONES.rule) : '#8392a6',
              }}
            >
              <span style={{width: 133}}>{row.label}</span>
              <strong style={{fontSize: 24, width: 40}}>{step >= row.revealStep ? row.value : '—'}</strong>
              <span style={{fontSize: 12}}>{row.note}</span>
            </div>
          ))}
          <div style={{fontSize: 14, color: TONES.human, marginTop: 10}}>{PANEL_FOOTER}</div>
        </div>
      )}

      <div style={{position: 'absolute', left: 60, right: 60, bottom: 16, height: 3, background: '#263346'}}>
        <div style={{width: `${(frame + 1) / TOTAL_FRAMES * 100}%`, height: '100%', background: STEP_TONES[step]}} />
      </div>
    </AbsoluteFill>
  );
};

export const AgentFlowClaimIntakeLogoSeal: React.FC = () => <AgentFlowClaimIntakeIcons nodeVariant="logoSeal"/>;
export const AgentFlowClaimIntakeActionRow: React.FC = () => <AgentFlowClaimIntakeIcons nodeVariant="actionRow"/>;

export const AgentFlowClaimIntakeIconsV2: React.FC = () => <AgentFlowClaimIntakeIcons nodeVariant="logoSeal" brandIcons/>;
