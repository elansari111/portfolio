import { useLayoutEffect, useRef, useState } from 'react'
import Folder from './Folder'
export default function ResponsiveFolder({ size = 1.15, mode = 'flap', ...props }) {
 const host = useRef(null)
 const [width, setWidth] = useState(220)
 useLayoutEffect(() => {
  const element = host.current
  const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
  observer.observe(element)
  return () => observer.disconnect()
 }, [])
 // Leave space for documents when the folder opens, not only its closed cover.
 const scale = Math.min(size, width / ((mode === 'book' ? 180 * 2.7 : 224 * 1.6)))
 return <div ref={host} className="responsive-folder-frame"><Folder {...props} size={scale} mode={mode}/></div>
}
