import { supabase } from '@/lib/supabase';

const visitorKey = 'visitiga_visitor_id';

function visitorId() {
  const existing = localStorage.getItem(visitorKey);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(visitorKey, id);
  return id;
}

export async function recordPageView(path: string): Promise<void> {
  if (!supabase || path.startsWith('/admin')) return;
  const { error } = await supabase.from('website_events').insert({ visitor_id: visitorId(), path });
  if (error) console.warn('Page view tidak dapat direkam:', error.message);
}
