import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, X, Upload } from 'lucide-react'

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCert, setEditingCert] = useState(null)

    useEffect(() => {
        fetchCertificates()
    }, [])

    async function fetchCertificates() {
        try {
            // Assuming certificates table exists, but checking schema.sql I realized I didn't create a 'certificates' table explicitely in the previous steps.
            // I need to update the schema for certificates first or handle it here if it was missed.
            // Checking local schema.sql content (I corrected it before but maybe missed 'certificates' table creation).
            // Let's assume table exists or I'll add it.
            // WAIT: schema.sql viewed earlier did NOT have certificates table. I must add it.
            // I will create the manager assuming the table exists, and then update schema.sql.

            const { data, error } = await supabase
                .from('certificates')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                // Table might not exist yet, suppress initial error or handle gracefully
                if (error.code === '42P01') {
                    console.warn('Certificates table does not exist yet.')
                    setCertificates([])
                } else {
                    throw error
                }
            } else {
                setCertificates(data || [])
            }
        } catch (error) {
            console.error('Error fetching certificates:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure?')) return
        try {
            const { error } = await supabase.from('certificates').delete().eq('id', id)
            if (error) throw error
            setCertificates(certificates.filter(c => c.id !== id))
        } catch (error) {
            console.error('Error deleting certificate:', error)
            alert('Failed to delete certificate')
        }
    }

    const handleEdit = (cert) => {
        setEditingCert(cert)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingCert(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchCertificates()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center">Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Certificates</h2>
                <button onClick={handleAddNew} className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Plus size={18} /> <span>Add Certificate</span>
                </button>
            </div>

            {isFormOpen && (
                <CertificateForm
                    certificate={editingCert}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {certificates.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No certificates found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                        <div key={cert.id} className="bg-black border border-gray-800 rounded-lg overflow-hidden group">
                            <div className="h-40 bg-gray-900 w-full relative">
                                {cert.image_url ? (
                                    <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-white truncate" title={cert.title}>{cert.title}</h3>
                                <p className="text-sm text-gray-400 mb-2">{cert.issuer}</p>
                                <div className="flex justify-between mt-4">
                                    <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-purple-400 hover:text-purple-300">View Credential</a>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(cert)} className="text-blue-400 hover:text-blue-300"><Edit size={16} /></button>
                                        <button onClick={() => handleDelete(cert.id)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CertificateForm({ certificate, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        credential_url: '',
        image_url: ''
    })
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        if (certificate) {
            setFormData({
                title: certificate.title,
                issuer: certificate.issuer,
                date: certificate.date,
                credential_url: certificate.credential_url || '',
                image_url: certificate.image_url || ''
            })
        }
    }, [certificate])

    const handleImageUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `cert-${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(filePath, file)

            if (uploadError) throw uploadError

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
            let error
            if (certificate) {
                const { error: updateError } = await supabase.from('certificates').update(formData).eq('id', certificate.id)
                error = updateError
            } else {
                const { error: insertError } = await supabase.from('certificates').insert([formData])
                error = insertError
            }

            if (error) throw error
            onSave()
        } catch (error) {
            console.error('Error saving certificate:', error)
            alert('Failed to save certificate')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-xl w-full max-w-md border border-gray-800 p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{certificate ? 'Edit Certificate' : 'Add Certificate'}</h3>
                    <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Title</label>
                        <input
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Issuer</label>
                        <input
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.issuer}
                            onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Date</label>
                        <input
                            type="date"
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Credential URL</label>
                        <input
                            type="url"
                            className="w-full bg-black border border-gray-700 rounded p-2 text-white"
                            value={formData.credential_url}
                            onChange={e => setFormData({ ...formData, credential_url: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Image</label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Image URL"
                                className="flex-1 bg-black border border-gray-700 rounded p-2 text-white"
                                value={formData.image_url}
                                onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            />
                            <label className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-2 rounded transition-colors">
                                <Upload size={20} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                        {uploading && <p className="text-xs text-purple-400 mt-1">Uploading...</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-bold disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    )
}
