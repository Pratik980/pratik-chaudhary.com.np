# Portfolio CMS — Anchored Summary

## Goal
- Complete admin CMS with Supabase that works on the same dev port as the portfolio, with all portfolio components restored to original design and admin changes properly reflecting on the portfolio.

## Constraints & Preferences
- Admin portal must CRUD every section of the portfolio (Hero, About, Skills, Projects, Experience, Education, Services, Testimonials, Contact, Navbar, Footer, SEO, Certifications).
- Portfolio frontend must keep its original design, layout, styling, and animations intact — only the data source should change to Supabase.
- Single `npm run dev` from root must serve both portfolio (port 8080) and admin (at `/admin`).
- No Supabase keys hardcoded in source files — only in `.env`.

## Progress
### Done
- **Root cause of "changes not reflecting" fixed** — `src/api/portfolio.js` now unwraps Supabase `{ data, error }` responses (was passing entire response object, causing all components to always use hardcoded fallbacks).
- **Admin CRUD silently failing fixed** — all admin editor mutation functions now check Supabase `{ error }` and throw it, so `onError` fires instead of `onSuccess` showing false "Saved!" toasts. Fixed in: HeroEditor, AboutEditor, ExperienceEditor, EducationEditor, ServicesEditor, NavbarEditor, ContactEditor, ContactSubmissions, SkillsEditor, ProjectsEditor.
- **Admin-to-portfolio column name mismatches fixed** across all components:
  - `Portfolio.tsx`: `technologies` → `tech_stack`, `image_url` → `thumbnail_url`, `description` → `full_description`/`short_description`, `color_tag` → cyclical fallback.
  - `Experience.tsx`: `role` → `job_title`, `period` → computed from `start_date`/`end_date`/`is_current`, `side` → cyclical, added `company_logo_url` + `employment_type` display.
  - `Team.tsx` (Education): `image_url` → `institution_logo_url`, `period` → computed from `start_year`/`end_year`, `crime` → `grade`, `bounty` → `end_year`.
  - `Contact.tsx`: `location` → `address`.
  - `Hero.tsx` + `Footer.tsx`: `s.label` → `s.platform` (`social_links` has no `label` column).
  - `Awards.tsx`: `cert.color` → `cert.color_tag`, `cert.subLinks` → `cert.sub_links`.
- **Navbar join fixed** — `getNavbar()` now queries `navbar_settings` and `nav_links` separately (no FK between them, so `*.select('*, nav_links(*)')` always returned `null`).
- **Missing Supabase columns created** via Management API SQL:
  - `projects`: `category` (text), `color_tag` (text)
  - `about`: `display_name`, `role`, `email`, `location` (all text)
  - `education`: `location` (text)
  - `footer_settings`: `description` (text), `tech_stack` (jsonb)
  - All seeded with existing data.
- **Certifications table, API, admin editor, and Awards component** all created/wired:
  - `certifications` table in Supabase (id, title, issuer, date, link, color_tag, sub_links, display_order) with RLS + seed data.
  - `getCertifications()` in `src/api/portfolio.js`.
  - `CertificationsEditor.jsx` in admin with full CRUD + sub-links support.
  - Sidebar route for Certifications added.
  - `Awards.tsx` now queries Supabase via React Query instead of hardcoded data.
- **Admin editors updated** for new columns:
  - `AboutEditor.jsx`: added `display_name`, `role`, `email`, `location` fields + error-fixed `reorderStats`.
  - `ProjectsEditor.jsx`: added `category` and `color_tag` (select) fields.
  - `FooterEditor.jsx`: added `description` (textarea) and `tech_stack` (TagInput) fields, now uses `useEffect` to sync loaded data.
- **Portfolio components now use more Supabase data** (was hardcoded):
  - `Hero.tsx`: `hero?.profile_image_url` (profile photo), `hero?.name` (heading), `hero?.subtitle` (description), all CTA labels/URLs + resume URL, navbar CTA from `hero?.cta_primary_label/url`, first role badge from `typingRoles[0]`.
  - `About.tsx`: `about?.profile_image_url` (profile photo), stats now show `value` next to `label`.
  - `Footer.tsx`: `footer?.copyright_text`.
  - `Contact.tsx`: WhatsApp display from `contactInfo?.whatsapp`, map embed from `contactInfo?.map_embed_url`, form submissions now also saved to Supabase `contact_submissions` table.
