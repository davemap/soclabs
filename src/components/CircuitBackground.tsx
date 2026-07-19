import { useMemo } from "react";

interface CircuitBackgroundProps {
  className?: string;
  seed?: number;
  density?: number;
  /** HSL color for traces & vias (defaults to the site's electric blue). */
  color?: string;
}

const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Tiled circuit-trace + via pattern that lives behind the page.
 * Orthogonal segments with the occasional 45° bend, terminating in
 * ringed via nodes — mirrors the SoC Labs slide-deck backdrop.
 */
const CircuitBackground = ({
  className = "",
  seed = 11,
  density = 34,
  color = "hsl(var(--electric))",
}: CircuitBackgroundProps) => {
  const paths = useMemo(() => {
    const rand = mulberry32(seed);
    const cell = 90;
    const cols = 18;
    const rows = 20;
    const items: { d: string; nodes: [number, number][]; opacity: number }[] = [];

    for (let i = 0; i < density; i++) {
      let x = Math.floor(rand() * cols) * cell + cell / 2;
      let y = Math.floor(rand() * rows) * cell + cell / 2;
      const nodes: [number, number][] = [[x, y]];
      let d = `M ${x} ${y}`;
      const segments = 3 + Math.floor(rand() * 5);
      let lastDir: "h" | "v" = rand() > 0.5 ? "h" : "v";

      for (let s = 0; s < segments; s++) {
        const goDiag = rand() > 0.55;
        const len = (1 + Math.floor(rand() * 3)) * cell;
        const dir = rand() > 0.5 ? 1 : -1;
        if (lastDir === "h") {
          const dy = dir * len;
          if (goDiag) {
            const step = Math.min(cell / 2, Math.abs(dy) / 2);
            d += ` l ${dir * step} ${dir * step}`;
            x += dir * step;
            y += dir * step;
          }
          const remaining = dy - (goDiag ? dir * (cell / 2) : 0);
          d += ` l 0 ${remaining}`;
          y += remaining;
          lastDir = "v";
        } else {
          const dx = dir * len;
          if (goDiag) {
            const step = Math.min(cell / 2, Math.abs(dx) / 2);
            d += ` l ${dir * step} ${-dir * step}`;
            x += dir * step;
            y += -dir * step;
          }
          const remaining = dx - (goDiag ? dir * (cell / 2) : 0);
          d += ` l ${remaining} 0`;
          x += remaining;
          lastDir = "h";
        }
        nodes.push([x, y]);
      }

      items.push({
        d,
        nodes,
        opacity: 0.35 + rand() * 0.45,
      });
    }
    return items;
  }, [seed, density]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1620 1800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((p, i) => (
          <g key={i} style={{ opacity: p.opacity }}>
            <path
              d={p.d}
              fill="none"
              stroke={color}
              strokeWidth={1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {p.nodes.map((n, j) => {
              const isEnd = j === 0 || j === p.nodes.length - 1;
              const r = isEnd ? 3.2 : 2.2;
              return (
                <g key={j}>
                  {isEnd && (
                    <circle cx={n[0]} cy={n[1]} r={r * 2.2} fill={color} opacity={0.12} />
                  )}
                  <circle cx={n[0]} cy={n[1]} r={r} fill="hsl(var(--background))" stroke={color} strokeWidth={1.1} />
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CircuitBackground;
