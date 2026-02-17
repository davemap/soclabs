import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { learningPhases } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

// Phase keys matching learningPhases ids
const phaseKeys = ["architecture", "rtl", "verification", "synthesis", "fpga", "asic"];

interface MilestoneTrackerProps {
  phaseProgress: Record<string, number>;
}

const RadialProgress = ({
  progress,
  size = 52,
  strokeWidth = 3,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  // Color based on progress
  const getColor = (p: number) => {
    if (p === 0) return "hsl(var(--muted-foreground) / 0.2)";
    if (p < 30) return "hsl(var(--primary) / 0.4)";
    if (p < 70) return "hsl(var(--primary) / 0.7)";
    if (p < 100) return "hsl(var(--primary) / 0.85)";
    return "hsl(var(--primary))";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border) / 0.4)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        {progress > 0 && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor(progress)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
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
  // Determine furthest active phase
  const activeIndex = phaseKeys.reduce((max, key, i) => {
    return (phaseProgress[key] || 0) > 0 ? i : max;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="mb-10"
    >
      <h3 className="text-sm font-display font-bold mb-4 text-muted-foreground uppercase tracking-wider">
        Design Progress
      </h3>
      <div className="relative flex items-start justify-between">
        {/* Connecting track line */}
        <div className="absolute top-[26px] left-[26px] right-[26px] h-[2px] bg-border/40" />
        <div
          className="absolute top-[26px] left-[26px] h-[2px] bg-primary/40 transition-all duration-500"
          style={{
            width: `calc(${(activeIndex / (phaseKeys.length - 1)) * 100}% - 52px + ${activeIndex === phaseKeys.length - 1 ? "52px" : "26px"})`,
          }}
        />

        {learningPhases.map((phase, index) => {
          const phaseKey = phaseKeys[index];
          if (!phaseKey) return null;
          const progress = phaseProgress[phaseKey] || 0;
          const Icon = iconMap[phase.icon] || Cpu;

          return (
            <div key={phase.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <Link to={`/learn/${phase.id}/${phase.topics[0].id}`}>
                <RadialProgress progress={progress}>
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center border transition-all",
                      progress === 100
                        ? "border-primary bg-primary/15 text-primary"
                        : progress > 0
                        ? "border-primary/50 bg-primary/10 text-primary/80"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </RadialProgress>
              </Link>
              <span className="text-[10px] font-display font-medium text-muted-foreground hidden sm:block">
                {phase.shortTitle}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold",
                  progress === 100 ? "text-primary" : progress > 0 ? "text-primary/70" : "text-muted-foreground/50"
                )}
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
