import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import TagInput from '../../components/TagInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Save } from 'lucide-react'

export default function FooterEditor() {
  const queryClient = useQueryClient()
  const [copyright, setCopyright] = useState('')
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState([])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['footer'],
    queryFn: async () => {
      const { data } = await supabase.from('footer_settings').select('*').limit(1).maybeSingle()
      return data || {}
    },
  })

  useEffect(() => {
    if (data) {
      if (data.copyright_text) setCopyright(data.copyright_text)
      if (data.description) setDescription(data.description)
      if (data.tech_stack) setTechStack(data.tech_stack)
    }
  }, [data])

  if (isLoading) return <LoadingSpinner text="Loading footer..." />
  if (isError) return <ErrorMessage message={error?.message || 'Failed to load footer'} />

  const save = async () => {
    const existing = await supabase.from('footer_settings').select('id').limit(1).maybeSingle()
    const { error } = existing.data
      ? await supabase.from('footer_settings').update({ copyright_text: copyright, description, tech_stack: techStack, updated_at: new Date().toISOString() }).eq('id', existing.data.id)
      : await supabase.from('footer_settings').insert([{ copyright_text: copyright, description, tech_stack: techStack }])
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['footer'] })
    toast.success('Footer saved!')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Footer</h1>
      <div className="bg-card border border-border rounded-xl p-6 space-y-4 max-w-lg">
        <div className="space-y-1">
          <label className="text-sm font-medium">Copyright Text</label>
          <input type="text" value={copyright} onChange={(e) => setCopyright(e.target.value)} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="© 2024 Pratik Chaudhary. All rights reserved." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" placeholder="Full Stack Developer crafting scalable digital solutions..." />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Tech Stack</label>
          <TagInput value={techStack} onChange={setTechStack} />
        </div>
        <p className="text-xs text-muted-foreground">Social links are managed in the Hero section editor.</p>
        <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium"><Save className="w-4 h-4" /> Save Footer</button>
      </div>
    </div>
  )
}
