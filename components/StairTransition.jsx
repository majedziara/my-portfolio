"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Stairs from "./Stairs";
import useMotionPreference from "./useMotionPreference";

export default function StairTransition() {
  const pathname = usePathname();
  const reducedMotion = useMotionPreference();
  if (reducedMotion) return null;

  return (
    <AnimatePresence mode="wait">
      <div key={pathname} aria-hidden="true" data-screen-transition="stairs"
        className="pointer-events-none fixed inset-0 z-40 flex overflow-hidden">
        <Stairs />
      </div>
    </AnimatePresence>
  );
}
