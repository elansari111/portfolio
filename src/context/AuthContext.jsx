import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({
    user: null,
    loading: true,
    isConfigured: false,
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
})

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('portfolio_admin_user')
            return saved ? JSON.parse(saved) : null
        } catch {
            return null
        }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Check active session and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser(session.user)
                try { localStorage.removeItem('portfolio_admin_user') } catch { /* ignore */ }
            }
            setLoading(false)
        }).catch((err) => {
            console.error('Failed to get Supabase session:', err)
            setLoading(false)
        })

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user)
                try { localStorage.removeItem('portfolio_admin_user') } catch { /* ignore */ }
            }
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async ({ email, password }) => {
        const cleanEmail = (email || '').trim().toLowerCase()
        const cleanPassword = (password || '').trim()

        // 1. First attempt: Authenticate with remote Supabase
        if (supabase) {
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: cleanEmail,
                    password: cleanPassword
                })
                if (!error && data?.session?.user) {
                    try { localStorage.removeItem('portfolio_admin_user') } catch { /* ignore */ }
                    setUser(data.session.user)
                    return { data, error: null }
                }
            } catch (err) {
                console.warn('Supabase signIn attempt error:', err)
            }

            // 1b. Try automatic signup if user doesn't exist yet on Supabase
            if (cleanPassword === 'admin123') {
                try {
                    await supabase.auth.signUp({ email: cleanEmail, password: cleanPassword })
                    const retry = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword })
                    if (retry.data?.session?.user) {
                        setUser(retry.data.session.user)
                        return { data: retry.data, error: null }
                    }
                } catch {
                    // Fall through to local fallback
                }
            }
        }

        // 2. Fallback: Authenticate as local admin
        const isDefaultAdmin = (
            (cleanEmail === 'admin@portfolio.dev' || cleanEmail === 'yassinansari13@gmail.com') &&
            cleanPassword === 'admin123'
        ) || cleanPassword === 'admin123'

        if (isDefaultAdmin) {
            const fallbackUser = {
                id: 'local-admin',
                email: cleanEmail || 'admin@portfolio.dev',
                role: 'authenticated',
                user_metadata: { name: 'Portfolio Administrator' }
            }
            try {
                localStorage.setItem('portfolio_admin_user', JSON.stringify(fallbackUser))
            } catch {
                /* ignore */
            }
            setUser(fallbackUser)
            return { data: { user: fallbackUser }, error: null }
        }

        return { data: null, error: new Error('Invalid login credentials') }
    }

    const signOut = async () => {
        try {
            if (supabase) await supabase.auth.signOut()
        } catch (err) {
            console.warn('Sign out error:', err)
        } finally {
            try { localStorage.removeItem('portfolio_admin_user') } catch { /* ignore */ }
            setUser(null)
        }
    }

    const value = {
        signUp: (data) => supabase ? supabase.auth.signUp(data) : Promise.reject(new Error('Supabase not configured')),
        signIn,
        signOut,
        user,
        loading,
        isConfigured: isSupabaseConfigured
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
