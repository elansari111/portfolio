-- ==============================================================================
-- REALISTIC SEED DATA FOR PORTFOLIO
-- Execute this script directly in the Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. CLEAN UP PREVIOUS DUMMY DATA
DELETE FROM projects WHERE title = 'cc' OR title = '';
DELETE FROM skills WHERE name = 'React' AND category = 'Frontend' AND level = 90;

-- 2. SEED REALISTIC PROJECTS
INSERT INTO projects (title, description, image_url, demo_url, repo_url, tags) VALUES
(
  'NexusAI — Generative Workflow Automation',
  'Enterprise-grade platform connecting LLM agents to production databases and APIs with real-time stream execution and telemetry.',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'https://nexusai.demo.dev',
  'https://github.com/elansari111/nexus-ai-platform',
  ARRAY['React', 'Next.js 14', 'TypeScript', 'TailwindCSS', 'OpenAI', 'PostgreSQL', 'Redis']
),
(
  'Apex — High-Frequency Asset Analytics',
  'Modern trading terminal featuring sub-millisecond WebSocket tickers, interactive candlestick charting, and automated portfolio rebalancing.',
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=1200&auto=format&fit=crop',
  'https://apex-ledger.demo.dev',
  'https://github.com/elansari111/apex-crypto-dashboard',
  ARRAY['React', 'Vite', 'TailwindCSS', 'WebSocket', 'Chart.js', 'Go', 'Docker']
),
(
  'Aura — Luxury Minimalist E-Commerce',
  'High-conversion digital storefront powered by Next.js App Router, Stripe Elements checkout, and Framer Motion micro-interactions.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'https://aura-store.demo.dev',
  'https://github.com/elansari111/aura-luxury-store',
  ARRAY['Next.js', 'TypeScript', 'Stripe', 'TailwindCSS', 'Framer Motion', 'Supabase']
),
(
  'KubePulse — Cluster Observability Suite',
  'Lightweight Kubernetes cluster health monitor and anomaly detector with instant Slack and PagerDuty alert integrations.',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
  'https://kubepulse.demo.dev',
  'https://github.com/elansari111/kubepulse-orchestrator',
  ARRAY['React', 'Go', 'Kubernetes', 'Docker', 'Prometheus', 'Grafana']
),
(
  'SyncBoard — Real-time Vector Whiteboard',
  'Multiplayer infinite canvas with real-time CRDT synchronization, cursor presence, and smart shape recognition for remote product teams.',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  'https://syncboard.demo.dev',
  'https://github.com/elansari111/syncboard-whiteboard',
  ARRAY['React', 'Canvas API', 'WebRTC', 'Node.js', 'Socket.io', 'TailwindCSS']
),
(
  'PulseLife — Biometric Wellbeing Tracker',
  'Cross-platform mobile companion tracking sleep circadian rhythms, daily cognitive performance, and nutritional habits.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1200&auto=format&fit=crop',
  'https://pulselife.demo.dev',
  'https://github.com/elansari111/pulselife-mobile',
  ARRAY['React Native', 'Expo', 'TypeScript', 'TailwindCSS', 'Supabase', 'HealthKit']
)
ON CONFLICT DO NOTHING;

-- 3. SEED REALISTIC SKILLS
INSERT INTO skills (name, category, level) VALUES
('React / Next.js', 'Frontend', 95),
('TypeScript', 'Frontend', 90),
('Tailwind CSS', 'Frontend', 95),
('GSAP & Framer Motion', 'Frontend', 88),
('Node.js & Express', 'Backend', 85),
('Supabase & PostgreSQL', 'Backend', 88),
('Python & FastAPI', 'Backend', 78),
('GraphQL & REST APIs', 'Backend', 84),
('Docker & Containers', 'Tools', 82),
('Git & GitHub Actions', 'Tools', 92),
('AWS Cloud Architecture', 'Tools', 80),
('Figma & UI Systems', 'Tools', 86)
ON CONFLICT DO NOTHING;

-- 4. SEED REALISTIC EXPERIENCES
INSERT INTO experiences (role, company, period, description, type) VALUES
(
  'Senior Frontend Engineer',
  'TechCorp Global',
  '2024 - Present',
  'Leading frontend architecture and design systems migration to Next.js 14 and TailwindCSS, reducing LCP by 45% for over 300,000 monthly active users.',
  'work'
),
(
  'Full-Stack Developer',
  'Digital Velocity Studio',
  '2022 - 2024',
  'Architected scalable SaaS web applications, real-time dashboards with WebSockets, and headless e-commerce integrations using Supabase, Stripe, and Node.js.',
  'work'
),
(
  'Software Engineering Intern',
  'Innovatech Labs',
  '2021 - 2022',
  'Developed interactive responsive UI components, automated end-to-end Cypress test suites, and optimized Core Web Vitals across client portals.',
  'work'
),
(
  'Bachelor of Science in Computer Science',
  'University of Science & Technology',
  '2018 - 2022',
  'Specialized in Software Architecture, Distributed Systems, Data Structures, and Cloud Computing algorithms.',
  'education'
)
ON CONFLICT DO NOTHING;

