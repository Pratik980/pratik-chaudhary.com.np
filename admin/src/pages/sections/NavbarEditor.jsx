import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import FileUpload from '../../components/FileUpload'
import SortableList from '../../components/SortableList'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Save } from 'lucide-react'

export default function NavbarEditor() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ logo_text: '', logo_image_url: '', resume_url: '' })
  const [links, setLinks] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [linkModal, setLinkModal] = useState(null)
  const [linkForm, setLinkForm] = useState({ label: '', href: '', display_order: 0, is_visible: true })

  const { data: navbarData } = useQuery({
    queryKey: ['navbar'],
    queryFn: async () => {
      const { data } = await supabase.from('navbar_settings').select('*').limit(1).maybeSingle()
      return data || null
    },
  })
  useEffect(() => { if (navbarData) setForm(navbarData) }, [navbarData])

  const { data: linkData } = useQuery({
    queryKey: ['nav-links'],
    queryFn: async () => {
      const { data } = await supabase.from('nav_links').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (linkData) setLinks(linkData) }, [linkData])

  const saveNavbar = async () => {
    const existing = await supabase.from('navbar_settings').select('id').limit(1).maybeSingle()
    const { error } = existing.data
      ? await supabase.from('navbar_settings').update({ ...form, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
      : await supabase.from('navbar_settings').insert([form])
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['navbar'] })
    toast.success('Navbar saved!')
  }

  const saveLink = async () => {
    if (!linkForm.label || !linkForm.href) return toast.error('Label and href required')
    const { error } = linkForm.id
      ? await supabase.from('nav_links').update(linkForm).eq('id', linkForm.id)
      : await supabase.from('nav_links').insert([linkForm])
    if (error) return toast.error(error.message)
    setLinkModal(null)
    queryClient.invalidateQueries({ queryKey: ['nav-links'] })
    toast.success('Link saved!')
  }

  const deleteLink = async () => {
    const { error } = await supabase.from('nav_links').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['nav-links'] })
    toast.success('Deleted!')
  }

  const reorderLinks = async (reordered) => {
    setLinks(reordered)
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase.from('nav_links').update({ display_order: i }).eq('id', reordered[i].id)
      if (error) return toast.error(error.message)
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Navbar</h1>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="space-y-1">
          <label className="text-sm">Logo Text</label>
          <input type="text" value={form.logo_text} onChange={(e) => setForm({ ...form, logo_text: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <ImageUpload value={form.logo_image_url} onChange={(url) => setForm({ ...form, logo_image_url: url })} folder="navbar" label="Logo Image" />
          <FileUpload value={form.resume_url} onChange={(url) => setForm({ ...form, resume_url: url })} folder="resume" label="Resume / CV" accept=".pdf,.doc,.docx" />
        </div>
        <button onClick={saveNavbar} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium"><Save className="w-4 h-4" /> Save Navbar</button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Navigation Links</h2>
          <button onClick={() => { setLinkForm({ label: '', href: '', display_order: links.length, is_visible: true }); setLinkModal('add') }} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"><Plus className="w-4 h-4" /> Add Link</button>
        </div>
        <SortableList items={links} onReorder={reorderLinks} renderItem={(item) => (
          <div className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
            <div className="flex-1 cursor-pointer" onClick={() => { setLinkForm(item); setLinkModal('edit') }}>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.href}</p>
            </div>
            <button onClick={() => { setDeleteId(item.id) }} className="p-1 text-destructive">✕</button>
          </div>
        )} />
      </div>

      {linkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLinkModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">{linkModal === 'add' ? 'Add' : 'Edit'} Nav Link</h3>
            <div className="space-y-1"><label className="text-sm">Label</label><input type="text" value={linkForm.label} onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="space-y-1"><label className="text-sm">Href</label><input type="text" value={linkForm.href} onChange={(e) => setLinkForm({ ...linkForm, href: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={linkForm.is_visible} onChange={(e) => setLinkForm({ ...linkForm, is_visible: e.target.checked })} /> Visible</label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setLinkModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={saveLink} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteLink} message="Delete this nav link?" />
    </div>
  )
}
