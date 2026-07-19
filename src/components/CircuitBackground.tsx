import { useMemo } from "react";

interface CircuitBackgroundProps {
  className?: string;
  seed?: number;
  count?: number;
  opacity?: number;
}

const mulberry32 = (a: number) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const WIDTH = 1620;
const HEIGHT = 2400;

type Trace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: "diag" | "vert" | "horiz";
  /** which end(s) should get a via ring */
  viaStart: boolean;
  viaEnd: boolean;
};

/**
 * Scattered SoC-style traces on a light background:
 *  - light-blue 45° diagonals
 *  - light-blue horizontal traces
 *  - soft-green vertical traces
 *  - light-blue via rings (translucent fill + ring stroke) at trace endpoints
 */
const CircuitBackground = ({
  className = "",
  seed = 5,
  count = 22,
  opacity = 0.9,
}: CircuitBackgroundProps) => {
  const traces = useMemo<Trace[]>(() => {
    const rand = mulberry32(seed);
    const items: Trace[] = [];

    for (let i = 0; i < count; i++) {
      const r = rand();
      const x = rand() * WIDTH;
      const y = rand() * HEIGHT;
      const len = 180 + rand() * 380;
      const viaStart = rand() > 0.55;
      const viaEnd = rand() > 0.35;

      if (r < 0.4) {
        // 45° diagonal (blue)
        const dirX = rand() > 0.5 ? 1 : -1;
        const dirY = rand() > 0.5 ? 1 : -1;
        const d = len / Math.SQRT2;
        items.push({
          x1: x,
          y1: y,
          x2: x + d * dirX,
          y2: y + d * dirY,
          kind: "diag",
          viaStart,
          viaEnd,
        });
      } else if (r < 0.75) {
        // vertical (green)
        const dir = rand() > 0.5 ? 1 : -1;
        items.push({
          x1: x,
          y1: y,
          x2: x,
          y2: y + len * dir,
          kind: "vert",
          viaStart,
          viaEnd,
        });
      } else {
        // horizontal (blue)
        const dir = rand() > 0.5 ? 1 : -1;
        items.push({
          x1: x,
          y1: y,
          x2: x + len * dir,
          y2: y,
          kind: "horiz",
          viaStart,
          viaEnd,
        });
      }
    }
    return items;
  }, [seed, count]);

  const blue = "hsl(200 85% 78%)";
  const green = "hsl(140 60% 80%)";
  const ringStroke = "hsl(200 85% 70%)";
  const ringFill = "hsl(200 85% 82% / 0.35)";
  const stroke = 5;

  const vias: [number, number][] = [];
  traces.forEach((t) => {
    if (t.viaStart) vias.push([t.x1, t.y1]);
    if (t.viaEnd) vias.push([t.x2, t.y2]);
  });

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {traces.map((t, i) => (
          <line
            key={`l${i}`}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.kind === "vert" ? green : blue}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        ))}
        {vias.map((v, i) => (
          <g key={`v${i}`}>
            <circle cx={v[0]} cy={v[1]} r={14} fill={ringFill} />
            <circle
              cx={v[0]}
              cy={v[1]}
              r={14}
              fill="none"
              stroke={ringStroke}
              strokeWidth={3.5}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CircuitBackground;
