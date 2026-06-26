-- Portfolio Database Migration
-- Run this ONCE to set up all tables, RLS, and storage

-- 1. Create tables
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
  display_name text,
  role text,
  email text,
  location text,
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
  category text,
  short_description text,
  full_description text,
  thumbnail_url text,
  live_url text,
  github_url text,
  tech_stack text[] DEFAULT '{}',
  color_tag text DEFAULT 'accent-blue',
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
  phone text,
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
  description text,
  tech_stack text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seo_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title text,
  meta_description text,
  meta_keywords text[] DEFAULT '{}',
  og_image_url text,
  twitter_handle text,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date text,
  link text,
  color_tag text DEFAULT 'accent-blue',
  sub_links jsonb DEFAULT '[]'::jsonb,
  display_order int DEFAULT 0
);

-- 2. Enable RLS
DO $$ BEGIN
  ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
  ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
  ALTER TABLE about ENABLE ROW LEVEL SECURITY;
  ALTER TABLE about_stats ENABLE ROW LEVEL SECURITY;
  ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
  ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
  ALTER TABLE education ENABLE ROW LEVEL SECURITY;
  ALTER TABLE services ENABLE ROW LEVEL SECURITY;
  ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
  ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE navbar_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;
  ALTER TABLE footer_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- 3. Create RLS policies (drop first for idempotency)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public read hero" ON hero;
  CREATE POLICY "Public read hero" ON hero FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read social_links" ON social_links;
  CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read about" ON about;
  CREATE POLICY "Public read about" ON about FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read about_stats" ON about_stats;
  CREATE POLICY "Public read about_stats" ON about_stats FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read skill_categories" ON skill_categories;
  CREATE POLICY "Public read skill_categories" ON skill_categories FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read skills" ON skills;
  CREATE POLICY "Public read skills" ON skills FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Public read projects" ON projects;
  CREATE POLICY "Public read projects" ON projects FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Public read experience" ON experience;
  CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read education" ON education;
  CREATE POLICY "Public read education" ON education FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read services" ON services;
  CREATE POLICY "Public read services" ON services FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
  CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Public read contact_info" ON contact_info;
  CREATE POLICY "Public read contact_info" ON contact_info FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public insert contact_submissions" ON contact_submissions;
  CREATE POLICY "Public insert contact_submissions" ON contact_submissions FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Public read navbar_settings" ON navbar_settings;
  CREATE POLICY "Public read navbar_settings" ON navbar_settings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read nav_links" ON nav_links;
  CREATE POLICY "Public read nav_links" ON nav_links FOR SELECT USING (is_visible = true);

  DROP POLICY IF EXISTS "Public read footer_settings" ON footer_settings;
  CREATE POLICY "Public read footer_settings" ON footer_settings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read seo_settings" ON seo_settings;
  CREATE POLICY "Public read seo_settings" ON seo_settings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Public read certifications" ON certifications;
  CREATE POLICY "Public read certifications" ON certifications FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admin all hero" ON hero;
  CREATE POLICY "Admin all hero" ON hero FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all social_links" ON social_links;
  CREATE POLICY "Admin all social_links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all about" ON about;
  CREATE POLICY "Admin all about" ON about FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all about_stats" ON about_stats;
  CREATE POLICY "Admin all about_stats" ON about_stats FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all skill_categories" ON skill_categories;
  CREATE POLICY "Admin all skill_categories" ON skill_categories FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all skills" ON skills;
  CREATE POLICY "Admin all skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all projects" ON projects;
  CREATE POLICY "Admin all projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all experience" ON experience;
  CREATE POLICY "Admin all experience" ON experience FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all education" ON education;
  CREATE POLICY "Admin all education" ON education FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all services" ON services;
  CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all testimonials" ON testimonials;
  CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all contact_info" ON contact_info;
  CREATE POLICY "Admin all contact_info" ON contact_info FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all contact_submissions" ON contact_submissions;
  CREATE POLICY "Admin all contact_submissions" ON contact_submissions FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all navbar_settings" ON navbar_settings;
  CREATE POLICY "Admin all navbar_settings" ON navbar_settings FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all nav_links" ON nav_links;
  CREATE POLICY "Admin all nav_links" ON nav_links FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all footer_settings" ON footer_settings;
  CREATE POLICY "Admin all footer_settings" ON footer_settings FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all seo_settings" ON seo_settings;
  CREATE POLICY "Admin all seo_settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');
  DROP POLICY IF EXISTS "Admin all certifications" ON certifications;
  CREATE POLICY "Admin all certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
END $$;

-- 4. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read storage" ON storage.objects;
CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-assets');

DROP POLICY IF EXISTS "Admin upload storage" ON storage.objects;
CREATE POLICY "Admin upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update storage" ON storage.objects;
CREATE POLICY "Admin update storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete storage" ON storage.objects;
CREATE POLICY "Admin delete storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'portfolio-assets' AND auth.role() = 'authenticated');
