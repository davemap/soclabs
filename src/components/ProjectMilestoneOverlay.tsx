import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ArrowRight, Users } from "lucide-react";
import { communityProjects } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

export default function ProjectMilestoneOverlay({ referenceSocId, phaseId }: ProjectMilestoneOverlayProps) {
  // Find community projects matching the selected reference SoC
  const matchingProjects = communityProjects.filter(
    (p) => p.referenceSoc.toLowerCase() === referenceSocId.toLowerCase()
  );

  if (matchingProjects.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-border/40 bg-muted/5 text-sm text-muted-foreground">
        No community projects found for this reference SoC yet.
      </div>
    );
  }

  // Collect milestones for this phase from all matching projects
  const projectMilestones = matchingProjects.map((project) => ({
    project,
    milestones: (project.milestones || []).filter(
      (m: Milestone) => m.phase === phaseId
    ) as Milestone[],
  })).filter(({ milestones }) => milestones.length > 0);

  if (projectMilestones.length === 0) {
    return (
      <div className="mt-4 p-4 rounded-xl border border-border/40 bg-muted/5 text-sm text-muted-foreground">
        No project milestones in this phase yet.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-display font-bold text-foreground">
          Community Project Milestones
        </h3>
      </div>

      {projectMilestones.map(({ project, milestones }) => (
        <div
          key={project.id}
          className="rounded-xl border border-primary/20 bg-primary/[0.02] overflow-hidden"
        >
          {/* Project header */}
          <Link
            to={`/projects/${project.id}`}
            className="flex items-center gap-3 px-4 py-3 border-b border-primary/10 hover:bg-primary/5 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-display font-bold group-hover:text-primary transition-colors truncate">
                {project.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {project.author} · {project.institution} · {project.technology}
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
          </Link>

          {/* Milestones list */}
          <div className="px-4 py-3 space-y-2">
            {milestones.map((m, i) => (
              <TooltipProvider key={i} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-start gap-2.5 py-1.5 cursor-default",
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
                      {/* Mini effort/uncertainty dots */}
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

          {/* Progress bar */}
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{
                    width: `${(milestones.filter((m) => m.done).length / milestones.length) * 100}%`,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {milestones.filter((m) => m.done).length}/{milestones.length}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
