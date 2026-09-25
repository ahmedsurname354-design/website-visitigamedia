import { escapeHtml, loadConfig, queryRows } from './_shared/seo.js';

const STATIC_ROUTES = ['/', '/about/', '/services/', '/services/led-indoor/', '/services/videotron-outdoor/', '/services/rental-led/', '/services/media-konvensional/', '/product/', '/portfolio/', '/video/', '/contact/', '/news/', '/faq/', '/privacy/'];
const LANGUAGES = ['id', 'en'];

function languageUrl(siteUrl, route, language) {
  return route === '/' ? `${siteUrl}/${language}/` : `${siteUrl}/${language}${route}`;
}

function entry(siteUrl, route, language, lastmod) {
  const alternates = LANGUAGES.map((alternate) => `\n    <xhtml:link rel="alternate" hreflang="${alternate}" href="${escapeHtml(languageUrl(siteUrl, route, alternate))}" />`).join('');
  return `  <url>\n    <loc>${escapeHtml(languageUrl(siteUrl, route, language))}</loc>${alternates}\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeHtml(languageUrl(siteUrl, route, 'id'))}" />${lastmod ? `\n    <lastmod>${escapeHtml(new Date(lastmod).toISOString())}</lastmod>` : ''}\n  </url>`;
}

export async function onRequestGet({ request, env }) {
  try {
    const config = await loadConfig(request, env);
    const [articles, portfolios] = await Promise.all([
      queryRows(config, 'news', 'slug,updated_at,published_at', { published_at: 'not.is.null', order: 'published_at.desc' }),
      queryRows(config, 'portfolios', 'slug,updated_at', { order: 'created_at.desc' }),
    ]);
    const routes = [
      ...STATIC_ROUTES.map((route) => ({ route })),
      ...articles.map((article) => ({ route: `/news/${article.slug}/`, lastmod: article.updated_at || article.published_at })),
      ...portfolios.map((portfolio) => ({ route: `/portfolio/${portfolio.slug}/`, lastmod: portfolio.updated_at })),
    ];
    const entries = routes.flatMap(({ route, lastmod }) => LANGUAGES.map((language) => entry(config.siteUrl, route, language, lastmod)));
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
    return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=0, s-maxage=300' } });
  } catch {
    return env.ASSETS.fetch(new URL('/sitemap.xml', request.url));
  }
}
