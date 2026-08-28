import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { ContactLead, LeadStatus, NewsInput, NewsRecord, Portfolio, PortfolioInput, Product, ProductCatalogue, ProductInput } from '@/types/admin';

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

export async function listPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await client().from('portfolios').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Portfolio[];
}

export async function listPublicPortfolios(): Promise<Portfolio[]> {
  return listPortfolios();
}

export async function savePortfolio(input: PortfolioInput, id?: string): Promise<void> {
  assertSafeMediaUrl(input.image_url, 'URL gambar project');
  const query = id ? client().from('portfolios').update(input).eq('id', id) : client().from('portfolios').insert(input);
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

export async function getPublicNews(id: string): Promise<NewsRecord | null> {
  const { data, error } = await client().from('news').select('*').eq('id', id).not('published_at', 'is', null).maybeSingle();
  if (error) throw error;
  return data as NewsRecord | null;
}

export async function saveNews(input: NewsInput, id?: string): Promise<void> {
  assertSafeMediaUrl(input.cover_image, 'URL cover berita');
  const query = id ? client().from('news').update(input).eq('id', id) : client().from('news').insert(input);
  const { error } = await query;
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
  const query = id ? client().from('products').update(input).eq('id', id) : client().from('products').insert(input);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await client().from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function getProductCatalogue(): Promise<ProductCatalogue | null> {
  const { data, error } = await client().from('product_catalogue').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as ProductCatalogue | null;
}

export async function saveProductCatalogue(title: string, fileUrl: string): Promise<void> {
  assertSafeMediaUrl(fileUrl, 'URL katalog');
  const { error } = await client().from('product_catalogue').upsert({ id: 1, title, file_url: fileUrl });
  if (error) throw error;
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
