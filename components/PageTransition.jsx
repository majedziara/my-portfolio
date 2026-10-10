"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import useMotionPreference from "./useMotionPreference";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const reducedMotion = useMotionPreference();

  return (
    <div key={pathname}>
      {!reducedMotion && (
        <motion.div aria-hidden="true" data-screen-transition="fade"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1, duration: 0.4, ease: "easeInOut" }}
          className="pointer-events-none fixed inset-0 z-30 bg-primary" />
      )}
      {children}
    </div>
  );
}
