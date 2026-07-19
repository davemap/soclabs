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
const MIN_LEN = 70;
const MAX_LEN = 150;
const EXIT_MARGIN = 60; // how far past the edge a terminal wire runs
const MIN_VIA_SPACING = 160;

type Color = "blue" | "green";
type Segment = { x1: number; y1: number; x2: number; y2: number; color: Color };
type Via = { x: number; y: number };

// Blue owns horizontal (0°) + +45° diagonal.
// Green owns vertical (90°) + -45° diagonal (135°).
// A via is only valid where the colour AND angle both change → guaranteed
// because the angle sets are disjoint between the two colours.
const ANGLES: Record<Color, number[]> = {
  blue: [0, Math.PI, Math.PI / 4, (5 * Math.PI) / 4],
  green: [Math.PI / 2, (3 * Math.PI) / 2, (3 * Math.PI) / 4, (7 * Math.PI) / 4],
};

const CircuitBackground = ({
  className = "",
  seed = 17,
  count = 44,
  opacity = 0.9,
}: CircuitBackgroundProps) => {
  const { segments, vias } = useMemo(() => {
    const rand = mulberry32(seed);
    const segs: Segment[] = [];
    const vs: Via[] = [];

    // Jittered anchors so distribution looks even but not tiled.
    const cols = 6;
    const rows = Math.max(6, Math.ceil(count / cols));
    const cellW = WIDTH / cols;
    const cellH = HEIGHT / rows;
    const anchors: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        anchors.push({
          x: cellW * (c + 0.2 + rand() * 0.6),
          y: cellH * (r + 0.2 + rand() * 0.6),
        });
      }
    }
    for (let i = anchors.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [anchors[i], anchors[j]] = [anchors[j], anchors[i]];
    }

    const tooClose = (x: number, y: number) =>
      vs.some((v) => Math.hypot(v.x - x, v.y - y) < MIN_VIA_SPACING);

    // Extend from (x,y) along `angle` until just past the frame.
    const exitOffscreen = (x: number, y: number, angle: number) => {
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const ts: number[] = [];
      if (dx > 1e-6) ts.push((WIDTH + EXIT_MARGIN - x) / dx);
      if (dx < -1e-6) ts.push((-EXIT_MARGIN - x) / dx);
      if (dy > 1e-6) ts.push((HEIGHT + EXIT_MARGIN - y) / dy);
      if (dy < -1e-6) ts.push((-EXIT_MARGIN - y) / dy);
      const t = Math.min(...ts.filter((v) => v > 0));
      return { x: x + dx * t, y: y + dy * t };
    };

    let placed = 0;
    for (const anchor of anchors) {
      if (placed >= count) break;
      if (tooClose(anchor.x, anchor.y)) continue;

      // Mostly single-via chains for lots of short wires.
      const interiorVias = rand() > 0.82 ? 2 : 1;
      const viaPositions: Via[] = [{ x: anchor.x, y: anchor.y }];

      // Pick the colour of the FIRST internal segment (between via0 and via1
      // if two vias; otherwise arbitrary since there is no internal segment).
      let internalColor: Color = rand() > 0.5 ? "blue" : "green";
      let chainOk = true;

      for (let k = 1; k < interiorVias; k++) {
        const opts = ANGLES[internalColor];
        const angle = opts[Math.floor(rand() * opts.length)];
        const len = MIN_LEN + rand() * (MAX_LEN - MIN_LEN);
        const prev = viaPositions[k - 1];
        const nx = prev.x + Math.cos(angle) * len;
        const ny = prev.y + Math.sin(angle) * len;
        if (
          nx < 80 || nx > WIDTH - 80 ||
          ny < 80 || ny > HEIGHT - 80 ||
          tooClose(nx, ny)
        ) {
          chainOk = false;
          break;
        }
        viaPositions.push({ x: nx, y: ny });
        // The next internal segment flips colour at this via.
        internalColor = internalColor === "blue" ? "green" : "blue";
      }
      if (!chainOk) continue;

      // Colour of the segment leaving via0 toward via1 (or a random pick if solo).
      const firstInternalColor: Color =
        viaPositions.length >= 2
          ? (() => {
              const dx = viaPositions[1].x - viaPositions[0].x;
              const dy = viaPositions[1].y - viaPositions[0].y;
              const ang = Math.atan2(dy, dx);
              return ANGLES.blue.some(
                (a) => Math.abs(Math.atan2(Math.sin(a - ang), Math.cos(a - ang))) < 0.05,
              )
                ? "blue"
                : "green";
            })()
          : rand() > 0.5
            ? "blue"
            : "green";

      // Terminal leaving via0: opposite colour of first internal segment.
      const startTermColor: Color = firstInternalColor === "blue" ? "green" : "blue";
      const startAngle =
        ANGLES[startTermColor][Math.floor(rand() * ANGLES[startTermColor].length)];
      const startEnd = exitOffscreen(viaPositions[0].x, viaPositions[0].y, startAngle);
      segs.push({
        x1: viaPositions[0].x, y1: viaPositions[0].y,
        x2: startEnd.x, y2: startEnd.y,
        color: startTermColor,
      });

      // Internal segments (alternate colour each via).
      let segColor = firstInternalColor;
      for (let k = 0; k < viaPositions.length - 1; k++) {
        segs.push({
          x1: viaPositions[k].x, y1: viaPositions[k].y,
          x2: viaPositions[k + 1].x, y2: viaPositions[k + 1].y,
          color: segColor,
        });
        segColor = segColor === "blue" ? "green" : "blue";
      }

      // Colour of the terminal leaving the last via — must differ from the
      // wire on the other side of the via so the via is a real layer change.
      // Two-via chain: after the loop, segColor was flipped past the last internal
      // segment, so `segColor` is already the opposite of the last internal wire → use it.
      // Single-via chain: opposite of the start terminal.
      const endTermColor: Color =
        viaPositions.length >= 2
          ? segColor
          : startTermColor === "blue"
            ? "green"
            : "blue";
      const endAngle =
        ANGLES[endTermColor][Math.floor(rand() * ANGLES[endTermColor].length)];
      const lastVia = viaPositions[viaPositions.length - 1];
      const endEnd = exitOffscreen(lastVia.x, lastVia.y, endAngle);
      segs.push({
        x1: lastVia.x, y1: lastVia.y,
        x2: endEnd.x, y2: endEnd.y,
        color: endTermColor,
      });

      vs.push(...viaPositions);
      placed++;
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
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
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
