import { useEffect, useState } from 'react'

/**
 * Returns true if the user has requested reduced motion
 * via the prefers-reduced-motion media query.
 */
export function useReducedMotion() {
    const [reduced, setReduced] = useState(() => {
        if (typeof window === 'undefined') return false
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    })

    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handler = (e) => setReduced(e.matches)
        mq.addEventListener('change', handler)
        return () => mq.removeEventListener('change', handler)
    }, [])

    return reduced
}
