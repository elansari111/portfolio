import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import Chatbot from '../ui/Chatbot'
import SmoothScroll from '../ui/SmoothScroll'
import BackgroundEffect from '../ui/BackgroundEffect'

export default function Layout({ children }) {
    return (
        <SmoothScroll>
            <div className="min-h-screen flex flex-col bg-transparent text-black dark:text-white transition-colors duration-300 relative">
                <BackgroundEffect />
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
                <ScrollToTop />
                <Chatbot />
            </div>
        </SmoothScroll>
    )
}
