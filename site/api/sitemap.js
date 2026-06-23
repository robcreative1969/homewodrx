// ============================================================================
// HOMEWODRX — Dynamic Sitemap Generator
// Vercel serverless function served at /sitemap.xml (via vercel.json route)
// Uses native fetch() — no npm dependencies required.
// ============================================================================

const SUPABASE_URL      = 'https://irtppmztpcakanhefljs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydHBwbXp0cGNha2FuaGVmbGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDcxMTcsImV4cCI6MjA5MDEyMzExN30.MmuqyE12kFNJN62JElt6vYMzDJ0z-_SMgMwZRLB0rwg';
const BASE              = 'https://homewodrx.com';

// ── Static pages ─────────────────────────────────────────────────────────────
const STATIC_PAGES = [
  { path: '/',                 priority: '1.0', changefreq: 'daily'   },
  { path: '/workouts',         priority: '0.9', changefreq: 'daily'   },
  { path: '/movements',        priority: '0.9', changefreq: 'weekly'  },
  { path: '/stretches',        priority: '0.8', changefreq: 'weekly'  },
  { path: '/stretch-routines', priority: '0.8', changefreq: 'weekly'  },
  { path: '/daily-wod',        priority: '0.8', changefreq: 'daily'   },
  { path: '/wodbuilder',       priority: '0.7', changefreq: 'monthly' },
  { path: '/stretchbuilder',   priority: '0.7', changefreq: 'monthly' },
  { path: '/timer',            priority: '0.6', changefreq: 'monthly' },
  { path: '/blog',             priority: '0.7', changefreq: 'weekly'  },
  { path: '/shop',             priority: '0.6', changefreq: 'weekly'  },
  { path: '/search',           priority: '0.5', changefreq: 'monthly' },
  { path: '/contact',          priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy',          priority: '0.3', changefreq: 'yearly'  },
  { path: '/terms',            priority: '0.3', changefreq: 'yearly'  },
  { path: '/disclaimer',       priority: '0.3', changefreq: 'yearly'  },
  { path: '/cookies',          priority: '0.3', changefreq: 'yearly'  },
];

// ── Blog posts (static files — update when new posts are published) ───────────
// Only include posts confirmed live on the site. Add slugs here when new posts go up.
const BLOG_SLUGS = [
  'best-gear-car-vacation',
  'best-home-gym-equipment',
  'building-garage-gym',
  'day-by-day-fitness-mindset',
  'finding-balance-in-life',
  'garage-gym-all-seasons',
  'glp1-fitness-guide',
  'hero-wod-guide',
  'hotel-room-workouts',
  'how-to-scale-wods',
  'kettlebell-only-wods',
  'named-benchmark-wods-guide',
  'rogue-vs-titan-home-gym',
  'sleep-and-athletic-performance',
  'staying-connected-fitness',
  'staying-motivated-solo-training',
  'weekly-training-program-home',
  'why-short-wods-work',
  'why-stretching-matters',
  'wod-formats-explained',
];


// ── Helpers ───────────────────────────────────────────────────────────────────
async function fetchSlugs(table) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?select=slug,updated_at&order=slug`,
    {
      headers: {
        'apikey':        SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    }
  );
  if (!res.ok) throw new Error(`Supabase fetch failed for ${table}: ${res.status}`);
  return res.json();
}

function urlEntry({ loc, priority, changefreq, lastmod }) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : '',
    '  </url>',
  ].filter(Boolean).join('\n');
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  try {
    const [movements, workouts, stretches, stretchRoutines] = await Promise.all([
      fetchSlugs('movements'),
      fetchSlugs('benchmark_workouts'),
      fetchSlugs('stretches'),
      fetchSlugs('stretch_routines'),
    ]);

    const entries = [
      // Static pages
      ...STATIC_PAGES.map(p => urlEntry({
        loc: `${BASE}${p.path}`,
        priority: p.priority,
        changefreq: p.changefreq,
      })),

      // Blog posts
      ...BLOG_SLUGS.map(slug => urlEntry({
        loc: `${BASE}/blog/${slug}`,
        priority: '0.6',
        changefreq: 'monthly',
      })),

      // Stretch routines (Supabase)
      ...(stretchRoutines || []).map(r => urlEntry({
        loc: `${BASE}/stretch-routines/${r.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: r.updated_at ? r.updated_at.split('T')[0] : undefined,
      })),

      // Movements (Supabase)
      ...(movements || []).map(m => urlEntry({
        loc: `${BASE}/movements/${m.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: m.updated_at ? m.updated_at.split('T')[0] : undefined,
      })),

      // Workouts (Supabase)
      ...(workouts || []).map(w => urlEntry({
        loc: `${BASE}/workouts/${w.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: w.updated_at ? w.updated_at.split('T')[0] : undefined,
      })),

      // Stretches (Supabase)
      ...(stretches || []).map(s => urlEntry({
        loc: `${BASE}/stretches/${s.slug}`,
        priority: '0.7',
        changefreq: 'monthly',
        lastmod: s.updated_at ? s.updated_at.split('T')[0] : undefined,
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);

  } catch (err) {
    console.error('Sitemap error:', err.message);
    res.status(500).send('Error generating sitemap');
  }
};
