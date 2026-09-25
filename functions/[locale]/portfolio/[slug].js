import { escapeHtml, loadConfig, loadShell, queryOne, renderSeoDocument, validSlug } from '../../_shared/seo.js';

export async function onRequestGet({ request, env, params }) {
  const { locale, slug } = params;
  if ((locale !== 'id' && locale !== 'en') || !validSlug(slug)) return new Response('Not found', { status: 404 });
  try {
    const config = await loadConfig(request, env);
    let project = await queryOne(config, 'portfolios', 'slug', slug, '*');
    if (!project) {
      const alias = await queryOne(config, 'portfolio_slug_aliases', 'old_slug', slug, 'portfolio_id');
      project = alias ? await queryOne(config, 'portfolios', 'id', alias.portfolio_id, '*') : null;
      if (!project) return new Response('Project not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
      return Response.redirect(new URL(`/${locale}/portfolio/${project.slug}/`, request.url), 301);
    }
    const title = `${project.seo_title?.trim() || project.title} | Visitiga Media`;
    const description = project.seo_description?.trim() || project.description || `${project.title} - Visitiga Media portfolio.`;
    const route = `/portfolio/${slug}/`;
    const body = `<article><p>${escapeHtml(project.category)}</p><h1>${escapeHtml(project.title)}</h1><p>${escapeHtml(project.description || '')}</p></article>`;
    const html = renderSeoDocument(await loadShell(request, env), { lang: locale, route, title, description, image: project.image_url, body, data: { portfolio: project, portfolios: [project] }, siteUrl: config.siteUrl });
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } });
  } catch {
    return new Response('Portfolio temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
