import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Cpu, ArrowRight, CheckCircle2, Plus, GitCompare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { referenceDesigns } from "@/data/mockData";
import SoCComparisonDialog from "@/components/SoCComparison";

const Designs = () => {
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const clearCompare = () => setCompareIds([]);

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Reference <span className="text-gradient">SoC Designs</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Proven ARM Cortex-M based architectures ready to fork, extend, and build upon. Each design includes full RTL source, documentation, and synthesis scripts.
            </p>
          </motion.div>

          {/* Compare hint */}
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitCompare className="h-4 w-4" />
                <span>Select designs to compare side by side</span>
              </div>
              {compareIds.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {compareIds.length} selected
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-16 max-w-4xl mx-auto">
            {referenceDesigns.map((design, i) => {
              const isSelected = compareIds.includes(design.id);
              return (
                <ScrollReveal key={design.id} delay={i * 0.1}>
                  <div id={design.id} className="relative">
                    {/* Compare toggle */}
                    <button
                      onClick={() => toggleCompare(design.id)}
                      className={cn(
                        "absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card/80 backdrop-blur-sm border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                      )}
                    >
                      <GitCompare className="h-3 w-3" />
                      {isSelected ? "Comparing" : "Compare"}
                    </button>

                    <Link to={`/designs/${design.id}`} className="block">
                      <Card className={cn(
                        "overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer",
                        isSelected
                          ? "border-primary/40 shadow-lg ring-1 ring-primary/20"
                          : "border-border/60"
                      )}>
                        <CardContent className="p-8 md:p-10">
                          <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <Cpu className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-display font-bold">{design.name}</h2>
                              <p className="text-primary font-medium text-sm">{design.tagline}</p>
                            </div>
                          </div>

                          {design.provenIn && design.provenIn.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {design.provenIn.map((p) => (
                                <Badge key={p.details} variant="outline" className={`text-xs gap-1 ${p.type === "ASIC" ? "border-amber-500/50 text-amber-400" : "border-emerald-500/50 text-emerald-400"}`}>
                                  <CheckCircle2 className="h-3 w-3" />
                                  {p.type}: {p.details}
                                </Badge>
                              ))}
                            </div>
                          )}

                          <p className="text-muted-foreground mb-6 leading-relaxed">{design.description}</p>

                          <div className="grid md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <h3 className="font-display font-semibold mb-3 text-sm text-foreground">Key Features</h3>
                              <ul className="space-y-2">
                                {design.features.map((f) => (
                                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <ArrowRight className="h-3 w-3 mt-1 text-primary shrink-0" />
                                    {f}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="font-display font-semibold mb-3 text-sm text-foreground">Use Cases</h3>
                              <ul className="space-y-2">
                                {design.useCases.map((u) => (
                                  <li key={u} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <ArrowRight className="h-3 w-3 mt-1 text-coral shrink-0" />
                                    {u}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button asChild className="rounded-full">
                              <Link to={`/designs/${design.id}`}>
                                <ArrowRight className="h-4 w-4 mr-2" /> Explore Design
                              </Link>
                            </Button>
                            <Button asChild variant="outline" className="rounded-full">
                              <a
                                href={design.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Github className="h-4 w-4 mr-2" /> GitHub
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Comparison Dialog */}
          <SoCComparisonDialog
            open={compareOpen}
            onOpenChange={setCompareOpen}
            selectedIds={compareIds}
            onToggle={toggleCompare}
            onClear={() => { clearCompare(); setCompareOpen(false); }}
          />

          {/* Floating compare bar */}
          {compareIds.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
              <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-card border border-primary/30 shadow-2xl backdrop-blur-sm">
                <GitCompare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {compareIds.length} selected
                </span>
                {compareIds.length >= 2 && (
                  <Button
                    size="sm"
                    className="rounded-full"
                    onClick={() => setCompareOpen(true)}
                  >
                    View Comparison
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={clearCompare} className="text-muted-foreground">
                  Clear
                </Button>
              </div>
            </motion.div>
          )}

          {/* Submit CTA */}
          <ScrollReveal className="max-w-4xl mx-auto mt-20 text-center">
            <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="p-10">
                <h2 className="text-2xl font-display font-bold mb-2">Have your own SoC platform?</h2>
                <p className="text-muted-foreground mb-6">
                  Submit your reference SoC design to be featured in the SoC Labs registry and share it with the community.
                </p>
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/designs/submit">
                    <Plus className="h-4 w-4 mr-2" /> Submit Your Reference SoC
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </Layout>
  );
};

export default Designs;
