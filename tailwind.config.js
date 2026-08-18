/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#8B5CF6',
                secondary: '#06B6D4',
                success: '#10B981',
                dark: {
                    bg: '#05050A',
                    card: 'rgba(20, 20, 30, 0.6)',
                    border: 'rgba(255,255,255,0.1)'
                },
                light: {
                    bg: '#F8FAFC',
                    card: 'rgba(255, 255, 255, 0.7)',
                    border: 'rgba(0,0,0,0.1)'
                }
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                heading: ['Space Grotesk', 'sans-serif'],
                pixel: ['"Press Start 2P"', 'cursive'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
