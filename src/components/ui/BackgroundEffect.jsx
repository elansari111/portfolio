import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function BackgroundEffect() {
    const prefersReduced = useReducedMotion()
    
    const orb1Ref = useRef(null)
    const orb2Ref = useRef(null)
    const orb3Ref = useRef(null)

    useEffect(() => {
        if (prefersReduced) return

        // GSAP Animations for infinite smooth orbiting
        
        // Orb 1 (Primary Blue)
        gsap.to(orb1Ref.current, {
            x: '20vw',
            y: '20vh',
            scale: 1.1,
            duration: 10,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        })
        
        // Orb 2 (Sky Blue)
        gsap.to(orb2Ref.current, {
            x: '-20vw',
            y: '-20vh',
            scale: 1.1,
            duration: 12,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        })
        
        // Orb 3 (Purple)
        gsap.to(orb3Ref.current, {
            x: '10vw',
            y: '-10vh',
            duration: 15,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        })

        return () => {
            gsap.killTweensOf([orb1Ref.current, orb2Ref.current, orb3Ref.current])
        }
    }, [prefersReduced])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-transparent">
            {/* SVG Noise Texture for premium grain feel */}
            <div 
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] mix-blend-multiply dark:mix-blend-screen" 
                style={{ 
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
                    backgroundRepeat: 'repeat',
                }} 
            />
            
            {/* Primary Purple Orb */}
            <div
                ref={orb1Ref}
                className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-primary/20 dark:bg-primary/10 blur-[100px] md:blur-[140px] mix-blend-multiply dark:mix-blend-screen"
            />
            
            {/* Secondary Cyan Orb */}
            <div
                ref={orb2Ref}
                className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full bg-secondary/20 dark:bg-secondary/10 blur-[100px] md:blur-[140px] mix-blend-multiply dark:mix-blend-screen"
            />
            
            {/* Subtle Accent Orb in the center */}
            <div
                ref={orb3Ref}
                className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-fuchsia-500/10 dark:bg-fuchsia-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen"
            />
        </div>
    )
}
