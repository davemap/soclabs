interface CircuitBackgroundProps {
  className?: string;
  /** Tile size in px */
  tile?: number;
  /** Stroke width of the traces */
  strokeWidth?: number;
  /** Overall opacity of the pattern */
  opacity?: number;
}

/**
 * Tessellating trace pattern:
 *  - light-blue 45° diagonal traces (with tick marks)
 *  - light-green vertical traces
 *  - light-blue ring at every intersection
 * Rendered as an SVG <pattern> so it tiles cleanly across the page.
 */
const CircuitBackground = ({
  className = "",
  tile = 220,
  strokeWidth = 6,
  opacity = 0.55,
}: CircuitBackgroundProps) => {
  const blue = "hsl(200 85% 72%)";
  const green = "hsl(140 60% 75%)";
  const tickBlue = "hsl(210 80% 55%)";

  // Geometry for one tile
  const s = tile;
  const cx = s * 0.72; // intersection x
  const cy = s * 0.78; // intersection y
  const diagStartX = s * 0.08;
  const diagStartY = s * 0.14;
  const vertTop = s * 0.02;
  const vertBottom = s + 2; // slight overlap so tiles connect
  const ringR = s * 0.075;

  // Tick marks along the diagonal
  const dx = cx - diagStartX;
  const dy = cy - diagStartY;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  // perpendicular unit
  const px = -uy;
  const py = ux;
  const tickCount = 6;
  const tickLen = strokeWidth * 1.6;

  const ticks: JSX.Element[] = [];
  for (let i = 1; i <= tickCount; i++) {
    const t = (i / (tickCount + 1)) * len;
    const mx = diagStartX + ux * t;
    const my = diagStartY + uy * t;
    ticks.push(
      <line
        key={`tick-${i}`}
        x1={mx - px * tickLen}
        y1={my - py * tickLen}
        x2={mx + px * tickLen}
        y2={my + py * tickLen}
        stroke={tickBlue}
        strokeWidth={1.4}
        strokeLinecap="round"
      />,
    );
  }

  // Cluster of ticks at the start of the diagonal
  const startCluster: JSX.Element[] = [];
  for (let i = 0; i < 4; i++) {
    const off = (i - 1.5) * (strokeWidth * 0.55);
    const mx = diagStartX + ux * off;
    const my = diagStartY + uy * off;
    startCluster.push(
      <line
        key={`start-${i}`}
        x1={mx - px * tickLen}
        y1={my - py * tickLen}
        x2={mx + px * tickLen}
        y2={my + py * tickLen}
        stroke={tickBlue}
        strokeWidth={1.4}
        strokeLinecap="round"
      />,
    );
  }

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="soc-traces"
            width={s}
            height={s}
            patternUnits="userSpaceOnUse"
          >
            {/* vertical green trace */}
            <line
              x1={cx}
              y1={vertTop}
              x2={cx}
              y2={vertBottom}
              stroke={green}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* 45° blue diagonal trace */}
            <line
              x1={diagStartX}
              y1={diagStartY}
              x2={cx}
              y2={cy}
              stroke={blue}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* tick marks along diagonal */}
            {ticks}
            {startCluster}
            {/* intersection ring */}
            <circle
              cx={cx}
              cy={cy}
              r={ringR}
              fill="none"
              stroke={blue}
              strokeWidth={strokeWidth * 0.75}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#soc-traces)" />
      </svg>
    </div>
  );
};

export default CircuitBackground;
