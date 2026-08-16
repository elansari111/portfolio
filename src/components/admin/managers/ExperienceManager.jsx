import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, X } from 'lucide-react'

export default function ExperienceManager() {
    const [experiences, setExperiences] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingExp, setEditingExp] = useState(null)

    useEffect(() => {
        fetchExperiences()
    }, [])

    async function fetchExperiences() {
        try {
            const { data, error } = await supabase
                .from('experiences')
                .select('*')
                .order('period', { ascending: false }) // Approximate ordering

            if (error) throw error
            setExperiences(data || [])
        } catch (error) {
            console.error('Error fetching experiences:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure?')) return
        try {
            const { error } = await supabase.from('experiences').delete().eq('id', id)
            if (error) throw error
            setExperiences(experiences.filter(e => e.id !== id))
        } catch (error) {
            console.error('Error deleting experience:', error)
            alert('Failed to delete experience')
        }
    }

    const handleEdit = (exp) => {
        setEditingExp(exp)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingExp(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchExperiences()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center">Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Experience</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Plus size={18} /> <span>Add Experience</span>
                </button>
            </div>

            {isFormOpen && (
                <ExperienceForm
                    experience={editingExp}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {experiences.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No experience records found.</p>
            ) : (
                <div className="space-y-4">
                    {experiences.map(exp => (
                        <div key={exp.id} className="bg-black border border-gray-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h3 className="font-bold text-white text-lg">{exp.role}</h3>
                                <p className="text-purple-400">{exp.company} <span className="text-gray-500 mx-2">|</span> <span className="text-gray-400">{exp.period}</span></p>
                                <p className="text-sm text-gray-500 mt-1">{exp.type}</p>
                            </div>
                            <div className="flex space-x-2 mt-4 md:mt-0">
                                <button onClick={() => handleEdit(exp)} className="p-2 bg-gray-800 text-blue-400 rounded hover:bg-gray-700"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(exp.id)} className="p-2 bg-gray-800 text-red-400 rounded hover:bg-gray-700"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function ExperienceForm({ experience, onClose, onSave }) {
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        period: '',
        description: '',
        type: 'work'
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (experience) {
            setFormData({
                role: experience.role,
                company: experience.company,
                period: experience.period,
                description: experience.description || '',
                type: experience.type || 'work'
            })
        }
    }, [experience])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let error
            if (experience) {
                const { error: updateError } = await supabase.from('experiences').update(formData).eq('id', experience.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase.from('experiences').insert([formData])
                error = insertError
            }
            if (error) throw error
            onSave()
        } catch (error) {
            console.error('Error saving experience:', error)
            alert('Failed to save experience')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-lg border border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{experience ? 'Edit Experience' : 'Add Experience'}</h3>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Role / Degree</label>
                            <input
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.role}
                                onChange={e => setFormData({ ...formData, role: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Company / Institution</label>
                            <input
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Period (e.g. 2020 - 2022)</label>
                            <input
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.period}
                                onChange={e => setFormData({ ...formData, period: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Type</label>
                            <select
                                className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="work">Work</option>
                                <option value="education">Education</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            rows={4}
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    )
}
