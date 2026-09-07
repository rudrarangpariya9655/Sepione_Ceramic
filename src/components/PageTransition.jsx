"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps every route in a short fade-and-rise so moving between tabs reads as
 * one continuous surface instead of a hard swap.
 *
 * The App Router unmounts the outgoing page before the new one renders, so an
 * exit animation would never play. Keying on the pathname and animating only
 * on entry is what actually produces a smooth transition here.
 */
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
