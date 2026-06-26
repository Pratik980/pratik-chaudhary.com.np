const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://mpketcmsusyohnjbkoyu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2V0Y21zdXN5b2huamJrb3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3NjI0ODAsImV4cCI6MjA5NzMzODQ4MH0.7imuoGJGclZ3B38sNvB_bQ2BE2rdOBKUjxtA2_R_E8s'

const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('projects').select('id, title, thumbnail_url')
  if (error) {
    console.error('Error fetching projects:', error)
    return
  }
  console.log('Projects stored in DB:')
  console.log(JSON.stringify(data, null, 2))
}

run()
