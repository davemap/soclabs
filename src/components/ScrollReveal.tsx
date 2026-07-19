import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  distance?: number;
}

const ScrollReveal = ({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 50,
}: ScrollRevealProps) => {
  const initial = {
    opacity: 0,
    y: direction === "up" ? distance : 0,
    x: direction === "left" ? -distance : direction === "right" ? distance : 0,
  };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 0.61, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
