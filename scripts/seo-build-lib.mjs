export const STATIC_ROUTES = ['/', '/about', '/services', '/services/led-indoor', '/services/videotron-outdoor', '/services/rental-led', '/services/media-konvensional', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];
export const SEO_LANGUAGES = ['id', 'en'];

export function canonicalRoute(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

export function localizedRoute(path, language) {
  const canonical = canonicalRoute(path);
  return canonical === '/' ? `/${language}/` : `/${language}${canonical}`;
}

export function buildRedirects(articles) {
  if (articles.length > 1980) throw new Error('Jumlah redirect Cloudflare Pages melebihi batas.');
  return ['/admin/* /admin/index.html 200',
    ...STATIC_ROUTES.map((path) => `${canonicalRoute(path)} ${localizedRoute(path, 'id')} 301`),
    ...articles.map(({ slug }) => `/news/${slug}/ /id/news/${slug}/ 301`),
    '/portfolio/:slug/ /id/portfolio/:slug/ 301',
    '/news/:slug/ /id/news/:slug/ 301',
    '/id/* /index.html 200',
    '/en/* /index.html 200', ''].join('\n');
}

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function buildSitemap(routes, articles, baseUrl, portfolios = []) {
  const urls = routes.map((path) => ({ path }));
  for (const article of articles) urls.push({ path: `/news/${article.slug}`, lastmod: article.updated_at || article.published_at });
  for (const project of portfolios) urls.push({ path: `/portfolio/${project.slug}`, lastmod: project.updated_at });
  const entries = urls.flatMap(({ path, lastmod }) => SEO_LANGUAGES.map((language) => {
    const modified = lastmod ? `\n    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '';
    const alternates = SEO_LANGUAGES.map((alternate) => `\n    <xhtml:link rel="alternate" hreflang="${alternate}" href="${escapeXml(`${baseUrl}${localizedRoute(path, alternate)}`)}" />`).join('');
    const defaultAlternate = `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(`${baseUrl}${localizedRoute(path, 'id')}`)}" />`;
    return `  <url>\n    <loc>${escapeXml(`${baseUrl}${localizedRoute(path, language)}`)}</loc>${alternates}${defaultAlternate}${modified}\n  </url>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
}
