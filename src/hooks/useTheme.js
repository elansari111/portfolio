import { useEffect, useSyncExternalStore } from 'react'

function initialTheme() {
    try {
        const saved = localStorage.getItem('theme')
        if (saved === 'light' || saved === 'dark') return saved
    } catch { /* Storage is optional. */ }
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}
let currentTheme = initialTheme()
const eventName = 'portfolio-theme-change'
function subscribe(listener) {
    const onStorage = event => {
        if (event.key === 'theme') {
            currentTheme = event.newValue === 'light' ? 'light' : 'dark'
            listener()
        }
    }
    window.addEventListener(eventName, listener)
    window.addEventListener('storage', onStorage)
    return () => {
        window.removeEventListener(eventName, listener)
        window.removeEventListener('storage', onStorage)
    }
}
export function useTheme() {
    const theme = useSyncExternalStore(subscribe, () => currentTheme)
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark')
        document.documentElement.style.colorScheme = theme
    }, [theme])
    const toggleTheme = () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
        try { localStorage.setItem('theme', currentTheme) } catch { /* Keep the session preference. */ }
        window.dispatchEvent(new Event(eventName))
    }
    return { theme, isDark: theme === 'dark', toggleTheme }
}
