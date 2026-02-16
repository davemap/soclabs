import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, ChevronDown, ChevronRight, ChevronLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { learningPhases, LearningPhase, LearningTopic } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

const TopicCard = ({ topic, isActive, onClick }: { topic: LearningTopic; isActive: boolean; onClick: () => void }) => (
  <div id={topic.id} className="scroll-mt-24">
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border transition-all duration-300 p-4 group",
        isActive
          ? "border-primary/40 bg-primary/5 shadow-sm"
          : "border-border/40 bg-card/50 hover:border-border hover:bg-card"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 transition-transform duration-200",
          isActive && "rotate-90"
        )}>
          <ChevronRight className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm mb-1">{topic.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{topic.summary}</p>
        </div>
      </div>
    </button>
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className="pl-11 pr-4 py-4 text-sm text-muted-foreground leading-relaxed">
            {topic.content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const PhaseSection = ({ phase, index }: { phase: LearningPhase; index: number }) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const Icon = iconMap[phase.icon] || Cpu;

  const toggleTopic = useCallback((topicId: string) => {
    setActiveTopic((prev) => (prev === topicId ? null : topicId));
  }, []);

  return (
    <motion.div
      key={phase.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-2xl border border-primary/30 bg-card shadow-md">
        {/* Phase header */}
        <div className="p-6 md:p-7 flex items-center gap-4">
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
        </div>

        {/* Phase content */}
        <div className="px-6 md:px-7 pb-6 md:pb-7">
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{phase.description}</p>

          {/* Quick nav */}
          <div className="flex flex-wrap gap-2 mb-6">
            {phase.topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  setActiveTopic(topic.id);
                  document.getElementById(topic.id)?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className={cn(
                  "text-xs px-3 py-1.5 rounded-full border transition-all",
                  activeTopic === topic.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                {topic.title}
              </button>
            ))}
          </div>

          {/* Topic cards */}
          <div className="space-y-3">
            {phase.topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                isActive={activeTopic === topic.id}
                onClick={() => toggleTopic(topic.id)}
              />
            ))}
          </div>
        </div>
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

          {/* Progress stepper with left/right arrows */}
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
                  {/* Track background */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                  {/* Active track */}
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

          {/* Active phase */}
          <div className="max-w-3xl mx-auto">
            <PhaseSection phase={learningPhases[activePhase]} index={activePhase} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningHub;
