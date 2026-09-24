import type { Metric } from 'web-vitals';
import { readLocalStorage, writeLocalStorage } from '@/lib/safeStorage';

export type ObservationKind = 'web_vital' | 'client_error' | 'csp_violation';
export type ObservationRating = 'good' | 'needs-improvement' | 'poor';

const keyName = 'visitiga_observation_key';
const sent = new Set<string>();

function observationKey() {
  const existing = readLocalStorage(keyName);
  if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
  const value = crypto.randomUUID();
  writeLocalStorage(keyName, value);
  return value;
}

export function cleanPath(path = window.location.pathname) {
  return path.startsWith('/') ? path.split('?')[0].slice(0, 500) : '/';
}

export function fingerprint(value: string) {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return `v1-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function shouldSampleVitals(key: string, rate = 0.2) {
  return Number.parseInt(fingerprint(key).slice(-8), 16) / 0xffffffff < rate;
}

function safeText(value: unknown, limit: number) {
  return String(value ?? '').replace(/https?:\/\/[^\s)]+/gi, (url) => url.split('?')[0]).slice(0, limit);
}

export async function submitObservation(input: { kind: ObservationKind; name: string; value?: number; rating?: ObservationRating; fingerprint: string; details?: Record<string, unknown> }) {
  const release = import.meta.env.VITE_APP_VERSION || 'development';
  const dedupeKey = `${release}:${input.fingerprint}`;
  if (sent.has(dedupeKey)) return;
  sent.add(dedupeKey);
  try {
    const { supabase } = await import('@/lib/supabase');
    if (!supabase) return;
    const { error } = await supabase.rpc('submit_website_observation', {
      p_kind: input.kind, p_name: input.name.slice(0, 80), p_value: input.value ?? null,
      p_rating: input.rating ?? null, p_path: cleanPath(), p_fingerprint: input.fingerprint,
      p_release: release.slice(0, 80), p_details: input.details ?? {}, p_submission_key: observationKey(),
    });
    if (error) sent.delete(dedupeKey);
  } catch { sent.delete(dedupeKey); }
}

export function reportClientError(reason: unknown, source = 'runtime') {
  const error = reason instanceof Error ? reason : new Error(safeText(reason, 300));
  const message = safeText(error.message, 500);
  void submitObservation({ kind: 'client_error', name: error.name || 'Error', fingerprint: fingerprint(`${source}:${message}:${error.stack?.split('\n')[1] ?? ''}`), details: { source, message, stack: safeText(error.stack, 2000) } });
}

function reportMetric(metric: Metric) {
  void submitObservation({ kind: 'web_vital', name: metric.name, value: metric.value, rating: metric.rating, fingerprint: fingerprint(`${metric.name}:${metric.id}`), details: { navigationType: metric.navigationType } });
}

export function initializeObservability() {
  const onError = (event: ErrorEvent) => reportClientError(event.error ?? event.message, 'window.error');
  const onRejection = (event: PromiseRejectionEvent) => reportClientError(event.reason, 'unhandledrejection');
  const onCsp = (event: SecurityPolicyViolationEvent) => {
    const directive = safeText(event.effectiveDirective, 80);
    void submitObservation({ kind: 'csp_violation', name: directive, fingerprint: fingerprint(`${directive}:${event.blockedURI}:${cleanPath()}`), details: { blockedOrigin: safeText(event.blockedURI, 300), disposition: event.disposition } });
  };
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  document.addEventListener('securitypolicyviolation', onCsp);
  const key = observationKey();
  if (shouldSampleVitals(key)) void import('web-vitals').then(({ onCLS, onINP, onLCP }) => { onCLS(reportMetric); onINP(reportMetric); onLCP(reportMetric); });
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
    document.removeEventListener('securitypolicyviolation', onCsp);
  };
}
