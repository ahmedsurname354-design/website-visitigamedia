const MAX_PAYLOAD_BYTES = 120_000;
const MAX_TEXT_LENGTH = 12_000;
const MAX_TEXT_NODES = 250;
const SUPPORTED_LOCALES = new Set(['en', 'id']);
const TECHNICAL_KEY = /(?:^|_)(?:id|ids|slug|url|uri|path|image|video|pdf|file|media|color|status|date|phone|email|keyword|sort|order|type|category_id)(?:$|_)/i;
const URL_VALUE = /^(?:https?:\/\/|mailto:|tel:|\/|data:)/i;
const EMAIL_VALUE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_VALUE = /^\+?[\d\s().-]{7,}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
}

function collectStrings(value, path = [], output = []) {
  if (typeof value === 'string') {
    const key = typeof path[path.length - 1] === 'string' ? path[path.length - 1] : '';
    const protectedValue = TECHNICAL_KEY.test(key) || URL_VALUE.test(value.trim()) || EMAIL_VALUE.test(value.trim()) || PHONE_VALUE.test(value.trim());
    if (!protectedValue && value.trim() && value.length <= MAX_TEXT_LENGTH && output.length < MAX_TEXT_NODES) output.push({ path, text: value });
    return output;
  }
  if (Array.isArray(value)) return value.forEach((item, index) => collectStrings(item, [...path, index], output)), output;
  if (value && typeof value === 'object') return Object.entries(value).forEach(([key, item]) => collectStrings(item, [...path, key], output)), output;
  return output;
}

function setAtPath(value, path, replacement) {
  let current = value;
  for (let index = 0; index < path.length - 1; index += 1) current = current[path[index]];
  current[path[path.length - 1]] = replacement;
}

function hasHtml(text) { return /<[^>]+>/.test(text); }

function cleanSecret(value) {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const first = trimmed[0];
  const last = trimmed[trimmed.length - 1];
  return (trimmed.length > 1 && first === last && (first === '"' || first === "'"))
    ? trimmed.slice(1, -1).trim()
    : trimmed;
}

async function isAdmin(request, env) {
  const token = request.headers.get('authorization');
  const supabaseUrl = cleanSecret(env.SUPABASE_URL);
  const publishableKey = cleanSecret(env.SUPABASE_PUBLISHABLE_KEY);
  if (!token || !supabaseUrl || !publishableKey) return false;
  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, { headers: { apikey: publishableKey, authorization: token } });
  if (!response.ok) return false;
  const user = await response.json();
  return Boolean(user?.id && user.app_metadata?.role === 'admin');
}

export async function onRequestPost(context) {
  try {
    return await handlePost(context);
  } catch (error) {
    console.error('translate-content failed', error);
    const detail = error instanceof Error && error.message ? `: ${error.message}` : '';
    return json({ error: `Translation function failed${detail}` }, 500);
  }
}

async function handlePost({ request, env }) {
  if (!(await isAdmin(request, env))) return json({ error: 'Unauthorized.' }, 401);
  const deepLKey = cleanSecret(env.DEEPL_AUTH_KEY);
  if (!deepLKey) return json({ error: 'Translation service is not configured.' }, 503);

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_PAYLOAD_BYTES) return json({ error: 'Translation payload is too large.' }, 413);
  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON body.' }, 400); }
  const { source_locale: sourceLocale, target_locale: targetLocale, content } = body ?? {};
  if (!SUPPORTED_LOCALES.has(sourceLocale) || !SUPPORTED_LOCALES.has(targetLocale) || sourceLocale === targetLocale || !content || typeof content !== 'object') return json({ error: 'Invalid translation request.' }, 400);

  const nodes = collectStrings(content);
  if (nodes.length > MAX_TEXT_NODES) return json({ error: 'Too many text fields.' }, 413);
  if (!nodes.length) return json({ content });
  const texts = nodes.map((node) => node.text);
  const endpoint = deepLKey.endsWith(':fx') ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate';
  const params = new URLSearchParams({ source_lang: sourceLocale.toUpperCase(), target_lang: targetLocale.toUpperCase(), preserve_formatting: '1' });
  texts.forEach((text) => params.append('text', text));
  if (texts.some(hasHtml)) params.set('tag_handling', 'html');
  const response = await fetch(endpoint, { method: 'POST', headers: { authorization: `DeepL-Auth-Key ${deepLKey}`, 'content-type': 'application/x-www-form-urlencoded' }, body: params });
  if (!response.ok) {
    let providerMessage = '';
    try {
      const providerResult = await response.json();
      providerMessage = typeof providerResult?.message === 'string' ? providerResult.message : '';
    } catch { /* Keep the stable fallback below for non-JSON provider responses. */ }
    return json({ error: providerMessage ? `Translation provider failed: ${providerMessage}` : `Translation provider failed (HTTP ${response.status}).` }, 502);
  }
  const result = await response.json();
  if (!Array.isArray(result.translations) || result.translations.length !== nodes.length) return json({ error: 'Translation response is incomplete.' }, 502);
  // The request body is JSON, so a JSON clone keeps this compatible with all
  // Pages Functions runtimes and avoids relying on structuredClone support.
  const translated = JSON.parse(JSON.stringify(content));
  nodes.forEach((node, index) => setAtPath(translated, node.path, result.translations[index].text));
  return json({ content: translated });
}
