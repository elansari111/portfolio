import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(true); // Default to dark as requested

    useEffect(() => {
        // Initialize from local storage or default to true
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card backdrop-blur-md text-gray-800 dark:text-white hover:bg-white/80 dark:hover:bg-white/10 transition-all shadow-sm"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={20} className="text-primary" /> : <Moon size={20} className="text-primary" />}
        </button>
    );
}
