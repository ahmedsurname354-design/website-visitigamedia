const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

async function queryOne(config, table, column, value, select) {
  const url = new URL(`/rest/v1/${table}`, config.supabaseUrl);
  url.searchParams.set('select', select);
  url.searchParams.set(column, `eq.${value}`);
  url.searchParams.set('limit', '1');
  const headers = { apikey: config.supabaseKey };
  if (!config.supabaseKey.startsWith('sb_publishable_')) headers.Authorization = `Bearer ${config.supabaseKey}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`Supabase ${response.status}`);
  const rows = await response.json();
  return rows[0] || null;
}

export async function onRequestGet({ request, env, params }) {
  const slug = params.slug;
  if (typeof slug !== 'string' || !SLUG_PATTERN.test(slug) || slug.length > 100) return new Response('Project not found', { status: 404 });
  const configResponse = await env.ASSETS.fetch(new URL('/portfolio-edge-config.json', request.url));
  if (!configResponse.ok) return new Response('Portfolio temporarily unavailable', { status: 503 });
  const config = await configResponse.json();
  if (!config.supabaseUrl || !config.supabaseKey) return new Response('Portfolio temporarily unavailable', { status: 503 });
  try {
    const project = await queryOne(config, 'portfolios', 'slug', slug, 'id,slug,title,description,seo_title,seo_description,image_url');
    if (!project) {
      const alias = await queryOne(config, 'portfolio_slug_aliases', 'old_slug', slug, 'portfolio_id');
      if (!alias) return new Response('Project not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
      const target = await queryOne(config, 'portfolios', 'id', alias.portfolio_id, 'slug');
      if (!target) return new Response('Project not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
      return Response.redirect(new URL(`/portfolio/${target.slug}/`, request.url), 301);
    }
    const staticResponse = await env.ASSETS.fetch(new URL(`/portfolio/${slug}/index.html`, request.url));
    if (staticResponse.ok) return staticResponse;
    const shellResponse = await env.ASSETS.fetch(new URL('/portfolio-fallback.html', request.url));
    if (!shellResponse.ok) throw new Error('Missing application shell');
    const title = `${project.seo_title || project.title} | Visitiga Media`;
    const description = project.seo_description || project.description || `${project.title} - portofolio Visitiga Media.`;
    const canonical = `${config.siteUrl}/portfolio/${slug}/`;
    const image = new URL(project.image_url, config.siteUrl).href;
    let html = await shellResponse.text();
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:image" content="[^"]*"\s*\/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`);
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  } catch {
    return new Response('Portfolio temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
