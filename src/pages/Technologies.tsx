import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import ScrollReveal from "@/components/ScrollReveal";
import { technologies } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight, Cpu, Wrench, Server } from "lucide-react";
import { cn } from "@/lib/utils";

// Build the tree: group → subcategory → technologies
const groups = [
  { key: "Components", label: "Components", icon: Cpu, description: "IP blocks that make up your SoC" },
  { key: "EDA Tooling", label: "EDA Tooling", icon: Wrench, description: "Tools for each stage of the design flow" },
  { key: "Infrastructure", label: "Infrastructure", icon: Server, description: "Boards, services, and fabrication" },
];

const edaPhaseOrder = [
  "RTL Design",
  "Verification",
  "Synthesis",
  "Physical Design",
  "Tapeout",
  "Silicon Validation",
];

const subcategoryColors: Record<string, string> = {
  Processors: "bg-primary/10 text-primary",
  "System Interconnects": "bg-violet/10 text-violet",
  Peripherals: "bg-coral/10 text-coral",
  "Memory Controllers": "bg-amber/10 text-amber",
  "Hardware Acceleration": "bg-emerald-500/10 text-emerald-500",
  "RTL Design": "bg-primary/10 text-primary",
  Verification: "bg-coral/10 text-coral",
  Synthesis: "bg-violet/10 text-violet",
  "Physical Design": "bg-amber/10 text-amber",
  Tapeout: "bg-emerald-500/10 text-emerald-500",
  "Silicon Validation": "bg-sky-500/10 text-sky-500",
  "FPGA Boards": "bg-primary/10 text-primary",
  "Shuttle Services": "bg-coral/10 text-coral",
};

const groupColors: Record<string, string> = {
  Components: "border-primary/30",
  "EDA Tooling": "border-violet/30",
  Infrastructure: "border-coral/30",
};

function getSubcategories(groupKey: string) {
  const techs = technologies.filter((t) => (t as any).group === groupKey);
  const cats = [...new Set(techs.map((t) => t.category))];
  if (groupKey === "EDA Tooling") {
    return cats.sort((a, b) => {
      const ai = edaPhaseOrder.indexOf(a);
      const bi = edaPhaseOrder.indexOf(b);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
  }
  return cats;
}

const Technologies = () => {
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);

  const toggleTech = (name: string) => {
    setSelectedTechs((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const selectedCount = selectedTechs.length;

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
              Technologies & <span className="text-gradient">Tools</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Explore the components, EDA tooling, and infrastructure available to design, verify, and fabricate your SoC.
            </p>
          </motion.div>

          {/* Group tabs */}
          {groups.map((group, gi) => {
            const Icon = group.icon;
            const subcats = getSubcategories(group.key);

            return (
              <ScrollReveal key={group.key} delay={gi * 0.1} className="max-w-5xl mx-auto mb-16">
                {/* Group header */}
                <div className={cn("rounded-2xl border bg-card/50 p-6 md:p-8", groupColors[group.key])}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-display font-bold">{group.label}</h2>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div className="mt-6 space-y-8">
                    {subcats.map((subcat, sci) => {
                      const techsInSubcat = technologies.filter(
                        (t) => (t as any).group === group.key && t.category === subcat
                      );

                      return (
                        <div key={subcat}>
                          <div className="flex items-center gap-2 mb-3 ml-1">
                            <div className="w-1 h-5 rounded-full bg-primary/30" />
                            <span
                              className={cn(
                                "text-xs px-3 py-1 rounded-full font-semibold",
                                subcategoryColors[subcat] || "bg-muted text-muted-foreground"
                              )}
                            >
                              {subcat}
                            </span>
                            {group.key === "EDA Tooling" && (
                              <Link
                                to={`/learn`}
                                className="text-[10px] text-muted-foreground hover:text-primary transition-colors ml-1"
                              >
                                → Learning Hub
                              </Link>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            {techsInSubcat.map((tech, i) => {
                              const isSelected = selectedTechs.includes(tech.name);
                              return (
                                <div key={tech.id} className="relative">
                                  <Link to={`/technologies/${tech.id}`}>
                                    <Card
                                      className={cn(
                                        "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300",
                                        isSelected
                                          ? "border-primary/40 shadow-md shadow-primary/10 bg-primary/[0.02]"
                                          : "border-border/60"
                                      )}
                                    >
                                      <CardContent className="p-5 pr-14">
                                        <h3 className="font-display font-semibold mb-1">{tech.name}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                          {tech.description}
                                        </p>
                                      </CardContent>
                                    </Card>
                                  </Link>
                                  <button
                                    onClick={() => toggleTech(tech.name)}
                                    className={cn(
                                      "absolute top-4 right-4 w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 z-10",
                                      isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border/60 hover:border-primary/50"
                                    )}
                                    title={
                                      isSelected
                                        ? "Interest registered"
                                        : `Register interest in ${tech.name}`
                                    }
                                  >
                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}

          {/* FPGA & ASIC Processes */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-8">
            <ScrollReveal direction="left">
              <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
                <h2 className="text-xl font-display font-bold mb-4">FPGA Prototyping Process</h2>
                <ol className="space-y-3">
                  {[
                    "Synthesise your RTL for target FPGA (Xilinx/Intel)",
                    "Run place & route with timing constraints",
                    "Generate bitstream and program the FPGA",
                    "Develop software drivers and test firmware",
                    "Debug with integrated logic analyser (ILA/SignalTap)",
                    "Benchmark performance on real hardware",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-primary font-display font-bold text-xs mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
                <h2 className="text-xl font-display font-bold mb-4">ASIC Tapeout Process</h2>
                <ol className="space-y-3">
                  {[
                    "Complete RTL verification and freeze design",
                    "Run logic synthesis targeting standard cell library",
                    "Physical design: floorplanning, placement, routing",
                    "Sign-off checks: DRC, LVS, timing closure",
                    "Submit to shuttle service (Europractice, OpenMPW)",
                    "Receive packaged chips and run post-silicon validation",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="text-coral font-display font-bold text-xs mt-0.5">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Floating CTA */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <div className="flex items-center gap-4 px-6 py-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-xl shadow-primary/10">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedCount} technolog{selectedCount !== 1 ? "ies" : "y"} selected
                </span>
              </div>
              <Button asChild size="sm" className="rounded-full px-5">
                <Link to="/about#join">
                  Register <ArrowRight className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Technologies;
