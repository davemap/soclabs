import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronLeft, ArrowRight, Cpu, Flame, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { learningPhases, LearningPhase } from "@/data/mockData";
import { PhaseStepperIcon, iconMap } from "@/components/PhaseStepperIcon";
import { projectTopicRatings } from "@/data/projectTopicRatings";
import { useDesignFlow, filterPhasesForFlow } from "@/hooks/useDesignFlow";
import DesignFlowToggle from "@/components/DesignFlowToggle";
import ReferenceSocSelector from "@/components/ReferenceSocSelector";
import ProjectMilestoneOverlay from "@/components/ProjectMilestoneOverlay";

const effortColors = [
  "bg-emerald-500", "bg-lime-500", "bg-amber-500", "bg-orange-500", "bg-red-500",
];
const uncertaintyColors = [
  "bg-sky-400", "bg-blue-400", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
];

const weightedAvg = (values: number[]): number => {
  if (values.length === 0) return 0;
  const weighted = values.reduce((sum, v) => sum + v * v, 0);
  const divisor = values.reduce((sum, v) => sum + v, 0);
  return divisor > 0 ? Math.round((weighted / divisor) * 10) / 10 : 0;
};

const effortTooltip = "Effort represents how much work is involved in completing this task or phase.";
const uncertaintyTooltip = "Uncertainty represents the flexibility in duration. High uncertainty means the task could take much longer or shorter than expected — it's hard to predict upfront. Low uncertainty indicates a straightforward task with few unexpected complications.";

