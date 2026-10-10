import { motion } from "framer-motion";

const steps = 4;
const stairAnimation = {
  initial: { top: "0%" },
  animate: { top: "100%" },
  exit: { top: ["100%", "0%"] },
};

export default function Stairs() {
  return Array.from({ length: steps }, (_, index) => (
    <motion.div
      key={index}
      variants={stairAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut", delay: (steps - index - 1) * 0.1 }}
      className="relative h-full w-full bg-white"
    />
  ));
}
