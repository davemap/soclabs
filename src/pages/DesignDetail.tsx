import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Cpu, ArrowRight, Github, ArrowLeft, CheckCircle2, Tag, GitBranch, BookOpen, Layers, FolderTree, CircuitBoard, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { useDesignFlow, DesignFlow, filterPhasesForFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { PhaseStepperIcon } from "@/components/PhaseStepperIcon";
import { learningPhases } from "@/data/mockData";
import InteractiveArchitectureDiagram from "@/components/InteractiveArchitectureDiagram";
import InteractiveHierarchyDiagram from "@/components/InteractiveHierarchyDiagram";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { referenceDesigns, communityProjects, technologies } from "@/data/mockData";
import CommunityProjectsCarousel from "@/components/CommunityProjectsCarousel";
import TechToolsCarousel from "@/components/TechToolsCarousel";
import { supabase } from "@/integrations/supabase/client";


const DesignDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { flow, setFlow, setSelectedSocId } = useDesignFlow();
  const design = referenceDesigns.find((d) => d.id === id);
  const lastClickRef = useRef<{ flow: DesignFlow; time: number } | null>(null);

  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [diagramView, setDiagramView] = useState<"architecture" | "hierarchy">(() => {
    const saved = sessionStorage.getItem(`diagram-view-${id}`);
    return saved === "hierarchy" ? "hierarchy" : "architecture";
  });

  useEffect(() => {
    if (id) sessionStorage.setItem(`diagram-view-${id}`, diagramView);
  }, [diagramView, id]);

  useEffect(() => {
    if (!design) return;
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .ilike("reference_soc", design.name);
      setDbProjects(data || []);
    };
    fetchProjects();
  }, [design?.name]);

  if (!design) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Design Not Found</h1>
            <Button variant="outline" className="rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
        </div>
      </Layout>
    );
  }

  const mockProjects = communityProjects.filter(
    (p) => p.referenceSoc.toLowerCase() === design.name.toLowerCase()
  );

  const relatedTechs = technologies.filter((t) =>
    design.relatedTechnologies.includes(t.name)
  );

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Back link */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/designs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
              <ArrowLeft className="h-4 w-4" /> All Designs
            </Link>
          </motion.div>

          <div className="flex gap-6 items-start max-w-5xl mx-auto">
            {/* Main column */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Cpu className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold">{design.name}</h1>
                    <p className="text-primary font-medium">{design.tagline}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Badge variant="secondary">{design.processor}</Badge>
                  <Badge variant="secondary">{design.busArchitecture}</Badge>
                  {design.targetTechnology.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
                {design.provenIn && design.provenIn.length > 0 && (
                  <div className="mt-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-emerald-500/15">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-display font-bold text-emerald-400">Silicon Proven</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {design.provenIn.map((p) => (
                        <div
                          key={p.details}
                          className={`flex items-center gap-3 rounded-xl border p-4 ${
                            p.type === "ASIC"
                              ? "border-violet-500/30 bg-violet-500/5"
                              : "border-sky-500/30 bg-sky-500/5"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-display font-bold ${
                            p.type === "ASIC"
                              ? "bg-violet-500/15 text-violet-400"
                              : "bg-sky-500/15 text-sky-400"
                          }`}>
                            {p.type}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${
                              p.type === "ASIC" ? "text-violet-400" : "text-sky-400"
                            }`}>{p.type} Fabrication</p>
                            <p className="text-xs text-muted-foreground">{p.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <div className="max-w-4xl space-y-12">
              {/* Architecture Overview */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <h2 className="text-2xl font-display font-bold mb-4">Architecture Overview</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {design.architectureOverview}
                </div>
              </motion.div>

              {/* Features & Use Cases */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Key Features</h2>
                  <ul className="space-y-2">
                    {design.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5 mt-1 text-primary shrink-0" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Use Cases</h2>
                  <ul className="space-y-2">
                    {design.useCases.map((u) => (
                      <li key={u} className="flex items-start gap-2 text-muted-foreground">
                        <ArrowRight className="h-3.5 w-3.5 mt-1 text-coral shrink-0" />
                        <span className="text-sm">{u}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Interactive Architecture / Hierarchy Diagram */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-8">
                  <h2 className="text-2xl font-display font-bold mb-4">
                    {diagramView === "architecture" ? "System Architecture" : "Chip Hierarchy"}
                  </h2>
                  {design.moduleHierarchy && (
                    <div className="flex items-center gap-0 rounded-xl border border-border/60 overflow-hidden mb-5">
                      <button
                        onClick={() => setDiagramView("architecture")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                          diagramView === "architecture"
                            ? "bg-primary text-primary-foreground shadow-inner"
                            : "bg-background text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        }`}
                      >
                        <Layers className="h-4 w-4" />
                        Architecture
                      </button>
                      <button
                        onClick={() => setDiagramView("hierarchy")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 border-l border-border/60 ${
                          diagramView === "hierarchy"
                            ? "bg-primary text-primary-foreground shadow-inner"
                            : "bg-background text-muted-foreground hover:text-foreground hover:bg-accent/40"
                        }`}
                      >
                        <FolderTree className="h-4 w-4" />
                        Hierarchy
                      </button>
                    </div>
                  )}
                  <p className="text-muted-foreground text-sm mb-6">
                    {diagramView === "architecture"
                      ? "Expand subsystems to explore their internal architecture. Click on any block or bus to view technical details and related learning resources."
                      : "Explore the physical chip hierarchy from the outermost pad ring down to individual IP blocks. Click on any layer to view its description."}
                  </p>
                  {diagramView === "architecture" ? (
                    <InteractiveArchitectureDiagram blocks={design.blockDiagram} designName={design.name} />
                  ) : design.moduleHierarchy ? (
                    <InteractiveHierarchyDiagram hierarchy={design.moduleHierarchy} designName={design.name} />
                  ) : null}
                </div>
              </motion.div>

              {/* Learn with this SoC */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-display font-bold">Learn with {design.name}</h2>
                  </div>
                  <p className="text-muted-foreground text-sm mb-6">
                    Select a design flow, or double-click to jump straight into the Learning Hub.
                  </p>
                  <div className="flex justify-center">
                    <div className="inline-flex items-center rounded-2xl border-2 border-border/60 bg-card gap-1 p-1.5">
                      {(["FPGA", "ASIC"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => {
                            const now = Date.now();
                            if (lastClickRef.current?.flow === f && now - lastClickRef.current.time < 400) {
                              setFlow(f);
                              setSelectedSocId(design.id);
                              navigate("/learn");
                              lastClickRef.current = null;
                              return;
                            }
                            lastClickRef.current = { flow: f, time: now };
                            setFlow(f);
                          }}
                          className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-200",
                            flow === f
                              ? f === "FPGA"
                                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-md ring-1 ring-sky-500/20"
                                : "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-md ring-1 ring-violet-500/20"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          {f === "FPGA" ? <CircuitBoard className="h-5 w-5" /> : <Cpu className="h-5 w-5" />}
                          {f} Flow
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Phase stepper bar */}
                  {(() => {
                    const phases = filterPhasesForFlow(learningPhases, flow);
                    return (
                      <div className="mt-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-5 h-0.5 bg-border" style={{ left: 20, right: 20 }} />
                              {phases.map((phase, i) => (
                                <PhaseStepperIcon
                                  key={phase.id}
                                  phase={phase}
                                  index={i}
                                  activeIndex={-1}
                                  onSelect={() => {
                                    setSelectedSocId(design.id);
                                    navigate(`/learn?phase=${i}`);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>

              {/* Related Technologies */}
              {relatedTechs.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                  <TechToolsCarousel techs={relatedTechs} />
                </motion.div>
              )}

              {/* Community Projects */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <CommunityProjectsCarousel
                  design={design}
                  mockProjects={mockProjects}
                  dbProjects={dbProjects}
                />
              </motion.div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-sm">
                <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Get Started</h3>
                {(design.version || design.branch) && (
                  <div className="space-y-2 pb-2 border-b border-border/40">
                    {design.version && (
                      <div className="flex items-center gap-2 text-xs">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Version</span>
                        <span className="ml-auto font-mono font-semibold text-foreground">{design.version}</span>
                      </div>
                    )}
                    {design.branch && (
                      <div className="flex items-center gap-2 text-xs">
                        <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Branch</span>
                        <span className="ml-auto font-mono font-semibold text-foreground">{design.branch}</span>
                      </div>
                    )}
                  </div>
                )}
                <Button asChild className="w-full rounded-lg justify-start" size="sm">
                  <Link to={`/designs/${design.id}/docs`}>
                    <BookOpen className="h-4 w-4 mr-2" /> Documentation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-lg justify-start" size="sm">
                  <a href={design.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" /> GitHub
                  </a>
                </Button>
                <Button asChild variant="ghost" className="w-full rounded-lg justify-start text-primary" size="sm">
                  <Link to="/projects/start">
                    <ArrowRight className="h-4 w-4 mr-2" /> Start a Project
                  </Link>
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DesignDetail;
