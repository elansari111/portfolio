import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { Edit, Trash2, Plus, X, Upload, CheckCircle2 } from 'lucide-react'
import { posts as defaultPosts } from '../../../data/posts'

export default function PostsManager() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingPost, setEditingPost] = useState(null)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        try {
            setLoading(true)
            if (!supabase) {
                setPosts(defaultPosts)
                return
            }

            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.warn('Posts table error:', error.message)
                setPosts(defaultPosts)
            } else {
                setPosts(data && data.length > 0 ? data : defaultPosts)
            }
        } catch (error) {
            console.error('Error fetching posts:', error)
            setPosts(defaultPosts)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Are you sure you want to delete this article?')) return
        try {
            if (supabase) {
                const { error } = await supabase.from('posts').delete().eq('id', id)
                if (error) throw error
            }
            setPosts(posts.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting post:', error)
            alert('Failed to delete post')
        }
    }

    const handleEdit = (post) => {
        setEditingPost(post)
        setIsFormOpen(true)
    }

    const handleAddNew = () => {
        setEditingPost(null)
        setIsFormOpen(true)
    }

    const handleSave = () => {
        fetchPosts()
        setIsFormOpen(false)
    }

    if (loading) return <div className="text-white text-center py-10">Loading articles...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Blog & Journal</h2>
                    <p className="text-sm text-gray-400">Manage technical writing and field notes in Supabase</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <Plus size={18} /> <span>Write Article</span>
                </button>
            </div>

            {isFormOpen && (
                <PostForm
                    post={editingPost}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
            )}

            {posts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No articles found.</p>
            ) : (
                <div className="space-y-3">
                    {posts.map((post, idx) => {
                        const img = post.cover_image || post.coverImage
                        return (
                            <div key={post.id || post.slug || idx} className="bg-black border border-gray-800 p-4 rounded-xl flex items-center justify-between gap-4">
                                {img && (
                                    <img
                                        src={img}
                                        alt={post.title}
                                        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                                        onError={(e) => { e.currentTarget.style.display = 'none' }}
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                                            {post.category || 'TECH'}
                                        </span>
                                        {post.published !== false && (
                                            <span className="text-xs text-emerald-400 flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Published
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-white text-base truncate">{post.title}</h3>
                                    <p className="text-xs text-gray-400 truncate">{post.excerpt}</p>
                                </div>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="p-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-700 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 bg-gray-800 text-red-400 rounded-lg hover:bg-gray-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function PostForm({ post, onClose, onSave }) {
    const slugify = (text) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

    const [formData, setFormData] = useState({
        title: post?.title || '',
        slug: post?.slug || '',
        category: post?.category || 'TECH',
        excerpt: post?.excerpt || '',
        content: post?.content || '',
        cover_image: post?.cover_image || post?.coverImage || '',
        published: post?.published ?? true
    })
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    const handleTitleChange = (e) => {
        const val = e.target.value
        setFormData(prev => ({
            ...prev,
            title: val,
            slug: post ? prev.slug : slugify(val)
        }))
    }

    const handleImageUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file) return

            const fileExt = file.name.split('.').pop()
            const fileName = `post-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage.from('portfolio').getPublicUrl(fileName)
            setFormData(prev => ({ ...prev, cover_image: data.publicUrl }))
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            if (!formData.title || !formData.slug) {
                alert('Please enter a title and slug.')
                setSaving(false)
                return
            }

            const postData = {
                title: formData.title.trim(),
                slug: formData.slug.trim(),
                category: formData.category,
                excerpt: formData.excerpt.trim(),
                content: formData.content,
                cover_image: formData.cover_image,
                published: formData.published,
                author_name: 'Yassine El Ansari',
                author_avatar: '/avatar.jpg'
            }

            if (supabase) {
                let error
                if (post?.id) {
                    const { error: updateError } = await supabase
                        .from('posts')
                        .update(postData)
                        .eq('id', post.id)
                    error = updateError
                } else {
                    const { error: insertError } = await supabase
                        .from('posts')
                        .insert([postData])
                    error = insertError
                }
                if (error) throw error
            }

            onSave()
        } catch (error) {
            console.error('Error saving article:', error)
            alert('Failed to save article: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-zinc-950 border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
                <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-bold text-white">
                        {post ? 'Edit Article' : 'New Article'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={handleTitleChange}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                                placeholder="Article title"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={e => setFormData(p => ({ ...p, slug: slugify(e.target.value) }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none font-mono"
                                placeholder="article-slug"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                            >
                                <option value="TECH">TECH</option>
                                <option value="ENGINEERING">ENGINEERING</option>
                                <option value="HACKATHON">HACKATHON</option>
                                <option value="DESIGN">DESIGN</option>
                                <option value="CAREER">CAREER</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase text-gray-400 mb-1">Cover Image</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={formData.cover_image}
                                    onChange={e => setFormData(p => ({ ...p, cover_image: e.target.value }))}
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
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Excerpt (Summary)</label>
                        <textarea
                            rows={2}
                            value={formData.excerpt}
                            onChange={e => setFormData(p => ({ ...p, excerpt: e.target.value }))}
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none"
                            placeholder="Brief summary displayed in article cards..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs uppercase text-gray-400 mb-1">Content (Markdown supported)</label>
                        <textarea
                            rows={12}
                            required
                            value={formData.content}
                            onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                            className="w-full bg-black border border-gray-800 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 outline-none font-mono"
                            placeholder="# Write your article in markdown..."
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={formData.published}
                                onChange={e => setFormData(p => ({ ...p, published: e.target.checked }))}
                                className="rounded bg-black border-gray-700 text-purple-600 focus:ring-purple-500"
                            />
                            Published & visible on site
                        </label>

                        <div className="flex gap-2">
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
                                {saving ? 'Saving...' : 'Save Article'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
