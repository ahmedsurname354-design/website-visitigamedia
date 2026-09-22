import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { loadEnv } from 'vite';
import { buildRedirects, buildSitemap, canonicalRoute, STATIC_ROUTES } from './seo-build-lib.mjs';

const projectRoot = process.cwd();
const distDir = join(projectRoot, 'dist');
const env = { ...loadEnv('production', projectRoot, ''), ...process.env };
const siteUrl = (env.VITE_SITE_URL || 'https://visitiga-media.pages.dev').replace(/\/$/, '');
const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/$/, '');
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;
const requireNews = env.SEO_REQUIRE_NEWS === 'true';

async function fetchPublicTable(table, select = '*', filters = {}) {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  const query = new URL(`${supabaseUrl}/rest/v1/${table}`);
  query.searchParams.set('select', select);
  for (const [key, value] of Object.entries(filters)) query.searchParams.set(key, value);
  const response = await fetch(query, { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } });
  if (!response.ok) {
    const message = `Supabase mengembalikan ${response.status} saat mengambil ${table} untuk prerender.`;
    if (requireNews) throw new Error(message);
    console.warn(`[seo] ${message}`);
    return null;
  }
  return response.json();
}

async function getBuildContent() {
  if (!supabaseUrl || !supabaseKey) {
    if (requireNews) throw new Error('SEO_REQUIRE_NEWS=true, tetapi kredensial Supabase tidak tersedia.');
    console.warn('[seo] Kredensial Supabase tidak tersedia; prerender lokal memakai fallback statis.');
    return { news: [], portfolios: null, aliases: [], products: null, serviceContent: null, catalogue: null };
  }
  const [news, portfolios, aliases, products, serviceRows, catalogueRows] = await Promise.all([
    fetchPublicTable('news', '*', { published_at: 'not.is.null', order: 'published_at.desc' }),
    fetchPublicTable('portfolios', '*', { order: 'created_at.desc' }),
    fetchPublicTable('portfolio_slug_aliases', 'old_slug,portfolio_id'),
    fetchPublicTable('products', '*', { order: 'sort_order.asc,created_at.asc' }),
    fetchPublicTable('service_content', '*', { id: 'eq.1' }),
    fetchPublicTable('product_catalogue', '*', { id: 'eq.1' }),
  ]);
  return {
    news: news ?? [], portfolios, aliases: aliases ?? [], products,
    serviceContent: serviceRows?.[0] ?? null,
    catalogue: catalogueRows?.[0] ?? null,
  };
}

function dataForRoute(path, content) {
  if (path === '/news') return { route: path, news: content.news };
  if (path.startsWith('/news/')) return { route: path, news: content.news, article: content.news.find(({ slug }) => path === `/news/${slug}`) ?? null };
  if (path === '/services') return { route: path, serviceContent: content.serviceContent, portfolios: content.portfolios ?? undefined };
  if (path === '/product') return { route: path, products: content.products ?? undefined, catalogue: content.catalogue };
  if (path === '/portfolio') return { route: path, portfolios: content.portfolios ?? undefined };
  if (path.startsWith('/portfolio/')) return { route: path, portfolios: content.portfolios ?? undefined,
    portfolio: content.portfolios?.find(({ slug, is_featured }) => is_featured && path === `/portfolio/${slug}`) ?? null };
  if (path === '/') return { route: path, portfolios: content.portfolios ?? undefined };
  return { route: path };
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Server preview berhenti dengan kode ${child.exitCode}.`);
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* Server belum siap. */ }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error('Server preview tidak siap dalam 20 detik.');
}

async function stopServer(child) {
  if (child.exitCode !== null) return;
  const exited = once(child, 'exit');
  child.kill();
  await exited;
}

async function snapshot(page, path, content, outputOverride) {
  const response = await page.goto(`http://127.0.0.1:4173${path}`, { waitUntil: 'domcontentloaded' });
  if (!response?.ok()) throw new Error(`${path} mengembalikan status ${response?.status() ?? 'tanpa respons'}.`);
  if (path.startsWith('/news/')) await page.waitForSelector('article h1', { timeout: 15_000 });
  else await page.waitForSelector('#main-content h1', { timeout: 15_000 });
  if (path === '/news') {
    await page.waitForFunction(() => {
      const text = document.querySelector('#main-content')?.textContent || '';
      return !text.includes('Memuat berita') && !text.includes('Loading news');
    }, undefined, { timeout: 15_000 });
  }
  await page.waitForFunction(() => {
    const canonical = document.querySelector('link[rel="canonical"]');
    return Boolean(document.title && canonical && document.querySelector('meta[name="description"]'));
  });
  if (path !== '/__not-found') {
    await page.waitForFunction((expected) => {
      const canonical = document.querySelector('link[rel="canonical"]');
      const robots = document.querySelector('meta[name="robots"]');
      return canonical?.href === expected && robots?.content === 'index, follow';
    }, `${siteUrl}${canonicalRoute(path)}`);
  }
  const routeData = dataForRoute(path, content);
  await page.evaluate((data) => {
    document.documentElement.dataset.prerendered = 'true';
    const snapshot = document.getElementById('root');
    if (!snapshot) throw new Error('Root prerender tidak ditemukan.');
    snapshot.id = 'prerender-content';
    const clientRoot = document.createElement('div');
    clientRoot.id = 'root';
    snapshot.before(clientRoot);
    const swapStyle = document.createElement('style');
    swapStyle.id = 'prerender-swap-style';
    swapStyle.textContent = '#root{display:none}';
    document.head.appendChild(swapStyle);
    const existing = document.getElementById('visitiga-prerender-data');
    existing?.remove();
    const script = document.createElement('script');
    script.id = 'visitiga-prerender-data';
    script.type = 'application/json';
    script.textContent = JSON.stringify(data).replace(/</g, '\\u003c');
    document.head.appendChild(script);
  }, routeData);
  const html = `<!doctype html>\n${await page.locator('html').evaluate((element) => element.outerHTML)}`;
  const output = outputOverride ?? (path === '/' ? join(distDir, 'index.html') : join(distDir, path.slice(1), 'index.html'));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
}

