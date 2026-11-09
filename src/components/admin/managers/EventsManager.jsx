import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, X, Upload, Trophy } from 'lucide-react'
import { events as defaultEvents } from '../../../data/events'

export default function EventsManager() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    async function fetchEvents() {
        try {
            setLoading(true)
            if (!supabase) {
                setEvents(defaultEvents)
                return
            }

            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.warn('Events table error:', error.message)
                setEvents(defaultEvents)
            } else {
                setEvents(data && data.length > 0 ? data : defaultEvents)
            }
        } catch (error) {
            console.error('Error fetching events:', error)
            setEvents(defaultEvents)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this event?')) return
        try {
            if (supabase) {
                const { error } = await supabase.from('events').delete().eq('id', id)
                if (error) throw error
            }
            setEvents(events.filter(item => item.id !== id))
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('Failed to delete event: ' + error.message)
        }
    }

    const handleEdit = (event) => {
        setEditingEvent(event)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingEvent(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchEvents()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center py-10">Loading events...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Hackathons & Events</h2>
                    <p className="text-sm text-gray-400">Manage hackathons, talks and community moments in Supabase</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} /> <span>Add Event</span>
                </button>
            </div>

            {isFormOpen && (
                <EventForm
                    event={editingEvent}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {events.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No events found.</p>
            ) : (
                <div className="space-y-3">
                    {events.map((item, idx) => (
                        <div key={item.id || idx} className="bg-black border border-gray-800 p-4 rounded-xl flex items-center justify-between gap-4">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-mono text-gray-400">{item.date}</span>
                                    {item.award && (
                                        <span className="text-xs px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 flex items-center gap-1">
                                            <Trophy size={11} /> {item.award}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-white text-base truncate">{item.title}</h3>
                                <p className="text-xs text-gray-400 truncate">
                                    {item.role && <span className="text-purple-400 font-medium">{item.role} · </span>}
                                    {item.description}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function EventForm({ event, onClose, onSave }) {
    const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [formData, setFormData] = useState({
        title: event?.title || '',
        slug: event?.slug || '',
        role: event?.role || '',
        date: event?.date || '',
        award: event?.award || '',
        description: event?.description || '',
        image: event?.image || '',
        tag: event?.tag || 'HACKATHON & EVENT'
    })
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleTitleChange = (e) => {
        const val = e.target.value
        setFormData(prev => ({
            ...prev,
            title: val,
            slug: event ? prev.slug : slugify(val)
        }))
    }

    const handleImageUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file || !supabase) return

            const fileExt = file.name.split('.').pop()
            const fileName = `event-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName)
            setFormData(prev => ({ ...prev, image: data.publicUrl }))
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (!formData.title.trim()) {
                alert('Please enter an event title.')
                setSaving(false)
                return
            }

            const eventData = {
                title: formData.title.trim(),
                slug: (formData.slug || slugify(formData.title)).trim(),
                role: formData.role.trim(),
                date: formData.date.trim(),
                award: formData.award.trim(),
                description: formData.description.trim(),
                image: formData.image.trim(),
                tag: formData.tag || 'HACKATHON & EVENT'
            }

            if (supabase) {
                let error
                if (event?.id) {
                    const { error: updateError } = await supabase
                        .from('events')
                        .update(eventData)
                        .eq('id', event.id)
                    error = updateError
                } else {
                    const { error: insertError } = await supabase
                        .from('events')
                        .insert([eventData])
                    error = insertError
                }
                if (error) throw error
            }

            onSave()
        } catch (error) {
            console.error('Error saving event:', error)
            alert('Failed to save event: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-950 border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-bold text-white">
                        {event ? 'Edit Event' : 'New Event'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Event Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="e.g. Global Hackathon 2026"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Write-up Article Slug (optional)</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData(p => ({ ...p, slug: slugify(e.target.value) }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none font-mono"
                                placeholder="winning-the-global-hackathon"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Your Role</label>
                            <input
                                type="text"
                                value={formData.role}
                                onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="Lead Developer / Speaker"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Date</label>
                            <input
                                type="text"
                                value={formData.date}
                                onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="Dec 2025"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Award / Achievement</label>
                            <input
                                type="text"
                                value={formData.award}
                                onChange={e => setFormData(p => ({ ...p, award: e.target.value }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="1st Place / Best Talk"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Event Image</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                                className="flex-1 bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="https://... or upload"
                            />
                            <label className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg cursor-pointer text-xs font-medium">
                                <Upload size={14} />
                                <span>{uploading ? '...' : 'Upload'}</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                            placeholder="What did you build, present, or learn?"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-800 hover:bg-gray-900 text-gray-300 rounded-lg text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

