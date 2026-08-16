import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, X } from 'lucide-react'

export default function SkillsManager() {
    const [skills, setSkills] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingSkill, setEditingSkill] = useState(null)

    useEffect(() => {
        fetchSkills()
    }, [])

    async function fetchSkills() {
        try {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true })

            if (error) throw error
            setSkills(data || [])
        } catch (error) {
            console.error('Error fetching skills:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure?')) return
        try {
            const { error } = await supabase.from('skills').delete().eq('id', id)
            if (error) throw error
            setSkills(skills.filter(s => s.id !== id))
        } catch (error) {
            console.error('Error deleting skill:', error)
            alert('Failed to delete skill')
        }
    }

    const handleEdit = (skill) => {
        setEditingSkill(skill)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingSkill(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchSkills()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center">Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Skills</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Plus size={18} /> <span>Add Skill</span>
                </button>
            </div>

            {isFormOpen && (
                <SkillForm
                    skill={editingSkill}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {skills.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No skills found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map(skill => (
                        <div key={skill.id} className="bg-black border border-gray-800 p-4 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-white">{skill.name}</h3>
                                <p className="text-sm text-gray-400">{skill.category} • {skill.level}%</p>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => handleEdit(skill)} className="p-1.5 bg-gray-800 text-blue-400 rounded hover:bg-gray-700"><Edit size={16} /></button>
                                <button onClick={() => handleDelete(skill.id)} className="p-1.5 bg-gray-800 text-red-400 rounded hover:bg-gray-700"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function SkillForm({ skill, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Frontend',
        level: 50
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name,
                category: skill.category,
                level: skill.level
            })
        }
    }, [skill])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const dataToSave = { ...formData, level: parseInt(formData.level) }
            let error

            if (skill) {
                const { error: updateError } = await supabase.from('skills').update(dataToSave).eq('id', skill.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase.from('skills').insert([dataToSave])
                error = insertError
            }

            if (error) throw error
            onSave()
        } catch (error) {
            console.error('Error saving skill:', error)
            alert('Failed to save skill')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-800 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{skill ? 'Edit Skill' : 'Add Skill'}</h3>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Name</label>
                        <input
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Category</label>
                        <select
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Tools">Tools</option>
                            <option value="Design">Design</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Level (0-100)</label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.level}
                            onChange={e => setFormData({ ...formData, level: e.target.value })}
                            required
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
