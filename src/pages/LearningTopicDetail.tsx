import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowRight, BookOpen, Cpu, Flame, HelpCircle, Users } from "lucide-react";
import { learningPhases } from "@/data/mockData";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PhaseStepperIcon } from "@/components/PhaseStepperIcon";
import { projectTopicRatings } from "@/data/projectTopicRatings";

const effortColors = [
  "bg-emerald-500", "bg-lime-500", "bg-amber-500", "bg-orange-500", "bg-red-500",
];
const uncertaintyColors = [
  "bg-sky-400", "bg-blue-400", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
];

const RatingDots = ({ value, colors, label, icon: IconComp }: { value: number; colors: string[]; label: string; icon: React.ElementType }) => (
  <div className="flex items-center gap-2.5">
    <IconComp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
    <span className="text-xs text-muted-foreground w-20 shrink-0">{label}</span>
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={cn(
            "w-5 h-2 rounded-full transition-all",
            i <= value ? colors[value - 1] : "bg-muted/30"
          )}
        />
      ))}
    </div>
    <span className="text-xs text-muted-foreground ml-1">{value}/5</span>
  </div>
);

/** Weighted average that emphasises high values (quadratic weighting) */
const weightedAvg = (values: number[]): number => {
  if (values.length === 0) return 0;
  const weighted = values.reduce((sum, v) => sum + v * v, 0);
  const divisor = values.reduce((sum, v) => sum + v, 0);
  return divisor > 0 ? Math.round((weighted / divisor) * 10) / 10 : 0;
};

