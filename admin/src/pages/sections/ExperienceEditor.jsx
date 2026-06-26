import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import RichTextEditor from '../../components/RichTextEditor'
import SortableList from '../../components/SortableList'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Save, Trash2 } from 'lucide-react'

const blank = { job_title: '', company: '', company_logo_url: '', location: '', employment_type: 'Full-time', start_date: '', end_date: '', is_current: false, description: '', display_order: 0 }

export default function ExperienceEditor() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [deleteId, setDeleteId] = useState(null)

  const { data } = useQuery({
    queryKey: ['experience'],
    queryFn: async () => {
      const { data } = await supabase.from('experience').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (data) setItems(data) }, [data])

  const openForm = (item) => {
    setForm(item ? { ...item } : { ...blank, display_order: items.length })
    setModal(true)
  }

  const save = async () => {
    if (!form.job_title || !form.company) return toast.error('Job title and company are required')
    const payload = { ...form, start_date: form.start_date || null, end_date: form.end_date || null }
    const { error } = form.id
      ? await supabase.from('experience').update(payload).eq('id', form.id)
      : await supabase.from('experience').insert([payload])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['experience'] })
    toast.success(form.id ? 'Updated!' : 'Experience added!')
  }

  const deleteItem = async () => {
    const { error } = await supabase.from('experience').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['experience'] })
    toast.success('Deleted!')
  }

  const reorder = async (reordered) => {
    setItems(reordered)
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase.from('experience').update({ display_order: i }).eq('id', reordered[i].id)
      if (error) return toast.error(error.message)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Experience</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Experience
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <SortableList items={items} onReorder={reorder} renderItem={(item) => (
          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg cursor-pointer hover:bg-accent/40" onClick={() => openForm(item)}>
            <div className="flex items-center gap-4">
              {item.company_logo_url ? <img src={item.company_logo_url} alt="" className="w-10 h-10 rounded object-contain bg-background" /> : <div className="w-10 h-10 bg-accent rounded" />}
              <div>
                <p className="text-sm font-semibold text-foreground">{item.job_title}</p>
                <p className="text-xs text-muted-foreground">{item.company} · {formatDate(item.start_date)} - {item.is_current ? 'Present' : formatDate(item.end_date)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.is_current && <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">Current</span>}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteId(item.id);
                }}
                className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )} />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-xl w-full mx-4 shadow-xl space-y-4 mb-10">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm">Job Title</label>
                <input type="text" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Company</label>
                <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Employment Type</label>
                <select value={form.employment_type} onChange={(e) => setForm({ ...form, employment_type: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground">
                  <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Freelance</option><option>Internship</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm">Start Date</label>
                <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">End Date</label>
                <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} disabled={form.is_current} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground disabled:opacity-50" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({ ...form, is_current: e.target.checked, end_date: e.target.checked ? '' : form.end_date })} />
              Currently working here
            </label>
            <ImageUpload value={form.company_logo_url} onChange={(url) => setForm({ ...form, company_logo_url: url })} folder="experience" label="Company Logo" />
            <div className="space-y-1">
              <label className="text-sm">Description</label>
              <RichTextEditor value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            </div>
            <div className="flex justify-between items-center">
              {form.id ? (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteId(form.id);
                    setModal(null);
                  }}
                  className="px-4 py-2 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 font-medium transition-colors"
                >
                  Delete
                </button>
              ) : <div />}
              <div className="flex gap-3">
                <button onClick={() => setModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
                <button onClick={save} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteItem} message="Delete this experience entry?" />
    </div>
  )
}