const MiniRatingBar = ({ effort, uncertainty }: { effort?: number; uncertainty?: number }) => {
  if (!effort || !uncertainty) return null;
  const eRound = Math.round(effort);
  const uRound = Math.round(uncertainty);
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1 shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-px cursor-help">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`e${i}`} className={cn("w-1.5 h-3 rounded-sm", i <= eRound ? effortColors[Math.max(0, eRound - 1)] : "bg-muted/20")} />
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p className="font-semibold mb-1">Effort: {effort}/5</p>
            <p>{effortTooltip}</p>
          </TooltipContent>
        </Tooltip>
        <div className="w-px h-3 bg-border/40 mx-0.5" />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-px cursor-help">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={`u${i}`} className={cn("w-1.5 h-3 rounded-sm", i <= uRound ? uncertaintyColors[Math.max(0, uRound - 1)] : "bg-muted/20")} />
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs text-xs">
            <p className="font-semibold mb-1">Uncertainty: {uncertainty}/5</p>
            <p>{uncertaintyTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

const PhaseSection = ({ phase, index, selectedSocId }: { phase: LearningPhase; index: number; selectedSocId: string | null }) => {
  const [expanded, setExpanded] = useState(true);
  const Icon = iconMap[phase.icon] || Cpu;

  const realTopics = phase.topics.filter((t) => !t.id.endsWith("-overview"));
  const effortValues = realTopics.map((t) => {
    const ratings = projectTopicRatings[t.id] || [];
    if (ratings.length > 0) return ratings.reduce((s, r) => s + r.effort, 0) / ratings.length;
    return t.effort ?? 0;
  }).filter(Boolean);
  const uncertaintyValues = realTopics.map((t) => {
    const ratings = projectTopicRatings[t.id] || [];
    if (ratings.length > 0) return ratings.reduce((s, r) => s + r.uncertainty, 0) / ratings.length;
    return t.uncertainty ?? 0;
  }).filter(Boolean);
  const avgEffort = weightedAvg(effortValues);
  const avgUncertainty = weightedAvg(uncertaintyValues);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl border border-primary/30 bg-card shadow-md">
        {/* Phase header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full p-6 md:p-7 flex items-center gap-4 text-left"
        >
          <div className="p-3 rounded-xl bg-primary/15">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary font-semibold font-display">Phase {index + 1}</span>
              <span className="text-xs text-muted-foreground">· {phase.topics.length} topics</span>
            </div>
            <h2 className="text-xl font-display font-bold">{phase.title}</h2>
          </div>
          <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", expanded && "rotate-180")} />
        </button>

        {/* Phase content - topic tree */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-7 pb-6 md:pb-7">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{phase.description}</p>

                {/* Phase average effort & uncertainty */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5 p-4 rounded-xl border border-border/40 bg-muted/5">
                  <TooltipProvider delayDuration={200}>
                    <div className="flex-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Flame className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-[11px] font-display font-semibold text-foreground">Effort</span>
                              <span className="text-[11px] text-muted-foreground ml-auto">{avgEffort}/5</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all", effortColors[Math.round(avgEffort) - 1] || "bg-muted")}
                                style={{ width: `${(avgEffort / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-xs">
                          <p>{effortTooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <div className="w-px bg-border/40 hidden sm:block" />
                    <div className="flex-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div className="flex items-center gap-2 mb-1.5">
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-[11px] font-display font-semibold text-foreground">Uncertainty</span>
                              <span className="text-[11px] text-muted-foreground ml-auto">{avgUncertainty}/5</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted/20 overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all", uncertaintyColors[Math.round(avgUncertainty) - 1] || "bg-muted")}
                                style={{ width: `${(avgUncertainty / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs text-xs">
                          <p>{uncertaintyTooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>

                {/* Topic tree */}
                <div className="relative pl-4 border-l-2 border-primary/20 space-y-1">
                  {phase.topics.map((topic, i) => {
                    const ratings = projectTopicRatings[topic.id] || [];
                    const isOverview = topic.id.endsWith("-overview");
                    const avgEffortFromProjects = ratings.length > 0
                      ? Math.round((ratings.reduce((s, r) => s + r.effort, 0) / ratings.length) * 10) / 10
                      : topic.effort;
                    const avgUncertaintyFromProjects = ratings.length > 0
                      ? Math.round((ratings.reduce((s, r) => s + r.uncertainty, 0) / ratings.length) * 10) / 10
                      : topic.uncertainty;

                    return (
                      <Link
                        key={topic.id}
                        to={`/learn/${phase.id}/${topic.id}`}
                        className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all relative"
                      >
                        {/* Branch connector */}
                        <div className="absolute -left-[calc(1rem+1px)] top-1/2 w-4 h-px bg-primary/20" />
                        <div className="absolute -left-[calc(1rem+3px)] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 border-primary/40 bg-background group-hover:border-primary group-hover:bg-primary/20 transition-colors" />

                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-display font-semibold group-hover:text-primary transition-colors">
                            {topic.title}
                          </div>
                          <div className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                            {topic.summary}
                          </div>
                        </div>
                        {!isOverview && (
                          <MiniRatingBar
                            effort={avgEffortFromProjects}
                            uncertainty={avgUncertaintyFromProjects}
                          />
                        )}
                        <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary mt-0.5 shrink-0 transition-colors" />
                      </Link>
                    );
                  })}
                </div>

                {/* Reference SoC project milestones overlay */}
                {selectedSocId && (
                  <ProjectMilestoneOverlay
                    referenceSocId={selectedSocId}
                    phaseId={phase.id}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LearningHub = () => {
  const [searchParams] = useSearchParams();
  const { flow } = useDesignFlow();
  const [selectedSocId, setSelectedSocId] = useState<string | null>(null);
  const phases = useMemo(() => filterPhasesForFlow(learningPhases, flow), [flow]);
  const phaseParam = searchParams.get("phase");
  const initialIndex = phaseParam ? phases.findIndex((p) => p.id === phaseParam) : 0;
  const [activePhase, setActivePhase] = useState(Math.max(0, initialIndex));

  // Clamp activePhase when phases change (e.g. toggling flow)
  const clampedActive = Math.min(activePhase, phases.length - 1);

  const goTo = (index: number) => {
    setActivePhase(index);
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Hardware Design <span className="text-gradient">Learning Hub</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              A comprehensive guide through every phase of digital hardware design — from architecture to silicon validation.
            </p>
            <DesignFlowToggle className="mt-2" />
            <ReferenceSocSelector value={selectedSocId} onChange={setSelectedSocId} className="mt-4 justify-center" />
          </motion.div>

          {/* Progress stepper */}
          <ScrollReveal className="max-w-4xl mx-auto mb-12 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => clampedActive > 0 && goTo(clampedActive - 1)}
                disabled={clampedActive === 0}
                className={cn(
                  "p-2 rounded-lg border transition-all shrink-0",
                  clampedActive === 0
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex-1 relative">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 h-0.5 bg-border" style={{ left: 20, right: 20 }} />
                  {clampedActive > 0 && (
                    <div
                      className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
                      style={{
                        left: 20,
                        width: `calc(${(clampedActive / (phases.length - 1)) * 100}%)`,
                      }}
                    />
                  )}
                  {phases.map((phase, i) => (
                    <PhaseStepperIcon
                      key={phase.id}
                      phase={phase}
                      index={i}
                      activeIndex={clampedActive}
                      onSelect={goTo}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => clampedActive < phases.length - 1 && goTo(clampedActive + 1)}
                disabled={clampedActive === phases.length - 1}
                className={cn(
                  "p-2 rounded-lg border transition-all shrink-0",
                  clampedActive === phases.length - 1
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </ScrollReveal>

          {/* Active phase with topic tree */}
          <div className="max-w-3xl mx-auto">
            <PhaseSection phase={phases[clampedActive]} index={clampedActive} selectedSocId={selectedSocId} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningHub;
