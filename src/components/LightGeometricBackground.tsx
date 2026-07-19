import { motion } from "framer-motion";

interface LightGeometricBackgroundProps {
  className?: string;
}

/**
 * A calm, light geometric backdrop for the homepage.
 * Uses a faint dot grid and soft ambient color washes to keep the
 * background airy, readable, and distinctly SoC Labs.
 */
const LightGeometricBackground = ({ className = "" }: LightGeometricBackgroundProps) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Soft ambient blobs */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[hsl(195_85%_85%)] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, -15, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-[hsl(195_75%_90%)] blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute top-[30%] left-[60%] h-[25%] w-[25%] rounded-full bg-[hsl(195_90%_88%)] blur-[100px]"
        />
      </div>

      {/* Faint dot grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(215 20% 70%) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Bottom vignette to ease into the footer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
};

export default LightGeometricBackground;
