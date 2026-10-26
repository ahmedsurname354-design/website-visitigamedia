import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { translateContent } from '@/lib/translation';
import type { ContactLead, HomepageContent, HomepageContentInput, LeadStatus, NewsInput, NewsRecord, Portfolio, PortfolioInput, PortfolioSlugAlias, Product, ProductCatalogue, ProductInput, ServiceContent, ServiceContentInput, ServiceLandingContent, ServiceLandingInput, ServiceLandingSlug } from '@/types/admin';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
}

function assertSafeMediaUrl(value: string, label: string) {
  if (value.length > 2048) throw new Error(`${label} terlalu panjang.`);
  if (value.startsWith('/') && !value.startsWith('//')) return;
  try {
    if (new URL(value).protocol === 'https:') return;
  } catch {
    // Fall through to the user-facing validation error.
  }
  throw new Error(`${label} harus berupa path website atau URL HTTPS yang valid.`);
}

function assertSafeLink(value: string, label: string) {
  if (value.length > 2048) throw new Error(`${label} terlalu panjang.`);
  if (value.startsWith('/') && !value.startsWith('//')) return;
  try {
    if (['https:', 'mailto:', 'tel:'].includes(new URL(value).protocol)) return;
  } catch {
    // Fall through to the user-facing validation error.
  }
  throw new Error(`${label} tidak valid.`);
}

export async function listPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await client().from('portfolios').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Portfolio[];
}

export async function listPublicPortfolios(): Promise<Portfolio[]> {
  return listPortfolios();
}

export async function getPublicPortfolioBySlug(slug: string): Promise<Portfolio | null> {
  const { data, error } = await client().from('portfolios').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as Portfolio | null;
}

export async function getPublicPortfolioById(id: string): Promise<Portfolio | null> {
  const { data, error } = await client().from('portfolios').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data as Portfolio | null;
}

export async function getPortfolioAlias(slug: string): Promise<PortfolioSlugAlias | null> {
  const { data, error } = await client().from('portfolio_slug_aliases').select('old_slug,portfolio_id').eq('old_slug', slug).maybeSingle();
  if (error) throw error;
  return data as PortfolioSlugAlias | null;
}

export async function listPortfolioAliases(): Promise<PortfolioSlugAlias[]> {
  const { data, error } = await client().from('portfolio_slug_aliases').select('old_slug,portfolio_id');
  if (error) throw error;
  return data as PortfolioSlugAlias[];
}

export async function savePortfolio(input: PortfolioInput, id?: string): Promise<void> {
  assertSafeMediaUrl(input.image_url, 'URL gambar project');
  const contentEn = { title: input.title, client: input.client, category: input.category, description: input.description, overview: input.overview, seo_title: input.seo_title, seo_description: input.seo_description };
  const contentId = await translateContent(contentEn);
  const payload = { ...input, content_en: contentEn, content_id: contentId };
  const query = id ? client().from('portfolios').update(payload).eq('id', id) : client().from('portfolios').insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function deletePortfolio(id: string): Promise<void> {
  const { error } = await client().from('portfolios').delete().eq('id', id);
  if (error) throw error;
}

export async function listNews(): Promise<NewsRecord[]> {
  const { data, error } = await client().from('news').select('*').order('published_at', { ascending: false, nullsFirst: false });
  if (error) throw error;
  return data as NewsRecord[];
}

export async function listPublicNews(): Promise<NewsRecord[]> {
  const { data, error } = await client().from('news').select('*').not('published_at', 'is', null).order('published_at', { ascending: false });
  if (error) throw error;
  return data as NewsRecord[];
}

export async function getPublicNews(slug: string): Promise<NewsRecord | null> {
  const { data, error } = await client().from('news').select('*').eq('slug', slug).not('published_at', 'is', null).maybeSingle();
  if (error) throw error;
  return data as NewsRecord | null;
}

export async function saveNews(input: NewsInput, id?: string): Promise<void> {
  assertSafeMediaUrl(input.cover_image, 'URL cover berita');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug) || input.slug.length > 100) throw new Error('Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (maksimal 100 karakter).');
  if ((input.seo_title?.length ?? 0) > 70) throw new Error('SEO title maksimal 70 karakter.');
  if ((input.seo_description?.length ?? 0) > 180) throw new Error('Meta description maksimal 180 karakter.');
  if ((input.cover_alt?.length ?? 0) > 180) throw new Error('Alt text cover maksimal 180 karakter.');
  if ((input.target_keyword?.length ?? 0) > 100) throw new Error('Target keyword maksimal 100 karakter.');
  const contentEn = { title: input.title, content: input.content, author: input.author, category: input.category, excerpt: input.excerpt, seo_title: input.seo_title ?? '', seo_description: input.seo_description ?? '', cover_alt: input.cover_alt ?? '', target_keyword: input.target_keyword ?? '' };
  const contentId = await translateContent(contentEn);
  const payload = { ...input, content_en: contentEn, content_id: contentId };
  const query = id ? client().from('news').update(payload).eq('id', id) : client().from('news').insert(payload);
  const { error } = await query;
  if (error?.code === '23505') throw new Error('Slug sudah digunakan oleh berita lain. Pilih slug yang berbeda.');
  if (error) throw error;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await client().from('news').delete().eq('id', id);
  if (error) throw error;
}

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await client().from('products').select('*').order('sort_order').order('created_at');
  if (error) throw error;
  return data as Product[];
}

