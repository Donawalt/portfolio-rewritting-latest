// Dev/preview responds with a real 301. In the static build Astro turns this
// endpoint into a meta-refresh fallback at /sitemap.xml; Netlify's _redirects
// rule forces the canonical 301 there so crawlers never see the fallback.
export async function GET() {
  return new Response(null, {
    status: 301,
    headers: { Location: "/sitemap-index.xml" },
  });
}
