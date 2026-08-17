import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'
import Chatbot from '../ui/Chatbot'
import SmoothScroll from '../ui/SmoothScroll'

export default function Layout({ children }) {
    return (
        <SmoothScroll>
            <div className="min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
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
