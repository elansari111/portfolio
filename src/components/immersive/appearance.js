export const palettes = [
    { name: 'Plum', bg: '#310744', fg: '#faeeff', accent: '#df36ed', lightAccent: '#9b1eaa' },
    { name: 'Forest', bg: '#073424', fg: '#ebf9e5', accent: '#65dd94', lightAccent: '#167447' },
    { name: 'Midnight', bg: '#101c48', fg: '#edf1ff', accent: '#86a6ff', lightAccent: '#345baf' },
    { name: 'Ember', bg: '#46170e', fg: '#fff1e4', accent: '#ff8355', lightAccent: '#b33b17' },
    { name: 'Black', bg: '#000000', fg: '#f5f5f5', accent: '#c4c4c4', lightAccent: '#4a4a4a' },
]
const defaultPalette = palettes.findIndex(palette => palette.name === 'Black')
export function readPalette() {
    try {
        const saved = sessionStorage.getItem('portfolio-palette')
        const value = saved === null || saved.trim() === '' ? defaultPalette : Number(saved)
        return Number.isInteger(value) && value >= 0 && value < palettes.length ? value : defaultPalette
    } catch { return defaultPalette }
}
export function appearanceTokens(index, isDark) {
    const palette = palettes[index] || palettes[defaultPalette]
    return {
        '--im-bg': isDark ? palette.bg : palette.fg,
        '--im-fg': isDark ? palette.fg : palette.bg,
        '--im-accent': isDark ? palette.accent : palette.lightAccent,
        '--im-ink': palette.bg,
        '--im-nav-fg': palette.fg,
        '--im-card-accent': palette.lightAccent,
        '--im-footer-ink': isDark ? palette.bg : palette.fg,
    }
}
