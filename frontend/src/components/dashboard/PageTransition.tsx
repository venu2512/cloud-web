import { motion } from "framer-motion";
import { ReactNode } from "react";

// Tweak this one place to change transitions site-wide
export const pageTransitionConfig = {
  duration: 0.28,
  ease: [0.25, 0.1, 0.25, 1] as const, // cubic-bezier for smooth feel
};

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: -6,  scale: 0.995 }}
      transition={pageTransitionConfig}
    >
      {children}
    </motion.div>
  );
}