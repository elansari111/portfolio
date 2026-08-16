import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Pages
import Home from './pages/public/Home'
import Projects from './pages/public/Projects'
import Skills from './pages/public/Skills'
import Experience from './pages/public/Experience'
import Contact from './pages/public/Contact'
import Certificates from './pages/public/Certificates' // New Import
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Layout><Home /></Layout>} />
                    <Route path="/projects" element={<Layout><Projects /></Layout>} />
                    <Route path="/skills" element={<Layout><Skills /></Layout>} />
                    <Route path="/experience" element={<Layout><Experience /></Layout>} />
                    <Route path="/contact" element={<Layout><Contact /></Layout>} />
                    <Route path="/certificates" element={<Layout><Certificates /></Layout>} />

                    {/* Admin Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
