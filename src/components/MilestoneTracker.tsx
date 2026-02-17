import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, FlaskConical, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { learningPhases } from "@/data/mockData";
import type { Milestone } from "@/components/ProjectMilestones";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, FlaskConical,
};

const phaseKeys = ["architecture", "rtl", "verification", "synthesis", "physical-design", "tapeout", "silicon-validation"];

const siliconValidationPhase = {
  id: "silicon-validation",
  title: "Silicon Validation",
  shortTitle: "SiVal",
  icon: "FlaskConical",
  topics: [{ id: "silicon-validation-overview", title: "Overview" }],
};

const phaseLabels: Record<string, string> = {
  architecture: "Architecture",
  rtl: "RTL Design",
  verification: "Verification",
  synthesis: "Synthesis",
  "physical-design": "Physical Design",
  tapeout: "Tapeout",
  "silicon-validation": "Silicon Validation",
};

interface MilestoneTrackerProps {
  phaseProgress: Record<string, number>;
  milestones?: Milestone[];
  onPhaseClick?: (phase: string) => void;
}

const progressColor = (p: number) => {
  if (p === 0) return "hsl(0 0% 60% / 0.25)";
  const hue = p < 50 ? (p / 50) * 45 : 45 + ((p - 50) / 50) * 97;
  const sat = 60 + (p / 100) * 12;
  const light = 42 + (p / 100) * 6;
  return `hsl(${Math.round(hue)} ${Math.round(sat)}% ${Math.round(light)}%)`;
};

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
  const perimeter = 2 * (rectW + rectH) - 8 * radius + 2 * Math.PI * radius;
  const offset = perimeter - (progress / 100) * perimeter;
  const color = progressColor(progress);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <rect
          x={inset} y={inset} width={rectW} height={rectH}
          rx={radius} ry={radius}
          fill="hsl(var(--background))"
          stroke="hsl(var(--border) / 0.3)"
          strokeWidth={strokeWidth}
        />
        {progress > 0 && (
          <motion.rect
            x={inset} y={inset} width={rectW} height={rectH}
            rx={radius} ry={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={perimeter}
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

const PhaseNode = ({
  phase,
  phaseKey,
  progress,
  milestones,
  onPhaseClick,
}: {
  phase: typeof siliconValidationPhase;
  phaseKey: string;
  progress: number;
  milestones: Milestone[];
  onPhaseClick?: (phase: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const Icon = iconMap[phase.icon] || Cpu;
  const color = progressColor(progress);
  const phaseTasks = milestones.filter((m) => m.phase === phaseKey);
  const learningPhase = learningPhases.find((p) => p.id === phaseKey);

  const show = useCallback(() => {
    clearTimeout(timeout.current);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const handleClick = () => {
    if (onPhaseClick) {
      onPhaseClick(phaseKey);
    }
  };

  return (
    <div
      className="relative z-10 flex flex-col items-center gap-1"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <button onClick={handleClick} className="group cursor-pointer">
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
      </button>
      <span className="text-[10px] font-display font-medium text-muted-foreground hidden sm:block mt-0.5">
        {phase.shortTitle}
      </span>
      <span
        className="text-[10px] font-bold tabular-nums"
        style={{ color: progress > 0 ? color : "hsl(var(--muted-foreground) / 0.4)" }}
      >
        {progress}%
      </span>

      {/* Hover dropdown */}
      {open && phaseTasks.length > 0 && (
        <div
          className="absolute top-full mt-1 w-56 z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="pt-1">
            <div className="rounded-xl border border-border/60 bg-card shadow-xl p-3 space-y-1">
              <div className="text-xs font-display font-bold text-foreground mb-2 px-1 flex items-center justify-between">
                <span>{phaseLabels[phaseKey] || phaseKey}</span>
                {learningPhase && (
                  <Link
                    to={`/learn/${learningPhase.id}/${learningPhase.topics[0].id}`}
                    className="text-[10px] font-medium text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Learn →
                  </Link>
                )}
              </div>
              {phaseTasks.map((task, i) => (
                <button
                  key={i}
                  onClick={handleClick}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all text-left hover:bg-muted/50"
                >
                  {task.done ? (
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                  )}
                  <span className={cn(
                    "flex-1 min-w-0 truncate",
                    task.done ? "text-muted-foreground" : "text-foreground"
                  )}>
                    {task.task}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MilestoneTracker = ({ phaseProgress, milestones = [], onPhaseClick }: MilestoneTrackerProps) => {
  const activeIndex = phaseKeys.reduce((max, key, i) => {
    return (phaseProgress[key] || 0) > 0 ? i : max;
  }, 0);

   return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="sticky top-20 z-30 rounded-xl border border-border/60 bg-card/95 backdrop-blur-md px-4 py-3 mb-10 shadow-sm"
    >
      <div className="text-xs font-display font-semibold text-muted-foreground mb-2">Project Progress</div>
      <div className="relative flex items-start justify-between">
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

          return (
            <PhaseNode
              key={phase.id}
              phase={phase}
              phaseKey={phaseKey}
              progress={progress}
              milestones={milestones}
              onPhaseClick={onPhaseClick}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default MilestoneTracker;
