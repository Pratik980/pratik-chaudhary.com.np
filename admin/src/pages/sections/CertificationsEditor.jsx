import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import DataTable from '../../components/DataTable'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Save, X } from 'lucide-react'

const blank = { title: '', issuer: '', date: '', link: '', color_tag: 'accent-blue', sub_links: [], display_order: 0 }

export default function CertificationsEditor() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [deleteId, setDeleteId] = useState(null)

  const { data } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data } = await supabase.from('certifications').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (data) setItems(data) }, [data])

  const openForm = (item) => {
    if (item) {
      setForm({ ...item, sub_links: item.sub_links || [] })
    } else {
      setForm({ ...blank, display_order: items.length })
    }
    setModal(true)
  }

  const save = async () => {
    if (!form.title || !form.issuer) return toast.error('Title and issuer are required')
    const { error } = form.id
      ? await supabase.from('certifications').update(form).eq('id', form.id)
      : await supabase.from('certifications').insert([form])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['certifications'] })
    toast.success(form.id ? 'Updated!' : 'Certification added!')
  }

  const deleteItem = async () => {
    const { error } = await supabase.from('certifications').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['certifications'] })
    toast.success('Deleted!')
  }

  const addSubLink = () => {
    setForm({ ...form, sub_links: [...(form.sub_links || []), { label: '', url: '' }] })
  }

  const updateSubLink = (i, field, value) => {
    const links = [...(form.sub_links || [])]
    links[i] = { ...links[i], [field]: value }
    setForm({ ...form, sub_links: links })
  }

  const removeSubLink = (i) => {
    const links = [...(form.sub_links || [])]
    links.splice(i, 1)
    setForm({ ...form, sub_links: links })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Certifications</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Certification
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'title', label: 'Title' },
          { key: 'issuer', label: 'Issuer' },
          { key: 'date', label: 'Date' },
          { key: 'color_tag', label: 'Color', render: (v) => (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              v === 'accent-blue' ? 'bg-blue-500/10 text-blue-500' : v === 'accent-purple' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'
            }`}>{v}</span>
          )},
        ]}
        data={items}
        onEdit={openForm}
        onDelete={(row) => setDeleteId(row.id)}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-xl w-full mx-4 shadow-xl space-y-4 mb-10">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Certification</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Issuer</label><input type="text" value={form.issuer} onChange={(e) => setForm({ ...form, issuer: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Date</label><input type="text" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="e.g. Nov 2025" /></div>
              <div className="space-y-1"><label className="text-sm">Display Order</label><input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm">Certificate Link</label><input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Accent Color</label>
                <select value={form.color_tag} onChange={(e) => setForm({ ...form, color_tag: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground">
                  <option value="accent-blue">Blue</option>
                  <option value="accent-purple">Purple</option>
                  <option value="accent-emerald">Emerald</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Sub-Links (optional)</label>
                <button onClick={addSubLink} className="text-xs px-2 py-1 bg-accent rounded-md text-muted-foreground hover:text-foreground">+ Add</button>
              </div>
              {form.sub_links?.map((sub, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={sub.label} onChange={(e) => updateSubLink(i, 'label', e.target.value)} placeholder="Label" className="flex-1 px-2 py-1 text-xs bg-background border border-input rounded-md text-foreground" />
                  <input type="text" value={sub.url} onChange={(e) => updateSubLink(i, 'url', e.target.value)} placeholder="URL" className="flex-1 px-2 py-1 text-xs bg-background border border-input rounded-md text-foreground" />
                  <button onClick={() => removeSubLink(i)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={save} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteItem} message="Delete this certification?" />
    </div>
  )
}
