import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { learningPhases, LearningPhase } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

interface PhaseStepperIconProps {
  phase: LearningPhase;
  index: number;
  activeIndex: number;
  currentPhaseId?: string;
  currentTopicId?: string;
  /** If provided, clicking selects the phase instead of navigating */
  onSelect?: (index: number) => void;
  /** If provided, double-clicking triggers this callback */
  onDoubleClick?: (index: number) => void;
  /** Hide the hover tooltip dropdown */
  noTooltip?: boolean;
}

const PhaseStepperIcon = ({
  phase,
  index,
  activeIndex,
  currentPhaseId,
  currentTopicId,
  onSelect,
  onDoubleClick,
  noTooltip,
}: PhaseStepperIconProps) => {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const dblClickRef = useRef<number>(0);
  const Icon = iconMap[phase.icon] || Cpu;
  const nonOverviewTopics = phase.topics.filter((t) => !t.id.endsWith("-overview"));

  const show = useCallback(() => {
    clearTimeout(timeout.current);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(false), 200);
  }, []);

  const iconContent = (
    <div className={cn(
      "relative w-10 h-10 rounded-xl transition-transform duration-200",
      index === activeIndex && "scale-125"
    )}>
      {/* Opaque background layer to block the track line */}
      <div className="absolute inset-0 rounded-xl bg-background" />
      <div
        className={cn(
          "relative w-full h-full rounded-xl flex items-center justify-center border-2 transition-all",
          index === activeIndex
            ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : index < activeIndex
            ? "border-primary bg-primary/10"
            : "border-border"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
    </div>
  );

  return (
    <div
      className="relative z-10 flex flex-col items-center gap-2"
      onMouseEnter={noTooltip ? undefined : show}
      onMouseLeave={noTooltip ? undefined : hide}
    >
      {onSelect ? (
        <button
          onClick={() => {
            if (onDoubleClick) {
              const now = Date.now();
              if (now - dblClickRef.current < 400) {
                onDoubleClick(index);
                dblClickRef.current = 0;
                return;
              }
              dblClickRef.current = now;
            }
            onSelect(index);
          }}
          className={cn(
            "flex flex-col items-center gap-2",
            index === activeIndex ? "text-primary" : "text-muted-foreground"
          )}
        >
          {iconContent}
          <span className={cn(
            "text-xs font-display font-medium hidden sm:block transition-all",
            index === activeIndex && "font-bold"
          )}>{phase.shortTitle}</span>
        </button>
      ) : (
        <Link
          to={`/learn/${phase.id}/${phase.topics[0].id}`}
          className={cn(
            "flex flex-col items-center gap-2",
            index <= activeIndex ? "text-primary" : "text-muted-foreground"
          )}
        >
          {iconContent}
          <span className="text-xs font-display font-medium hidden sm:block">{phase.shortTitle}</span>
        </Link>
      )}

      {/* Hover dropdown */}
      {open && (
        <div
          className="absolute top-full mt-1 w-56 z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div className="pt-2">
            <div className="rounded-xl border border-border/60 bg-card shadow-xl p-3 space-y-0.5">
              <div className="text-xs font-display font-bold text-foreground mb-2 px-1">
                {phase.title}
              </div>
              {nonOverviewTopics.map((t) => (
                <Link
                  key={t.id}
                  to={`/learn/${phase.id}/${t.id}`}
                  className={cn(
                    "block px-2 py-1.5 rounded-lg text-xs transition-all",
                    t.id === currentTopicId && phase.id === currentPhaseId
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { PhaseStepperIcon, iconMap };
