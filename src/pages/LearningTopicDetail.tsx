import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, ArrowRight, BookOpen, FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap } from "lucide-react";
import { learningPhases } from "@/data/mockData";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap,
};

const LearningTopicDetail = () => {
  const { phaseId, topicId } = useParams();
  const navigate = useNavigate();

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
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
              <Link to="/learn" className="hover:text-foreground transition-colors">
                Learning Hub
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/learn" className="hover:text-foreground transition-colors">
                {phase.title}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{topic.title}</span>
            </nav>

            {/* Phase progress stepper */}
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
                <div
                  className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500"
                  style={{ width: `${(phaseIndex / (learningPhases.length - 1)) * 100}%` }}
                />
                {learningPhases.map((p, i) => {
                  const Icon = iconMap[p.icon] || Cpu;
                  return (
                    <Link
                      key={p.id}
                      to={`/learn?phase=${p.id}`}
                      className={cn(
                        "relative z-10 flex flex-col items-center gap-2 group",
                        i <= phaseIndex ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all",
                          i === phaseIndex
                            ? "border-primary bg-primary/15 shadow-md shadow-primary/20"
                            : i < phaseIndex
                            ? "border-primary bg-primary/10"
                            : "border-border bg-background"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-display font-medium hidden sm:block">{p.shortTitle}</span>
                    </Link>
                  );
                })}
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

            {/* Sibling topics in this phase */}
            <div className="rounded-2xl border border-border/40 bg-card/30 p-6 mb-10">
              <h3 className="text-sm font-display font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Other topics in {phase.title}
              </h3>
              <div className="grid gap-2">
                {phase.topics.map((t, i) => (
                  <Link
                    key={t.id}
                    to={`/learn/${phase.id}/${t.id}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                      t.id === topicId
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="w-5 text-xs text-muted-foreground">{i + 1}.</span>
                    {t.title}
                  </Link>
                ))}
              </div>
            </div>

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
        </div>
      </section>
    </Layout>
  );
};

export default LearningTopicDetail;
