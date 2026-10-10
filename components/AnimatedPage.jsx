"use client";

import { motion } from "framer-motion";
import useMotionPreference from "./useMotionPreference";

export default function AnimatedPage({ children, className, as = "div" }) {
  const reducedMotion = useMotionPreference();
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component className={className} data-page-reveal="true"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { delay: 2.4, duration: 0.4, ease: "easeIn" }}>
      {children}
    </Component>
  );
}
