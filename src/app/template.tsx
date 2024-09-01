'use client'
import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Template({ children }: { children: ReactNode }) {
  const variants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 }
  };

  return (
    <AnimatePresence
      mode="wait" // Ensures that the exit animation completes before the next page enters
    >
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={variants}
        transition={{ duration: 0.5 }} // Adjust duration as needed
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
