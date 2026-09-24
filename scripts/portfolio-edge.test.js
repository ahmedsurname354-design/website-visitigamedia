import { describe, expect, it, vi } from 'vitest';
import { onRequestGet } from '../functions/portfolio/[slug].js';

const config = { supabaseUrl: 'https://db.example', supabaseKey: 'public-key', siteUrl: 'https://site.example' };
const project = { id: 'project-1', slug: 'current-project', title: 'Current Project', description: 'A project', seo_title: '', seo_description: '', image_url: '/project.jpg' };
const shell = '<html><head><title>Old</title><meta name="description" content="Old" /><link rel="canonical" href="https://site.example/" /><meta property="og:title" content="Old" /><meta property="og:description" content="Old" /><meta property="og:url" content="https://site.example/" /><meta property="og:image" content="https://site.example/old.jpg" /></head><body><div id="root"></div></body></html>';

function context(slug, staticExists = false, edgeConfig = config) {
  return {
    request: new Request(`https://site.example/portfolio/${slug}/`),
    params: { slug },
    env: { ASSETS: { fetch: vi.fn(async (url) => {
      const path = new URL(url).pathname;
      if (path === '/portfolio-edge-config.json') return Response.json(edgeConfig);
      if (path === '/portfolio-fallback.html') return new Response(shell);
      return new Response(staticExists ? 'prerendered' : 'missing', { status: staticExists ? 200 : 404 });
    }) } },
  };
}

function mockDatabase(rows) {
  vi.stubGlobal('fetch', vi.fn(async (url) => {
    const path = new URL(url).pathname;
    const data = path.includes('portfolio_slug_aliases') ? rows.alias : path.includes('portfolios') && new URL(url).searchParams.has('id') ? rows.target : rows.project;
    return Response.json(data ? [data] : []);
  }));
}

describe('portfolio edge route', () => {
  it('serves a prerendered project when available', async () => {
    mockDatabase({ project });
    const response = await onRequestGet(context('current-project', true));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('prerendered');
  });

  it('serves a new slug immediately with its own initial metadata', async () => {
    mockDatabase({ project });
    const response = await onRequestGet(context('current-project'));
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('<title>Current Project | Visitiga Media</title>');
    expect(html).toContain('href="https://site.example/portfolio/current-project/"');
    expect(html).toContain('content="https://site.example/project.jpg"');
  });

  it('redirects an old slug and returns 404 for unknown slugs', async () => {
    mockDatabase({ alias: { portfolio_id: 'project-1' }, target: { slug: 'current-project' } });
    const redirected = await onRequestGet(context('old-project'));
    expect(redirected.status).toBe(301);
    expect(redirected.headers.get('location')).toBe('https://site.example/portfolio/current-project/');
    mockDatabase({});
    expect((await onRequestGet(context('unknown-project'))).status).toBe(404);
  });

  it('does not send a publishable key as an authorization bearer token', async () => {
    const publishableConfig = { ...config, supabaseKey: 'sb_publishable_example' };
    const databaseFetch = vi.fn(async () => Response.json([project]));
    vi.stubGlobal('fetch', databaseFetch);
    expect((await onRequestGet(context('current-project', true, publishableConfig))).status).toBe(200);
    const headers = new Headers(databaseFetch.mock.calls[0][1].headers);
    expect(headers.get('apikey')).toBe('sb_publishable_example');
    expect(headers.has('authorization')).toBe(false);
  });
});
