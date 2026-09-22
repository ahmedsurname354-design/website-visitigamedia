export const STATIC_ROUTES = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];

export function canonicalRoute(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

export function buildRedirects(articles, retiredPortfolioSlugs = []) {
  if (articles.length > 1997) throw new Error('Jumlah redirect Cloudflare Pages melebihi batas.');
  if (new Set(retiredPortfolioSlugs).size !== retiredPortfolioSlugs.length) throw new Error('Snapshot slug portofolio berisi duplikat.');
  return ['/admin/* /admin/index.html 200',
    ...articles.map(({ slug }) => `/news/${slug} /news/${slug}/index.html 200`),
    '/portfolio/:slug /portfolio/ 301',
    '/portfolio/:slug/ /portfolio/ 301',
    '/news/* /index.html 200', ''].join('\n');
}

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function buildSitemap(routes, articles, baseUrl) {
  const urls = routes.map((path) => ({ path }));
  for (const article of articles) urls.push({ path: `/news/${article.slug}`, lastmod: article.updated_at || article.published_at });
  const entries = urls.map(({ path, lastmod }) => {
    const modified = lastmod ? `\n    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(`${baseUrl}${canonicalRoute(path)}`)}</loc>${modified}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
