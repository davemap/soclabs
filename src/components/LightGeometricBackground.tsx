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
        <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-[hsl(195_70%_85%)] blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-[hsl(210_60%_90%)] blur-[120px]" />
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
