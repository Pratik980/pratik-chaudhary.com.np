import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import ImageUpload from '../../components/ImageUpload'
import TagInput from '../../components/TagInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import ErrorMessage from '../../components/ErrorMessage'
import { Save } from 'lucide-react'

export default function SeoEditor() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ page_title: '', meta_description: '', meta_keywords: [], og_image_url: '', twitter_handle: '' })
  const [keywords, setKeywords] = useState([])

  const { data: seoData, isLoading, isError, error } = useQuery({
    queryKey: ['seo'],
    queryFn: async () => {
      const { data } = await supabase.from('seo_settings').select('*').limit(1).maybeSingle()
      return data || null
    },
  })
  useEffect(() => { if (seoData) { setForm(seoData); setKeywords(seoData.meta_keywords || []) } }, [seoData])

  if (isLoading) return <LoadingSpinner text="Loading..." />
  if (isError) return <ErrorMessage message={error?.message || 'Failed to load'} />

  const save = async () => {
    const vals = { ...form, meta_keywords: keywords, updated_at: new Date().toISOString() }
    const existing = await supabase.from('seo_settings').select('id').limit(1).maybeSingle()
    const { error } = existing.data
      ? await supabase.from('seo_settings').update(vals).eq('id', existing.data.id)
      : await supabase.from('seo_settings').insert([vals])
    if (error) return toast.error(error.message)
    queryClient.invalidateQueries({ queryKey: ['seo'] })
    toast.success('SEO settings saved!')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-foreground">SEO Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="space-y-1"><label className="text-sm">Page Title</label><input type="text" value={form.page_title} onChange={(e) => setForm({ ...form, page_title: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" /></div>
          <div className="space-y-1">
            <label className="text-sm">Meta Description ({form.meta_description?.length || 0}/160)</label>
            <textarea value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} rows={3} maxLength={160} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground resize-none" />
          </div>
          <div className="space-y-1"><label className="text-sm">Meta Keywords</label><TagInput value={keywords} onChange={setKeywords} /></div>
          <div className="space-y-1"><label className="text-sm">Twitter Handle</label><input type="text" value={form.twitter_handle} onChange={(e) => setForm({ ...form, twitter_handle: e.target.value })} className="w-full px-3 py-2 bg-background border border-input rounded-md text-foreground" placeholder="@handle" /></div>
          <ImageUpload value={form.og_image_url} onChange={(url) => setForm({ ...form, og_image_url: url })} folder="seo" label="OG Image" />
          <button onClick={save} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-md font-medium"><Save className="w-4 h-4" /> Save SEO</button>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Google Preview</h2>
          <div className="p-4 border border-border rounded-lg bg-background">
            <p className="text-xs text-green-700 dark:text-green-400 mb-1">{window.location?.hostname || 'pratik-chaudhary.com.np'}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium text-ellipsis overflow-hidden">{form.page_title || 'Page Title'}</p>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{form.meta_description || 'Meta description will appear here...'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
