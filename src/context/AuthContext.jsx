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
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Check active session and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch((err) => {
            console.error('Failed to get Supabase session:', err)
            setLoading(false)
        })

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const value = {
        signUp: (data) => supabase ? supabase.auth.signUp(data) : Promise.reject(new Error('Supabase not configured')),
        signIn: (data) => supabase ? supabase.auth.signInWithPassword(data) : Promise.reject(new Error('Supabase not configured')),
        signOut: () => supabase ? supabase.auth.signOut() : Promise.resolve(),
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
