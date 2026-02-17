import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, ListChecks, AlertTriangle, Calendar, User, ChevronsDownUp, BookOpen } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { communityMembers, learningPhases } from "@/data/mockData";

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

interface PhaseDateInfo {
  startDate?: string;
  projectedEndDate?: string;
  completedDate?: string;
}

interface ProjectMilestonesProps {
  milestones: Milestone[];
  expandPhase?: string | null;
  phaseEffort?: Record<string, number>;
  phaseUncertainty?: Record<string, number>;
  phaseDates?: Record<string, PhaseDateInfo>;
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

const ratingTooltips: Record<string, string> = {
  Effort: "Estimated work required to complete this task, from 1 (minimal) to 5 (extensive). Accounts for complexity, skill requirements, and resource needs.",
  Uncertainty: "Risk level reflecting unknowns that could affect timeline or outcome, from 1 (well-understood) to 5 (highly unpredictable). Higher values suggest more research or prototyping may be needed.",
};

const RatingBar = ({ value, colors, label }: { value: number; colors: string[]; label: string }) => {
  const rounded = Math.round(value);
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-help">
            <span className="text-[10px] text-muted-foreground shrink-0">{label}</span>
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
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[220px] text-xs">
          <p className="font-semibold mb-0.5">{label}: {value}/5</p>
          <p className="text-muted-foreground">{ratingTooltips[label]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

const ProjectMilestones = ({ milestones, expandPhase, phaseEffort = {}, phaseUncertainty = {}, phaseDates = {} }: ProjectMilestonesProps) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (expandPhase) {
      setExpandedPhases((prev) => {
        const next = new Set(prev);
        next.add(expandPhase);
        return next;
      });
      // Auto-expand all tasks within the clicked phase
      const phaseTasks = milestones.filter((m) => m.phase === expandPhase);
      setExpandedTasks((prev) => {
        const next = new Set(prev);
        phaseTasks.forEach((_, i) => next.add(`${expandPhase}-${i}`));
        return next;
      });
    }
  }, [expandPhase, milestones]);

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
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-primary" /> Project Milestones
        </h2>
        <span className="text-sm text-muted-foreground ml-auto">
          {totalDone}/{totalTasks} completed
        </span>
        {(expandedPhases.size > 0 || expandedTasks.size > 0) && (
          <button
            onClick={() => { setExpandedPhases(new Set()); setExpandedTasks(new Set()); }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted/50"
          >
            <ChevronsDownUp className="h-3.5 w-3.5" />
            Collapse all
          </button>
        )}
      </div>

      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40">
        {grouped.map(({ phase, label, tasks }) => {
          const phaseId = `milestone-phase-${phase}`;
          const done = tasks.filter((t) => t.done).length;
          const isExpanded = expandedPhases.has(phase);
          const allDone = done === tasks.length;
          const hasOverrun = tasks.some((t) => isOverrunning(t));
          const phaseDateInfo = phaseDates[phase];
          const phaseOverrun = phaseDateInfo && !phaseDateInfo.completedDate && phaseDateInfo.projectedEndDate && new Date() > new Date(phaseDateInfo.projectedEndDate);
          const phaseCompletedLate = phaseDateInfo?.completedDate && phaseDateInfo?.projectedEndDate && new Date(phaseDateInfo.completedDate) > new Date(phaseDateInfo.projectedEndDate);

          // Phase-level effort/uncertainty set by author
          const phaseEff = phaseEffort[phase] || 0;
          const phaseUnc = phaseUncertainty[phase] || 0;
          const learningPhase = learningPhases.find((p) => p.id === phase);

          return (
            <div key={phase} id={phaseId}>
              <div className="flex items-center gap-0">
                <button
                  onClick={() => togglePhase(phase)}
                  className="flex-1 flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
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

                {(hasOverrun || phaseOverrun) && (
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                )}

                {/* Phase-level ratings - only shown when all tasks are done */}
                {allDone && phaseEff > 0 && (
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <RatingBar value={phaseEff} colors={effortColors} label="Effort" />
                    <RatingBar value={phaseUnc} colors={uncertaintyColors} label="Uncertainty" />
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
                {learningPhase && (
                  <Link
                    to={`/learn/${learningPhase.id}/${learningPhase.topics[0].id}`}
                    className="shrink-0 p-3 hover:bg-muted/30 transition-colors"
                    title={`Learn about ${label}`}
                  >
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground hover:text-primary transition-colors" />
                  </Link>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3 space-y-2">
                      {/* Phase-level dates */}
                      {phaseDateInfo && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground px-1 py-1.5 rounded-lg bg-muted/10">
                          {phaseDateInfo.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Start: {formatDate(phaseDateInfo.startDate)}
                            </span>
                          )}
                          {phaseDateInfo.projectedEndDate && (
                            <span className={cn(
                              "flex items-center gap-1",
                              phaseOverrun && "text-amber-600 font-medium"
                            )}>
                              <Calendar className="h-3 w-3" />
                              Target: {formatDate(phaseDateInfo.projectedEndDate)}
                            </span>
                          )}
                          {phaseDateInfo.completedDate && (
                            <span className={cn(
                              "flex items-center gap-1",
                              phaseCompletedLate ? "text-amber-600 font-medium" : "text-emerald-600"
                            )}>
                              <CheckCircle2 className="h-3 w-3" />
                              Completed: {formatDate(phaseDateInfo.completedDate)}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="space-y-1">
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
                                        <RatingBar value={task.effort} colors={effortColors} label="Effort" />
                                      )}
                                      {task.uncertainty && (
                                        <RatingBar value={task.uncertainty} colors={uncertaintyColors} label="Uncertainty" />
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
