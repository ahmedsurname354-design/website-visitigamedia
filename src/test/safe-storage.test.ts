import { afterEach, describe, expect, it, vi } from 'vitest';
import { readLocalStorage, writeLocalStorage } from '@/lib/safeStorage';

describe('safe local storage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('reads and writes available storage', () => {
    expect(writeLocalStorage('safe-storage-test', 'value')).toBe(true);
    expect(readLocalStorage('safe-storage-test')).toBe('value');
  });

  it('does not throw when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(readLocalStorage('blocked')).toBeNull();
    expect(writeLocalStorage('blocked', 'value')).toBe(false);
  });
});
