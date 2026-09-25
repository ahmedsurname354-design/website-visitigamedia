import { escapeHtml, loadConfig, loadShell, plainText, queryOne, renderSeoDocument, validSlug } from '../../_shared/seo.js';

export async function onRequestGet({ request, env, params }) {
  const { locale, slug } = params;
  if ((locale !== 'id' && locale !== 'en') || !validSlug(slug)) return new Response('Not found', { status: 404 });
  try {
    const config = await loadConfig(request, env);
    const article = await queryOne(config, 'news', 'slug', slug, '*');
    if (!article?.published_at) return new Response('Article not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    const title = `${article.seo_title?.trim() || article.title} — Visitiga`;
    const description = article.seo_description?.trim() || article.excerpt || plainText(article.content).slice(0, 160);
    const route = `/news/${slug}/`;
    const body = `<article><p>${escapeHtml(article.category)}</p><h1>${escapeHtml(article.title)}</h1><p>${escapeHtml(article.excerpt || '')}</p><div>${escapeHtml(plainText(article.content))}</div></article>`;
    const html = renderSeoDocument(await loadShell(request, env), { lang: locale, route, title, description, image: article.cover_image, type: 'article', body, data: { article, news: [article] }, siteUrl: config.siteUrl });
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } });
  } catch {
    return new Response('Article temporarily unavailable', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
