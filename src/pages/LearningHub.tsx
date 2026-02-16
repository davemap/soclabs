import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import { designStages } from "@/data/mockData";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

const LearningHub = () => {
  const [activeStage, setActiveStage] = useState(0);
  const stage = designStages[activeStage];
  const Icon = iconMap[stage.icon] || Cpu;

  return (
    <Layout>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl font-bold mb-4">Hardware Design <span className="text-gradient">Learning Hub</span></h1>
            <p className="text-lg text-muted-foreground">
              A step-by-step guide through the stages of digital hardware design — from specification to silicon.
            </p>
          </motion.div>

          {/* Timeline stepper */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                style={{ width: `${(activeStage / (designStages.length - 1)) * 100}%` }}
              />
              {designStages.map((s, i) => {
                const StepIcon = iconMap[s.icon] || Cpu;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveStage(i)}
                    className={cn(
                      "relative z-10 flex flex-col items-center gap-2 group",
                      i <= activeStage ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                        i === activeStage
                          ? "border-primary bg-primary/20 shadow-md"
                          : i < activeStage
                          ? "border-primary bg-primary/10"
                          : "border-border bg-background"
                      )}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-mono hidden sm:block">{s.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage content */}
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{stage.title}</h2>
                  <p className="text-sm text-primary font-mono">Stage {activeStage + 1} of {designStages.length}</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{stage.description}</p>

              <h3 className="font-semibold text-sm mb-3">Key Activities</h3>
              <ul className="space-y-2 mb-8">
                {stage.details.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="h-3 w-3 mt-1 text-primary shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                {activeStage > 0 && (
                  <button
                    onClick={() => setActiveStage(activeStage - 1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← {designStages[activeStage - 1].title}
                  </button>
                )}
                <div className="flex-1" />
                {activeStage < designStages.length - 1 && (
                  <button
                    onClick={() => setActiveStage(activeStage + 1)}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {designStages[activeStage + 1].title} →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LearningHub;
