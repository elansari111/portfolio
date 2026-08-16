import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { X, Upload } from 'lucide-react'

export default function ProjectForm({ project, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image_url: '',
        demo_url: '',
        repo_url: '',
        tags: ''
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description || '',
                image_url: project.image_url || '',
                demo_url: project.demo_url || '',
                repo_url: project.repo_url || '',
                tags: project.tags ? project.tags.join(', ') : ''
            })
        }
    }, [project])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleImageUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath)
            setFormData({ ...formData, image_url: data.publicUrl })
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image!')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')

            const projectData = {
                title: formData.title,
                description: formData.description,
                image_url: formData.image_url,
                demo_url: formData.demo_url,
                repo_url: formData.repo_url,
                tags: tagsArray
            }

            let error
            if (project) {
                const { error: updateError } = await supabase
                    .from('projects')
                    .update(projectData)
                    .eq('id', project.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase
                    .from('projects')
                    .insert([projectData])
                error = insertError
            }

            if (error) throw error
            onSave()
            onClose()
        } catch (error) {
            console.error('Error saving project:', error)
            alert('Error saving project!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-800">
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {project ? 'Edit Project' : 'Add New Project'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Demo URL</label>
                            <input
                                type="url"
                                name="demo_url"
                                value={formData.demo_url}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Repo URL</label>
                            <input
                                type="url"
                                name="repo_url"
                                value={formData.repo_url}
                                onChange={handleChange}
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma separated)</label>
                        <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="React, Node.js, Tailwind"
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Image</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="text"
                                name="image_url"
                                value={formData.image_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="flex-1 bg-black border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                                <Upload size={20} />
                                <span className="hidden sm:inline">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                        {uploading && <p className="text-sm text-purple-400 mt-2">Uploading image...</p>}
                        {formData.image_url && (
                            <img src={formData.image_url} alt="Preview" className="mt-4 h-32 w-auto object-cover rounded-lg border border-gray-700" />
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-transparent text-gray-400 hover:text-white font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
