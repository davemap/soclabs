import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, ChevronDown, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { learningPhases, LearningPhase } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

const PhaseSection = ({ phase, index }: { phase: LearningPhase; index: number }) => {
  const [expanded, setExpanded] = useState(true);
  const Icon = iconMap[phase.icon] || Cpu;

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

                {/* Topic tree */}
                <div className="relative pl-4 border-l-2 border-primary/20 space-y-1">
                  {phase.topics.map((topic, i) => (
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
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary mt-0.5 shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const LearningHub = () => {
  const [activePhase, setActivePhase] = useState(0);

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
            <p className="text-lg text-muted-foreground leading-relaxed">
              A comprehensive guide through every phase of digital hardware design — from architecture to silicon validation.
            </p>
          </motion.div>

          {/* Progress stepper */}
          <ScrollReveal className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center gap-2">
              <button
                onClick={() => activePhase > 0 && goTo(activePhase - 1)}
                disabled={activePhase === 0}
                className={cn(
                  "p-2 rounded-lg border transition-all shrink-0",
                  activePhase === 0
                    ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/50"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex-1 relative">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                    style={{ width: `${(activePhase / (learningPhases.length - 1)) * 100}%` }}
                  />
                  {learningPhases.map((phase, i) => {
                    const Icon = iconMap[phase.icon] || Cpu;
                    return (
                      <button
                        key={phase.id}
                        onClick={() => goTo(i)}
                        className={cn(
                          "relative z-10 flex flex-col items-center gap-2 group",
                          i <= activePhase ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                            i === activePhase
                              ? "border-primary bg-primary/15 shadow-md shadow-primary/20"
                              : i < activePhase
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-display font-medium hidden sm:block">{phase.shortTitle}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => activePhase < learningPhases.length - 1 && goTo(activePhase + 1)}
                disabled={activePhase === learningPhases.length - 1}
                className={cn(
                  "p-2 rounded-lg border transition-all shrink-0",
                  activePhase === learningPhases.length - 1
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
            <PhaseSection phase={learningPhases[activePhase]} index={activePhase} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningHub;
