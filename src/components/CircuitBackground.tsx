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

type Color = "blue" | "green";
type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: Color;
};
type Via = { x: number; y: number };

/**
 * Chip-wiring style background.
 *  - Blue owns horizontal (0°) and +45° diagonal traces.
 *  - Green owns vertical (90°) and -45° diagonal traces.
 *  - Traces are chains of segments. When a chain switches color mid-run
 *    (i.e. changes routing layer), a via ring is dropped at the joint.
 *  - Endpoints also terminate on vias.
 */
const CircuitBackground = ({
  className = "",
  seed = 7,
  count = 14,
  opacity = 0.9,
}: CircuitBackgroundProps) => {
  const { segments, vias } = useMemo(() => {
    const rand = mulberry32(seed);
    const segs: Segment[] = [];
    const vs: Via[] = [];

    // angle sets per color (in radians)
    const angles: Record<Color, number[]> = {
      blue: [0, Math.PI, Math.PI / 4, (5 * Math.PI) / 4], // horiz + 45°
      green: [Math.PI / 2, (3 * Math.PI) / 2, (3 * Math.PI) / 4, (7 * Math.PI) / 4], // vert + 135°(=-45°)
    };

    const inBounds = (x: number, y: number) =>
      x > 40 && x < WIDTH - 40 && y > 40 && y < HEIGHT - 40;

    for (let i = 0; i < count; i++) {
      let x = 60 + rand() * (WIDTH - 120);
      let y = 60 + rand() * (HEIGHT - 120);
      let color: Color = rand() > 0.5 ? "blue" : "green";

      // starting via
      vs.push({ x, y });

      const hops = 2 + Math.floor(rand() * 3); // 2-4 segments per chain
      let lastAngle = angles[color][Math.floor(rand() * angles[color].length)];

      for (let h = 0; h < hops; h++) {
        // pick an angle for the current color, avoid reversing direction
        const opts = angles[color].filter(
          (a) => Math.abs(((a - lastAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI) > 0.1,
        );
        const angle = opts[Math.floor(rand() * opts.length)];
        const len = 140 + rand() * 320;
        const nx = x + Math.cos(angle) * len;
        const ny = y + Math.sin(angle) * len;

        if (!inBounds(nx, ny)) break;

        segs.push({ x1: x, y1: y, x2: nx, y2: ny, color });
        x = nx;
        y = ny;
        lastAngle = angle;

        // maybe switch layer -> via at the joint (skip on last hop; endpoint via added below)
        if (h < hops - 1 && rand() > 0.45) {
          vs.push({ x, y });
          color = color === "blue" ? "green" : "blue";
        }
      }

      // terminating via
      vs.push({ x, y });
    }

    return { segments: segs, vias: vs };
  }, [seed, count]);

  const blue = "hsl(200 85% 78%)";
  const green = "hsl(140 55% 78%)";
  const ringStroke = "hsl(200 85% 68%)";
  const ringFill = "hsl(200 85% 82% / 0.35)";
  const stroke = 5;

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
        {segments.map((s, i) => (
          <line
            key={`s${i}`}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.color === "blue" ? blue : green}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        ))}
        {vias.map((v, i) => (
          <g key={`v${i}`}>
            <circle cx={v.x} cy={v.y} r={14} fill={ringFill} />
            <circle
              cx={v.x}
              cy={v.y}
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
