import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ArrowRight, Users, ChevronDown, Filter } from "lucide-react";
import { communityProjects } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";

interface Milestone {
  phase: string;
  task: string;
  done: boolean;
  effort: number;
  uncertainty: number;
  blurb?: string;
  learningTopicIds?: string[];
  assigneeId?: string;
}

interface ProjectMilestoneOverlayProps {
  referenceSocId: string;
  phaseId: string;
}

type StatusFilter = "all" | "complete" | "in-progress";
type TechFilter = "all" | "ASIC" | "FPGA";

export default function ProjectMilestoneOverlay({ referenceSocId, phaseId }: ProjectMilestoneOverlayProps) {
  const [sectionOpen, setSectionOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [techFilter, setTechFilter] = useState<TechFilter>("all");

  const matchingProjects = communityProjects.filter(
    (p) => p.referenceSoc.toLowerCase() === referenceSocId.toLowerCase()
  );

  const projectMilestones = useMemo(() => {
    return matchingProjects
      .filter((p) => techFilter === "all" || p.technology === techFilter)
      .map((project) => ({
        project,
        milestones: (project.milestones || []).filter(
          (m: Milestone) => m.phase === phaseId
        ) as Milestone[],
      }))
      .filter(({ milestones }) => milestones.length > 0)
      .filter(({ milestones }) => {
        if (statusFilter === "all") return true;
        const allDone = milestones.every((m) => m.done);
        return statusFilter === "complete" ? allDone : !allDone;
      });
  }, [matchingProjects, phaseId, techFilter, statusFilter]);

  if (matchingProjects.length === 0) {
    return null;
  }

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalProjects = projectMilestones.length;

  const filterBtnClass = (active: boolean) =>
    cn(
      "px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
      active
        ? "bg-primary/10 text-primary ring-1 ring-primary/20"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    );

  return (
    <div className="mt-6 rounded-2xl border border-border/60 bg-card/50 overflow-hidden">
      {/* Collapsible header */}
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
      >
        <Users className="h-4 w-4 text-primary shrink-0" />
        <h3 className="text-sm font-display font-bold text-foreground flex-1">
          Community Project Milestones
        </h3>
        <span className="text-xs text-muted-foreground mr-2">
          {totalProjects} project{totalProjects !== 1 ? "s" : ""}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            sectionOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {sectionOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Filters row */}
            <div className="px-5 pb-3 flex flex-wrap items-center gap-3 border-b border-border/40">
              <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-1">
                {(["all", "in-progress", "complete"] as StatusFilter[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={filterBtnClass(statusFilter === s)}
                  >
                    {s === "all" ? "All" : s === "in-progress" ? "In Progress" : "Complete"}
                  </button>
                ))}
              </div>
              <div className="w-px h-4 bg-border/40" />
              <div className="flex items-center gap-1">
                {(["all", "ASIC", "FPGA"] as TechFilter[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTechFilter(t)}
                    className={filterBtnClass(techFilter === t)}
                  >
                    {t === "all" ? "All Tech" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Project list */}
            <div className="px-5 py-3 space-y-2">
              {projectMilestones.length === 0 ? (
                <p className="text-sm text-muted-foreground py-2">No projects match the current filters.</p>
              ) : (
                projectMilestones.map(({ project, milestones }) => {
                  const isExpanded = expandedProjects.has(project.id);
                  const doneCount = milestones.filter((m) => m.done).length;
                  return (
                    <div
                      key={project.id}
                      className="rounded-xl border border-border/40 bg-card/80 overflow-hidden"
                    >
                      {/* Project header - click to expand */}
                      <button
                        onClick={() => toggleProject(project.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-display font-semibold truncate">
                            {project.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {project.author} · {project.institution} · {project.technology}
                          </div>
                        </div>
                        {/* Progress pill */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-16 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500 transition-all"
                              style={{ width: `${(doneCount / milestones.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-medium w-7">
                            {doneCount}/{milestones.length}
                          </span>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>

                      {/* Collapsible milestones */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 py-2.5 space-y-1.5 border-t border-border/30">
                              {milestones.map((m, i) => (
                                <TooltipProvider key={i} delayDuration={200}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "flex items-start gap-2.5 py-1 cursor-default",
                                          m.done ? "opacity-100" : "opacity-70"
                                        )}
                                      >
                                        {m.done ? (
                                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                        ) : (
                                          <Circle className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className={cn(
                                            "text-sm font-medium",
                                            m.done && "line-through text-muted-foreground"
                                          )}>
                                            {m.task}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <span className="text-[10px] text-muted-foreground">E:{m.effort}</span>
                                          <span className="text-[10px] text-muted-foreground">U:{m.uncertainty}</span>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    {m.blurb && (
                                      <TooltipContent side="top" className="max-w-sm text-xs">
                                        <p>{m.blurb}</p>
                                      </TooltipContent>
                                    )}
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                            {/* View project link */}
                            <div className="px-4 pb-3">
                              <Link
                                to={`/projects/${project.id}`}
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
                              >
                                View project <ArrowRight className="h-3 w-3" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
