import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { Code2, Layers, Cpu, Globe, ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useLanguage } from '../../context/LanguageContext'

export default function Badge({ profile, ready }) {
 const { t } = useLanguage()
 const host = useRef(null), card = useRef(null), rope = useRef(null), rig = useRef({ x: 0, y: -440, vx: 0, vy: 0, angle: 0, flip: 0, target: 0, dragging: false, tx: 0, ty: 0, tilt: 0, moved: false })
 const [back, setBack] = useState(false)
 const ribbonId = useId().replace(/:/g, '')
 const reduced = useReducedMotion()
 useLayoutEffect(() => {
  const stage = host.current
  const hero = stage.closest('.im-hero')
  const heading = hero.querySelector('.im-hero-name')
  const bottom = hero.querySelector('.im-hero-bottom')
  const layout = () => {
   const compact = hero.clientWidth <= 900
   const top = heading.offsetTop + heading.offsetHeight + (compact ? 24 : 16)
   const limit = bottom.offsetTop - (compact ? 62 : 20)
   const available = Math.max(180, limit - top)
   const width = Math.min(hero.clientWidth <= 640 ? 290 : 360, hero.clientWidth - 64, available / 1.41)
   const y = top + Math.max(0, (available - width * 1.41) / 2)
   stage.style.setProperty('--badge-width', `${width}px`)
   stage.style.setProperty('--badge-top', `${y}px`)
  }
  const observer = new ResizeObserver(layout)
  ;[hero, heading, bottom].forEach(element => observer.observe(element))
  layout()
  document.fonts.ready.then(layout)
  return () => observer.disconnect()
 }, [])
 const flip = () => { rig.current.target += 180; setBack(Math.round(rig.current.target / 180) % 2 === 1) }
 useEffect(() => {
  if (!ready) return
  const el = host.current, badge = card.current, path = rope.current, s = rig.current
  let frame, last = 0, visible = true
  if (reduced) s.y = 0
  const observer = new IntersectionObserver(([entry]) => {visible=entry.isIntersecting}); observer.observe(el)
  const tick = now => {
   frame = requestAnimationFrame(tick)
   const dt = Math.min((now-(last || now))/1000,.025); last = now
   if (!visible || document.hidden) return
   if (!reduced) {
    const stiffness=s.dragging?170:32, damping=s.dragging?20:7
    s.vx += ((s.dragging?s.tx:0)-s.x)*stiffness*dt-s.vx*damping*dt
    s.vy += ((s.dragging?s.ty:0)-s.y)*stiffness*dt-s.vy*damping*dt
    s.x += s.vx*dt; s.y += s.vy*dt
   } else { s.x=s.dragging?s.tx:0;s.y=s.dragging?s.ty:0 }
   s.flip += (s.target-s.flip)*Math.min(1,dt*(reduced?40:9))
   s.angle += ((-2+s.x*.06+s.vx*.025)-s.angle)*Math.min(1,dt*6)
   badge.style.transform=`translate3d(${s.x}px,${s.y}px,0) rotate(${s.angle}deg) rotateY(${s.flip+s.tilt}deg)`
   const rect=el.getBoundingClientRect(), x=rect.width/2+s.x, y=badge.parentElement.offsetTop+s.y
   path.setAttribute('d',`M ${rect.width/2} -25 Q ${rect.width/2-s.x*.25} ${Math.max(0,y*.5)} ${x} ${y}`)
  }; frame=requestAnimationFrame(tick)
  const scroll = () => { if(visible && !s.dragging && !reduced)s.vx+=Math.min(15,Math.abs(window.scrollY-s.previousScroll || 0));s.previousScroll=window.scrollY }
  window.addEventListener('scroll',scroll,{passive:true})
  return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',scroll)}
 },[ready,reduced])
 const down=e=>{if(e.button>0)return;const s=rig.current;s.dragging=true;s.moved=false;s.startX=e.clientX;s.startY=e.clientY;s.originX=s.x;s.originY=s.y;s.tx=s.x;s.ty=s.y;e.currentTarget.setPointerCapture(e.pointerId)}
 const move=e=>{const s=rig.current;if(s.dragging){s.moved ||= Math.hypot(e.clientX-s.startX,e.clientY-s.startY)>6;s.tx=Math.max(-150,Math.min(150,s.originX+e.clientX-s.startX));s.ty=Math.max(-130,Math.min(100,s.originY+e.clientY-s.startY))}else if(!reduced && e.pointerType==='mouse'){const r=e.currentTarget.getBoundingClientRect();s.tilt=(e.clientX-r.left-r.width/2)/r.width*16}}
 return <div className="im-badge-stage" ref={host}><svg className="im-lanyard" aria-hidden="true"><defs><linearGradient id={`${ribbonId}-shine`} gradientUnits="userSpaceOnUse" x1="49.4%" x2="50.6%" y1="0" y2="0"><stop offset="0" stopColor="var(--im-accent)"/><stop offset=".5" stopColor="#ffffff" stopOpacity=".75"/><stop offset="1" stopColor="var(--im-accent)"/></linearGradient></defs><path ref={rope} id={`${ribbonId}-path`} style={{stroke:`url(#${ribbonId}-shine)`}}/><text><textPath href={`#${ribbonId}-path`} startOffset="35">✦ BUILD. SHIP. REPEAT. ✦ BUILD. SHIP. REPEAT.</textPath></text></svg><div className="im-badge-anchor"><div className="im-badge" ref={card} onPointerDown={down} onPointerMove={move} onPointerUp={()=>{const s=rig.current;s.dragging=false;if(!s.moved)flip()}} onPointerCancel={()=>{rig.current.dragging=false}} onPointerLeave={()=>{rig.current.tilt=0}}><div className="im-badge-clip"/><div className="im-badge-face im-badge-front"><div className="im-pass-label">{t.badge.passLabel} <span>YE—001</span></div><img className="im-pass-photo" src={profile.avatar} alt={profile.name} draggable="false"/><div className="im-pass-name">{profile.name}</div><p className="im-pass-role">{t.badge.role1}<br/>{t.badge.role2}</p><div className="im-pass-status"><span><i/> {t.badge.available}<br/><small>{t.badge.basedIn}</small></span><em>{profile.firstName}</em></div><div className="im-pass-bottom"><span className="im-barcode"/><span>BUILD. SHIP. REPEAT. ↗</span></div></div><div className="im-badge-face im-badge-back"><div className="im-pass-label">{t.badge.expertiseTitle} <ArrowUpRight size={22}/></div>{[{icon:Code2,title:t.badge.exp1Title,text:t.badge.exp1Text},{icon:Layers,title:t.badge.exp2Title,text:t.badge.exp2Text},{icon:Cpu,title:t.badge.exp3Title,text:t.badge.exp3Text},{icon:Globe,title:t.badge.exp4Title,text:t.badge.exp4Text}].map(({icon:Icon,title,text})=><div key={title} className="im-expertise-row"><Icon size={20}/><div><b>{title}</b><small>{text}</small></div></div>)}<em>{t.home.portraitNote1}<br/>{t.home.portraitNote2}</em><div className="im-pass-bottom"><small>{profile.socials.email.replace('mailto:','')}</small><span className="im-barcode"/></div></div></div></div><button className="im-flip-button" onClick={flip} aria-label={`Flip portfolio pass to ${back?'front':'expertise'}`}>{t.badge.flipBtn} <span>{t.badge.flipHint}</span></button></div>
}
