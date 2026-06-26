import { supabase } from './supabase'

export async function uploadImage(file, folder = 'general') {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('portfolio-assets')
    .upload(fileName, file, { upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('portfolio-assets')
    .getPublicUrl(fileName)

  return publicUrl
}
