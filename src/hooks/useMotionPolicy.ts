import { useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 640px)';
const reducedQuery = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(mobileQuery), window.matchMedia(reducedQuery)];
  queries.forEach((query) => query.addEventListener('change', onChange));
  return () => queries.forEach((query) => query.removeEventListener('change', onChange));
}

function getSnapshot() {
  return Number(window.matchMedia(mobileQuery).matches) | (Number(window.matchMedia(reducedQuery).matches) << 1);
}

export function useMotionPolicy() {
  const policy = useSyncExternalStore(subscribe, getSnapshot, () => 2);
  const isMobile = Boolean(policy & 1);
  const reducedMotion = Boolean(policy & 2);
  return { isMobile, reducedMotion, parallax: !isMobile && !reducedMotion };
}
