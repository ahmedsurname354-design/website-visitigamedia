import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { Product, ProductInput } from '@/types/admin';

function client(): SupabaseClient {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi. Isi variabel environment terlebih dahulu.');
  return supabase;
}

export async function listProducts(): Promise<Product[]> {
  const { data, error } = await client().from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as Product[];
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await client().from('products').insert(input).select().single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const { data, error } = await client().from('products').update(input).eq('id', id).select().single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await client().from('products').delete().eq('id', id);
  if (error) throw error;
}
