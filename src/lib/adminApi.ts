import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { NewsInput, NewsRecord, Portfolio, PortfolioInput } from '@/types/admin';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  return supabase;
}

export async function listPortfolios(): Promise<Portfolio[]> {
  const { data, error } = await client().from('portfolios').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Portfolio[];
}

export async function savePortfolio(input: PortfolioInput, id?: string): Promise<void> {
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

export async function saveNews(input: NewsInput, id?: string): Promise<void> {
  const query = id ? client().from('news').update(input).eq('id', id) : client().from('news').insert(input);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteNews(id: string): Promise<void> {
  const { error } = await client().from('news').delete().eq('id', id);
  if (error) throw error;
}