- Same-port admin serving configured (proxy + `base: "/admin/"` + `BrowserRouter basename="/admin"`).
- Route paths fixed in Sidebar, Login, Dashboard, Topbar, AuthContext/ProtectedRoute.
- ProtectedRoute race condition fixed (uses `AuthContext` instead of direct `getSession()`).
- `npm run dev` runs both via `concurrently`.
- `refetchOnWindowFocus: true`, `staleTime: 0` in portfolio QueryClient.
- No Supabase keys in source — only `.env`.

### In Progress
- (none)

### Blocked
- `portfolio-assets` Storage bucket must be created manually in Supabase Dashboard (anon key lacks bucket creation permission).

## Key Decisions
- API functions must `await` Supabase calls and return only `data` — raw `{ data, error }` breaks React Query's data shape.
- Admin served via Vite proxy + `base: "/admin/"` + `BrowserRouter basename="/admin"` so both apps share port 8080.
- Auth user must be created manually in Supabase Dashboard — no registration UI.
- Storage bucket `portfolio-assets` must be created manually — anon key can't create buckets.
- `ProtectedRoute` uses `AuthContext` to avoid session race conditions.
- Missing table columns added via Management API instead of requiring user to run SQL manually.
- Component field mappings default gracefully (cyclical colors, `short_description` as category fallback, etc.) when columns don't exist yet.

## Critical Context
- Supabase project ref: `mpketcmsusyohnjbkoyu` — URL: `https://mpketcmsusyohnjbkoyu.supabase.co`
- Management access token: (removed — use SUPABASE_ACCESS_TOKEN env var)
- All 17 tables exist with seed data (including `certifications`). Anonymous CRUD works (tested). Admin login requires Auth user.
- Portfolio React Query refetches on window focus (`refetchOnWindowFocus: true`, `staleTime: 0`).
- Admin base `/admin/`, root Vite proxy forwards `/admin/*` → `http://localhost:5174/*`.
- Admin dev server auto-increments to 5175 if 5174 is taken.

## Relevant Files
- `src/api/portfolio.js`: all API functions — **must** `await` and return `data` only, not raw Supabase response. Navbar query fixed to separate queries. Certifications query added.
- `vite.config.ts`: proxy `/admin` → admin dev server.
- `src/main.tsx`: `QueryClient` with `refetchOnWindowFocus: true`, `staleTime: 0`.
- `admin/vite.config.js`: `base: "/admin/"`, `port: 5174`.
- `admin/src/App.jsx`: `BrowserRouter basename="/admin"`, routes relative, CertificationsEditor route added.
- `admin/src/context/AuthContext.jsx`: `ProtectedRoute` uses `useAuth()` context.
- `admin/src/components/Sidebar.jsx`: nav items include Certifications.
- `src/components/Hero.tsx`: all hero fields (name, subtitle, tagline, CTAs, profile_image_url, resume_url, socials platform/label fix, navbar data).
- `src/components/About.tsx`: bio, display_name, role, email, location, profile_image_url, stats label+value.
- `src/components/Portfolio.tsx`: projects mapping uses `tech_stack`, `thumbnail_url`, `full_description`/`short_description`, cyclical `color` fallback.
- `src/components/Experience.tsx`: uses `job_title`, computed `period` from dates, `company_logo_url`, `employment_type`, cyclical side/color.
- `src/components/Team.tsx` (Education): uses `institution_logo_url`, computed `period` from years, `grade` for crime badge.
- `src/components/Contact.tsx`: uses `address`, `whatsapp`, `map_embed_url`, saves submissions to Supabase.
- `src/components/Footer.tsx`: uses `copyright_text`, `description`, `tech_stack`, `getNavbar()` data, social `platform` field.
- `src/components/Awards.tsx`: uses `getCertifications()` via React Query, `color_tag`, `sub_links` fields.
- `admin/src/pages/sections/AboutEditor.jsx`: added display_name, role, email, location + reorderStats error check.
- `admin/src/pages/sections/ProjectsEditor.jsx`: added category + color_tag fields.
- `admin/src/pages/sections/FooterEditor.jsx`: added description + tech_stack (TagInput), useEffect sync.
- `admin/src/pages/sections/CertificationsEditor.jsx`: full CRUD with sub-links support.
- `admin/src/pages/sections/*Editor.jsx`: ALL editors now properly check Supabase `{ error }` in mutation functions.
- `.env` (root + admin/): Supabase credentials, gitignored.