async function validateOutput(routes) {
  for (const path of routes) {
    const output = path === '/' ? join(distDir, 'index.html') : join(distDir, path.slice(1), 'index.html');
    const html = await readFile(output, 'utf8');
    const required = ['<title>', 'name="description"', 'rel="canonical"', 'property="og:title"', 'application/ld+json', '<h1'];
    for (const marker of required) if (!html.includes(marker)) throw new Error(`${output} tidak memiliki ${marker}.`);
    if (!html.includes(`${siteUrl}${canonicalRoute(path)}`)) throw new Error(`${output} memiliki canonical yang salah.`);
    if (html.includes('Memuat berita…') || html.includes('Loading news…')) throw new Error(`${output} masih berisi placeholder pemuatan.`);
  }
}

async function main() {
  const content = await getBuildContent();
  const appShell = await readFile(join(distDir, 'index.html'), 'utf8');
  const articles = content.news;
  const articleRoutes = articles.map(({ slug }) => `/news/${slug}`);
  const caseStudyRoutes = (content.portfolios ?? []).filter(({ is_featured }) => is_featured).map(({ slug }) => `/portfolio/${slug}`);
  const routes = [...STATIC_ROUTES, ...caseStudyRoutes, ...articleRoutes];
  const viteBin = join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js');
  const server = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'inherit' });
  let browser;
  try {
    await waitForServer('http://127.0.0.1:4173/', server);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.addInitScript((allContent) => {
      window.__VISITIGA_PRERENDER_MODE__ = true;
      const path = window.location.pathname;
      const data = path === '/news'
        ? { route: path, news: allContent.news }
        : path.startsWith('/news/')
          ? { route: path, news: allContent.news, article: allContent.news.find(({ slug }) => path === `/news/${slug}`) ?? null }
          : path === '/services'
            ? { route: path, serviceContent: allContent.serviceContent, portfolios: allContent.portfolios ?? undefined }
            : path === '/product'
              ? { route: path, products: allContent.products ?? undefined, catalogue: allContent.catalogue }
              : path === '/portfolio'
                ? { route: path, portfolios: allContent.portfolios ?? undefined }
                : path.startsWith('/portfolio/')
                  ? { route: path, portfolios: allContent.portfolios ?? undefined,
                    portfolio: allContent.portfolios?.find(({ slug, is_featured }) => is_featured && path === `/portfolio/${slug}`) ?? null }
                  : path === '/'
                    ? { route: path, portfolios: allContent.portfolios ?? undefined }
                    : { route: path };
      window.__VISITIGA_PRERENDER_DATA__ = data;
    }, content);
    for (const path of routes.filter((route) => route !== '/')) {
      await snapshot(page, path, content);
      console.log(`[seo] prerendered ${path}`);
    }
    await snapshot(page, '/', content);
    console.log('[seo] prerendered /');
    await snapshot(page, '/__not-found', content, join(distDir, '404.html'));
    console.log('[seo] prerendered 404');
    await writeFile(join(distDir, '_redirects'), buildRedirects(articles, content.portfolios ?? [], content.aliases), 'utf8');
  } finally {
    await browser?.close();
    await stopServer(server);
  }
  const adminShell = appShell
    .replace('<meta name="robots" content="index, follow" />', '<meta name="robots" content="noindex, nofollow" />')
    .replace(`<link rel="canonical" href="${siteUrl}/" />`, `<link rel="canonical" href="${siteUrl}/admin" />`)
    .replace(/<title>.*?<\/title>/, '<title>Admin Visitiga</title>');
  await mkdir(join(distDir, 'admin'), { recursive: true });
  await writeFile(join(distDir, 'admin', 'index.html'), adminShell, 'utf8');
  await writeFile(join(distDir, 'sitemap.xml'), buildSitemap(STATIC_ROUTES, articles, content.portfolios ?? [], siteUrl), 'utf8');
  await writeFile(join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`, 'utf8');
  await validateOutput(routes);
  console.log(`[seo] ${routes.length} halaman tervalidasi; sitemap dan robots.txt dibuat.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
