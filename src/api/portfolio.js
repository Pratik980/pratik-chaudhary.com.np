import { supabase } from '../lib/supabase'

export const getHero = async () => {
  const { data } = await supabase.from('hero').select('*').maybeSingle()
  return data
}

export const getSocialLinks = async () => {
  const { data } = await supabase.from('social_links').select('*').eq('is_visible', true).order('display_order')
  return data || []
}

export const getAbout = async () => {
  const { data } = await supabase.from('about').select('*').maybeSingle()
  return data
}

export const getAboutStats = async () => {
  const { data } = await supabase.from('about_stats').select('*').order('display_order')
  return data || []
}

export const getSkills = async () => {
  const { data } = await supabase.from('skill_categories').select('*, skills(*)').order('display_order')
  return data || []
}

export const getProjects = async () => {
  const { data } = await supabase.from('projects').select('*').eq('is_visible', true).order('display_order')
  return data || []
}

export const getExperience = async () => {
  const { data } = await supabase.from('experience').select('*').order('display_order')
  return data || []
}

export const getEducation = async () => {
  const { data } = await supabase.from('education').select('*').order('display_order')
  return data || []
}

export const getContactInfo = async () => {
  const { data } = await supabase.from('contact_info').select('*').maybeSingle()
  return data
}

export const getNavbar = async () => {
  const { data: navbar } = await supabase.from('navbar_settings').select('*').maybeSingle()
  if (!navbar) return null
  const { data: navLinks } = await supabase.from('nav_links').select('*').eq('is_visible', true).order('display_order')
  return { ...navbar, nav_links: navLinks || [] }
}

export const getFooter = async () => {
  const { data } = await supabase.from('footer_settings').select('*').maybeSingle()
  return data
}

export const getSeo = async () => {
  const { data } = await supabase.from('seo_settings').select('*').maybeSingle()
  return data
}

export const getCertifications = async () => {
  const { data } = await supabase.from('certifications').select('*').order('display_order')
  return data || []
}

export const submitContactForm = async (data) => {
  const { error } = await supabase.from('contact_submissions').insert([data])
  if (error) throw error
  return true
}
