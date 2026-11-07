import { useRef } from 'react'

export default function Card3D({ children, className = '', intensity = 15 }) {
    const cardRef = useRef(null)
    const rafId = useRef(null)

    const handleMouseMove = (e) => {
        if (!cardRef.current) return

        if (rafId.current) cancelAnimationFrame(rafId.current)

        rafId.current = requestAnimationFrame(() => {
            const card = cardRef.current
            if (!card) return
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const centerX = rect.width / 2
            const centerY = rect.height / 2

            const rotateX = ((y - centerY) / centerY) * -intensity
            const rotateY = ((x - centerX) / centerX) * intensity

            const shadowX = (rotateY / intensity) * 16
            const shadowY = (rotateX / intensity) * 16

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
            card.style.boxShadow = `${shadowX}px ${shadowY}px 28px rgba(0, 0, 0, 0.18)`
        })
    }

    const handleMouseLeave = () => {
        if (rafId.current) cancelAnimationFrame(rafId.current)
        const card = cardRef.current
        if (card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)'
        }
    }

    return (
        <div
            ref={cardRef}
            className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
            style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Reflection overlay */}
            <div 
                className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none rounded-2xl"
                style={{
                    transform: 'translateZ(1px)'
                }}
            />
            {children}
        </div>
    )
}
