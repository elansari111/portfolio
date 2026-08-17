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
                primary: '#3B82F6',
                secondary: '#38bdf8',
                success: '#00bb7f',
                dark: {
                    bg: '#000000',
                    card: '#0d0d0f',
                    border: 'rgba(255,255,255,0.1)'
                }
            },
            fontFamily: {
                sans: ['Satoshi', 'sans-serif'],
                heading: ['Clash Display', 'sans-serif'],
                pixel: ['"Press Start 2P"', 'cursive'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
