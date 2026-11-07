export function eventType(event) {
    if (/speaker|talk|presenter/i.test(event.role || '')) return 'Talks & events'
    return /hackathon|buildathon/i.test(event.title || '') ? 'Hackathons' : 'Talks & events'
}
export function eventYear(event) {
    return String(event.date || '').match(/\b(?:19|20)\d{2}\b/)?.[0] || 'Undated'
}
export function eventTimestamp(event) {
    const value = Date.parse(event.date || '')
    return Number.isFinite(value) ? value : 0
}
export function filterEvents(events, { category = 'All', year = 'All years', search = '' } = {}) {
    const query = search.trim().toLowerCase()
    return events.filter(event =>
        (category === 'All' || eventType(event) === category) &&
        (year === 'All years' || eventYear(event) === year) &&
        (!query || [event.title, event.role, event.date, event.description, event.award].filter(Boolean).join(' ').toLowerCase().includes(query))
    ).sort((a, b) => eventTimestamp(b) - eventTimestamp(a))
}
