import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const Icon = iconMap[phase.icon] || Cpu;

  const toggleTopic = useCallback((topicId: string) => {
    setActiveTopic((prev) => (prev === topicId ? null : topicId));
  }, []);

  return (
    <ScrollReveal delay={index * 0.06}>
      <div className={cn(
        "rounded-2xl border transition-all duration-300",
        isOpen ? "border-primary/30 bg-card shadow-md" : "border-border/60 bg-card/80 hover:border-border"
      )}>
        {/* Phase header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full text-left p-6 md:p-7 flex items-center gap-4"
        >
          <div className={cn(
            "p-3 rounded-xl transition-colors",
            isOpen ? "bg-primary/15" : "bg-muted"
          )}>
            <Icon className={cn("h-5 w-5", isOpen ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-primary font-semibold font-display">Phase {index + 1}</span>
              <span className="text-xs text-muted-foreground">· {phase.topics.length} topics</span>
            </div>
            <h2 className="text-xl font-display font-bold">{phase.title}</h2>
            {!isOpen && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{phase.description}</p>
            )}
          </div>
          <ChevronDown className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0",
            isOpen && "rotate-180"
          )} />
        </button>

        {/* Phase content */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-7 pb-6 md:pb-7">
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{phase.description}</p>

                {/* Quick nav */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {phase.topics.map((topic) => (
                    <a
                      key={topic.id}
                      href={`#${topic.id}`}
                      onClick={(e) => {
                        e.preventDefault();
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
                    </a>
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ScrollReveal>
  );
};

const LearningHub = () => {
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

          {/* Phase overview bar */}
          <ScrollReveal className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
              {learningPhases.map((phase, i) => {
                const Icon = iconMap[phase.icon] || Cpu;
                return (
                  <a
                    key={phase.id}
                    href={`#phase-${phase.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`phase-${phase.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="flex flex-col items-center gap-1.5 px-2 py-2 rounded-lg hover:bg-muted/50 transition-colors group min-w-[60px]"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted group-hover:bg-primary/10 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-[10px] font-display font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center">
                      {phase.shortTitle}
                    </span>
                  </a>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Phase sections */}
          <div className="max-w-3xl mx-auto space-y-4">
            {learningPhases.map((phase, i) => (
              <div key={phase.id} id={`phase-${phase.id}`} className="scroll-mt-24">
                <PhaseSection phase={phase} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningHub;
