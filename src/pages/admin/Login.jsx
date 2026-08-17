import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'

// Simple local auth — password stored in env var (VITE_ADMIN_PASSWORD)
// Default: "admin123" — change in .env for production
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const SESSION_KEY = 'portfolio_admin_auth'

export function isAdminAuthenticated() {
    return localStorage.getItem(SESSION_KEY) === 'true'
}

export default function Login() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [showPw, setShowPw] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem(SESSION_KEY, 'true')
            navigate('/admin')
        } else {
            setError('Incorrect password.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-10">
                    <span className="text-4xl font-heading font-bold text-white">
                        Y<span className="text-primary">↗</span>
                    </span>
                    <h1 className="text-xl font-heading font-bold text-white mt-3">Admin Access</h1>
                    <p className="text-gray-500 text-sm mt-1">Sign in to manage your portfolio</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 space-y-5">
                    <div className="relative">
                        <label htmlFor="password" className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError('') }}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 pr-11 text-white text-sm outline-none focus:border-primary transition-colors"
                                placeholder="Enter admin password"
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                aria-label={showPw ? 'Hide password' : 'Show password'}
                            >
                                {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                        </div>
                        {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                        <Lock size={16} />
                        Sign In
                    </button>

                    <p className="text-gray-600 text-xs text-center">
                        Default password: <code className="text-gray-400">admin123</code><br />
                        Set <code className="text-gray-400">VITE_ADMIN_PASSWORD</code> in .env to change it.
                    </p>
                </form>
            </div>
        </div>
    )
}
