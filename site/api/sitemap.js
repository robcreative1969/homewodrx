// ============================================================================
// HOMEWODRX — Dynamic Sitemap Generator
// Vercel serverless function served at /sitemap.xml (via vercel.json rewrite)
// Uses native fetch() — no npm dependencies required.
// ============================================================================

const SUPABASE_URL      = 'https://irtppmztpcakanhefljs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydHBwbXp0cGNha2FuaGVmbGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDcxMTcsImV4cCI6MjA5MDEyMzExN30.MmuqyE12kFNJN62JElt6vYMzDJ0z-_SMgMwZRLB0rwg';
const BASE              = 'https://homewodrx.com';

const STATIC_PAGES = [
  { path: '/',            priority: '1.0', changefreq: 'daily'   },
  { path: '/workouts',    priority: '0.9', changefreq: 'daily'   },
  { path: '/movements',   priority: '0.9', changefreq: 'weekly'  },
  { path: '/daily-wod',   priority: '0.8', changefreq: 'daily'   },
  { path: '/generator',   priority: '0.7', changefreq: 'monthly' },
  { path: '/leaderboard', priority: '0.6', changefreq: 'daily'   },
  { path: '/search',      priority: '0.5', changefreq: 'monthly' },
];

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

module.exports = async (req, res) => {
  try {
    const [movements, workouts] = await Promise.all([
      fetchSlugs('movements'),
      fetchSlugs('benchmark_workouts'),
    ]);

    const entries = [
      ...STATIC_PAGES.map(p => urlEntry({
        loc: `${BASE}${p.path}`,
        priority: p.priority,
        changefreq: p.changefreq,
      })),
      ...(movements || []).map(m => urlEntry({
        loc: `${BASE}/movements/${m.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: m.updated_at ? m.updated_at.split('T')[0] : undefined,
      })),
      ...(workouts || []).map(w => urlEntry({
        loc: `${BASE}/workouts/${w.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: w.updated_at ? w.updated_at.split('T')[0] : undefined,
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
