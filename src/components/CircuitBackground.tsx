import { useMemo } from "react";

interface CircuitBackgroundProps {
  className?: string;
  seed?: number;
  density?: number;
}

// Deterministic pseudo-random so the SSR/CSR trace layout matches.
const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * A tiled circuit-trace + via pattern that lives behind the whole page.
 * Uses orthogonal segments with 45° corners and glowing nodes to echo
 * the SoC Labs slide-deck backdrop.
 */
const CircuitBackground = ({ className = "", seed = 7, density = 26 }: CircuitBackgroundProps) => {
  const paths = useMemo(() => {
    const rand = mulberry32(seed);
    const cell = 120;
    const cols = 12;
    const rows = 14;
    const items: { d: string; nodes: [number, number][]; opacity: number; color: string }[] = [];

    for (let i = 0; i < density; i++) {
      const startCol = Math.floor(rand() * cols);
      const startRow = Math.floor(rand() * rows);
      let x = startCol * cell + cell / 2;
      let y = startRow * cell + cell / 2;
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
            y += dir * step;
            x += dir * step;
          }
          d += ` l 0 ${dy - (goDiag ? dir * (cell / 2) : 0)}`;
          y += dy - (goDiag ? dir * (cell / 2) : 0);
          lastDir = "v";
        } else {
          const dx = dir * len;
          if (goDiag) {
            const step = Math.min(cell / 2, Math.abs(dx) / 2);
            d += ` l ${dir * step} ${-dir * step}`;
            x += dir * step;
            y += -dir * step;
          }
          d += ` l ${dx - (goDiag ? dir * (cell / 2) : 0)} 0`;
          x += dx - (goDiag ? dir * (cell / 2) : 0);
          lastDir = "h";
        }
        nodes.push([x, y]);
      }

      const colorRoll = rand();
      const color =
        colorRoll > 0.72
          ? "hsl(195 85% 55%)" // bright accent
          : colorRoll > 0.42
          ? "hsl(195 85% 60%)" // cyan
          : "hsl(195 75% 50%)"; // muted primary

      items.push({
        d,
        nodes,
        opacity: 0.18 + rand() * 0.35,
        color,
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
        viewBox="0 0 1440 1680"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="via-lime" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(195 85% 65%)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="hsl(195 85% 65%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(195 85% 65%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="via-cyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(195 85% 70%)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="hsl(195 85% 70%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(195 85% 70%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" />
          </filter>
        </defs>

        {paths.map((p, i) => (
          <g key={i} style={{ opacity: p.opacity }}>
            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-soft)"
            />
            {p.nodes.map((n, j) => {
              const isEnd = j === 0 || j === p.nodes.length - 1;
              const r = isEnd ? 6 : 3;
              const fill =
                p.color.includes("82") ? "url(#via-lime)" : "url(#via-cyan)";
              return (
                <g key={j}>
                  <circle cx={n[0]} cy={n[1]} r={r * 2.4} fill={fill} />
                  <circle
                    cx={n[0]}
                    cy={n[1]}
                    r={r}
                    fill="none"
                    stroke={p.color}
                    strokeWidth={1}
                    opacity={0.9}
                  />
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
