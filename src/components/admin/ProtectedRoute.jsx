import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()
    const isLocalAdmin = localStorage.getItem('portfolio_admin_auth') === 'true'

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>
    }

    if (!user && !isLocalAdmin) {
        return <Navigate to="/login" replace />
    }

    return children
}
