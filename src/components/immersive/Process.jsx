import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useLanguage } from '../../context/LanguageContext'

export default function Process(){
 const { t } = useLanguage()
 const steps = t.process.steps
 const host=useRef(null), canvas=useRef(null), progress=useRef(0), [active,setActive]=useState(0), reduced=useReducedMotion()
 useEffect(()=>{
  const el=host.current, cv=canvas.current, ctx=cv.getContext('2d');if(!ctx)return
  const stencil=document.createElement('canvas');stencil.width=360;stencil.height=360;const pen=stencil.getContext('2d')
  const icons = [
   'M100 65 L225 65 L225 180 M100 65 L100 280 L190 280 M120 100 L200 100 M120 125 L190 125 M120 150 L165 150 M120 175 L150 175 M235 210 A45 45 0 1 0 145 210 A45 45 0 1 0 235 210 M222 243 L260 282',
   'M65 80 L295 80 L295 270 L65 270 Z M65 110 L295 110 M82 95 L88 95 M100 95 L106 95 M118 95 L124 95 M135 145 L105 175 L135 205 M220 145 L250 175 L220 205 M190 135 L165 215 M100 245 L155 245',
   'M100 65 L260 65 L260 290 L100 290 Z M140 55 L220 55 L220 85 L140 85 Z M120 125 L130 135 L150 110 M170 125 L235 125 M120 185 L130 195 L150 170 M170 185 L235 185 M120 245 L130 255 L150 230 M170 245 L235 245',
   'M80 75 L280 75 L280 125 L80 125 Z M80 145 L280 145 L280 195 L80 195 Z M100 100 L110 100 M100 170 L110 170 M220 100 L260 100 M220 170 L260 170 M80 240 L120 240 L140 215 L165 280 L190 230 L210 240 L280 240',
  ]
  const targets=icons.map(d=>{pen.clearRect(0,0,360,360);pen.strokeStyle='#fff';pen.lineWidth=3;pen.stroke(new Path2D(d));const data=pen.getImageData(0,0,360,360).data, points=[];for(let y=0;y<360;y+=2)for(let x=0;x<360;x+=2)if(data[(y*360+x)*4+3]>80)points.push([x-180,y-180]);return points})
  const count=1500, points=Array.from({length:count},(_,i)=>({x:0,y:0,seed:i*2.39996}));let raf, current=0, last=0, visible=false,w=1,h=1
  const resize=()=>{const r=cv.getBoundingClientRect();w=r.width;h=r.height;const d=Math.min(devicePixelRatio||1,2);cv.width=w*d;cv.height=h*d;ctx.setTransform(d,0,0,d,0,0)}
  const ro=new ResizeObserver(resize);ro.observe(cv)
  const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});io.observe(el)
  const onScroll=()=>{const r=el.getBoundingClientRect();progress.current=Math.max(0,Math.min(3,-r.top/Math.max(1,r.height-innerHeight)*3));setActive(Math.round(progress.current))};window.addEventListener('scroll',onScroll,{passive:true});onScroll()
  const draw=now=>{raf=requestAnimationFrame(draw);const dt=Math.min((now-(last||now))/1000,.04);last=now;if(!visible||document.hidden)return;const target=Math.round(progress.current);current=reduced?target:current+(target-current)*Math.min(1,dt*6.5);if(Math.abs(current-target)<.002)current=target;const a=Math.floor(current),b=Math.min(3,a+1),mix=current-a;ctx.clearRect(0,0,w,h);const style=getComputedStyle(el),colour=style.getPropertyValue('--im-accent').trim();ctx.fillStyle=colour;const scale=Math.min(w,h)/360*1.05;points.forEach((point,i)=>{const pa=targets[a][i%targets[a].length],pb=targets[b][(i*7)%targets[b].length];const x=pa[0]+(pb[0]-pa[0])*mix,y=pa[1]+(pb[1]-pa[1])*mix;const drift=reduced?0:Math.sin(now*.001+point.seed)*1.8;point.x=x;point.y=y;ctx.globalAlpha=.45+(i%5)*.12;ctx.beginPath();ctx.arc(w/2+(x+drift)*scale,h/2+(y+drift)*scale,1.1+(i%3)*.2,0,Math.PI*2);ctx.fill()});ctx.globalAlpha=1};raf=requestAnimationFrame(draw)
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();window.removeEventListener('scroll',onScroll)}
 },[reduced])
 const go=i=>window.scrollTo({top:host.current.offsetTop+(host.current.offsetHeight-innerHeight)*i/3,behavior:reduced?'auto':'smooth'})
 return <section className="im-process" ref={host} id="process" aria-labelledby="im-process-title"><div className="im-process-compact"><p className="im-kicker">{t.process.compactKicker}</p><h2>{t.process.title}</h2><ol>{steps.map((step,i)=><li key={step.title}><span className="im-kicker">0{i+1} / 04</span><h3>{step.title}</h3><p>{step.text}</p><div className="im-tags">{step.tags.map(tag=><span key={tag}>{tag}</span>)}</div></li>)}</ol></div><div className="im-process-sticky"><div className="im-section-caption"><span>{t.process.captionLeft}</span><span>{t.process.captionRight}</span></div><h2 id="im-process-title">{t.process.title}</h2><canvas ref={canvas} className="im-particles" aria-hidden="true"/><div className="im-process-copy" aria-live="polite"><span className="im-kicker">0{active+1} / 04</span><h3 key={active}>{steps[active].title}</h3><p>{steps[active].text}</p><div className="im-tags">{steps[active].tags.map(tag=><span key={tag}>{tag}</span>)}</div></div><div className="im-process-rail" aria-label="Process steps">{steps.map((step,i)=><button key={step.title} onClick={()=>go(i)} aria-current={active===i?'step':undefined}><span style={{transform:`scaleX(${Math.max(0,Math.min(1,active-i+1))})`}}/>{step.title}</button>)}</div></div></section>
}
