import { supabase } from '../lib/supabase'

async function query(table, options = {}) {
  const { single, filter, order } = options
  let q = supabase.from(table).select(options.select || '*')
  if (filter) q = q.eq(filter.key, filter.value)
  if (order) q = q.order(order.by, { ascending: order.ascending ?? true })
  if (single) q = q.maybeSingle()

  const { data, error } = await q
  if (error) throw new Error(`Failed to fetch ${table}: ${error.message}`)
  return data
}

export const getHero = async () => {
  return query('hero', { single: true })
}

export const getSocialLinks = async () => {
  return query('social_links', { filter: { key: 'is_visible', value: true }, order: { by: 'display_order' } }) || []
}

export const getAbout = async () => {
  return query('about', { single: true })
}

export const getAboutStats = async () => {
  return query('about_stats', { order: { by: 'display_order' } }) || []
}

export const getSkills = async () => {
  return query('skill_categories', { select: '*, skills(*)', order: { by: 'display_order' } }) || []
}

export const getProjects = async () => {
  return query('projects', { filter: { key: 'is_visible', value: true }, order: { by: 'display_order' } }) || []
}

export const getExperience = async () => {
  return query('experience', { order: { by: 'display_order' } }) || []
}

export const getEducation = async () => {
  return query('education', { order: { by: 'display_order' } }) || []
}

export const getContactInfo = async () => {
  return query('contact_info', { single: true })
}

export const getNavbar = async () => {
  const navbar = await query('navbar_settings', { single: true })
  if (!navbar) return null
  const navLinks = await query('nav_links', { filter: { key: 'is_visible', value: true }, order: { by: 'display_order' } }) || []
  return { ...navbar, nav_links: navLinks }
}

export const getFooter = async () => {
  return query('footer_settings', { single: true })
}

export const getSeo = async () => {
  return query('seo_settings', { single: true })
}

export const getCertifications = async () => {
  return query('certifications', { order: { by: 'display_order' } }) || []
}

export const submitContactForm = async (data) => {
  const { error } = await supabase.from('contact_submissions').insert([data])
  if (error) throw new Error(`Failed to submit contact form: ${error.message}`)
  return true
}
