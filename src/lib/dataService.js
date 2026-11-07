import { supabase } from './supabase'
import { projects as defaultProjects } from '../data/projects'
import { skills as defaultSkills } from '../data/skills'
import { experience as defaultExperience } from '../data/experience'
import { posts as defaultPosts } from '../data/posts'
import { profile as defaultProfile } from '../data/profile'
import { events as defaultEvents } from '../data/events'

// Default fallback certificates if database table is empty or offline
export const defaultCertificates = [
    {
        id: 1,
        title: 'AWS Certified Solutions Architect — Associate',
        issuer: 'Amazon Web Services',
        date: '2024-04-12',
        credential_url: 'https://aws.amazon.com/verification',
        image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 2,
        title: 'Meta Professional Full-Stack Developer',
        issuer: 'Meta Platforms Inc.',
        date: '2023-11-20',
        credential_url: 'https://coursera.org/verify/meta-fullstack',
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 3,
        title: 'HashiCorp Certified: Terraform Associate',
        issuer: 'HashiCorp',
        date: '2023-07-15',
        credential_url: 'https://hashicorp.com/certifications',
        image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 4,
        title: 'PostgreSQL 15 Advanced DBA & Optimization',
        issuer: 'PostgreSQL Professional Institute',
        date: '2022-12-05',
        credential_url: 'https://postgresql.org',
        image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop'
    }
]

export const dataService = {
    // ── Projects ──────────────────────────────────────────
    async getProjects() {
        if (!supabase) return defaultProjects
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('created_at', { ascending: false })

            if (error || !data || data.length === 0) return defaultProjects

            // Filter out dummy test items
            const valid = data.filter(item => item.title && item.title.trim().length > 2 && item.title.toLowerCase() !== 'cc')
            if (valid.length === 0) return defaultProjects

            return valid.map((item, idx) => ({
                id: item.id || `proj-${idx}`,
                slug: item.slug || `project-${item.id || idx}`,
                title: item.title,
                year: item.year || new Date(item.created_at || Date.now()).getFullYear().toString(),
                tags: (item.tags && item.tags.length > 0) ? item.tags : ['Full-Stack', 'Web'],
                coverImage: item.image_url || defaultProjects[idx % defaultProjects.length]?.coverImage,
                accentColor: item.accent_color || defaultProjects[idx % defaultProjects.length]?.accentColor || '#3B82F6',
                description: item.description || '',
                longDescription: item.long_description || item.description || '',
                gallery: item.gallery || [item.image_url || defaultProjects[0]?.coverImage].filter(Boolean),
                stack: item.tags || [],
                liveUrl: item.demo_url || '#',
                repoUrl: item.repo_url || '#'
            }))
        } catch {
            return defaultProjects
        }
    },

    // ── Skills ────────────────────────────────────────────
    async getSkills() {
        if (!supabase) return defaultSkills
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('name', { ascending: true })

            if (error || !data || data.length === 0) return defaultSkills
            return data
        } catch {
            return defaultSkills
        }
    },

    // ── Experience ────────────────────────────────────────
    async getExperiences() {
        if (!supabase) return defaultExperience
        try {
            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .order('created_at', { ascending: false })

            if (error || !data || data.length === 0) return defaultExperience

            return data.map((item, idx) => ({
                id: item.id || idx + 1,
                title: item.role || item.title,
                role: item.role || item.title,
                company: item.company,
                period: item.period || `${item.startDate || ''} - ${item.endDate || ''}`,
                description: item.description,
                type: item.type || 'work',
                color: item.color || defaultExperience[idx % defaultExperience.length]?.color || '#8B5CF6',
                icon: item.icon || 'Laptop'
            }))
        } catch {
            return defaultExperience
        }
    },

    // ── Certificates ──────────────────────────────────────
    async getCertificates() {
        if (!supabase) return defaultCertificates
        try {
            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .order('date', { ascending: false })

            if (error || !data || data.length === 0) return defaultCertificates
            return data
        } catch {
            return defaultCertificates
        }
    },

    // ── Messages (Contact Form) ───────────────────────────
    async saveMessage(payload) {
        if (!supabase) {
            console.warn('Supabase not configured, message not saved to database.')
            return { success: true, localOnly: true }
        }
        const { data, error } = await supabase
            .from('messages')
            .insert([{
                name: payload.name,
                email: payload.email,
                message: payload.message,
                read: false,
                created_at: new Date().toISOString()
            }])
        if (error) throw error
        return { success: true, data }
    },

    async getMessages() {
        if (!supabase) return []
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) throw error
        return data || []
    },

    async markMessageRead(id, read = true) {
        if (!supabase) return
        const { error } = await supabase
            .from('messages')
            .update({ read })
            .eq('id', id)
        if (error) throw error
    },

    async deleteMessage(id) {
        if (!supabase) return
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id)
        if (error) throw error
    },

    // ── Profile, Posts & Events ───────────────────────────
    getProfile() {
        return defaultProfile
    },
    getPosts() {
        return defaultPosts
    },
    getEvents() {
        return defaultEvents
    }
}
