import { m as motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { useMotionPolicy } from '@/hooks/useMotionPolicy';

export default function LightReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const { reducedMotion } = useMotionPolicy();

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12, margin: '0px 0px -24px 0px' }}
      transition={{ duration: reducedMotion ? 0 : 0.28, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
