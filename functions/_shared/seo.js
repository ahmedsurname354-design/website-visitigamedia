const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validSlug(value) {
  return typeof value === 'string' && value.length <= 120 && SLUG_PATTERN.test(value);
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function plainText(value) {
  return String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function loadConfig(request, env) {
  const response = await env.ASSETS.fetch(new URL('/portfolio-edge-config.json', request.url));
  if (!response.ok) throw new Error('Missing edge configuration');
  const config = await response.json();
  if (!config.supabaseUrl || !config.supabaseKey || !config.siteUrl) throw new Error('Incomplete edge configuration');
  return config;
}

function databaseHeaders(config) {
  const headers = { apikey: config.supabaseKey };
  if (!config.supabaseKey.startsWith('sb_publishable_')) headers.Authorization = `Bearer ${config.supabaseKey}`;
  return headers;
}

export async function queryRows(config, table, select, filters = {}) {
  const url = new URL(`/rest/v1/${table}`, config.supabaseUrl);
  url.searchParams.set('select', select);
  for (const [key, value] of Object.entries(filters)) url.searchParams.set(key, value);
  const response = await fetch(url, { headers: databaseHeaders(config) });
  if (!response.ok) throw new Error(`Supabase ${response.status}`);
  return response.json();
}

export async function queryOne(config, table, column, value, select) {
  const rows = await queryRows(config, table, select, { [column]: `eq.${value}`, limit: '1' });
  return rows[0] || null;
}

function replaceMeta(html, selectorPattern, replacement) {
  return selectorPattern.test(html) ? html.replace(selectorPattern, replacement) : html.replace('</head>', `  ${replacement}\n</head>`);
}

export function renderSeoDocument(shell, { lang, route, title, description, image, type = 'website', body, data, siteUrl }) {
  const canonical = `${siteUrl}/${lang}${route}`;
  const idUrl = `${siteUrl}/id${route}`;
  const enUrl = `${siteUrl}/en${route}`;
  const imageUrl = new URL(image || '/social-preview.png', siteUrl).href;
  let html = shell.replace(/<html(?:\s[^>]*)?>/i, `<html lang="${lang}" data-prerendered="true">`)
    .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, /<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  html = replaceMeta(html, /<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, /<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<meta property="og:type" content="[^"]*"\s*\/>/i, `<meta property="og:type" content="${type}" />`);
  html = replaceMeta(html, /<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${escapeHtml(canonical)}" />`);
  html = replaceMeta(html, /<meta property="og:image" content="[^"]*"\s*\/>/i, `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`);
  html = html.replace(/\s*<meta property="og:image:(?:width|height)"[^>]*>/gi, '');
  html = replaceMeta(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/i, `<meta name="twitter:title" content="${escapeHtml(title)}" />`);
  html = replaceMeta(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/i, `<meta name="twitter:description" content="${escapeHtml(description)}" />`);
  html = replaceMeta(html, /<meta name="twitter:image" content="[^"]*"\s*\/>/i, `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`);
  const alternates = `  <link rel="alternate" hreflang="id" href="${escapeHtml(idUrl)}" />\n  <link rel="alternate" hreflang="en" href="${escapeHtml(enUrl)}" />\n  <link rel="alternate" hreflang="x-default" href="${escapeHtml(idUrl)}" />`;
  html = html.replace(/\s*<link rel="alternate" hreflang="(?:id|en|x-default)"[^>]*\/>/gi, '');
  html = html.replace('</head>', `${alternates}\n</head>`);
  const bootstrap = JSON.stringify({ route: `/${lang}${route}`, ...data }).replace(/</g, '\\u003c');
  const snapshot = `<div id="prerender-content"><main id="main-content">${body}</main></div><div id="root"></div><style id="prerender-swap-style">#root{display:none}</style><script id="visitiga-prerender-data" type="application/json">${bootstrap}</script>`;
  return html.replace('<div id="root"></div>', snapshot);
}

export async function loadShell(request, env) {
  const response = await env.ASSETS.fetch(new URL('/portfolio-fallback.html', request.url));
  if (!response.ok) throw new Error('Missing application shell');
  return response.text();
}
