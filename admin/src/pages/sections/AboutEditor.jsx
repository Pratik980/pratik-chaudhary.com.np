import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import RichTextEditor from '../../components/RichTextEditor'
import SortableList from '../../components/SortableList'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Save, Plus, Trash2 } from 'lucide-react'

const defaultAbout = { bio: '', profile_image_url: '', display_name: '', role: '', email: '', location: '' }

export default function AboutEditor() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(defaultAbout)
  const [stats, setStats] = useState([])
  const [deleteId, setDeleteId] = useState(null)
  const [newStat, setNewStat] = useState({ label: '', value: '' })

  const { data, isLoading: loading1, isError: error1, error: err1 } = useQuery({
    queryKey: ['about'],
    queryFn: async () => {
      const { data } = await supabase.from('about').select('*').limit(1).maybeSingle()
      return data || defaultAbout
    },
  })

  const { data: statsData, isLoading: loading2, isError: error2, error: err2 } = useQuery({
    queryKey: ['about-stats'],
    queryFn: async () => {
      const { data } = await supabase.from('about_stats').select('*').order('display_order')
      return data || []
    },
  })

  useEffect(() => { if (data) setForm(data) }, [data])
  useEffect(() => { if (statsData) setStats(statsData) }, [statsData])

  const saveMutation = useMutation({
    mutationFn: async (vals) => {
      const existing = await supabase.from('about').select('id').limit(1).maybeSingle()
      if (existing.data) {
        const { error } = await supabase.from('about').update({ ...vals, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('about').insert([vals])
        if (error) throw error
      }
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['about'] }); toast.success('About saved!') },
    onError: (e) => toast.error(e.message),
  })

  if (loading1 || loading2) return <LoadingSpinner text="Loading..." />
  if (error1 || error2) return <ErrorMessage message={(err1 || err2)?.message || 'Failed to load'} />

  const addStat = async () => {
    if (!newStat.label || !newStat.value) return toast.error('Fill in both fields')
    const { error } = await supabase.from('about_stats').insert([{ ...newStat, display_order: stats.length }])
    if (error) return toast.error(error.message)
    setNewStat({ label: '', value: '' })
    queryClient.invalidateQueries({ queryKey: ['about-stats'] })
    toast.success('Stat added!')
  }

  const deleteStat = async (id) => {
    const { error } = await supabase.from('about_stats').delete().eq('id', id)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['about-stats'] })
    toast.success('Deleted!')
  }

  const reorderStats = async (reordered) => {
    setStats(reordered)
    const updates = reordered.map((item, i) => ({ ...item, display_order: i }))
    const { error } = await supabase.from('about_stats').upsert(updates)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['about-stats'] })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">About Section</h1>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(form) }} className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Display Name</label>
            <input type="text" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="Pratik Chaudhary" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Role</label>
            <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="Full Stack Developer" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="prtkcha980@gmail.com" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Location</label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="Kalanki, Kathmandu, Nepal" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio (Rich Text)</label>
          <RichTextEditor value={form.bio} onChange={(v) => setForm({ ...form, bio: v })} />
        </div>
        <ImageUpload value={form.profile_image_url} onChange={(url) => setForm({ ...form, profile_image_url: url })} folder="about" label="Profile Photo" />
        <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90">
          <Save className="w-4 h-4" /> Save About
        </button>
      </form>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Stats</h2>
        <div className="flex items-end gap-3">
          <div className="space-y-1 flex-1">
            <label className="text-xs text-muted-foreground">Label</label>
            <input type="text" value={newStat.label} onChange={(e) => setNewStat({ ...newStat, label: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm" placeholder="e.g. Projects Completed" />
          </div>
          <div className="space-y-1 flex-1">
            <label className="text-xs text-muted-foreground">Value</label>
            <input type="text" value={newStat.value} onChange={(e) => setNewStat({ ...newStat, value: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground text-sm" placeholder="e.g. 50+" />
          </div>
          <button onClick={addStat} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"><Plus className="w-4 h-4" /></button>
        </div>
        <SortableList items={stats} onReorder={reorderStats} renderItem={(item) => (
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div>
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-sm text-muted-foreground ml-2">— {item.value}</span>
            </div>
            <button onClick={() => setDeleteId(item.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
          </div>
        )} />
      </div>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteStat(deleteId)} message="Delete this stat?" />
    </div>
  )
}
