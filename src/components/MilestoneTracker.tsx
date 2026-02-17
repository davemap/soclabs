import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { learningPhases } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

const phaseKeys = ["architecture", "rtl", "verification", "synthesis", "fpga", "asic"];

interface MilestoneTrackerProps {
  phaseProgress: Record<string, number>;
}

/** Returns an HSL color string interpolating from deep red (0%) → amber (50%) → green (100%) */
const progressColor = (p: number) => {
  if (p === 0) return "hsl(0 0% 60% / 0.25)";
  // Hue: 0 (red) → 45 (amber) → 142 (green)
  const hue = p < 50 ? (p / 50) * 45 : 45 + ((p - 50) / 50) * 97;
  const sat = 60 + (p / 100) * 12; // 60-72%
  const light = 42 + (p / 100) * 6; // 42-48%
  return `hsl(${Math.round(hue)} ${Math.round(sat)}% ${Math.round(light)}%)`;
};

const progressColorLight = (p: number) => {
  if (p === 0) return "transparent";
  const hue = p < 50 ? (p / 50) * 45 : 45 + ((p - 50) / 50) * 97;
  return `hsl(${Math.round(hue)} 60% 50% / 0.12)`;
};

/**
 * Rounded-rect progress ring using a <rect> with rx/ry and stroke-dasharray.
 */
const RoundedRectProgress = ({
  progress,
  size = 50,
  radius = 10,
  strokeWidth = 2.5,
  children,
}: {
  progress: number;
  size?: number;
  radius?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}) => {
  const inset = strokeWidth / 2;
  const rectW = size - strokeWidth;
  const rectH = size - strokeWidth;
  // Perimeter of a rounded rect ≈ 2*(w + h) - 8*r + 2*π*r
  const perimeter = 2 * (rectW + rectH) - 8 * radius + 2 * Math.PI * radius;
  const offset = perimeter - (progress / 100) * perimeter;
  const color = progressColor(progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Track */}
        <rect
          x={inset}
          y={inset}
          width={rectW}
          height={rectH}
          rx={radius}
          ry={radius}
          fill="hsl(var(--background))"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        {progress > 0 && (
          <motion.rect
            x={inset}
            y={inset}
            width={rectW}
            height={rectH}
            rx={radius}
            ry={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={perimeter}
            initial={{ strokeDashoffset: perimeter }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const MilestoneTracker = ({ phaseProgress }: MilestoneTrackerProps) => {
  const activeIndex = phaseKeys.reduce((max, key, i) => {
    return (phaseProgress[key] || 0) > 0 ? i : max;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-xl border border-border/60 bg-card px-4 py-3 mb-10"
    >
      <div className="relative flex items-start justify-between">
        {/* Track line */}
        <div className="absolute top-[25px] left-[25px] right-[25px] h-[3px] rounded-full bg-primary/20" />
        <div
          className="absolute top-[25px] left-[25px] h-[3px] rounded-full bg-primary transition-all duration-500"
          style={{
            width: `calc(${(activeIndex / (phaseKeys.length - 1)) * 100}% - 50px + ${activeIndex === phaseKeys.length - 1 ? "50px" : "25px"})`,
          }}
        />

        {learningPhases.map((phase, index) => {
          const phaseKey = phaseKeys[index];
          if (!phaseKey) return null;
          const progress = phaseProgress[phaseKey] || 0;
          const Icon = iconMap[phase.icon] || Cpu;
          const color = progressColor(progress);

          return (
            <div key={phase.id} className="relative z-10 flex flex-col items-center gap-1">
              <Link to={`/learn/${phase.id}/${phase.topics[0].id}`} className="group">
                <RoundedRectProgress progress={progress}>
                  <div
                    className={cn(
                      "w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-all group-hover:scale-105",
                      progress > 0
                        ? "bg-primary/15 text-primary"
                        : "bg-card text-muted-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                </RoundedRectProgress>
              </Link>
              <span className="text-[10px] font-display font-medium text-muted-foreground hidden sm:block mt-0.5">
                {phase.shortTitle}
              </span>
              <span
                className="text-[10px] font-bold tabular-nums"
                style={{ color: progress > 0 ? color : "hsl(var(--muted-foreground) / 0.4)" }}
              >
                {progress}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MilestoneTracker;