export async function listPublicProducts(): Promise<Product[]> {
  return listProducts();
}

export async function saveProduct(input: ProductInput, id?: string): Promise<void> {
  assertSafeMediaUrl(input.image_url, 'URL gambar produk');
  const contentEn = { name: input.name, category: input.category, description: input.description, label: input.label };
  const contentId = await translateContent(contentEn);
  const payload = { ...input, content_en: contentEn, content_id: contentId };
  const query = id ? client().from('products').update(payload).eq('id', id) : client().from('products').insert(payload);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await client().from('products').delete().eq('id', id);
  if (error) throw error;
}

function validateHomepageContent(input: HomepageContentInput) {
  if (input.content_id.stats.length > 4 || input.content_en.stats.length > 4) throw new Error('Maksimal empat statistik per bahasa.');
  if (input.content_id.services.cards.length > 4 || input.content_en.services.cards.length > 4) throw new Error('Maksimal empat kartu layanan per bahasa.');
  if (input.featured_portfolio_ids.length > 3) throw new Error('Maksimal tiga proyek unggulan.');
  assertSafeMediaUrl(input.hero_image_url, 'URL gambar hero');
  if (input.about_image_url) assertSafeMediaUrl(input.about_image_url, 'URL gambar tentang');
  for (const locale of [input.content_id, input.content_en]) {
    if (!locale.cta.emailInfo.includes('@')) throw new Error('Email CTA tidak valid.');
    if (locale.cta.phoneInfo.trim().length < 5) throw new Error('Nomor telepon CTA tidak valid.');
  }
}

