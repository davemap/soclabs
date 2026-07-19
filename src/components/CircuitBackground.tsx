import { useMemo } from "react";

interface CircuitBackgroundProps {
  className?: string;
  seed?: number;
  /** Number of traces to draw */
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
const HEIGHT = 2200;

type Trace = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  kind: "diag" | "vert" | "horiz";
};

/**
 * Randomly scattered SoC-style traces:
 *  - light-blue 45° diagonals with tick marks
 *  - green vertical / horizontal traces
 *  - light-blue vias (rings) at every trace endpoint & intersection
 */
const CircuitBackground = ({
  className = "",
  seed = 7,
  count = 26,
  opacity = 0.55,
}: CircuitBackgroundProps) => {
  const { traces, vias } = useMemo(() => {
    const rand = mulberry32(seed);
    const traces: Trace[] = [];
    const endpoints: [number, number][] = [];

    for (let i = 0; i < count; i++) {
      const r = rand();
      const x = rand() * WIDTH;
      const y = rand() * HEIGHT;
      const len = 140 + rand() * 360;

      if (r < 0.45) {
        const dir = rand() > 0.5 ? 1 : -1;
        const d = len / Math.SQRT2;
        const x2 = x + d * dir;
        const y2 = y + d;
        traces.push({ x1: x, y1: y, x2, y2, kind: "diag" });
        endpoints.push([x, y], [x2, y2]);
      } else if (r < 0.8) {
        const dir = rand() > 0.5 ? 1 : -1;
        const y2 = y + len * dir;
        traces.push({ x1: x, y1: y, x2: x, y2, kind: "vert" });
        endpoints.push([x, y], [x, y2]);
      } else {
        const dir = rand() > 0.5 ? 1 : -1;
        const x2 = x + len * dir;
        traces.push({ x1: x, y1: y, x2, y2: y, kind: "horiz" });
        endpoints.push([x, y], [x2, y]);
      }
    }

    const intersections: [number, number][] = [];
    for (let i = 0; i < traces.length; i++) {
      for (let j = i + 1; j < traces.length; j++) {
        const a = traces[i];
        const b = traces[j];
        if (a.kind === b.kind) continue;
        const denom =
          (a.x1 - a.x2) * (b.y1 - b.y2) - (a.y1 - a.y2) * (b.x1 - b.x2);
        if (Math.abs(denom) < 0.001) continue;
        const t =
          ((a.x1 - b.x1) * (b.y1 - b.y2) - (a.y1 - b.y1) * (b.x1 - b.x2)) /
          denom;
        const u =
          -((a.x1 - a.x2) * (a.y1 - b.y1) - (a.y1 - a.y2) * (a.x1 - b.x1)) /
          denom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          intersections.push([
            a.x1 + t * (a.x2 - a.x1),
            a.y1 + t * (a.y2 - a.y1),
          ]);
        }
      }
    }

    return { traces, vias: [...endpoints, ...intersections] };
  }, [seed, count]);

  const blue = "hsl(200 85% 72%)";
  const green = "hsl(140 60% 75%)";
  const tickBlue = "hsl(210 80% 55%)";
  const stroke = 6;

  const renderTicks = (t: Trace, key: number) => {
    if (t.kind !== "diag") return null;
    const dx = t.x2 - t.x1;
    const dy = t.y2 - t.y1;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const tickLen = stroke * 1.5;
    const spacing = 55;
    const n = Math.max(2, Math.floor(len / spacing));
    const nodes: JSX.Element[] = [];

    for (let i = 0; i < 4; i++) {
      const off = i * (stroke * 0.55);
      const mx = t.x1 + ux * off;
      const my = t.y1 + uy * off;
      nodes.push(
        <line
          key={`${key}-s${i}`}
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

    for (let i = 1; i < n; i++) {
      const d = (i / n) * len;
      const mx = t.x1 + ux * d;
      const my = t.y1 + uy * d;
      nodes.push(
        <line
          key={`${key}-t${i}`}
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
    return <g key={`ticks-${key}`}>{nodes}</g>;
  };

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
            stroke={t.kind === "diag" ? blue : green}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        ))}
        {traces.map((t, i) => renderTicks(t, i))}
        {vias.map((v, i) => (
          <circle
            key={`v${i}`}
            cx={v[0]}
            cy={v[1]}
            r={15}
            fill="none"
            stroke={blue}
            strokeWidth={4.5}
          />
        ))}
      </svg>
    </div>
  );
};

export default CircuitBackground;
