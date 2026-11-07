import { useState, useEffect } from 'react'
import { dataService } from '../../../lib/dataService'
import { Mail, Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react'

export default function MessagesManager() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchMessages = async () => {
        setLoading(true)
        try {
            const data = await dataService.getMessages()
            setMessages(data || [])
        } catch (err) {
            console.error('Error fetching messages:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMessages()
    }, [])

    const handleToggleRead = async (id, currentRead) => {
        try {
            await dataService.markMessageRead(id, !currentRead)
            setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentRead } : m))
        } catch (err) {
            console.error('Failed to update message status:', err)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message permanently?')) return
        try {
            await dataService.deleteMessage(id)
            setMessages(prev => prev.filter(m => m.id !== id))
        } catch (err) {
            console.error('Failed to delete message:', err)
            alert('Failed to delete message')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                        <Mail size={20} className="text-primary" />
                        Contact Inquiries ({messages.length})
                    </h2>
                    <p className="text-gray-400 text-xs mt-1">Messages submitted through the public contact form</p>
                </div>
                <button
                    onClick={fetchMessages}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1.5"
                    title="Refresh"
                >
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="py-12 flex justify-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-12 border border-white/5 rounded-2xl bg-black/40">
                    <Mail size={32} className="mx-auto text-gray-600 mb-3" />
                    <p className="text-gray-400 font-medium">No inquiries received yet.</p>
                    <p className="text-gray-600 text-xs mt-1">Incoming contact submissions will be displayed here.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map(msg => (
                        <div
                            key={msg.id}
                            className={`p-5 rounded-2xl border transition-all ${
                                msg.read
                                    ? 'bg-black/30 border-white/5 opacity-70'
                                    : 'bg-black/60 border-primary/30 shadow-lg shadow-primary/5'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-heading font-bold text-white text-base">{msg.name}</span>
                                        {!msg.read && (
                                            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <a
                                        href={`mailto:${msg.email}`}
                                        className="text-xs text-primary hover:underline font-mono"
                                    >
                                        {msg.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                                    <Clock size={13} />
                                    <span>{new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>

                            <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5 mb-4">
                                {msg.message}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <button
                                    onClick={() => handleToggleRead(msg.id, msg.read)}
                                    className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                    <CheckCircle size={14} className={msg.read ? 'text-green-400' : 'text-gray-500'} />
                                    {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                                <button
                                    onClick={() => handleDelete(msg.id)}
                                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

