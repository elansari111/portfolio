import { useEffect, useState } from 'react'
import { dataService } from '../lib/dataService'
import { profile as defaultProfile } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'

let cachedProfile = null

const DEFAULT_BIOS_EN = new Set([
    defaultProfile.bio,
    "I'm a Full-Stack Developer based in Morocco, passionate about building high-impact digital products, scalable backends, and immersive interactive experiences."
])

const DEFAULT_STATUS_EN = new Set([
    defaultProfile.status,
    'Available for full-time roles & select projects'
])

export function useProfile() {
    const [rawProfile, setRawProfile] = useState(() => cachedProfile || dataService.getProfile())
    const { lang, t } = useLanguage()

    useEffect(() => {
        let active = true
        dataService.fetchProfile()
            .then(data => {
                if (!active || !data) return
                cachedProfile = data
                setRawProfile(data)
            })
            .catch(() => {})
        return () => { active = false }
    }, [])

    if (lang === 'fr') {
        return {
            ...rawProfile,
            bio: DEFAULT_BIOS_EN.has(rawProfile.bio) ? t.profile.bio : rawProfile.bio,
            shortBio: rawProfile.shortBio === defaultProfile.shortBio ? t.profile.shortBio : rawProfile.shortBio,
            status: DEFAULT_STATUS_EN.has(rawProfile.status) ? t.profile.status : rawProfile.status,
            roles: Array.isArray(rawProfile.roles)
                ? rawProfile.roles.map(r => {
                    if (r === 'Software Engineer') return 'Ingénieur Logiciel'
                    if (r === 'Full-Stack Developer') return 'Développeur Full-Stack'
                    return r
                })
                : rawProfile.roles
        }
    }

    return rawProfile
}
