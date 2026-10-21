import { supabase } from '@/lib/supabase';

export async function translateContent<T>(content: T, sourceLocale: 'en' | 'id' = 'en', targetLocale: 'en' | 'id' = 'id'): Promise<T> {
  if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Sesi admin tidak ditemukan. Silakan masuk kembali.');
  const response = await fetch('/api/translate-content', { method: 'POST', headers: { authorization: `Bearer ${session.access_token}`, 'content-type': 'application/json' }, body: JSON.stringify({ source_locale: sourceLocale, target_locale: targetLocale, content }) });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    const detail = result && typeof result.error === 'string' ? result.error : `Layanan terjemahan mengembalikan HTTP ${response.status}.`;
    throw new Error(detail);
  }
  if (!result || !result.content || typeof result.content !== 'object') throw new Error('Respons terjemahan tidak valid.');
  return result.content as T;
}
