import { useEffect, useState } from 'react';
import { getPublicContactSettings } from '@/lib/publicApi';
import { defaultContactSettings } from '@/lib/contactSettings';
import type { ContactSettings } from '@/types/admin';

export function useContactSettings() {
  const [settings, setSettings] = useState<ContactSettings>(defaultContactSettings);

  useEffect(() => {
    let active = true;
    void getPublicContactSettings().then((saved) => {
      if (active && saved) setSettings({ ...defaultContactSettings, ...saved });
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  return settings;
}
