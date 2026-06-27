import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Plus, Save, Star } from 'lucide-react'

const blank = { client_name: '', client_role: '', client_company: '', client_photo_url: '', quote: '', rating: 5, display_order: 0, is_visible: true }

export default function TestimonialsEditor() {
  const queryClient = useQueryClient()
  const [items, setItems] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(blank)
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data } = await supabase.from('testimonials').select('*').order('display_order')
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
    if (!form.client_name || !form.quote) return toast.error('Name and quote are required')
    const { error } = form.id
      ? await supabase.from('testimonials').update(form).eq('id', form.id)
      : await supabase.from('testimonials').insert([form])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    toast.success(form.id ? 'Updated!' : 'Testimonial added!')
  }

  const deleteItem = async () => {
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    toast.success('Deleted!')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => openForm(item)}>
                {item.client_photo_url ? <img src={item.client_photo_url} alt="" className="w-12 h-12 rounded-full object-cover" /> : <div className="w-12 h-12 rounded-full bg-accent" />}
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.client_name}</p>
                  <p className="text-xs text-muted-foreground">{item.client_role}{item.client_company ? ` at ${item.client_company}` : ''}</p>
                </div>
              </div>
              <button onClick={() => { setDeleteId(item.id) }} className="p-1 text-destructive">✕</button>
            </div>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= (item.rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />)}
            </div>
            <p className="text-sm text-muted-foreground italic">"{item.quote}"</p>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={item.is_visible} onChange={() => { supabase.from('testimonials').update({ is_visible: !item.is_visible }).eq('id', item.id); queryClient.invalidateQueries({ queryKey: ['testimonials'] }) }} />
              Visible
            </label>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Testimonial</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><label className="text-sm">Client Name</label><input type="text" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Role</label><input type="text" value={form.client_role} onChange={(e) => setForm({ ...form, client_role: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Company</label><input type="text" value={form.client_company} onChange={(e) => setForm({ ...form, client_company: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
              <div className="space-y-1"><label className="text-sm">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}>
                      <Star className={`w-6 h-6 ${s <= form.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <ImageUpload value={form.client_photo_url} onChange={(url) => setForm({ ...form, client_photo_url: url })} folder="testimonials" label="Client Photo" />
            <div className="space-y-1"><label className="text-sm">Quote</label><textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" /></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} /> Visible</label>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={save} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteItem} message="Delete this testimonial?" />
    </div>
  )
}
