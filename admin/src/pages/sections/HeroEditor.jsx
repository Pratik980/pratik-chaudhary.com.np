import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import FileUpload from '../../components/FileUpload'
import DataTable from '../../components/DataTable'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Save, Pencil } from 'lucide-react'

const defaultHero = {
  name: '', tagline: '', subtitle: '', cta_primary_label: '', cta_primary_url: '',
  cta_secondary_label: '', cta_secondary_url: '', profile_image_url: '', resume_url: ''
}

export default function HeroEditor() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(defaultHero)
  const [socials, setSocials] = useState([])
  const [socialModal, setSocialModal] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [socialForm, setSocialForm] = useState({ platform: '', url: '', icon: '', display_order: 0, is_visible: true })

  const { data, isLoading } = useQuery({
    queryKey: ['hero'],
    queryFn: async () => {
      const { data } = await supabase.from('hero').select('*').limit(1).maybeSingle()
      return data || defaultHero
    },
  })

  const { data: socialData } = useQuery({
    queryKey: ['social-links'],
    queryFn: async () => {
      const { data } = await supabase.from('social_links').select('*').order('display_order')
      return data || []
    },
  })

  useEffect(() => { if (data) setForm(data) }, [data])
  useEffect(() => { if (socialData) setSocials(socialData) }, [socialData])

  const saveMutation = useMutation({
    mutationFn: async (vals) => {
      const existing = await supabase.from('hero').select('id').limit(1).maybeSingle()
      const { error } = existing.data
        ? await supabase.from('hero').update({ ...vals, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
        : await supabase.from('hero').insert([vals])
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['hero'] }); toast.success('Hero saved!') },
    onError: (e) => toast.error(e.message),
  })

  const saveSocialMutation = useMutation({
    mutationFn: async (vals) => {
      const { error } = vals.id
        ? await supabase.from('social_links').update(vals).eq('id', vals.id)
        : await supabase.from('social_links').insert([vals])
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-links'] }); toast.success('Social link saved!'); setSocialModal(null) },
    onError: (e) => toast.error(e.message),
  })

  const deleteSocialMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['social-links'] }); toast.success('Deleted!'); setDeleteId(null) },
    onError: (e) => toast.error(e.message),
  })

  const handleSave = (e) => { e.preventDefault(); saveMutation.mutate(form) }

  const openSocial = (item) => {
    if (item) { setSocialForm(item); setSocialModal('edit') }
    else { setSocialForm({ platform: '', url: '', icon: '', display_order: socials.length, is_visible: true }); setSocialModal('add') }
  }

  if (isLoading) return <div className="p-8 text-muted-foreground">Loading...</div>

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Hero Section</h1>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline / Profession</label>
            <input type="text" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium">Subtitle / Description</label>
            <textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Primary Label</label>
            <input type="text" value={form.cta_primary_label} onChange={(e) => setForm({ ...form, cta_primary_label: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Primary URL</label>
            <input type="text" value={form.cta_primary_url} onChange={(e) => setForm({ ...form, cta_primary_url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Secondary Label</label>
            <input type="text" value={form.cta_secondary_label} onChange={(e) => setForm({ ...form, cta_secondary_label: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CTA Secondary URL</label>
            <input type="text" value={form.cta_secondary_url} onChange={(e) => setForm({ ...form, cta_secondary_url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUpload value={form.profile_image_url} onChange={(url) => setForm({ ...form, profile_image_url: url })} folder="hero" label="Profile Image" />
          <FileUpload value={form.resume_url} onChange={(url) => setForm({ ...form, resume_url: url })} folder="resume" label="Resume / CV" accept=".pdf,.doc,.docx" />
        </div>

        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90">
          <Save className="w-4 h-4" /> Save Hero
        </button>
      </form>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Social Links</h2>
          <button onClick={() => openSocial(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>
        <DataTable
          columns={[
            { key: 'platform', label: 'Platform' },
            { key: 'url', label: 'URL', render: (v) => <span className="text-xs text-muted-foreground truncate max-w-[200px] inline-block">{v}</span> },
            { key: 'display_order', label: 'Order' },
            { key: 'is_visible', label: 'Visible', render: (v) => <span className={v ? 'text-green-500' : 'text-red-500'}>{v ? 'Yes' : 'No'}</span> },
          ]}
          data={socials}
          onEdit={openSocial}
          onDelete={(row) => setDeleteId(row.id)}
        />
      </div>

      {socialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSocialModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">{socialModal === 'add' ? 'Add' : 'Edit'} Social Link</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm">Platform</label>
                <input type="text" value={socialForm.platform} onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="GitHub" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">URL</label>
                <input type="text" value={socialForm.url} onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Icon (Lucide name)</label>
                <input type="text" value={socialForm.icon} onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="Github" />
              </div>
              <div className="flex items-center gap-4">
                <div className="space-y-1 flex-1">
                  <label className="text-sm">Display Order</label>
                  <input type="number" value={socialForm.display_order} onChange={(e) => setSocialForm({ ...socialForm, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" checked={socialForm.is_visible} onChange={(e) => setSocialForm({ ...socialForm, is_visible: e.target.checked })} id="social-visible" />
                  <label htmlFor="social-visible" className="text-sm">Visible</label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setSocialModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={() => saveSocialMutation.mutate(socialForm)} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteSocialMutation.mutate(deleteId)} message="Delete this social link?" />
    </div>
  )
}
