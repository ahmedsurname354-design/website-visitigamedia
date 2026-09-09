import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useMotionPolicy } from './useMotionPolicy';

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { reducedMotion } = useMotionPolicy();
  const isInView = useInView(ref, {
    once: true,
    // Start the reveal slightly before the section reaches the viewport so it
    // never feels delayed while scrolling.
    margin: '0px 0px 80px 0px',
    amount: 'some',
  });
  return { ref, isInView: reducedMotion || isInView, reducedMotion };
}
