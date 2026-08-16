import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!supabase) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                <div className="max-w-md w-full text-center p-8 bg-gray-900 rounded-2xl border border-red-500/50 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-4 text-red-500">Configuration Required</h1>
                    <p className="text-gray-300 mb-6">
                        Please set your Supabase credentials in the <code className="bg-gray-800 px-2 py-1 rounded text-purple-400 font-mono text-sm">.env</code> file.
                    </p>
                    <div className="bg-black/50 p-4 rounded-lg text-left text-sm font-mono text-gray-400 overflow-x-auto">
                        <p>VITE_SUPABASE_URL=...</p>
                        <p>VITE_SUPABASE_ANON_KEY=...</p>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">Restart the server after saving changes.</p>
                </div>
            </div>
        )
    }

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
        loading
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
