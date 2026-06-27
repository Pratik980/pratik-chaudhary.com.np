import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import SortableList from '../../components/SortableList'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Plus, Save, Trash2 } from 'lucide-react'

const blank = { degree: '', field_of_study: '', institution: '', institution_logo_url: '', start_year: '', end_year: '', grade: '', description: '', display_order: 0 }

export default function EducationEditor() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data } = await supabase.from('education').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (data) setItems(data) }, [data])

  if (isLoading) return <LoadingSpinner text="Loading..." />
  if (isError) return <ErrorMessage message={error?.message || 'Failed to load'} />

  const openForm = (item) => {
    setForm(item ? { ...item } : { ...blank, display_order: items.length })
    setModal(true)
  }

  const save = async () => {
    if (!form.degree || !form.institution) return toast.error('Degree and institution are required')
    const payload = { ...form, start_year: form.start_year || null, end_year: form.end_year || null }
    const { error } = form.id
      ? await supabase.from('education').update(payload).eq('id', form.id)
      : await supabase.from('education').insert([payload])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['education'] })
    toast.success(form.id ? 'Updated!' : 'Education added!')
  }

  const deleteItem = async () => {
    const { error } = await supabase.from('education').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['education'] })
    toast.success('Deleted!')
  }

  const reorder = async (reordered) => {
    setItems(reordered)
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase.from('education').update({ display_order: i }).eq('id', reordered[i].id)
      if (error) return toast.error(error.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Education</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Education
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <SortableList items={items} onReorder={reorder} renderItem={(item) => (
          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg cursor-pointer hover:bg-accent/40" onClick={() => openForm(item)}>
            <div className="flex items-center gap-4">
              {item.institution_logo_url ? <img src={item.institution_logo_url} alt="" className="w-10 h-10 rounded object-contain bg-background" /> : <div className="w-10 h-10 bg-accent rounded" />}
              <div>
                <p className="text-sm font-semibold text-foreground">{item.degree}{item.field_of_study ? ` in ${item.field_of_study}` : ''}</p>
                <p className="text-xs text-muted-foreground">{item.institution} · {item.start_year} - {item.end_year || 'Present'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {item.grade && <span className="text-xs bg-accent px-2 py-0.5 rounded text-muted-foreground">{item.grade}</span>}
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
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Education</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm">Degree</label><input type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Field of Study</label><input type="text" value={form.field_of_study} onChange={(e) => setForm({ ...form, field_of_study: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Institution</label><input type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Grade/GPA</label><input type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Start Year</label><input type="number" value={form.start_year} onChange={(e) => setForm({ ...form, start_year: parseInt(e.target.value) || '' })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">End Year</label><input type="number" value={form.end_year} onChange={(e) => setForm({ ...form, end_year: parseInt(e.target.value) || '' })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            </div>
            <ImageUpload value={form.institution_logo_url} onChange={(url) => setForm({ ...form, institution_logo_url: url })} folder="education" label="Institution Logo" />
            <div className="space-y-1"><label className="text-sm">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" /></div>
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
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteItem} message="Delete this education entry?" />
    </div>
  )
}
