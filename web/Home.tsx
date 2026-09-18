import {useRef,useState} from 'react';
import {PlaybackControls} from './PlaybackControls';
import {Player,type PlayerRef} from '@remotion/player';
import {AgentFlowCodexReClaude} from '@flow/agent-flow/reference/codex-reclaude';
import {TOTAL_FRAMES,FPS,CANVAS_W,CANVAS_H} from '@flow/agent-flow/reference/codex-reclaude/constants';
import {MENUS,CATALOG} from './catalog';
const descriptions=[
 'エージェントを、どんな図で伝えるか。アイコン、役割ごとのレーン、環状の配置、路線図。同じ業務を5つの表現で見比べます。',
 '図のそばに、何を置くか。工程・現場の画面・判断の理由を添える3つの配置で、全体像と具体的な動きをつなぎます。',
 'エージェントが、どんな業務を担うか。通報受付、物件提案、問い合わせ、原状回復。AI・ルール・人が関わる4つの仕事を見ます。'
];
export function Home(){const player=useRef<PlayerRef>(null);const [speed,setSpeed]=useState(1);return <main id="content" className="home" tabIndex={-1}>
 <section className="home-hero"><h1 className="eyebrow">AGENT EXPERIENCE STUDIES</h1><div className="hero-bottom"><p>エージェントの働きを、どう見せるか。<br/>図の表現、情報の配置、業務の内容。<br/>3つの視点から、伝わる形を探すコレクション。</p><a className="hero-link" href="#diagram/LogoSeal">パターンを見比べる <span>↗</span></a></div><div className="outcome"><div className="eyebrow">最終成果物のイメージ</div><p>AgentDiagramとSideの最適な組み合わせを考え、新しいアイデアも取り入れながら、BusinessContentsを当てはめたバージョンを作ります。</p><p>ここに掲載しているのは、現時点でおすすめの型を中心に選んだパターン群です。これらを出発点に、図・配置・業務を組み合わせて仕上げていきます。</p><div className="outcome-formula" aria-label="AgentDiagramとSideにBusinessContentsを組み合わせる"><span>AgentDiagram</span><b>＋</b><span>Side</span><b>×</b><span>BusinessContents</span></div></div></section>
 <section className="collections" aria-label="3つの比較テーマ">{MENUS.map((menu,i)=><a className="collection" href={`#${menu.id}/${CATALOG[menu.id][0].id}`} key={menu.id}><div className="collection-top"><span>0{i+1} / {menu.label}</span><span>↗</span></div><div className={`collection-art art-${menu.id}`} aria-hidden="true"><i/><i/><i/><i/><i/></div><h2>{menu.title}</h2><p>{descriptions[i]}</p><div className="collection-bottom">{CATALOG[menu.id].length} PATTERNS <span>表示する →</span></div></a>)}</section>
 <section className="reference" aria-labelledby="reference-title"><div className="reference-heading"><div><p className="eyebrow">DESIGN REFERENCE</p><h2 id="reference-title">着想の出発点。</h2></div><p>主体と経路を一枚にまとめ、動きで処理の順番を伝える。<br/>今回のパターンを考える参考にした、Cloudflareの音声エージェント参照図です。</p></div><div className="reference-label"><span>Reference-Cloudflare-Refactored</span><span>20 SEC / 4 STEPS</span></div><div className="player-shell"><Player ref={player} playbackRate={speed} component={AgentFlowCodexReClaude} durationInFrames={TOTAL_FRAMES} fps={FPS} compositionWidth={CANVAS_W} compositionHeight={CANVAS_H} controls loop initialFrame={75} style={{width:'100%'}} errorFallback={()=> <div className="player-error" role="alert">参照図を表示できませんでした。ページを再読み込みしてください。</div>}/></div><div className="playback"><PlaybackControls player={player} speed={speed} onSpeedChange={setSpeed}/></div><div className="description"><div><p className="eyebrow">CONCEPT</p><h3>システムのつながりを、処理の流れとして見せる。</h3><p>音声エージェントを構成するサービスと、その間を流れる情報を可視化。全体の構造を保ちながら、進行中の工程へ視線を導く表現を参照しています。</p></div><div><p className="eyebrow">特徴</p><ul><li>主体と接続関係を一枚に集約</li><li>4工程のアニメーションで順番を案内</li><li>選抜パターンと見比べられる参照図</li></ul></div></div></section>
 </main>;}
