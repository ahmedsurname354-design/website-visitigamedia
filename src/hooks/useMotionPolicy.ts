import { useSyncExternalStore } from 'react';

const reducedQuery = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(reducedQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function getSnapshot() {
  return window.matchMedia(reducedQuery).matches;
}

export function useMotionPolicy() {
  const reducedMotion = useSyncExternalStore(subscribe, getSnapshot, () => true);
  return { reducedMotion };
}
