export const STATIC_ROUTES = ['/', '/about', '/services', '/product', '/portfolio', '/video', '/contact', '/news', '/faq', '/privacy'];

export function canonicalRoute(path) {
  return path.endsWith('/') ? path : `${path}/`;
}

export function buildRedirects(articles, portfolios = [], aliases = []) {
  const featured = portfolios.filter((project) => project.is_featured);
  const liveAliases = aliases.flatMap(({ old_slug, portfolio_id }) => {
    const project = featured.find(({ id }) => id === portfolio_id);
    return project ? [`/portfolio/${old_slug} /portfolio/${project.slug}/ 301`, `/portfolio/${old_slug}/ /portfolio/${project.slug}/ 301`] : [];
  });
  if (articles.length + featured.length + liveAliases.length > 1997) throw new Error('Jumlah redirect Cloudflare Pages melebihi batas.');
  return ['/admin/* /admin/index.html 200',
    ...articles.map(({ slug }) => `/news/${slug} /news/${slug}/index.html 200`),
    ...liveAliases,
    ...featured.map(({ slug }) => `/portfolio/${slug} /portfolio/${slug}/index.html 200`),
    '/portfolio/* /index.html 200',
    '/news/* /index.html 200', ''].join('\n');
}

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function buildSitemap(routes, articles, portfolios, baseUrl) {
  const urls = routes.map((path) => ({ path }));
  for (const project of portfolios.filter((item) => item.is_featured)) urls.push({ path: `/portfolio/${project.slug}`, lastmod: project.updated_at });
  for (const article of articles) urls.push({ path: `/news/${article.slug}`, lastmod: article.updated_at || article.published_at });
  const entries = urls.map(({ path, lastmod }) => {
    const modified = lastmod ? `\n    <lastmod>${escapeXml(new Date(lastmod).toISOString())}</lastmod>` : '';
    return `  <url>\n    <loc>${escapeXml(`${baseUrl}${canonicalRoute(path)}`)}</loc>${modified}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
