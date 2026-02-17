import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, ListChecks, AlertTriangle, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { communityMembers } from "@/data/mockData";

export interface Milestone {
  phase: string;
  task: string;
  done: boolean;
  effort?: number;
  uncertainty?: number;
  startDate?: string;
  projectedEndDate?: string;
  completedDate?: string;
  assigneeId?: string;
  blurb?: string;
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

const effortColors = [
  "bg-emerald-500", "bg-lime-500", "bg-amber-500", "bg-orange-500", "bg-red-500",
];
const uncertaintyColors = [
  "bg-sky-400", "bg-blue-400", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
];

const RatingBar = ({ value, colors, label }: { value: number; colors: string[]; label: string }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1.5" title={`${label}: ${value}/5`}>
      <span className="text-[10px] text-muted-foreground w-5 shrink-0">{label}</span>
      <div className="flex gap-px">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-3 rounded-sm transition-colors",
              i <= rounded ? colors[Math.max(0, rounded - 1)] : "bg-muted/30"
            )}
          />
        ))}
      </div>
    </div>
  );
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const isOverrunning = (m: Milestone): boolean => {
  if (m.done) {
    if (m.completedDate && m.projectedEndDate) {
      return new Date(m.completedDate) > new Date(m.projectedEndDate);
    }
    return false;
  }
  if (m.projectedEndDate) {
    return new Date() > new Date(m.projectedEndDate);
  }
  return false;
};

const ProjectMilestones = ({ milestones }: ProjectMilestonesProps) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phase)) next.delete(phase);
      else next.add(phase);
      return next;
    });
  };

  const toggleTask = (key: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
          const hasOverrun = tasks.some((t) => isOverrunning(t));

          // Phase-level average effort/uncertainty
          const effortVals = tasks.filter((t) => t.effort).map((t) => t.effort!);
          const uncVals = tasks.filter((t) => t.uncertainty).map((t) => t.uncertainty!);
          const avgEffort = effortVals.length > 0 ? effortVals.reduce((a, b) => a + b, 0) / effortVals.length : 0;
          const avgUnc = uncVals.length > 0 ? uncVals.reduce((a, b) => a + b, 0) / uncVals.length : 0;

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
                  "text-sm font-display font-semibold flex-1 min-w-0",
                  allDone && "text-emerald-600"
                )}>
                  {label}
                </span>

                {hasOverrun && (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                )}

                {/* Phase-level ratings */}
                {avgEffort > 0 && (
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <RatingBar value={avgEffort} colors={effortColors} label="E" />
                    <RatingBar value={avgUnc} colors={uncertaintyColors} label="U" />
                  </div>
                )}

                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
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
                    <div className="px-4 pb-3 space-y-1">
                      {tasks.map((task, i) => {
                        const taskKey = `${phase}-${i}`;
                        const taskExpanded = expandedTasks.has(taskKey);
                        const overrun = isOverrunning(task);
                        const assignee = task.assigneeId ? communityMembers.find((m) => m.id === task.assigneeId) : null;
                        const initials = assignee
                          ? assignee.name.split(" ").filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("").slice(0, 2)
                          : "";

                        return (
                          <div key={i} className="rounded-lg border border-border/30 overflow-hidden">
                            <button
                              onClick={() => toggleTask(taskKey)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-muted/20 transition-colors"
                            >
                              {task.done ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                              )}
                              <span
                                className={cn(
                                  "text-sm flex-1 min-w-0",
                                  task.done ? "text-muted-foreground" : "text-foreground"
                                )}
                              >
                                {task.task}
                              </span>

                              {overrun && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 shrink-0">
                                  <AlertTriangle className="h-3 w-3" />
                                  Overrun
                                </span>
                              )}

                              {assignee && (
                                <Avatar className="h-5 w-5 shrink-0">
                                  <AvatarFallback className="text-[8px] font-bold bg-primary/10 text-primary">
                                    {initials}
                                  </AvatarFallback>
                                </Avatar>
                              )}

                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 text-muted-foreground transition-transform shrink-0",
                                  taskExpanded && "rotate-180"
                                )}
                              />
                            </button>

                            <AnimatePresence>
                              {taskExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.15 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-3 pb-3 pt-1 space-y-2.5 border-t border-border/20">
                                    {/* Blurb */}
                                    {task.blurb && (
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {task.blurb}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                                      {/* Effort & Uncertainty */}
                                      {task.effort && (
                                        <RatingBar value={task.effort} colors={effortColors} label="E" />
                                      )}
                                      {task.uncertainty && (
                                        <RatingBar value={task.uncertainty} colors={uncertaintyColors} label="U" />
                                      )}
                                    </div>

                                    {/* Dates */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                                      {task.startDate && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3 w-3" />
                                          Start: {formatDate(task.startDate)}
                                        </span>
                                      )}
                                      {task.projectedEndDate && (
                                        <span className={cn(
                                          "flex items-center gap-1",
                                          overrun && !task.done && "text-amber-600 font-medium"
                                        )}>
                                          <Calendar className="h-3 w-3" />
                                          Target: {formatDate(task.projectedEndDate)}
                                        </span>
                                      )}
                                      {task.completedDate && (
                                        <span className={cn(
                                          "flex items-center gap-1",
                                          overrun ? "text-amber-600 font-medium" : "text-emerald-600"
                                        )}>
                                          <CheckCircle2 className="h-3 w-3" />
                                          Completed: {formatDate(task.completedDate)}
                                        </span>
                                      )}
                                    </div>

                                    {/* Assignee */}
                                    {assignee && (
                                      <Link
                                        to={`/community/${assignee.id}`}
                                        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                                      >
                                        <User className="h-3 w-3" />
                                        <span className="font-medium">{assignee.name}</span>
                                        <span>· {assignee.institution}</span>
                                      </Link>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
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
