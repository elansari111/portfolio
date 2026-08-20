import { useRef, useState } from 'react'

export default function Card3D({ children, className = '', intensity = 15 }) {
    const cardRef = useRef(null)
    const [transform, setTransform] = useState('')
    const [shadow, setShadow] = useState('')

    const handleMouseMove = (e) => {
        if (!cardRef.current) return

        const card = cardRef.current
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -intensity
        const rotateY = ((x - centerX) / centerX) * intensity

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
        
        // Dynamic shadow based on rotation
        const shadowX = (rotateY / intensity) * 20
        const shadowY = (rotateX / intensity) * 20
        setShadow(`${shadowX}px ${shadowY}px 30px rgba(0, 0, 0, 0.15)`)
    }

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
        setShadow('0 10px 30px rgba(0, 0, 0, 0.1)')
    }

    return (
        <div
            ref={cardRef}
            className={`relative transition-transform duration-200 ease-out preserve-3d ${className}`}
            style={{
                transform,
                boxShadow: shadow,
                transformStyle: 'preserve-3d'
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
