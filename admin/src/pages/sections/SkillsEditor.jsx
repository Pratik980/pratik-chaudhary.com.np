import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import ConfirmDialog from '../../components/ConfirmDialog'
import { Plus, Trash2, Edit3, ChevronDown, ChevronRight, Save } from 'lucide-react'

export default function SkillsEditor() {
  const queryClient = useQueryClient()
  const [collapsed, setCollapsed] = useState({})
  const [deleteId, setDeleteId] = useState(null)
  const [deleteType, setDeleteType] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [skillModal, setSkillModal] = useState(null)
  const [skillForm, setSkillForm] = useState({ name: '', category_id: '', icon_url: '', proficiency: 75, display_order: 0, is_visible: true })
  const [showAddCategory, setShowAddCategory] = useState(false)

  const { data: categories } = useQuery({
    queryKey: ['skill-categories'],
    queryFn: async () => {
      const { data } = await supabase.from('skill_categories').select('*, skills(*)').order('display_order')
      return data || []
    },
  })

  const addCategory = async () => {
    if (!newCategoryName) return toast.error('Enter a category name')
    const { error } = await supabase.from('skill_categories').insert([{ name: newCategoryName, display_order: (categories?.length || 0) }])
    if (error) return toast.error(error.message)
    setNewCategoryName('')
    setShowAddCategory(false)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
    toast.success('Category added!')
  }

  const updateCategory = async (id, name) => {
    const { error } = await supabase.from('skill_categories').update({ name }).eq('id', id)
    if (error) return toast.error(error.message)
    setEditingCategory(null)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
    toast.success('Updated!')
  }

  const deleteCategory = async (id) => {
    const { error } = await supabase.from('skill_categories').delete().eq('id', id)
    if (error) return toast.error(error.message)
    setDeleteId(null); setDeleteType(null)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
    toast.success('Category deleted!')
  }

  const openSkill = (catId, skill) => {
    if (skill) setSkillForm(skill)
    else setSkillForm({ name: '', category_id: catId, icon_url: '', proficiency: 75, display_order: 0, is_visible: true })
    setSkillModal(true)
  }

  const saveSkill = async () => {
    if (!skillForm.name) return toast.error('Skill name is required')
    const { error } = skillForm.id
      ? await supabase.from('skills').update(skillForm).eq('id', skillForm.id)
      : await supabase.from('skills').insert([skillForm])
    if (error) return toast.error(error.message)
    setSkillModal(null)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
    toast.success(skillForm.id ? 'Updated!' : 'Skill added!')
  }

  const deleteSkill = async (id) => {
    const { error } = await supabase.from('skills').delete().eq('id', id)
    if (error) return toast.error(error.message)
    setDeleteId(null); setDeleteType(null)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
    toast.success('Deleted!')
  }

  const toggleVisibility = async (skill) => {
    const { error } = await supabase.from('skills').update({ is_visible: !skill.is_visible }).eq('id', skill.id)
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['skill-categories'] })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Skills</h1>
        <button onClick={() => setShowAddCategory(!showAddCategory)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showAddCategory && (
        <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-4">
          <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="Category name..." />
          <button onClick={addCategory} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Add</button>
          <button onClick={() => setShowAddCategory(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
        </div>
      )}

      {categories?.map((cat) => (
        <div key={cat.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-accent/30">
            <button onClick={() => setCollapsed({ ...collapsed, [cat.id]: !collapsed[cat.id] })} className="flex items-center gap-2">
              {collapsed[cat.id] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {editingCategory === cat.id ? (
                <input type="text" value={cat.name} onChange={(e) => {
                  const updated = categories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c)
                  queryClient.setQueryData(['skill-categories'], updated)
                }} className="px-2 py-1 bg-background border border-input rounded text-foreground text-sm" autoFocus />
              ) : (
                <h3 className="font-semibold text-foreground">{cat.name}</h3>
              )}
            </button>
            <div className="flex items-center gap-2">
              {editingCategory === cat.id ? (
                <button onClick={() => updateCategory(cat.id, cat.name)} className="p-1.5 text-green-500 hover:bg-green-500/10 rounded"><Save className="w-4 h-4" /></button>
              ) : (
                <button onClick={() => setEditingCategory(cat.id)} className="p-1.5 text-muted-foreground hover:text-foreground"><Edit3 className="w-4 h-4" /></button>
              )}
              <button onClick={() => { setDeleteId(cat.id); setDeleteType('category') }} className="p-1.5 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-4 h-4" /></button>
              <button onClick={() => openSkill(cat.id, null)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium"><Plus className="w-3 h-3 inline" /> Skill</button>
            </div>
          </div>
          {!collapsed[cat.id] && (
            <div className="p-4 space-y-2">
              {cat.skills?.length ? cat.skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between p-3 bg-accent/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {skill.icon_url && <img src={skill.icon_url} alt="" className="w-8 h-8 object-contain" />}
                    <div>
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <div className="w-32 h-1.5 bg-border rounded-full mt-1">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${skill.proficiency || 0}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleVisibility(skill)} className={`px-2 py-0.5 text-xs rounded-full ${skill.is_visible ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {skill.is_visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button onClick={() => openSkill(cat.id, skill)} className="p-1 text-muted-foreground hover:text-foreground"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={() => { setDeleteId(skill.id); setDeleteType('skill') }} className="p-1 text-destructive"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">No skills in this category</p>}
            </div>
          )}
        </div>
      ))}

      {skillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSkillModal(null)} />
          <div className="relative bg-card border border-border rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">{skillForm.id ? 'Edit' : 'Add'} Skill</h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm">Name</label>
                <input type="text" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Category</label>
                <select value={skillForm.category_id} onChange={(e) => setSkillForm({ ...skillForm, category_id: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground">
                  {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <ImageUpload value={skillForm.icon_url} onChange={(url) => setSkillForm({ ...skillForm, icon_url: url })} folder="skills" label="Icon" />
              <div className="space-y-1">
                <label className="text-sm">Proficiency: {skillForm.proficiency}%</label>
                <input type="range" min="0" max="100" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={skillForm.is_visible} onChange={(e) => setSkillForm({ ...skillForm, is_visible: e.target.checked })} id="skill-visible" />
                <label htmlFor="skill-visible" className="text-sm">Visible</label>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setSkillModal(null)} className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md">Cancel</button>
              <button onClick={saveSkill} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md">Save</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => deleteType === 'category' ? deleteCategory(deleteId) : deleteSkill(deleteId)}
        message={`Delete this ${deleteType}? ${deleteType === 'category' ? 'All skills in this category will also be deleted.' : ''}`} />
    </div>
  )
}
