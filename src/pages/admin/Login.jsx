import PageShell from '../../components/immersive/PageShell'
import SEO from '../../components/ui/SEO'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [showPw, setShowPw] = useState(false)
    const { signIn, user, isConfigured } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/admin', { replace: true })
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)

        if (!isConfigured) {
            setError('Supabase is not configured yet. Please check your .env variables.')
            setSubmitting(false)
            return
        }

        try {
            const { error: authError } = await signIn({ email: email.trim(), password })
            if (authError) {
                throw authError
            }
            navigate('/admin', { replace: true })
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'Authentication failed. Please verify your credentials.')
        } finally {
            setSubmitting(false)
        }
    }

    return <><SEO title="Workspace sign in"/><PageShell className="renew-login" label="PORTFOLIO / PRIVATE WORKSPACE"><section className="renew-login-layout"><div><p className="renew-eyebrow">BEHIND THE SCENES</p><h1>YOUR WORK.<br/><span>YOUR SPACE.</span></h1><p>Manage the projects, stories and details that make this portfolio yours.</p><ShieldCheck size={50}/></div><form onSubmit={handleSubmit} className="renew-login-form" aria-busy={submitting}><span className="renew-eyebrow">WORKSPACE ACCESS</span><h2>WELCOME BACK.</h2><p>Sign in to manage your portfolio.</p>{!isConfigured&&<p className="renew-login-warning" role="status">Authentication is not configured. Add the Supabase URL and public key to the project environment to enable sign in.</p>}{error&&<p role="alert" className="renew-login-warning">{error}</p>}<label htmlFor="admin-email">Email address<input id="admin-email" type="email" autoComplete="username" required value={email} onChange={e=>{setEmail(e.target.value);setError('')}} placeholder="you@example.com" disabled={submitting}/></label><label htmlFor="admin-password">Password<div className="renew-password"><input id="admin-password" type={showPw?'text':'password'} autoComplete="current-password" required value={password} onChange={e=>{setPassword(e.target.value);setError('')}} placeholder="Your password" disabled={submitting}/><button type="button" onClick={()=>setShowPw(!showPw)} aria-label={showPw?'Hide password':'Show password'}>{showPw?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label><button className="renew-login-submit" disabled={submitting||!isConfigured} type="submit"><span>{submitting?'Signing in…':'Sign in to workspace'}</span>{submitting?<Loader2 className="renew-spinner" size={18}/>:<ArrowUpRight size={19}/>}</button><small>Access is restricted to authorized portfolio administrators.</small></form></section></PageShell></>
}
