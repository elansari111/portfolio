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
            className="p-2 rounded-full border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Theme"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
