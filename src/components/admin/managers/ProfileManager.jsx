import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { dataService } from '../../../lib/dataService'
import { Save, Upload, CheckCircle2 } from 'lucide-react'

function Input({ label, textarea = false, ...props }) {
    const El = textarea ? 'textarea' : 'input'
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
            <El
                className={`bg-black border border-gray-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500 transition-colors resize-none ${textarea ? 'min-h-[100px]' : ''}`}
                {...props}
            />
        </label>
    )
}

export default function ProfileManager() {
    const [data, setData] = useState(() => dataService.getProfile())
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        let active = true
        dataService.fetchProfile()
            .then(profile => {
                if (active && profile) setData(profile)
            })
            .finally(() => {
                if (active) setLoading(false)
            })
        return () => { active = false }
    }, [])

    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true)
            const file = e.target.files[0]
            if (!file || !supabase) return

            const fileExt = file.name.split('.').pop()
            const fileName = `avatar-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('portfolio')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
                .from('portfolio')
                .getPublicUrl(fileName)

            setData(prev => ({ ...prev, avatar: urlData.publicUrl }))
        } catch (error) {
            console.error('Error uploading avatar:', error)
            alert('Error uploading avatar: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSave = async (e) => {
        if (e) e.preventDefault()
        setSaving(true)
        setSaved(false)

        try {
            const payload = {
                name: (data.name || '').trim(),
                first_name: (data.firstName || (data.name || '').split(' ')[0] || '').trim(),
                roles: Array.isArray(data.roles) ? data.roles.filter(Boolean) : [],
                greeting: (data.greeting || '').trim(),
                bio: (data.bio || '').trim(),
                short_bio: (data.shortBio || '').trim(),
                avatar: (data.avatar || '').trim(),
                resume_url: (data.resumeUrl || '').trim(),
                status: (data.status || '').trim(),
                socials: data.socials || {},
                updated_at: new Date().toISOString()
            }

            if (supabase) {
                if (data.id) {
                    const { error } = await supabase
                        .from('profile')
                        .update(payload)
                        .eq('id', data.id)
                    if (error) throw error
                } else {
                    const { data: existing } = await supabase
                        .from('profile')
                        .select('id')
                        .limit(1)
                        .maybeSingle()

                    if (existing?.id) {
                        const { error } = await supabase
                            .from('profile')
                            .update(payload)
                            .eq('id', existing.id)
                        if (error) throw error
                        setData(prev => ({ ...prev, id: existing.id }))
                    } else {
                        const { data: inserted, error } = await supabase
                            .from('profile')
                            .insert([payload])
                            .select('id')
                            .single()
                        if (error) throw error
                        if (inserted?.id) setData(prev => ({ ...prev, id: inserted.id }))
                    }
                }
            }

            setSaved(true)
            setTimeout(() => setSaved(false), 2500)
        } catch (error) {
            console.error('Error saving profile:', error)
            alert('Failed to save profile to Supabase: ' + error.message)
        } finally {
            setSaving(false)
        }
    }

    const field = (key, label, textarea = false) => (
        <Input
            label={label}
            textarea={textarea}
            value={data[key] || ''}
            onChange={e => setData(p => ({ ...p, [key]: e.target.value }))}
        />
    )

    if (loading) return <div className="text-white text-center py-10">Loading profile...</div>

    return (
        <form onSubmit={handleSave} className="space-y-5">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Profile & Identity</h2>
                    <p className="text-sm text-gray-400">Synchronized with Supabase table &ldquo;profile&rdquo;</p>
                </div>
                {saved && (
                    <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                        <CheckCircle2 size={16} /> Saved to Supabase
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {field('name', 'Full Name')}
                {field('firstName', 'First Name')}
                {field('greeting', 'Greeting text')}
                {field('status', 'Availability status badge')}
                {field('resumeUrl', 'Resume / CV URL')}

                <div className="flex flex-col gap-1">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Avatar Image</span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={data.avatar || ''}
                            onChange={e => setData(p => ({ ...p, avatar: e.target.value }))}
                            className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500 transition-colors"
                            placeholder="/avatar.jpg or https://..."
                        />
                        <label className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl cursor-pointer text-xs font-medium transition-colors">
                            <Upload size={14} />
                            <span>{uploading ? '...' : 'Upload'}</span>
                            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                        </label>
                    </div>
                </div>
            </div>

            {field('bio', 'Full Bio', true)}
            {field('shortBio', 'Short Bio (SEO & Meta Description)', true)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['github', 'linkedin', 'twitter', 'instagram', 'email'].map(k => (
                    <Input
                        key={k}
                        label={`Social — ${k}`}
                        value={data.socials?.[k] || ''}
                        onChange={e => setData(p => ({ ...p, socials: { ...p.socials, [k]: e.target.value } }))}
                    />
                ))}
            </div>

            <label className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider">Roles (comma-separated)</span>
                <input
                    className="bg-black border border-gray-800 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-purple-500 transition-colors"
                    value={(data.roles || []).join(', ')}
                    onChange={e => setData(p => ({ ...p, roles: e.target.value.split(',').map(r => r.trim()) }))}
                />
            </label>

            <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all"
            >
                <Save size={16} />
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Save Profile'}
            </button>
        </form>
    )
}

