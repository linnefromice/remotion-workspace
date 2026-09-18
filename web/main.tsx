import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player,type PlayerRef} from '@remotion/player';
import {CATALOG,MENUS,BUSINESSES,readRoute,resolveEntry,type Category} from './catalog';
import './style.css';
import {Home} from './Home';
import {PlaybackControls} from './PlaybackControls';

class PlayerBoundary extends React.Component<{children:React.ReactNode},{failed:boolean}>{
 state={failed:false};
 static getDerivedStateFromError(){return {failed:true};}
 render(){return this.state.failed?<div className="player-error" role="alert">表示を読み込めませんでした。<button onClick={()=>location.reload()}>ページを再読み込み</button></div>:this.props.children;}
}
function App(){
 const [route,setRoute]=React.useState(()=>readRoute(location.hash));
 const [speed,setSpeed]=React.useState(1);
 const [message,setMessage]=React.useState('');
 const player=React.useRef<PlayerRef>(null);
 React.useEffect(()=>{const update=()=>{setRoute(readRoute(location.hash));setMessage('');};window.addEventListener('hashchange',update);return()=>window.removeEventListener('hashchange',update);},[]);
 React.useEffect(()=>{window.scrollTo(0,0);},[route.home,route.category]);
 const menu=MENUS.find(m=>m.id===route.category)!;
 const entry=resolveEntry(route.category,route.id,route.subject);
 const key=`${route.category}/${entry.id}${route.category==='side'?'/'+route.subject:''}`;
 const duration=entry.steps.length*entry.stepLength;
 const navigate=(category:Category,id=CATALOG[category][0].id)=>{location.hash=`${category}/${id}${category==='side'?'/'+route.subject:''}`;};
 const copyLink=async()=>{try{await navigator.clipboard.writeText(location.href);setMessage('この表示のリンクをコピーしました。');}catch{setMessage('アドレスバーのURLをコピーして共有できます。');}};
 return <>
  <a className="skip" href="#content" onClick={e=>{e.preventDefault();const main=document.getElementById("content");main?.focus();main?.scrollIntoView();}}>コンテンツへ移動</a>
  <header className="site-header"><a className="brand" href="#home" aria-label="AgentFlow トップページ"><span className="brand-mark">A</span> AgentFlow <span className="brand-caption">PATTERN COLLECTION</span></a><nav className="menus" aria-label="比較するテーマ"><a href="#home" aria-current={route.home?'page':undefined}>Overview</a>{MENUS.map(m=><a key={m.id} href={`#${m.id}/${CATALOG[m.id][0].id}`} aria-current={!route.home&&route.category===m.id?'page':undefined}>{m.title}</a>)}</nav></header>
  {route.home?<Home/>:<main id="content" className="comparison" tabIndex={-1}>
   <div className="section-heading"><div><p className="eyebrow">{menu.label}</p><h1>{menu.title}</h1></div><p>{menu.intro}</p></div>
   <nav className="pattern-list" aria-label="パターンを選択">{CATALOG[route.category].map((item,i)=><button key={item.id} className={item.id===entry.id?'pattern selected':'pattern'} aria-pressed={item.id===entry.id} onClick={()=>navigate(route.category,item.id)}><span className="pattern-number">{String(i+1).padStart(2,'0')}</span><strong>{item.title}</strong>{item.recommended&&<span className="recommended">推奨</span>}</button>)}</nav>
    <section className="viewer" aria-label={entry.title+'の表示'}>
     <div className="viewer-heading"><h2>{entry.title} {entry.recommended&&<span className="recommended">推奨</span>}</h2><p>{route.category==='diagram'?'Inquiryで比較':route.category==='side'?route.subject:entry.id} <span> / {duration/30}秒 · {entry.steps.length}工程</span></p></div>
     {route.category==='side'&&<div className="subjects" aria-label="Sideの題材"><span>題材</span>{BUSINESSES.map(b=><button key={b.id} aria-pressed={route.subject===b.id} onClick={()=>{location.hash=`side/${entry.id}/${b.id}`;}}>{b.title}</button>)}</div>}
     <div className="player-shell"><PlayerBoundary key={key}><Player key={key} ref={player} component={entry.component} durationInFrames={duration} fps={30} compositionWidth={1920} compositionHeight={1080} playbackRate={speed} initialFrame={Math.floor(entry.stepLength/2)} controls loop style={{width:'100%'}} errorFallback={()=> <div className="player-error" role="alert">再生できませんでした。別のパターンを選ぶか、ページを再読み込みしてください。</div>}/></PlayerBoundary></div>
     <div className="playback"><PlaybackControls player={player} speed={speed} onSpeedChange={setSpeed}/><button className="text-button" onClick={copyLink}>この表示を共有 ↗</button></div>
     <div className="steps" aria-label="工程へ移動">{entry.steps.map((step,i)=><button key={step} onClick={()=>{player.current?.pause();player.current?.seekTo(i*entry.stepLength+Math.floor(entry.stepLength/2));}}><span>{String(i+1).padStart(2,'0')}</span>{step}</button>)}</div>
     <div className="description"><div><p className="eyebrow">CONCEPT</p><h3>{entry.tagline}</h3><p>{entry.concept}</p></div><div><p className="eyebrow">特徴</p><ul>{entry.features.map(feature=><li key={feature}>{feature}</li>)}</ul></div></div>
     <div className="view-note"><span>比較のポイント</span><p>{entry.watch}</p></div>
     <p className="status" role="status">{message}</p>
    </section>
  </main>}
  <footer><a href="#home">AgentFlow</a><span>AgentFlow Pattern Collection / Design Studies</span></footer>
 </>;
}
createRoot(document.getElementById('root')!).render(<App/>);
