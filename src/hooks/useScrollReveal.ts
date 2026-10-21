import { useEffect, useRef, useState } from 'react';
import { useMotionPolicy } from './useMotionPolicy';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const { reducedMotion } = useMotionPolicy();

  useEffect(() => {
    if (reducedMotion) {
      setIsInView(true);
      return;
    }

    const element = ref.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsInView(true);
      observer.disconnect();
    }, { rootMargin: '0px 0px 80px 0px', threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return { ref, isInView: reducedMotion || isInView, reducedMotion };
}
