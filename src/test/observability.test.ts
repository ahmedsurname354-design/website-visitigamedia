import { describe, expect, it } from 'vitest';
import { cleanPath, fingerprint, shouldSampleVitals } from '@/lib/observability';

describe('first-party observability helpers', () => {
  it('removes query strings and rejects non-path input', () => {
    expect(cleanPath('/news/id?token=secret')).toBe('/news/id');
    expect(cleanPath('https://example.com/private')).toBe('/');
  });

  it('creates deterministic non-reversible fingerprints', () => {
    expect(fingerprint('same error')).toBe(fingerprint('same error'));
    expect(fingerprint('same error')).not.toContain('same error');
    expect(fingerprint('different error')).not.toBe(fingerprint('same error'));
  });

  it('uses deterministic sampling boundaries', () => {
    expect(shouldSampleVitals('visitor', 0)).toBe(false);
    expect(shouldSampleVitals('visitor', 1)).toBe(true);
    expect(shouldSampleVitals('visitor', 0.2)).toBe(shouldSampleVitals('visitor', 0.2));
  });
});
