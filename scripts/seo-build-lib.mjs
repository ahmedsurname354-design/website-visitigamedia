export const STATIC_ROUTES = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function buildSitemap(routes, articles, baseUrl) {
  const urls = routes.map((path) => ({ path }));
  for (const article of articles) urls.push({ path: `/news/${article.id}`, lastmod: article.updated_at || article.published_at });
  const entries = urls.map(({ path, lastmod }) => {
    const modified = lastmod ? `\n    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(`${baseUrl}${path === '/' ? '/' : path}`)}</loc>${modified}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
