import { supabase } from '@/lib/supabase';

export interface NewsComment {
  id: string;
  news_id: string;
  name: string;
  body: string;
  created_at: string;
}

function client() {
  if (!supabase) throw new Error('Layanan komentar belum tersedia.');
  return supabase;
}

export async function listNewsComments(newsId: string, cursor?: NewsComment) {
  let query = client().from('news_comments').select('id,news_id,name,body,created_at')
    .eq('news_id', newsId).order('created_at', { ascending: false }).order('id', { ascending: false }).limit(21);
  if (cursor) query = query.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`);
  const { data, error } = await query;
  if (error) throw error;
  return { items: data.slice(0, 20) as NewsComment[], hasMore: data.length > 20 };
}

let memoryKey: string | undefined;
function submissionKey() {
  try {
    const existing = localStorage.getItem('visitiga_comment_submission_key');
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) return existing;
  } catch { /* Storage can be disabled; retain a key for this page session. */ }
  memoryKey ??= crypto.randomUUID();
  try { localStorage.setItem('visitiga_comment_submission_key', memoryKey); } catch { /* Use memory key. */ }
  return memoryKey;
}

export async function submitNewsComment(newsId: string, name: string, body: string, honeypot: string) {
  const { error } = await client().rpc('submit_news_comment', {
    p_news_id: newsId, p_name: name.trim(), p_body: body.trim(),
    p_submission_key: submissionKey(), p_honeypot: honeypot,
  });
  if (error) {
    if (error.message.includes('Rate limit')) throw new Error('Terlalu banyak komentar. Tunggu 15 menit sebelum mencoba kembali.');
    if (error.message.includes('Article unavailable')) throw new Error('Artikel ini sudah tidak tersedia untuk komentar.');
    throw new Error('Komentar belum terkirim. Silakan coba lagi.');
  }
}

export async function deleteNewsComment(id: string) {
  const { data, error } = await client().from('news_comments').delete().eq('id', id).select('id');
  if (error || !data?.length) throw new Error('Komentar gagal dihapus. Muat ulang daftar dan pastikan Anda memiliki akses admin.');
}
