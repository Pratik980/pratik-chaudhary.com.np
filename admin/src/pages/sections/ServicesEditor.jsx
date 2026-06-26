import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import SortableList from '../../components/SortableList'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Save, Eye, EyeOff } from 'lucide-react'

const blank = { icon: '', title: '', description: '', display_order: 0, is_visible: true }

export default function ServicesEditor() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [deleteId, setDeleteId] = useState(null)

  const { data } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await supabase.from('services').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (data) setItems(data) }, [data])

  const openForm = (item) => {
    setForm(item ? { ...item } : { ...blank, display_order: items.length })
    setModal(true)
  }

  const save = async () => {
    if (!form.title) return toast.error('Title is required')
    const { error } = form.id
      ? await supabase.from('services').update(form).eq('id', form.id)
      : await supabase.from('services').insert([form])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['services'] })
    toast.success(form.id ? 'Updated!' : 'Service added!')
  }

  const deleteItem = async () => {
    const { error } = await supabase.from('services').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['services'] })
    toast.success('Deleted!')
  }

  const toggleVisible = async (item) => {
    const { error } = await supabase.from('services').update({ is_visible: !item.is_visible }).eq('id', item.id)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['services'] })
  }

  const reorder = async (reordered) => {
    setItems(reordered)
    for (let i = 0; i < reordered.length; i++) {
      const { error } = await supabase.from('services').update({ display_order: i }).eq('id', reordered[i].id)
      if (error) return toast.error(error.message)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Services</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>
      <div className="bg-card border border-border rounded-xl p-6">
        <SortableList items={items} onReorder={reorder} renderItem={(item) => (
          <div className="flex items-center justify-between p-4 bg-accent/20 rounded-lg">
            <div className="flex-1 cursor-pointer" onClick={() => openForm(item)}>
              <div className="flex items-center gap-3">
                {item.icon && <span className="text-2xl">{item.icon}</span>}
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleVisible(item)} className="p-1.5 text-muted-foreground hover:text-foreground">
                {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => { setDeleteId(item.id) }} className="p-1.5 text-destructive">✕</button>
            </div>
          </div>
        )} />
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Service</h3>
            <div className="space-y-1"><label className="text-sm">Icon (emoji or Lucide name)</label><input type="text" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="🚀 or Code2" /></div>
            <div className="space-y-1"><label className="text-sm">Title</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
            <div className="space-y-1"><label className="text-sm">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" /></div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={save} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteItem} message="Delete this service?" />
    </div>
  )
}
