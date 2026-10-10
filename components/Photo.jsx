"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import useMotionPreference from "./useMotionPreference";

export default function Photo() {
  const reducedMotion = useMotionPreference();

  return (
    <div className="relative w-[310px] h-[310px] lg:w-[430px] lg:h-[430px]">
      <motion.div data-portrait-reveal="true"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { delay: 2, duration: 0.4, ease: "easeIn" }}>
        <motion.div data-portrait-reveal="true"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reducedMotion ? { duration: 0 } : { delay: 2.4, duration: 0.4, ease: "easeInOut" }}
          className="absolute w-[298px] h-[298px] lg:w-[420px] lg:h-[420px] mix-blend-difference">
          <Image src="/assets/my-picture.webp"
            alt="Illustrated portrait of Majed Ziara, Laravel and Next.js developer"
            fill preload fetchPriority="high" sizes="(min-width: 1024px) 420px, 298px"
            className="object-contain rounded-full" />
        </motion.div>
        <svg aria-hidden="true" className="portrait-ring w-[310px] h-[310px] lg:w-[430px] lg:h-[430px] -ml-1"
          fill="transparent" viewBox="0 0 506 506" xmlns="http://www.w3.org/2000/svg">
          <motion.circle cx="253" cy="253" r="250" stroke="#00ff99" strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round"
            initial={{ strokeDasharray: "24 10 0 0" }}
            animate={reducedMotion ? { strokeDasharray: "24 10 0 0", rotate: 0 } : {
              strokeDasharray: ["15 120 25 25", "16 25 92 72", "4 250 22 22"],
              rotate: [120, 360],
            }}
            transition={reducedMotion ? { duration: 0 } : { duration: 15, repeat: Infinity, repeatType: "reverse" }} />
        </svg>
      </motion.div>
    </div>
  );
}
