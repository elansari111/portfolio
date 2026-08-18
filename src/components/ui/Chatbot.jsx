import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'
import gsap from 'gsap'
import { store } from '../../data/store'

const profile = store.getProfile()
const skills = store.getSkills()
const experience = store.getExperience()

const faqData = [
    { keywords: ['hello', 'hi', 'hey', 'bonjour', 'salut'], answer: `Hey! 👋 I'm ${profile.firstName}'s portfolio assistant. Ask me anything about his skills, experience, or how to reach him!` },
    { keywords: ['name', 'who', 'about'], answer: `This is the portfolio of ${profile.name} — ${profile.roles.join(' & ')}. ${profile.shortBio}` },
    { keywords: ['skill', 'tech', 'stack', 'tools'], answer: `${profile.firstName} works with: ${skills.map(s => s.name).join(', ')}.` },
    { keywords: ['experience', 'work', 'job'], answer: experience.map(e => `• ${e.title} at ${e.company} (${e.startDate} – ${e.endDate})`).join('\n') },
    { keywords: ['contact', 'email', 'reach', 'hire'], answer: `You can reach ${profile.firstName} at ${profile.socials.email.replace('mailto:', '')} or visit the Contact page!` },
    { keywords: ['resume', 'cv'], answer: `You can download ${profile.firstName}'s resume from the hero section or ask him directly via email.` },
    { keywords: ['available', 'status', 'freelance'], answer: `Current status: ${profile.status} ✅` },
]

function getAnswer(input) {
    const lower = input.toLowerCase()
    for (const faq of faqData) {
        if (faq.keywords.some(k => lower.includes(k))) return faq.answer
    }
    return `I'm not sure about that! Try asking about skills, experience, or contact info. 🤔`
}

export default function Chatbot() {
    const [open, setOpen] = useState(false)
    const [render, setRender] = useState(false) // Controls actual mounting for exit animations
    const [messages, setMessages] = useState([
        { from: 'bot', text: `Hey! 👋 I'm ${profile.firstName}'s portfolio assistant. Ask me anything!` }
    ])
    const [input, setInput] = useState('')
    
    const endRef = useRef(null)
    const panelRef = useRef(null)

    // Handle scroll to bottom
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, render])

    // GSAP Mount/Unmount logic
    useEffect(() => {
        if (open) {
            setRender(true) // Mount the component
        } else if (render && panelRef.current) {
            // Animate out before unmounting
            gsap.to(panelRef.current, {
                opacity: 0,
                y: 20,
                scale: 0.95,
                duration: 0.2,
                ease: 'power2.in',
                onComplete: () => setRender(false)
            })
        }
    }, [open, render])

    // GSAP Entry Animation
    useEffect(() => {
        if (open && render && panelRef.current) {
            gsap.fromTo(panelRef.current,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.2)' }
            )
        }
    }, [render, open])

    const handleSend = () => {
        if (!input.trim()) return
        const userMsg = { from: 'user', text: input }
        const botMsg = { from: 'bot', text: getAnswer(input) }
        setMessages(prev => [...prev, userMsg, botMsg])
        setInput('')
    }

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-6 right-20 z-40 bg-dark-card hover:bg-primary border border-white/10 text-white p-3.5 rounded-full backdrop-blur-lg shadow-xl transition-all duration-300"
                aria-label="Chat"
            >
                {open ? <X size={20} /> : <MessageCircle size={20} />}
            </button>

            {/* Chat panel */}
            {render && (
                <div
                    ref={panelRef}
                    className="fixed bottom-20 right-6 z-50 w-80 max-h-[28rem] bg-[#0d0d0f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-sm font-heading font-bold text-white">Portfolio Assistant</span>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] px-3 py-2 rounded-xl whitespace-pre-line ${
                                    msg.from === 'bot'
                                        ? 'bg-white/5 text-gray-300 self-start'
                                        : 'bg-primary/20 text-white ml-auto'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-white/10 flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask something..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-primary transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            className="bg-primary text-white p-2 rounded-full hover:bg-primary/80 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
