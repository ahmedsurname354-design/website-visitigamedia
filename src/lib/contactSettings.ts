import type { ContactSettings } from '@/types/admin';

export const defaultContactSettings: ContactSettings = {
  id: 1,
  marketing_phone: '+62 822 5878 8780',
  marketing_email: 'marcomm@visitiga.com',
  procurement_phone: '+62 822 5878 8780',
  procurement_email: 'marcomm@visitiga.com',
  updated_at: '',
};

export function normalizePhoneForWhatsApp(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

export function whatsappHref(phone: string, message?: string) {
  const base = `https://wa.me/${normalizePhoneForWhatsApp(phone)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
