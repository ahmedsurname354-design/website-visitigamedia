import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
    // Start the reveal slightly before the section reaches the viewport so it
    // never feels delayed while scrolling.
    margin: '0px 0px -12% 0px',
    amount: 0.15,
  });
  return { ref, isInView };
}
