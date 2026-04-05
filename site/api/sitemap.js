// ============================================================================
// HOMEWODRX — Dynamic Sitemap Generator
// Vercel serverless function served at /sitemap.xml (via vercel.json rewrite)
// Queries Supabase for all movement + benchmark slugs to build a full sitemap.
// ============================================================================

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL     = 'https://irtppmztpcakanhefljs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlydHBwbXp0cGNha2FuaGVmbGpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDcxMTcsImV4cCI6MjA5MDEyMzExN30.MmuqyE12kFNJN62JElt6vYMzDJ0z-_SMgMwZRLB0rwg';
const BASE             = 'https://homewodrx.com';

// Static pages — priority / changefreq reflects update cadence
const STATIC_PAGES = [
  { path: '/',             priority: '1.0', changefreq: 'daily'   },
  { path: '/workouts',     priority: '0.9', changefreq: 'daily'   },
  { path: '/movements',    priority: '0.9', changefreq: 'weekly'  },
  { path: '/daily-wod',    priority: '0.8', changefreq: 'daily'   },
  { path: '/generator',    priority: '0.7', changefreq: 'monthly' },
  { path: '/leaderboard',  priority: '0.6', changefreq: 'daily'   },
  { path: '/search',       priority: '0.5', changefreq: 'monthly' },
];

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
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Fetch movement and workout slugs in parallel
    const [{ data: movements, error: movErr }, { data: workouts, error: wrkErr }] = await Promise.all([
      supabase.from('movements').select('slug, updated_at').order('slug'),
      supabase.from('benchmark_workouts').select('slug, updated_at').order('slug'),
    ]);

    if (movErr) console.error('Sitemap: movements fetch error', movErr.message);
    if (wrkErr) console.error('Sitemap: workouts fetch error', wrkErr.message);

    // Build URL entries
    const entries = [
      // Static pages
      ...STATIC_PAGES.map(p => urlEntry({
        loc: `${BASE}${p.path}`,
        priority: p.priority,
        changefreq: p.changefreq,
      })),

      // Movement detail pages: /movements/:slug
      ...(movements || []).map(m => urlEntry({
        loc: `${BASE}/movements/${m.slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: m.updated_at ? m.updated_at.split('T')[0] : undefined,
      })),

      // Benchmark workout detail pages: /workouts/:slug
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
    // Cache for 1 hour at the CDN edge, serve stale for up to 24 h while revalidating
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(xml);

  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
};
