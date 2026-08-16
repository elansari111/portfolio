import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Upload, Download, Trash2, FileText, Loader } from 'lucide-react'

export default function CVManager() {
    const [cvFile, setCvFile] = useState(null)
    const [currentCV, setCurrentCV] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCurrentCV()
    }, [])

    async function fetchCurrentCV() {
        try {
            setLoading(true)
            const { data, error } = await supabase.storage
                .from('portfolio')
                .list('cv', {
                    limit: 1,
                    sortBy: { column: 'created_at', order: 'desc' }
                })

            if (error) throw error

            if (data && data.length > 0) {
                const { data: urlData } = supabase.storage
                    .from('portfolio')
                    .getPublicUrl(`cv/${data[0].name}`)

                setCurrentCV({
                    name: data[0].name,
                    url: urlData.publicUrl,
                    size: data[0].metadata?.size,
                    updated_at: data[0].updated_at
                })
            }
        } catch (error) {
            console.error('Error fetching CV:', error.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleUpload() {
        if (!cvFile) {
            alert('Please select a PDF file')
            return
        }

        if (cvFile.type !== 'application/pdf') {
            alert('Only PDF files are allowed')
            return
        }

        try {
            setUploading(true)

            // Delete old CV if exists
            if (currentCV) {
                await supabase.storage
                    .from('portfolio')
                    .remove([`cv/${currentCV.name}`])
            }

            // Upload new CV
            const fileName = `cv_${Date.now()}.pdf`
            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(`cv/${fileName}`, cvFile, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            alert('CV uploaded successfully!')
            setCvFile(null)
            fetchCurrentCV()
        } catch (error) {
            console.error('Error uploading CV:', error.message)
            alert('Error uploading CV: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    async function handleDelete() {
        if (!currentCV) return

        if (!confirm('Are you sure you want to delete your CV?')) return

        try {
            const { error } = await supabase.storage
                .from('portfolio')
                .remove([`cv/${currentCV.name}`])

            if (error) throw error

            alert('CV deleted successfully!')
            setCurrentCV(null)
        } catch (error) {
            console.error('Error deleting CV:', error.message)
            alert('Error deleting CV: ' + error.message)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin text-purple-500" size={32} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">CV Management</h2>
            </div>

            {/* Current CV Display */}
            {currentCV && (
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="bg-purple-500/10 p-3 rounded-lg">
                                <FileText className="text-purple-500" size={32} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Current CV</h3>
                                <p className="text-gray-400 text-sm mt-1">{currentCV.name}</p>
                                {currentCV.size && (
                                    <p className="text-gray-500 text-xs mt-1">
                                        {(currentCV.size / 1024).toFixed(2)} KB
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <a
                                href={currentCV.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                                title="Preview CV"
                            >
                                <Download size={20} />
                            </a>
                            <button
                                onClick={handleDelete}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Delete CV"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upload New CV */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-4">
                    {currentCV ? 'Replace CV' : 'Upload CV'}
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Select PDF File
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={(e) => setCvFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-purple-500 file:text-white
                                hover:file:bg-purple-600
                                file:cursor-pointer cursor-pointer"
                        />
                        {cvFile && (
                            <p className="text-sm text-gray-400 mt-2">
                                Selected: {cvFile.name} ({(cvFile.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!cvFile || uploading}
                        className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold
                            hover:bg-purple-600 disabled:bg-gray-700 disabled:cursor-not-allowed
                            transition-colors flex items-center justify-center space-x-2"
                    >
                        {uploading ? (
                            <>
                                <Loader className="animate-spin" size={20} />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                <span>Upload CV</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                    <strong>Note:</strong> Only PDF files are accepted. The CV will be publicly accessible
                    via the "Import CV" button on your portfolio.
                </p>
            </div>
        </div>
    )
}