export async function getHomepageContent(): Promise<HomepageContent | null> {
  const { data, error } = await client().from('homepage_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as HomepageContent | null;
}

export async function getPublicHomepageContent(): Promise<HomepageContent | null> {
  return getHomepageContent();
}

export async function saveHomepageContent(input: HomepageContentInput): Promise<HomepageContent> {
  validateHomepageContent(input);
  const { data, error } = await client().from('homepage_content').upsert({ id: 1, ...input }).select('*').single();
  if (error) throw error;
  return data as HomepageContent;
}

export async function getProductCatalogue(): Promise<ProductCatalogue | null> {
  const { data, error } = await client().from('product_catalogue').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as ProductCatalogue | null;
}

export async function saveProductCatalogue(title: string, fileUrl: string): Promise<void> {
  assertSafeMediaUrl(fileUrl, 'URL katalog');
  const translated = await translateContent({ title });
  const { error } = await client().from('product_catalogue').upsert({ id: 1, title, title_en: title, title_id: translated.title, file_url: fileUrl });
  if (error) throw error;
}

export async function getServiceContent(): Promise<ServiceContent | null> {
  const { data, error } = await client().from('service_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as ServiceContent | null;
}

export async function saveServiceContent(input: ServiceContentInput): Promise<ServiceContent> {
  assertSafeLink(input.primary_button_url, 'URL tombol utama');
  assertSafeLink(input.secondary_button_url, 'URL tombol kedua');
  assertSafeMediaUrl(input.video_webm_url, 'URL video WebM');
  assertSafeMediaUrl(input.video_mp4_url, 'URL video MP4');
  assertSafeMediaUrl(input.video_poster_url, 'URL poster video');
  const contentEn = { eyebrow: input.eyebrow, heading: input.heading, heading_accent: input.heading_accent, cards: input.cards, showreel_eyebrow: input.showreel_eyebrow, showreel_heading: input.showreel_heading, showreel_accent: input.showreel_accent, showreel_description: input.showreel_description, primary_button_text: input.primary_button_text, secondary_button_text: input.secondary_button_text };
  const contentId = await translateContent(contentEn);
  const { data, error } = await client().from('service_content').upsert({ id: 1, ...input, content_en: contentEn, content_id: contentId }).select('*').single();
  if (error) throw error;
  return data as ServiceContent;
}

type ServiceLandingRow = Omit<ServiceLandingContent, 'related_portfolio_ids'> & {
  service_landing_portfolios?: { portfolio_id: string; position: number }[];
};

function mapServiceLanding(row: ServiceLandingRow): ServiceLandingContent {
  return {
    ...row,
    related_portfolio_ids: [...(row.service_landing_portfolios ?? [])]
      .sort((a, b) => a.position - b.position)
      .map((item) => item.portfolio_id),
  };
}

const serviceLandingSelect = '*,service_landing_portfolios(portfolio_id,position)';

export async function listServiceLandings(): Promise<ServiceLandingContent[]> {
  const { data, error } = await client().from('service_landings').select(serviceLandingSelect).order('slug');
  if (error) throw error;
  return (data as ServiceLandingRow[]).map(mapServiceLanding);
}

export async function getServiceLanding(slug: ServiceLandingSlug): Promise<ServiceLandingContent | null> {
  const { data, error } = await client().from('service_landings').select(serviceLandingSelect).eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? mapServiceLanding(data as ServiceLandingRow) : null;
}

export async function saveServiceLanding(input: ServiceLandingInput): Promise<ServiceLandingContent> {
  if (input.related_portfolio_ids.length > 3) throw new Error('Maksimal 3 portofolio terkait.');
  if (new Set(input.related_portfolio_ids).size !== input.related_portfolio_ids.length) throw new Error('Portofolio terkait tidak boleh duplikat.');
  if (input.hero_image_url) assertSafeMediaUrl(input.hero_image_url, 'URL gambar hero');
  const { error } = await client().rpc('save_service_landing', {
    p_slug: input.slug,
    p_hero_image_url: input.hero_image_url,
    p_content_id: input.content_id,
    p_content_en: input.content_en,
    p_seo_title_id: input.seo_title_id,
    p_seo_description_id: input.seo_description_id,
    p_seo_title_en: input.seo_title_en,
    p_seo_description_en: input.seo_description_en,
    p_portfolio_ids: input.related_portfolio_ids,
  });
  if (error) throw error;
  const saved = await getServiceLanding(input.slug);
  if (!saved) throw new Error('Konten detail layanan tidak ditemukan setelah disimpan.');
  return saved;
}

export async function listContactLeads(): Promise<ContactLead[]> {
  const { data, error } = await client().from('contact_messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as ContactLead[];
}

export async function updateContactLead(id: number, input: { status: LeadStatus; notes: string }): Promise<void> {
  const { error } = await client().from('contact_messages').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteContactLead(id: number): Promise<void> {
  const { error } = await client().from('contact_messages').delete().eq('id', id);
  if (error) throw error;
}

export async function countNewContactLeads(): Promise<number> {
  const { count, error } = await client().from('contact_messages').select('id', { count: 'exact', head: true }).eq('status', 'new');
  if (error) throw error;
  return count ?? 0;
}
