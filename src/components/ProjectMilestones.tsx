import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";

interface Milestone {
  phase: string;
  task: string;
  done: boolean;
}

interface ProjectMilestonesProps {
  milestones: Milestone[];
}

const phaseLabels: Record<string, string> = {
  architecture: "Architecture",
  rtl: "RTL Design",
  verification: "Verification",
  synthesis: "Synthesis",
  fpga: "FPGA Prototyping",
  asic: "ASIC Tapeout",
  "silicon-validation": "Silicon Validation",
};

const ProjectMilestones = ({ milestones }: ProjectMilestonesProps) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  // Group milestones by phase, preserving order
  const phaseOrder = ["architecture", "rtl", "verification", "synthesis", "fpga", "asic", "silicon-validation"];
  const grouped = phaseOrder
    .map((phase) => ({
      phase,
      label: phaseLabels[phase] || phase,
      tasks: milestones.filter((m) => m.phase === phase),
    }))
    .filter((g) => g.tasks.length > 0);

  const totalDone = milestones.filter((m) => m.done).length;
  const totalTasks = milestones.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="mt-10"
    >
      <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
        <ListChecks className="h-5 w-5 text-primary" /> Project Milestones
        <span className="text-sm font-normal text-muted-foreground ml-auto">
          {totalDone}/{totalTasks} completed
        </span>
      </h2>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40">
        {grouped.map(({ phase, label, tasks }) => {
          const done = tasks.filter((t) => t.done).length;
          const isExpanded = expandedPhases.has(phase);
          const allDone = done === tasks.length;

          return (
            <div key={phase}>
              <button
                onClick={() => togglePhase(phase)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform shrink-0",
                    isExpanded && "rotate-180"
                  )}
                />
                <span className={cn(
                  "text-sm font-display font-semibold flex-1",
                  allDone && "text-emerald-600"
                )}>
                  {label}
                </span>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  allDone
                    ? "bg-emerald-500/10 text-emerald-600"
                    : done > 0
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {done}/{tasks.length}
                </span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 space-y-1.5">
                      {tasks.map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 py-1"
                        >
                          {task.done ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                          )}
                          <span
                            className={cn(
                              "text-sm",
                              task.done
                                ? "text-muted-foreground line-through"
                                : "text-foreground"
                            )}
                          >
                            {task.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProjectMilestones;
