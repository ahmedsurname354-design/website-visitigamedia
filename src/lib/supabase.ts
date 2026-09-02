import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// New-format publishable keys authenticate through the `apikey` header, not as
// bearer tokens. supabase-js currently adds the key as an Authorization
// fallback for PostgREST requests, which some Supabase gateways reject with a
// 401. Keep real user session JWTs intact, but remove that invalid fallback.
const fetchWithoutPublishableKeyBearer: typeof fetch = (input, init) => {
  const headers = new Headers(init?.headers);
  if (
    supabasePublishableKey?.startsWith('sb_publishable_')
    && headers.get('Authorization') === `Bearer ${supabasePublishableKey}`
  ) {
    headers.delete('Authorization');
  }

  // CMS reads must reflect admin changes immediately instead of reusing an
  // older PostgREST response cached by a browser or an intermediary.
  return fetch(input, { ...init, headers, cache: init?.cache ?? 'no-store' });
};

// Keep the public site available when contact-form configuration has not yet
// been added to an environment (for example, a preview deployment).
export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, {
      global: { fetch: fetchWithoutPublishableKeyBearer },
    })
  : null;
