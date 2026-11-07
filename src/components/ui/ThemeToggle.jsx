import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
export default function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()
    return <button onClick={toggleTheme} className="p-3 rounded-full border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card text-gray-800 dark:text-white transition-colors shadow-sm" aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
}
