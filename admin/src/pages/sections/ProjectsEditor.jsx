import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import RichTextEditor from '../../components/RichTextEditor'
import TagInput from '../../components/TagInput'
import DataTable from '../../components/DataTable'
import ConfirmDialog from '../../components/ConfirmDialog'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Plus, Save } from 'lucide-react'

const defaultProject = { title: '', category: '', short_description: '', full_description: '', thumbnail_url: '', live_url: '', github_url: '', tech_stack: [], color_tag: 'accent-blue', is_featured: false, is_visible: true, display_order: 0 }

export default function ProjectsEditor() {
  const queryClient = useQueryClient()
  const [projects, setProjects] = useState([])
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(defaultProject)
  const [deleteId, setDeleteId] = useState(null)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await supabase.from('projects').select('*').order('display_order')
      return data || []
    },
  })
  useEffect(() => { if (data) setProjects(data) }, [data])

  if (isLoading) return <LoadingSpinner text="Loading..." />
  if (isError) return <ErrorMessage message={error?.message || 'Failed to load'} />

  const openForm = (project) => {
    setForm(project ? { ...project } : { ...defaultProject, display_order: projects.length })
    setModal(true)
  }

  const save = async () => {
    if (!form.title) return toast.error('Title is required')
    const { error } = form.id
      ? await supabase.from('projects').update(form).eq('id', form.id)
      : await supabase.from('projects').insert([form])
    if (error) return toast.error(error.message)
    setModal(null)
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    toast.success(form.id ? 'Updated!' : 'Project added!')
  }

  const deleteProject = async () => {
    const { error } = await supabase.from('projects').delete().eq('id', deleteId)
    if (error) return toast.error(error.message)
    setDeleteId(null)
    queryClient.invalidateQueries({ queryKey: ['projects'] })
    toast.success('Deleted!')
  }

  const toggleVisible = async (project) => {
    const { error } = await supabase.from('projects').update({ is_visible: !project.is_visible }).eq('id', project.id)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Projects</h1>
        <button onClick={() => openForm(null)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'thumbnail_url', label: 'Image', render: (v) => v ? <img src={v} alt="" className="w-12 h-8 object-cover rounded" /> : <div className="w-12 h-8 bg-accent rounded" /> },
          { key: 'title', label: 'Title' },
          { key: 'tech_stack', label: 'Tech', render: (v) => (v || []).slice(0, 3).map(t => <span key={t} className="inline-block text-xs bg-accent px-1.5 py-0.5 rounded mr-1">{t}</span>) },
          { key: 'is_featured', label: 'Featured', render: (v) => v ? <span className="text-yellow-500 text-xs font-bold">★</span> : '-' },
          { key: 'is_visible', label: 'Visible', render: (v, row) => (
            <button onClick={() => toggleVisible(row)} className={`text-xs px-2 py-0.5 rounded-full ${v ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{v ? 'Yes' : 'No'}</button>
          )},
        ]}
        data={projects}
        onEdit={openForm}
        onDelete={(row) => setDeleteId(row.id)}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-2xl w-full mx-4 shadow-xl space-y-4 mb-10">
            <h3 className="text-lg font-semibold">{form.id ? 'Edit' : 'Add'} Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm">Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Category</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="e.g. MERN Stack, Full Stack" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Display Order</label>
                <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Accent Color</label>
                <select value={form.color_tag} onChange={(e) => setForm({ ...form, color_tag: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground">
                  <option value="accent-blue">Blue</option>
                  <option value="accent-purple">Purple</option>
                  <option value="accent-emerald">Emerald</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm">Short Description</label>
              <textarea value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm">Full Description</label>
              <RichTextEditor value={form.full_description} onChange={(v) => setForm({ ...form, full_description: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUpload value={form.thumbnail_url} onChange={(url) => setForm({ ...form, thumbnail_url: url })} folder="projects" label="Thumbnail" />
              <div className="space-y-1">
                <label className="text-sm">Tech Stack</label>
                <TagInput value={form.tech_stack || []} onChange={(v) => setForm({ ...form, tech_stack: v })} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm">Live URL</label>
                <input type="text" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">GitHub URL</label>
                <input type="text" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} />
                Visible
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={save} className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"><Save className="w-4 h-4" /> Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={deleteProject} message="Delete this project?" />
    </div>
  )
}
