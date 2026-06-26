// Seed script for Pratik Chaudhary Portfolio CMS
// Run: node scripts/seed.js
// Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '..', '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://mpketcmsusyohnjbkoyu.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding portfolio data...')

  // Hero
  const { error: heroErr } = await supabase.from('hero').upsert({
    name: 'Pratik Chaudhary',
    tagline: 'Full Stack Developer, MERN Stack Developer, Python Developer, Data Science Enthusiast, UI/UX Enthusiast',
    subtitle: 'Dedicated Computer Science student with proven full-stack development expertise. Proficient in MERN Stack, Python, Java, and data science technologies. Combines technical proficiency with digital marketing experience to create impactful, user-centered solutions.',
    cta_primary_label: 'Hire Me',
    cta_primary_url: '#contact',
    cta_secondary_label: 'About Me ↓',
    cta_secondary_url: '#about',
    profile_image_url: '',
    resume_url: '/CV.pdf',
  })
  if (heroErr) console.error('Hero error:', heroErr.message)
  else console.log('✓ Hero seeded')

  // Social Links
  const socials = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/pratik-chaudhary-web/', icon: 'Linkedin', display_order: 0, is_visible: true },
    { platform: 'GitHub', url: 'https://github.com/Pratik980', icon: 'Github', display_order: 1, is_visible: true },
    { platform: 'Twitter', url: 'https://x.com/PraTik_980', icon: 'Twitter', display_order: 2, is_visible: true },
    { platform: 'Telegram', url: 'https://t.me/pratik_web', icon: 'Send', display_order: 3, is_visible: true },
    { platform: 'Instagram', url: 'https://www.instagram.com/ig_pratik0p/', icon: 'Instagram', display_order: 4, is_visible: true },
  ]
  await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: socialErr } = await supabase.from('social_links').insert(socials)
  if (socialErr) console.error('Social links error:', socialErr.message)
  else console.log('✓ Social links seeded')

  // About
  const { error: aboutErr } = await supabase.from('about').upsert({
    bio: '<p>Dedicated Computer Science student with proven full-stack development expertise and hands-on experience building production-grade applications. Proficient in <strong>MERN Stack</strong>, Python, Java, and data science technologies with demonstrated ability to deliver scalable solutions for real-world clients.</p><p>Strong foundation in software engineering principles, machine learning, and data-driven decision-making. Combines technical proficiency with digital marketing experience and collaborative mindset to create impactful, user-centered solutions.</p>',
    profile_image_url: '',
  })
  if (aboutErr) console.error('About error:', aboutErr.message)
  else console.log('✓ About seeded')

  // About Stats
  const stats = [
    { label: 'Projects', value: '10+', display_order: 0 },
    { label: 'Years Coding', value: '2+', display_order: 1 },
    { label: 'MERN Expert', value: '', display_order: 2 },
  ]
  await supabase.from('about_stats').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('about_stats').insert(stats)
  console.log('✓ About stats seeded')

  // Skill Categories & Skills
  const skillData = [
    { name: 'Frontend', order: 0, skills: [
      { name: 'ReactJS', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', proficiency: 90 },
      { name: 'JavaScript', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', proficiency: 85 },
      { name: 'HTML5', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg', proficiency: 95 },
      { name: 'CSS3', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg', proficiency: 90 },
      { name: 'TailwindCSS', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', proficiency: 88 },
    ]},
    { name: 'Backend', order: 1, skills: [
      { name: 'NodeJS', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg', proficiency: 85 },
      { name: 'ExpressJS', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg', proficiency: 85 },
      { name: 'Python', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', proficiency: 80 },
      { name: 'Java', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', proficiency: 75 },
      { name: 'PHP', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg', proficiency: 65 },
    ]},
    { name: 'Database', order: 2, skills: [
      { name: 'MongoDB', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', proficiency: 85 },
      { name: 'MySQL', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 80 },
      { name: 'SQL', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg', proficiency: 78 },
    ]},
    { name: 'Data Science', order: 3, skills: [
      { name: 'Pandas', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg', proficiency: 75 },
      { name: 'NumPy', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg', proficiency: 75 },
      { name: 'Scikit-Learn', icon_url: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg', proficiency: 70 },
      { name: 'Matplotlib', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matplotlib/matplotlib-original.svg', proficiency: 70 },
      { name: 'R', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg', proficiency: 60 },
    ]},
    { name: 'Tools & Platforms', order: 4, skills: [
      { name: 'Git', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', proficiency: 85 },
      { name: 'GitHub', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', proficiency: 85 },
      { name: 'Postman', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg', proficiency: 80 },
      { name: 'Firebase', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg', proficiency: 75 },
      { name: 'VSCode', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', proficiency: 95 },
      { name: 'Jupyter', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg', proficiency: 70 },
      { name: 'Netlify', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg', proficiency: 80 },
      { name: 'Vercel', icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg', proficiency: 80 },
    ]},
  ]

  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('skill_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  for (const cat of skillData) {
    const { data: catData, error: catErr } = await supabase.from('skill_categories').insert({ name: cat.name, display_order: cat.order }).select().single()
    if (catErr) { console.error(`Category error: ${cat.name}`, catErr.message); continue }
    const skills = cat.skills.map((s, i) => ({ ...s, category_id: catData.id, display_order: i, is_visible: true }))
    const { error: skErr } = await supabase.from('skills').insert(skills)
    if (skErr) console.error(`Skills error for ${cat.name}:`, skErr.message)
  }
  console.log('✓ Skills seeded')

  // Projects
  const projects = [
    { title: 'SkillDurbar Learning Management System', short_description: 'Comprehensive e-learning platform with course catalog, mentoring, and dynamic learning paths.', full_description: '<p>Comprehensive e-learning platform featuring course catalog, interactive dashboard, mentoring, and dynamic learning paths to assist students in practical training and upskilling.</p>', tech_stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS'], live_url: 'https://skilldarbarlmss.netlify.app/', github_url: 'https://github.com/Pratik980/skilldarbarLMS', thumbnail_url: 'https://skilldarbarlmss.netlify.app/assets/images/hero-bg.png', is_featured: true, display_order: 0 },
    { title: 'Hotel Grill Durbar', short_description: 'Complete landing page for a premium hotel with modern aesthetics and room showcase.', full_description: '<p>A complete landing page and front-facing site for a premium hotel. Designed with modern aesthetics to showcase their rooms, services, and online presence.</p>', tech_stack: ['React.js', 'Tailwind CSS', 'Responsive UI'], live_url: 'https://www.hotelgrilldurbar.com.np/', is_featured: true, display_order: 1 },
    { title: 'Skating Park Management System', short_description: 'Production-grade park management with session booking and payment processing.', full_description: '<p>Production-grade skating park management platform actively used by a real client. Features automated session booking, real-time slot management, player tracking, and secure payment processing managing 500+ bookings monthly.</p>', tech_stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Stripe API'], live_url: 'https://roshanskatingpark.netlify.app/login', github_url: 'https://github.com/Pratik980/Skating-Park-Management', is_featured: true, display_order: 2 },
    { title: 'Prabin Institute Learning Platform', short_description: 'E-learning platform for NEB exam preparation with video courses and payments.', full_description: '<p>Comprehensive e-learning platform for NEB exam preparation with video course delivery, progress tracking, secure payment processing with automated WhatsApp notifications.</p>', tech_stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Payment Gateway'], live_url: 'https://prabin-institute.netlify.app/', github_url: 'https://github.com/Pratik980/prabin-institute-neb-courses', is_featured: true, display_order: 3 },
    { title: 'Mini Amazon E-Commerce', short_description: 'Full e-commerce app with auth, cart, orders, and admin dashboard.', full_description: '<p>Complete e-commerce application with user authentication, product catalog, cart, order management, and admin dashboard for inventory, user administration, order tracking, and sales analytics.</p>', tech_stack: ['React.js', 'Node.js', 'MongoDB', 'Express.js', 'JWT'], github_url: 'https://github.com/Pratik980/Mini-Amazon-MERN-Stack-E-Commerce-Application', display_order: 4 },
    { title: 'URJA Smart Energy Platform', short_description: 'Energy monitoring with AI forecasting and analytics dashboards.', full_description: '<p>Intelligent energy monitoring system with real-time consumption insights, AI-driven energy forecasting, interactive analytics dashboards, and gamification features targeting 20% energy cost reduction.</p>', tech_stack: ['Node.js', 'MongoDB', 'Machine Learning', 'Chart.js'], github_url: 'https://github.com/Pratik980/URJA---Smart-Energy-Analytics-Platform', display_order: 5 },
    { title: 'GharNirman AI Contractor Evaluation', short_description: 'AI-powered bid evaluation platform using Random Forest.', full_description: '<p>AI-powered bid evaluation platform using Random Forest algorithm for contractor proposal analysis. Automated cost estimation with 85% prediction accuracy.</p>', tech_stack: ['Node.js', 'MongoDB', 'Random Forest', 'Python'], github_url: 'https://github.com/Pratik980/GharNirman', display_order: 6 },
    { title: 'Bhabhya Event Management', short_description: 'Event booking platform with Google OAuth and email notifications.', full_description: '<p>Full-featured event booking platform with real-time availability checking, automated email notifications, Google OAuth 2.0 integration, and comprehensive admin panel.</p>', tech_stack: ['PHP', 'MySQL', 'Google OAuth', 'Email API'], github_url: 'https://github.com/Pratik980/Bhabhya_Event', display_order: 7 },
    { title: 'Motosafa Waste Management', short_description: 'Waste collection app with GPS tracking and multilingual support.', full_description: '<p>Waste collection app with GPS-based real-time tracking, automated SMS alerts, multilingual support (English/Nepali).</p>', tech_stack: ['GPS Tracking', 'SMS Integration', 'Multilingual'], github_url: 'https://github.com/Pratik980/Motosafa-Waste-Management-System', display_order: 8 },
    { title: 'Student Management System', short_description: 'Java-based student records management with JDBC.', full_description: '<p>Robust Java-based system with MySQL integration for managing student records, enrollment, and attendance. Normalized database schema with JDBC prepared statements preventing SQL injection.</p>', tech_stack: ['Java', 'MySQL', 'JDBC'], github_url: 'https://github.com/Pratik980/StudentManagementSystem', display_order: 9 },
  ]

  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: projErr } = await supabase.from('projects').insert(projects.map(p => ({ ...p, is_visible: true })))
  if (projErr) console.error('Projects error:', projErr.message)
  else console.log('✓ Projects seeded')

  // Experience
  const experiences = [
    { job_title: 'MERN Stack Developer Intern (Remote)', company: 'Bheema Infotech Pvt. Ltd.', location: 'Indore, India', employment_type: 'Internship', start_date: '2025-11-01', end_date: '2026-01-31', is_current: false, description: '<p>Developed production-ready full-stack web applications using MongoDB, Express.js, React.js, and Node.js. Architected RESTful APIs with JWT authentication, role-based access control, and data validation. Optimized database queries improving performance by 40%. Integrated third-party services including payment gateways, OAuth systems, and notification services.</p>', display_order: 0 },
    { job_title: 'Social Media Manager', company: 'Nagmani International Pvt. Ltd.', location: 'Kathmandu, Nepal', employment_type: 'Part-time', start_date: '2025-03-01', end_date: '2025-05-31', is_current: false, description: '<p>Managed multi-platform social media presence, increasing engagement rates by 35% through data-driven strategies. Created and edited multimedia content using Canva and CapCut, producing 50+ promotional videos and graphics. Analyzed social media metrics using analytics tools to optimize content performance.</p>', display_order: 1 },
  ]
  await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('experience').insert(experiences)
  console.log('✓ Experience seeded')

  // Education
  const education = [
    { degree: 'BSc. CSIT', field_of_study: 'Computer Science and Information Technology', institution: 'Tribhuvan University', institution_logo_url: '', start_year: 2022, end_year: 2026, grade: '', description: "Bachelor's degree in Computer Science and Information Technology", display_order: 0 },
    { degree: '+2 Science', field_of_study: 'Science', institution: 'Apple International College', institution_logo_url: '', start_year: 2020, end_year: 2022, grade: '', description: 'Higher Secondary Education in Science', display_order: 1 },
    { degree: 'SEE', field_of_study: '', institution: 'Trijuda Higher Secondary School', institution_logo_url: '', start_year: 2018, end_year: 2020, grade: '', description: 'Secondary Education Examination', display_order: 2 },
  ]
  await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('education').insert(education)
  console.log('✓ Education seeded')

  // Services
  const services = [
    { title: 'Web Development', icon: '🌐', description: 'Full-stack web applications using MERN stack, with responsive design and optimal performance.', display_order: 0, is_visible: true },
    { title: 'API Development', icon: '🔌', description: 'RESTful API design and development with authentication, authorization, and documentation.', display_order: 1, is_visible: true },
    { title: 'Data Science', icon: '📊', description: 'Data analysis, visualization, and machine learning solutions using Python ecosystem.', display_order: 2, is_visible: true },
    { title: 'UI/UX Design', icon: '🎨', description: 'User-centered interface design with modern aesthetics and seamless user experiences.', display_order: 3, is_visible: true },
  ]
  await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('services').insert(services)
  console.log('✓ Services seeded')

  // Contact Info
  await supabase.from('contact_info').upsert({
    email: 'prtkcha980@gmail.com',
    phone: '+977-9800000000',
    address: 'Kalanki, Kathmandu, Nepal',
  })
  console.log('✓ Contact info seeded')

  // Navbar
  await supabase.from('navbar_settings').upsert({
    logo_text: 'PRATIK',
    resume_url: '/CV.pdf',
  })
  console.log('✓ Navbar seeded')

  // Nav Links
  const navLinks = [
    { label: 'About', href: '#about', display_order: 0, is_visible: true },
    { label: 'Skills', href: '#skills', display_order: 1, is_visible: true },
    { label: 'Education', href: '#education', display_order: 2, is_visible: true },
    { label: 'Projects', href: '#portfolio', display_order: 3, is_visible: true },
    { label: 'Experience', href: '#experience', display_order: 4, is_visible: true },
    { label: 'Certifications', href: '#certifications', display_order: 5, is_visible: true },
    { label: 'Contact', href: '#contact', display_order: 6, is_visible: true },
  ]
  await supabase.from('nav_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('nav_links').insert(navLinks)
  console.log('✓ Nav links seeded')

  // Footer
  await supabase.from('footer_settings').upsert({
    copyright_text: '© 2024 Pratik Chaudhary. All rights reserved.',
  })
  console.log('✓ Footer seeded')

  // SEO
  await supabase.from('seo_settings').upsert({
    page_title: 'Pratik Chaudhary | Full Stack Developer | MERN Stack, Python, Java, Data Science',
    meta_description: 'Full Stack Developer specializing in MERN Stack, Python, Java, and Data Science. Computer Science student with proven full-stack development expertise.',
    meta_keywords: ['Pratik Chaudhary', 'Full Stack Developer', 'MERN Stack', 'React Developer', 'Python Developer', 'Nepal', 'Portfolio'],
    twitter_handle: '@PraTik_980',
  })
  console.log('✓ SEO seeded')

  console.log('\n✅ All data seeded successfully!')
}

seed().catch(console.error)
