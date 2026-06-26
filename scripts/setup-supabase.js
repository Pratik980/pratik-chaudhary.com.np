import * as https from 'node:https'

const PROJECT_REF = 'mpketcmsusyohnjbkoyu'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'YOUR_SUPABASE_ACCESS_TOKEN'

async function runSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    }
    const req = https.request(options, (res) => {
      let body = ''
      res.on('data', chunk => body += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body)
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body.substring(0, 300)}`))
        }
      })
    })
    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function main() {
  console.log('Creating tables...')

  const schema = `
CREATE TABLE IF NOT EXISTS hero (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  subtitle text,
  cta_primary_label text,
  cta_primary_url text,
  cta_secondary_label text,
  cta_secondary_url text,
  profile_image_url text,
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bio text,
  profile_image_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  display_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skill_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  display_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES skill_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  icon_url text,
  proficiency int CHECK (proficiency BETWEEN 0 AND 100),
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  short_description text,
  full_description text,
  thumbnail_url text,
  live_url text,
  github_url text,
  tech_stack text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title text NOT NULL,
  company text NOT NULL,
  company_logo_url text,
  location text,
  employment_type text,
  start_date date,
  end_date date,
  is_current boolean DEFAULT false,
  description text,
  display_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS education (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  degree text NOT NULL,
  field_of_study text,
  institution text NOT NULL,
  institution_logo_url text,
  start_year int,
  end_year int,
  grade text,
  description text,
  display_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  icon text,
  title text NOT NULL,
  description text,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text,
  client_company text,
  client_photo_url text,
  quote text NOT NULL,
  rating int CHECK (rating BETWEEN 1 AND 5),
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone text,
  whatsapp text,
  address text,
  map_embed_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS navbar_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_text text,
  logo_image_url text,
  resume_url text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS nav_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  href text NOT NULL,
  display_order int DEFAULT 0,
  is_visible boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS footer_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  copyright_text text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title text,
  meta_description text,
  meta_keywords text,
  og_image_url text,
  twitter_handle text,
  updated_at timestamptz DEFAULT now()
);
`
  try {
    await runSQL(schema)
    console.log('✓ All tables created')
  } catch (e) {
    console.error('Table creation error:', e.message)
  }

  console.log('Enabling RLS...')
  const rlsTables = [
    'hero', 'social_links', 'about', 'about_stats', 'skill_categories',
    'skills', 'projects', 'experience', 'education', 'services',
    'testimonials', 'contact_info', 'contact_submissions', 'navbar_settings',
    'nav_links', 'footer_settings', 'seo_settings'
  ]

  for (const table of rlsTables) {
    try {
      await runSQL(`ALTER TABLE IF EXISTS ${table} ENABLE ROW LEVEL SECURITY;`)
    } catch (e) {
      console.error(`RLS error for ${table}:`, e.message)
    }
  }
  console.log('✓ RLS enabled')

  console.log('Creating RLS policies...')
  let policiesSQL = ''

  for (const table of rlsTables) {
    policiesSQL += `DROP POLICY IF EXISTS "Public read ${table}" ON ${table};\n`
    policiesSQL += `DROP POLICY IF EXISTS "Admin all ${table}" ON ${table};\n`
  }

  // Public select policies
  const publicTables = rlsTables
  for (const table of publicTables) {
    let condition = 'true'
    if (['skills', 'projects', 'services', 'testimonials', 'nav_links'].includes(table)) {
      condition = 'is_visible = true'
    }
    policiesSQL += `CREATE POLICY "Public read ${table}" ON ${table} FOR SELECT USING (${condition});\n`
  }

  // Public insert for contact_submissions
  policiesSQL += `DROP POLICY IF EXISTS "Public insert contact_submissions" ON contact_submissions;\n`
  policiesSQL += `CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);\n`

  // Admin policies
  for (const table of rlsTables) {
    policiesSQL += `CREATE POLICY "Admin all ${table}" ON ${table} FOR ALL USING (auth.role() = 'authenticated');\n`
  }

  try {
    await runSQL(policiesSQL)
    console.log('✓ RLS policies created')
  } catch (e) {
    console.error('Policy creation error:', e.message)
  }

  // Storage bucket
  console.log('Creating storage bucket...')
  try {
    await runSQL(`
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin update storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete storage" ON storage.objects;

CREATE POLICY "Public read storage" ON storage.objects 
  FOR SELECT USING (bucket_id = 'portfolio-assets');

CREATE POLICY "Admin upload storage" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin update storage" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete storage" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated'
  );
`)
    console.log('✓ Storage bucket and policies created')
  } catch (e) {
    console.error('Storage error:', e.message)
  }

  console.log('\n✅ Database setup complete!')
}

main().catch(console.error)
