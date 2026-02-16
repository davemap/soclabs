import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, ExternalLink, Cpu, ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { referenceDesigns } from "@/data/mockData";

const Designs = () => {
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

          <div className="space-y-16 max-w-4xl mx-auto">
            {referenceDesigns.map((design, i) => (
              <ScrollReveal key={design.id} delay={i * 0.1}>
                <div id={design.id}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/60">
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
                          <a href={design.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" /> GitHub
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            ))}
          </div>

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
