import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
    const cursorRef = useRef(null)
    const cursorLabelRef = useRef(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const cursorLabel = cursorLabelRef.current

        if (!cursor) return

        // Move cursor
        const moveCursor = (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            })
            gsap.to(cursorLabel, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15,
                ease: 'power2.out'
            })
        }

        window.addEventListener('mousemove', moveCursor)

        // Handle Hover States
        // We will use a data-attribute 'data-hover' on elements to trigger cursor changes
        const handleMouseOver = (e) => {
            const target = e.target.closest('[data-hover]')
            if (target) {
                gsap.to(cursor, {
                    scale: 4,
                    backgroundColor: '#ffffff',
                    mixBlendMode: 'difference',
                    duration: 0.3
                })
                // If the element has a label text
                const label = target.getAttribute('data-hover-label')
                if (label && cursorLabel) {
                    cursorLabel.innerText = label
                    gsap.to(cursorLabel, { opacity: 1, scale: 1, duration: 0.3 })
                }
            }
        }

        const handleMouseOut = (e) => {
            const target = e.target.closest('[data-hover]')
            if (target) {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: 'white',
                    mixBlendMode: 'normal',
                    duration: 0.3
                })
                if (cursorLabel) {
                    gsap.to(cursorLabel, { opacity: 0, scale: 0, duration: 0.3 })
                }
            }
        }

        document.addEventListener('mouseover', handleMouseOver)
        document.addEventListener('mouseout', handleMouseOut)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
        }
    }, [])

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block mix-blend-difference"
            />
            <div
                ref={cursorLabelRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 text-black text-[10px] font-bold uppercase tracking-widest opacity-0 hidden md:flex items-center justify-center"
            >
                View
            </div>
        </>
    )
}
