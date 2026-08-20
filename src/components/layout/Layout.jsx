import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-transparent text-black dark:text-white transition-colors duration-300 relative">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <ScrollToTop />
        </div>
    )
}
