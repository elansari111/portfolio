import { useEffect, useState } from 'react'
import { dataService } from '../lib/dataService'

let cachedProfile = null

export function useProfile() {
    const [profile, setProfile] = useState(() => cachedProfile || dataService.getProfile())

    useEffect(() => {
        let active = true
        dataService.fetchProfile()
            .then(data => {
                if (!active || !data) return
                cachedProfile = data
                setProfile(data)
            })
            .catch(() => {})
        return () => { active = false }
    }, [])

    return profile
}

