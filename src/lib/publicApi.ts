import type { SupabaseClient } from '@supabase/supabase-js';
import type { HomepageContent, NewsRecord, Portfolio, Product, ProductCatalogue } from '@/types/admin';

async function client(): Promise<SupabaseClient> {
  const { supabase } = await import('@/lib/supabase');
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
}

export async function listPublicPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await (await client()).from('portfolios').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Portfolio[];
}

export async function listPublicNews(): Promise<NewsRecord[]> {
  const { data, error } = await (await client()).from('news').select('*').not('published_at', 'is', null).order('published_at', { ascending: false });
  if (error) throw error;
  return data as NewsRecord[];
}

export async function listPublicProducts(): Promise<Product[]> {
  const { data, error } = await (await client()).from('products').select('*').order('sort_order').order('created_at');
  if (error) throw error;
  return data as Product[];
}

export async function getPublicHomepageContent(): Promise<HomepageContent | null> {
  const { data, error } = await (await client()).from('homepage_content').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as HomepageContent | null;
}

export async function getProductCatalogue(): Promise<ProductCatalogue | null> {
  const { data, error } = await (await client()).from('product_catalogue').select('*').eq('id', 1).maybeSingle();
  if (error) throw error;
  return data as ProductCatalogue | null;
}