-- 5. SEED REALISTIC CERTIFICATES
INSERT INTO certificates (title, issuer, date, credential_url, image_url) VALUES
(
  'AWS Certified Solutions Architect — Associate',
  'Amazon Web Services',
  '2024-04-12',
  'https://aws.amazon.com/verification',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop'
),
(
  'Meta Professional Full-Stack Developer',
  'Meta Platforms Inc.',
  '2023-11-20',
  'https://coursera.org/verify/meta-fullstack',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop'
),
(
  'HashiCorp Certified: Terraform Associate',
  'HashiCorp',
  '2023-07-15',
  'https://hashicorp.com/certifications',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop'
),
(
  'PostgreSQL 15 Advanced DBA & Optimization',
  'PostgreSQL Professional Institute',
  '2022-12-05',
  'https://postgresql.org',
  'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop'
)
ON CONFLICT DO NOTHING;

-- 6. SEED REALISTIC INCOMING MESSAGES
INSERT INTO messages (name, email, message, read, created_at) VALUES
(
  'Sarah Connor',
  'sarah.connor@cyberdyne.io',
  'Hello Yassine! I saw your portfolio and would love to discuss a Senior Frontend role at our company. The interactive animations are stunning!',
  false,
  NOW() - INTERVAL '2 hours'
),
(
  'Alexandre Dupont',
  'alex.dupont@techventures.fr',
  'Bonjour Yassine, nous cherchons un développeur Full-Stack React / Supabase pour un projet SaaS de 3 mois. Seriez-vous disponible prochainement pour un échange ?',
  false,
  NOW() - INTERVAL '1 day'
),
(
  'Elena Rostova',
  'elena.rostova@designlab.co',
  'Amazing portfolio! The interactive timeline and folder animations are top tier. Would love to collaborate on upcoming design engineering client projects.',
  true,
  NOW() - INTERVAL '3 days'
)
ON CONFLICT DO NOTHING;

-- 7. SEED PROFILE
INSERT INTO profile (id, name, first_name, roles, greeting, bio, short_bio, avatar, resume_url, status, socials) VALUES
(
  1,
  'Yassine El Ansari',
  'Yassine',
  ARRAY['Software Engineer', 'Full-Stack Developer', 'Creative Technologist'],
  'Hello there!',
  'I design and build high-performance web applications that merge thoughtful design with robust software architecture. Specialized in React, Next.js, TypeScript, and modern cloud backends.',
  'Full-Stack Engineer building high-conversion digital experiences, performant web platforms, and interactive interfaces.',
  '/avatar.jpg',
  '/resume.pdf',
  'Available for high-impact projects',
  '{"github":"https://github.com/elansari111","linkedin":"https://linkedin.com/in/yassine-elansari","twitter":"https://twitter.com/yassine_dev","instagram":"https://instagram.com/yassine_codes","email":"mailto:contact@yassinelansari.dev"}'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  first_name = EXCLUDED.first_name,
  roles = EXCLUDED.roles,
  greeting = EXCLUDED.greeting,
  bio = EXCLUDED.bio,
  short_bio = EXCLUDED.short_bio,
  avatar = EXCLUDED.avatar,
  resume_url = EXCLUDED.resume_url,
  status = EXCLUDED.status,
  socials = EXCLUDED.socials;

-- 8. SEED EVENTS (HACKATHONS & TALKS)
INSERT INTO events (title, slug, role, date, award, description, image, tag) VALUES
(
  'Global Hackathon 2025',
  'winning-the-global-hackathon',
  'Lead Developer',
  'Dec 2025',
  '1st Place',
  'Built a sustainable AI solution in 48 hours.',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop',
  'HACKATHON & EVENT'
),
(
  'Web3 Summit Buildathon',
  'building-micro-frontends',
  'Frontend Engineer',
  'Oct 2024',
  'Best UI/UX',
  'Created an intuitive dashboard for decentralized finance.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
  'HACKATHON & EVENT'
),
(
  'DevFest Morocco 2024',
  'mastering-react-animations',
  'Speaker',
  'Nov 2024',
  'Best Talk',
  'Spoke about modern animation techniques in React.',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop',
  'HACKATHON & EVENT'
)
ON CONFLICT DO NOTHING;


