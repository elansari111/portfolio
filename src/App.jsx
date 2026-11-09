import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/admin/ProtectedRoute'

// Public Pages (Home loaded eagerly for fast first paint, other pages lazy loaded)
import Home from './pages/public/Home'
const Projects = lazy(() => import('./pages/public/Projects'))
const Skills = lazy(() => import('./pages/public/Skills'))
const Experience = lazy(() => import('./pages/public/Experience'))
const Events = lazy(() => import('./pages/public/Events'))
const Contact = lazy(() => import('./pages/public/Contact'))
const Certificates = lazy(() => import('./pages/public/Certificates'))
const Blogs = lazy(() => import('./pages/public/Blogs'))
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'))
const NotFound = lazy(() => import('./pages/public/NotFound'))

// Admin Pages
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))

function PageLoader() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-gray-500 font-mono tracking-wider">LOADING...</span>
            </div>
        </div>
    )
}

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/skills" element={<Skills />} />
                        <Route path="/experience" element={<Experience />} />
                        <Route path="/events" element={<Events />} />
                        <Route path="/hackathons" element={<Navigate to="/events" replace />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/certificates" element={<Certificates />} />
                        <Route path="/blogs" element={<Blogs />} />
                        <Route path="/blogs/:slug" element={<BlogDetail />} />

                        {/* Admin Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </Router>
            </AuthProvider>
        </LanguageProvider>
    )
}

export default App