const MiniRatingBar = ({ effort, uncertainty }: { effort?: number; uncertainty?: number }) => {
  if (!effort || !uncertainty) return null;
  return (
    <div className="flex items-center gap-1 ml-auto shrink-0">
      <div className="flex gap-px" title={`Effort: ${effort}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={`e${i}`} className={cn("w-1.5 h-3 rounded-sm", i <= effort ? effortColors[effort - 1] : "bg-muted/20")} />
        ))}
      </div>
      <div className="w-px h-3 bg-border/40 mx-0.5" />
      <div className="flex gap-px" title={`Uncertainty: ${uncertainty}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={`u${i}`} className={cn("w-1.5 h-3 rounded-sm", i <= uncertainty ? uncertaintyColors[uncertainty - 1] : "bg-muted/20")} />
        ))}
      </div>
    </div>
  );
};
const LearningTopicDetail = () => {
  const navigate = useNavigate();
  const { phaseId, topicId } = useParams();

  const phase = learningPhases.find((p) => p.id === phaseId);
  const topicIndex = phase?.topics.findIndex((t) => t.id === topicId) ?? -1;
  const topic = phase?.topics[topicIndex];

  if (!phase || !topic) {
    return (
      <Layout>
        <section className="py-24 text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Topic not found</h1>
          <Button asChild variant="outline">
            <Link to="/learn">Back to Learning Hub</Link>
          </Button>
        </section>
      </Layout>
    );
  }

  const phaseIndex = learningPhases.indexOf(phase);
  const prevPhase = phaseIndex > 0 ? learningPhases[phaseIndex - 1] : null;
  const nextPhase = phaseIndex < learningPhases.length - 1 ? learningPhases[phaseIndex + 1] : null;

  // Build prev/next across all phases and topics
  const allTopics = learningPhases.flatMap((p) =>
    p.topics.map((t) => ({ phaseId: p.id, topicId: t.id, title: t.title, phaseTitle: p.shortTitle }))
  );
  const globalIndex = allTopics.findIndex((t) => t.phaseId === phaseId && t.topicId === topicId);
  const prev = globalIndex > 0 ? allTopics[globalIndex - 1] : null;
  const next = globalIndex < allTopics.length - 1 ? allTopics[globalIndex + 1] : null;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Breadcrumb - full width */}
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/learn" className="hover:text-foreground transition-colors">
                Learning Hub
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to={`/learn?phase=${phase.id}`} className="hover:text-foreground transition-colors">
                {phase.title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{topic.title}</span>
            </nav>
          </div>

          {/* Main content with floating sidebar */}
          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Phase stepper + arrows - centred over content column */}
              <div className="max-w-2xl mx-auto mb-10">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => prevPhase && navigate(`/learn/${prevPhase.id}/${prevPhase.topics[0].id}`)}
                    disabled={!prevPhase}
                    className={cn(
                      "p-2 rounded-lg border transition-all shrink-0",
                      !prevPhase
                        ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                        : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div className="flex-1 relative">
                    <div className="flex items-center justify-between relative">
                      {/* Track between icon edges: inset by half icon width (20px) */}
                      <div className="absolute top-5 h-0.5 bg-border" style={{ left: 20, right: 20 }} />
                      {phaseIndex > 0 && (
                        <div
                          className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
                          style={{
                            left: 20,
                            width: `calc(${(phaseIndex / (learningPhases.length - 1)) * 100}%)`,
                          }}
                        />
                      )}
                      {learningPhases.map((p, i) => (
                        <PhaseStepperIcon
                          key={p.id}
                          phase={p}
                          index={i}
                          activeIndex={phaseIndex}
                          currentPhaseId={phaseId}
                          currentTopicId={topicId}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => nextPhase && navigate(`/learn/${nextPhase.id}/${nextPhase.topics[0].id}`)}
                    disabled={!nextPhase}
                    className={cn(
                      "p-2 rounded-lg border transition-all shrink-0",
                      !nextPhase
                        ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                        : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50"
                    )}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Phase badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold font-display text-primary bg-primary/10 px-3 py-1 rounded-full">
                  Phase {phaseIndex + 1}: {phase.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  Topic {topicIndex + 1} of {phase.topics.length}
                </span>
              </div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-display font-bold mb-4"
              >
                {topic.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground mb-8"
              >
                {topic.summary}
              </motion.p>

              {/* Effort & Uncertainty ratings — non-overview topics only */}
              {!topic.id.endsWith("-overview") && topic.effort && topic.uncertainty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-8 mb-8 px-4 py-3 rounded-xl border border-border/40 bg-card/30"
                >
                  <RatingDots value={topic.effort} colors={effortColors} label="Effort" icon={Flame} />
                  <RatingDots value={topic.uncertainty} colors={uncertaintyColors} label="Uncertainty" icon={HelpCircle} />
                </motion.div>
              )}

              {/* Phase averages — only on overview pages, above content */}
              {topic.id.endsWith("-overview") && (() => {
                const realTopics = phase.topics.filter((t) => !t.id.endsWith("-overview"));
                const effortValues = realTopics.map((t) => t.effort ?? 0).filter(Boolean);
                const uncertaintyValues = realTopics.map((t) => t.uncertainty ?? 0).filter(Boolean);
                const avgEffort = weightedAvg(effortValues);
                const avgUncertainty = weightedAvg(uncertaintyValues);
                return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mb-8"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-xl border border-border/40 bg-card/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-display font-semibold text-foreground">Phase Effort</span>
                        <span className="text-xs text-muted-foreground ml-auto">{avgEffort}/5</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted/20 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", effortColors[Math.round(avgEffort) - 1] || "bg-muted")}
                          style={{ width: `${(avgEffort / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Weighted towards high-effort tasks</p>
                    </div>
                    <div className="w-px bg-border/40 hidden sm:block" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-display font-semibold text-foreground">Phase Uncertainty</span>
                        <span className="text-xs text-muted-foreground ml-auto">{avgUncertainty}/5</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-muted/20 overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", uncertaintyColors[Math.round(avgUncertainty) - 1] || "bg-muted")}
                          style={{ width: `${(avgUncertainty / 5) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">Weighted towards high-uncertainty tasks</p>
                    </div>
                  </div>
                </motion.div>
                );
              })()}

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-invert max-w-none mb-12"
              >
                <div className="rounded-2xl border border-border/60 bg-card/50 p-6 md:p-8 text-sm md:text-base text-muted-foreground leading-relaxed">
                  {topic.content}
                </div>
              </motion.div>

              {/* Project completions — non-overview topics only */}
              {!topic.id.endsWith("-overview") && (() => {
                const ratings = projectTopicRatings[topic.id] || [];
                if (ratings.length === 0) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mb-12"
                  >
                    <div className="rounded-2xl border border-border/40 bg-card/30 p-5 md:p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="h-4 w-4 text-primary" />
                        <h3 className="text-sm font-display font-semibold">
                          Projects that completed this task
                        </h3>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {ratings.length} project{ratings.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {ratings.map((r) => (
                          <Link
                            key={r.projectId}
                            to={`/projects/${r.projectId}`}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/5 hover:bg-muted/15 border border-border/20 hover:border-border/40 transition-all group/proj"
                          >
                            <span className="text-sm text-muted-foreground group-hover/proj:text-foreground transition-colors truncate flex-1 font-display">
                              {r.projectTitle}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="flex items-center gap-1.5">
                                <Flame className="h-3 w-3 text-muted-foreground/60" />
                                <div className="flex gap-px">
                                  {[1, 2, 3, 4, 5].map((v) => (
                                    <div key={`e${v}`} className={cn("w-1.5 h-3 rounded-sm", v <= r.effort ? effortColors[r.effort - 1] : "bg-muted/20")} />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{r.effort}/5</span>
                              </div>
                              <div className="w-px h-4 bg-border/30" />
                              <div className="flex items-center gap-1.5">
                                <HelpCircle className="h-3 w-3 text-muted-foreground/60" />
                                <div className="flex gap-px">
                                  {[1, 2, 3, 4, 5].map((v) => (
                                    <div key={`u${v}`} className={cn("w-1.5 h-3 rounded-sm", v <= r.uncertainty ? uncertaintyColors[r.uncertainty - 1] : "bg-muted/20")} />
                                  ))}
                                </div>
                                <span className="text-[10px] text-muted-foreground">{r.uncertainty}/5</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })()}

              {/* Phase topics grid — only on overview pages, below content */}
              {topic.id.endsWith("-overview") && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mb-12"
                >
                  <h2 className="text-lg font-display font-bold mb-5">Topics in this phase</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {phase.topics
                      .filter((t) => !t.id.endsWith("-overview"))
                      .map((t, i) => (
                        <Link
                          key={t.id}
                          to={`/learn/${phase.id}/${t.id}`}
                          className="group relative rounded-xl border border-border/40 bg-card/50 p-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary text-xs font-bold font-display shrink-0">
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-display font-semibold group-hover:text-primary transition-colors mb-1">
                                {t.title}
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                {t.summary}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                          </div>
                        </Link>
                      ))}
                  </div>
                </motion.div>
              )}

              {/* Prev / Next navigation */}
              <div className="flex items-stretch gap-4">
                {prev ? (
                  <Link
                    to={`/learn/${prev.phaseId}/${prev.topicId}`}
                    className="flex-1 group rounded-xl border border-border/40 bg-card/50 p-4 hover:border-border transition-all"
                  >
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <ChevronLeft className="h-3 w-3" /> Previous
                    </div>
                    <div className="text-sm font-display font-semibold group-hover:text-primary transition-colors">
                      {prev.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{prev.phaseTitle}</div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {next ? (
                  <Link
                    to={`/learn/${next.phaseId}/${next.topicId}`}
                    className="flex-1 group rounded-xl border border-border/40 bg-card/50 p-4 hover:border-border transition-all text-right"
                  >
                    <div className="text-xs text-muted-foreground mb-1 flex items-center justify-end gap-1">
                      Next <ChevronRight className="h-3 w-3" />
                    </div>
                    <div className="text-sm font-display font-semibold group-hover:text-primary transition-colors">
                      {next.title}
                    </div>
                    <div className="text-xs text-muted-foreground">{next.phaseTitle}</div>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
              </div>
            </div>

            {/* Floating sidebar - topics in this phase */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 rounded-2xl border border-border/40 bg-card/30 p-5">
                <h3 className="text-sm font-display font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  {phase.title} Topics
                </h3>
                <div className="relative pl-3 border-l-2 border-primary/20 space-y-0.5">
                  {phase.topics.map((t, i) => (
                    <Link
                      key={t.id}
                      to={`/learn/${phase.id}/${t.id}`}
                      className={cn(
                        "relative flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs transition-all",
                        t.id === topicId
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                    >
                      {/* Branch dot */}
                      <div className={cn(
                        "absolute -left-[calc(0.75rem+3px)] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 transition-colors",
                        t.id === topicId
                          ? "border-primary bg-primary/30"
                          : "border-primary/30 bg-background"
                      )} />
                      <div className="absolute -left-3 top-1/2 w-3 h-px bg-primary/20" />
                      <span className="w-4 text-muted-foreground/60 shrink-0">{i + 1}.</span>
                      <span className="leading-tight flex-1">{t.title}</span>
                      {!t.id.endsWith("-overview") && (
                        <MiniRatingBar effort={t.effort} uncertainty={t.uncertainty} />
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningTopicDetail;
