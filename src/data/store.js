/**
 * Local CMS store — reads from localStorage, falls back to default JS data files.
 * The admin panel writes here; public pages read from here.
 */
import { profile as defaultProfile } from './profile'
import { projects as defaultProjects } from './projects'
import { posts as defaultPosts } from './posts'
import { experience as defaultExperience } from './experience'
import { skills as defaultSkills } from './skills'
import { events as defaultEvents } from './events'

const KEYS = {
    profile: 'cms_profile',
    projects: 'cms_projects',
    posts: 'cms_posts',
    experience: 'cms_experience',
    skills: 'cms_skills',
    events: 'cms_events',
}

function load(key, fallback) {
    try {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : fallback
    } catch {
        return fallback
    }
}

function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export const store = {
    // ── Getters ──────────────────────────────────────────
    getProfile:    () => load(KEYS.profile, defaultProfile),
    getProjects:   () => load(KEYS.projects, defaultProjects),
    getPosts:      () => load(KEYS.posts, defaultPosts),
    getExperience: () => load(KEYS.experience, defaultExperience),
    getSkills:     () => load(KEYS.skills, defaultSkills),
    getEvents:     () => load(KEYS.events, defaultEvents),

    // ── Setters ──────────────────────────────────────────
    saveProfile:    (data) => save(KEYS.profile, data),
    saveProjects:   (data) => save(KEYS.projects, data),
    savePosts:      (data) => save(KEYS.posts, data),
    saveExperience: (data) => save(KEYS.experience, data),
    saveSkills:     (data) => save(KEYS.skills, data),
    saveEvents:     (data) => save(KEYS.events, data),

    // ── Reset to defaults ────────────────────────────────
    reset: (key) => localStorage.removeItem(KEYS[key]),
    resetAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
}
