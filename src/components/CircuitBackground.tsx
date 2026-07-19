import { useMemo } from "react";

interface CircuitBackgroundProps {
  className?: string;
  seed?: number;
  /** approximate number of wire chains to draw */
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
const MARGIN = 220; // how far terminal segments run off-screen
const MIN_VIA_SPACING = 130;

type Color = "blue" | "green";
type Segment = { x1: number; y1: number; x2: number; y2: number; color: Color };
type Via = { x: number; y: number };

/**
 * Chip-wiring background.
 *  - Blue routes horizontally and along +45°.
 *  - Green routes vertically and along -45°.
 *  - Vias only exist at layer changes; every via has ≥2 wires attached.
 *  - Terminal wires exit past the visible frame — no dead-end vias.
 *  - Chain anchors are placed on a jittered grid with a minimum spacing so
 *    the pattern feels evenly distributed but never regular.
 */
const CircuitBackground = ({
  className = "",
  seed = 11,
  count = 22,
  opacity = 0.9,
}: CircuitBackgroundProps) => {
  const { segments, vias } = useMemo(() => {
    const rand = mulberry32(seed);
    const segs: Segment[] = [];
    const vs: Via[] = [];

    const angles: Record<Color, number[]> = {
      blue: [0, Math.PI, Math.PI / 4, (5 * Math.PI) / 4],
      green: [Math.PI / 2, (3 * Math.PI) / 2, (3 * Math.PI) / 4, (7 * Math.PI) / 4],
    };

    // Jittered-grid anchors so chains distribute evenly without looking tiled.
    const cols = 4;
    const rows = Math.round((count / cols) * (HEIGHT / WIDTH) * (WIDTH / HEIGHT)); // ~count/cols
    const anchors: { x: number; y: number }[] = [];
    const cellW = WIDTH / cols;
    const rowN = Math.max(4, Math.ceil(count / cols));
    const cellH = HEIGHT / rowN;
    for (let r = 0; r < rowN; r++) {
      for (let c = 0; c < cols; c++) {
        anchors.push({
          x: cellW * (c + 0.15 + rand() * 0.7),
          y: cellH * (r + 0.15 + rand() * 0.7),
        });
      }
    }
    // shuffle
    for (let i = anchors.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
    }

    const tooClose = (x: number, y: number) =>
      vs.some((v) => Math.hypot(v.x - x, v.y - y) < MIN_VIA_SPACING);

    const extendOffscreen = (
      x: number,
      y: number,
      angle: number,
    ): { x: number; y: number } => {
      // extend until well past any edge
      const step = 40;
      let nx = x;
      let ny = y;
      while (nx > -MARGIN && nx < WIDTH + MARGIN && ny > -MARGIN && ny < HEIGHT + MARGIN) {
        nx += Math.cos(angle) * step;
        ny += Math.sin(angle) * step;
      }
      return { x: nx, y: ny };
    };

    for (const anchor of anchors) {
      if (segs.length / 3 >= count) break; // rough cap on chain count
      if (tooClose(anchor.x, anchor.y)) continue;

      // Chain: [off-screen] -> seg -> via -> seg -> (maybe via -> seg) -> [off-screen]
      const interiorVias = rand() > 0.55 ? 2 : 1;
      let color: Color = rand() > 0.5 ? "blue" : "green";

      // pick first interior via position (anchor)
      const viaPositions: Via[] = [{ x: anchor.x, y: anchor.y }];

      // choose subsequent via positions along valid angles for the *next* color layer
      let currentAngle = angles[color][Math.floor(rand() * angles[color].length)];
      let ok = true;
      for (let k = 1; k < interiorVias; k++) {
        // the segment between via k-1 and via k is drawn in `color`; next color flips
        const opts = angles[color];
        const angle = opts[Math.floor(rand() * opts.length)];
        const len = 180 + rand() * 260;
        const prev = viaPositions[k - 1];
        const nx = prev.x + Math.cos(angle) * len;
        const ny = prev.y + Math.sin(angle) * len;
        if (
          nx < 80 ||
          nx > WIDTH - 80 ||
          ny < 80 ||
          ny > HEIGHT - 80 ||
          tooClose(nx, ny)
        ) {
          ok = false;
          break;
        }
        viaPositions.push({ x: nx, y: ny });
        currentAngle = angle;
        color = color === "blue" ? "green" : "blue";
      }
      if (!ok) continue;

      // Now draw segments. Start with a terminal segment leaving via[0] off-screen,
      // then internal segments between vias, then terminal leaving last via off-screen.
      // Reset color to the layer of the *first* internal segment (leaving via[0] toward via[1]).
      let firstInternalColor: Color = rand() > 0.5 ? "blue" : "green";
      if (viaPositions.length >= 2) {
        // derive color from the actual geometry of via0 -> via1
        const dx = viaPositions[1].x - viaPositions[0].x;
        const dy = viaPositions[1].y - viaPositions[0].y;
        const ang = Math.atan2(dy, dx);
        firstInternalColor = angles.blue.some((a) => Math.abs(Math.atan2(Math.sin(a - ang), Math.cos(a - ang))) < 0.05)
          ? "blue"
          : "green";
      }

      // Terminal 1: opposite color to the first internal segment (so via[0] is a real layer change)
      const termStartColor: Color = firstInternalColor === "blue" ? "green" : "blue";
      const t1Angle =
        angles[termStartColor][Math.floor(rand() * angles[termStartColor].length)];
      const t1End = extendOffscreen(viaPositions[0].x, viaPositions[0].y, t1Angle);
      segs.push({
        x1: viaPositions[0].x,
        y1: viaPositions[0].y,
        x2: t1End.x,
        y2: t1End.y,
        color: termStartColor,
      });

      // Internal segments
      let segColor = firstInternalColor;
      for (let k = 0; k < viaPositions.length - 1; k++) {
        segs.push({
          x1: viaPositions[k].x,
          y1: viaPositions[k].y,
          x2: viaPositions[k + 1].x,
          y2: viaPositions[k + 1].y,
          color: segColor,
        });
        segColor = segColor === "blue" ? "green" : "blue";
      }

      // Terminal 2 leaves the last via in the opposite color of the last internal segment
      const lastVia = viaPositions[viaPositions.length - 1];
      const lastInternalColor: Color =
        viaPositions.length >= 2
          ? (segColor === "blue" ? "green" : "blue") // segColor was flipped past the last segment
          : firstInternalColor;
      const termEndColor: Color = lastInternalColor === "blue" ? "green" : "blue";
      const t2Angle =
        angles[termEndColor][Math.floor(rand() * angles[termEndColor].length)];
      const t2End = extendOffscreen(lastVia.x, lastVia.y, t2Angle);
      segs.push({
        x1: lastVia.x,
        y1: lastVia.y,
        x2: t2End.x,
        y2: t2End.y,
        color: termEndColor,
      });

      vs.push(...viaPositions);
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
            <circle cx={v.x} cy={v.y} r={14} fill="none" stroke={ringStroke} strokeWidth={3.5} />
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CircuitBackground;
