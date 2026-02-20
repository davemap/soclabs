import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, ArrowRight, Github, ArrowLeft, CheckCircle2, Tag, GitBranch, BookOpen, Layers, FolderTree, CircuitBoard, GraduationCap, ChevronLeft, ChevronRight, Wrench, Component, ChevronDown, Plus, Send, User, Calendar, FolderOpen } from "lucide-react";
import { useDesignFlow, DesignFlow, filterPhasesForFlow } from "@/hooks/useDesignFlow";
import { getAvailableSocTopics } from "@/data/socTopicContent";
import { cn } from "@/lib/utils";
import { PhaseStepperIcon } from "@/components/PhaseStepperIcon";
import { learningPhases } from "@/data/mockData";
import InteractiveArchitectureDiagram from "@/components/InteractiveArchitectureDiagram";
import InteractiveHierarchyDiagram from "@/components/InteractiveHierarchyDiagram";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { referenceDesigns, communityProjects, technologies } from "@/data/mockData";
import { useAuth } from "@/hooks/useAuth";

const phaseToolCategoryMap: Record<string, string[]> = {
  architecture: ["Processors", "DMA Controllers", "System Interconnects", "Bus Protocols", "Peripherals", "Memory Controllers"],
  rtl: ["RTL Design", "Serial Protocols"],
  verification: ["Verification"],
  synthesis: ["Synthesis"],
  "physical-design": ["Physical Design"],
  tapeout: ["Tapeout", "Shuttle Services"],
  "silicon-validation": ["Silicon Validation", "FPGA Boards"],
};

// Map individual topic IDs to relevant technology IDs
const topicToolMap: Record<string, string[]> = {
  "system-partitioning": ["arm-cortex-m0", "arm-cortex-m3"],
  "bus-architecture": ["amba-interconnect", "ahb-lite", "ahb", "apb", "axi"],
  "memory-map": ["memory-controllers"],
  "ip-selection": ["arm-cortex-m0", "arm-cortex-m3", "pl230-dma", "dma-350", "standard-peripherals"],
  "power-clocking": [],
  "coding-style": ["verilator-linting"],
  "fsm-design": ["verilator-linting"],
  "interface-protocols": ["ahb-lite", "ahb", "apb", "axi", "uart-protocol", "spi-protocol"],
  "parameterisation": ["verilator-linting"],
  "dft-insertion": [],
  "testbench-architecture": ["uvm-cocotb"],
  "constrained-random": ["uvm-cocotb"],
  "functional-coverage": ["uvm-cocotb"],
  "formal-verification": ["uvm-cocotb"],
  "regression-ci": ["uvm-cocotb"],
  constraints: ["vivado-quartus", "yosys", "design-compiler-genus"],
  "synthesis-strategies": ["vivado-quartus", "yosys", "design-compiler-genus"],
  "timing-closure": ["vivado-quartus", "design-compiler-genus"],
  "lint-cdc-checks": ["verilator-linting"],
  floorplanning: ["openroad", "innovus-icc2"],
  placement: ["openroad", "innovus-icc2"],
  "clock-tree": ["openroad", "innovus-icc2"],
  routing: ["openroad", "innovus-icc2"],
  "power-analysis": ["openroad", "innovus-icc2"],
  "signoff-checks": ["signoff-tools"],
  "timing-signoff": ["signoff-tools"],
  "shuttle-submission": ["shuttle-services"],
  packaging: [],
  "bring-up": ["debug-test-tools", "fpga-boards"],
  "functional-test": ["debug-test-tools"],
  characterisation: ["debug-test-tools"],
  "debug-techniques": ["debug-test-tools"],
  documentation: [],
};
import CommunityProjectsCarousel from "@/components/CommunityProjectsCarousel";
import TechToolsCarousel from "@/components/TechToolsCarousel";
import { supabase } from "@/integrations/supabase/client";


const DesignDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { flow, setFlow, setSelectedSocId } = useDesignFlow();
  const { user } = useAuth();
  const design = referenceDesigns.find((d) => d.id === id);
  const lastClickRef = useRef<{ flow: DesignFlow; time: number } | null>(null);

  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState<number | null>(null);
  const [provenDialogOpen, setProvenDialogOpen] = useState(false);
  const [provenDetailEntry, setProvenDetailEntry] = useState<any | null>(null);
  const [provenValidationIdx, setProvenValidationIdx] = useState(0);
  const [provenType, setProvenType] = useState<"FPGA" | "ASIC">("FPGA");
  const [provenPlatform, setProvenPlatform] = useState("");
  const [provenDetails, setProvenDetails] = useState("");
  const [provenBoard, setProvenBoard] = useState("");
  const [provenProjectId, setProvenProjectId] = useState("");
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [openProvenSections, setOpenProvenSections] = useState<Set<string>>(new Set());
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

  useEffect(() => {
    if (!user) { setUserProjects([]); return; }
    const fetchUserProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title")
        .eq("user_id", user.id);
      setUserProjects(data || []);
    };
    fetchUserProjects();
  }, [user?.id]);

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
                  {(() => {
                    const processorTech = technologies.find(t => t.name === design.processor);
                    return processorTech ? (
                      <Link to={`/technologies/${processorTech.id}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">{design.processor}</Badge>
                      </Link>
                    ) : (
                      <Badge variant="secondary">{design.processor}</Badge>
                    );
                  })()}
                  {(() => {
                    const busTech = technologies.find(t => t.name === design.busArchitecture);
                    return busTech ? (
                      <Link to={`/technologies/${busTech.id}`}>
                        <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 transition-colors">{design.busArchitecture}</Badge>
                      </Link>
                    ) : (
                      <Badge variant="secondary">{design.busArchitecture}</Badge>
                    );
                  })()}
                  {design.targetTechnology.map((t) => (
                    <Badge key={t} variant="outline">{t}</Badge>
                  ))}
                </div>
                {design.provenIn && design.provenIn.length > 0 && (() => {
                  const asicEntries = design.provenIn.filter(p => p.type === "ASIC");
                  const fpgaEntries = design.provenIn.filter(p => p.type === "FPGA");
                  return (
                    <div className="mt-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-emerald-500/15">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </div>
                          <h3 className="text-lg font-display font-bold text-emerald-400">Silicon Proven</h3>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 gap-1.5"
                          onClick={() => {
                            if (!user) {
                              toast.error("Please sign in to submit a proof", { description: "You need to be signed in so we can contact you." });
                              navigate("/auth");
                              return;
                            }
                            setProvenDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" /> I've proven this
                        </Button>
                      </div>
                      <div className={cn(
                        fpgaEntries.length > 0 && asicEntries.length > 0
                          ? "grid sm:grid-cols-2 gap-2"
                          : "space-y-2"
                      )}>
                        {fpgaEntries.length > 0 && (
                          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 overflow-hidden">
                            <button
                              type="button"
                              className="flex items-center gap-3 p-4 cursor-pointer select-none w-full text-left"
                              onClick={() => setOpenProvenSections(prev => { const next = new Set(prev); next.has("fpga") ? next.delete("fpga") : next.add("fpga"); return next; })}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-display font-bold bg-sky-500/15 text-sky-400 shrink-0">
                                FPGA
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-sky-400">FPGA Implementation</p>
                                <p className="text-xs text-muted-foreground">{fpgaEntries.length} platform{fpgaEntries.length > 1 ? "s" : ""} verified</p>
                              </div>
                              <ChevronDown className={cn("h-4 w-4 text-sky-400 transition-transform", openProvenSections.has("fpga") && "rotate-180")} />
                            </button>
                            {openProvenSections.has("fpga") && (
                              <div className="px-4 pb-4 pt-1 space-y-2">
                                {fpgaEntries.map((p) => (
                                  <button
                                    key={p.details}
                                    type="button"
                                    className="flex items-center gap-2.5 rounded-lg bg-sky-500/5 border border-sky-500/15 px-3 py-2.5 w-full text-left hover:bg-sky-500/10 transition-colors cursor-pointer"
                                    onClick={() => { setProvenDetailEntry(p); setProvenValidationIdx(0); }}
                                  >
                                    <CircuitBoard className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                                    <div className="flex flex-col flex-1">
                                      <span className="text-xs font-medium text-foreground/80">{p.details}</span>
                                      {(p as any).board && (
                                        <span className="text-[11px] font-semibold text-sky-400">{(p as any).board}</span>
                                      )}
                                    </div>
                                    {(p as any).validations?.length > 0 && (
                                      <span className="text-[10px] text-muted-foreground shrink-0">{(p as any).validations.length} validation{(p as any).validations.length > 1 ? "s" : ""}</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {asicEntries.length > 0 && (
                          <div className="rounded-xl border border-violet-500/30 bg-violet-500/5 overflow-hidden">
                            <button
                              type="button"
                              className="flex items-center gap-3 p-4 cursor-pointer select-none w-full text-left"
                              onClick={() => setOpenProvenSections(prev => { const next = new Set(prev); next.has("asic") ? next.delete("asic") : next.add("asic"); return next; })}
                            >
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-display font-bold bg-violet-500/15 text-violet-400 shrink-0">
                                ASIC
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-violet-400">ASIC Fabrication</p>
                                <p className="text-xs text-muted-foreground">{asicEntries.length} tapeout{asicEntries.length > 1 ? "s" : ""} verified</p>
                              </div>
                              <ChevronDown className={cn("h-4 w-4 text-violet-400 transition-transform", openProvenSections.has("asic") && "rotate-180")} />
                            </button>
                            {openProvenSections.has("asic") && (
                              <div className="px-4 pb-4 pt-1 space-y-2">
                                {asicEntries.map((p) => (
                                  <button
                                    key={p.details}
                                    type="button"
                                    className="flex items-center gap-2 rounded-lg bg-violet-500/5 border border-violet-500/15 px-3 py-2.5 w-full text-left hover:bg-violet-500/10 transition-colors cursor-pointer"
                                    onClick={() => { setProvenDetailEntry(p); setProvenValidationIdx(0); }}
                                  >
                                    <Cpu className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                                    <span className="text-xs text-muted-foreground flex-1">{p.details}</span>
                                    {(p as any).validations?.length > 0 && (
                                      <span className="text-[10px] text-muted-foreground shrink-0">{(p as any).validations.length} validation{(p as any).validations.length > 1 ? "s" : ""}</span>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
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
              <motion.div id="learn-with" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="rounded-2xl border border-border/60 bg-card p-5 md:p-8 scroll-mt-24">
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
                    const availableTopics = id ? new Set(getAvailableSocTopics(id)) : new Set<string>();
                    const selectedPhase = selectedPhaseIndex !== null ? phases[selectedPhaseIndex] : null;
                    const phaseTasks = selectedPhase
                      ? selectedPhase.topics.filter((t) => !t.id.endsWith("-overview") && availableTopics.has(t.id))
                      : [];

                    return (
                      <div className="mt-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 relative">
                            <div className="flex items-center justify-between relative">
                              <div className="absolute top-5 h-0.5 bg-border" style={{ left: 20, right: 20 }} />
                              {selectedPhaseIndex !== null && selectedPhaseIndex > 0 && (
                                <div
                                  className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
                                  style={{
                                    left: 20,
                                    width: `calc(${(selectedPhaseIndex / (phases.length - 1)) * 100}%)`,
                                  }}
                                />
                              )}
                              {phases.map((phase, i) => (
                                <PhaseStepperIcon
                                  key={phase.id}
                                  phase={phase}
                                  index={i}
                                  activeIndex={selectedPhaseIndex ?? -1}
                                  noTooltip
                                  onSelect={(idx) => {
                                    setSelectedPhaseIndex((prev) => (prev === idx ? null : idx));
                                  }}
                                  onDoubleClick={(idx) => {
                                    setSelectedSocId(design.id);
                                    setFlow(flow);
                                    navigate(`/learn?phase=${phases[idx].id}`);
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Expandable phase detail */}
                        <AnimatePresence>
                          {selectedPhase && (
                            <motion.div
                              key={selectedPhase.id}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.03] overflow-hidden">
                                {/* Phase header */}
                                <div className="px-5 py-4 border-b border-primary/10 flex items-center justify-between gap-4">
                                  <div>
                                    <h3 className="text-lg font-display font-bold text-foreground">{selectedPhase.title}</h3>
                                    <p className="text-sm text-muted-foreground/80 mt-0.5 leading-relaxed">{selectedPhase.description}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="rounded-lg shrink-0"
                                    onClick={() => {
                                      setSelectedSocId(design.id);
                                      setFlow(flow);
                                      navigate(`/learn?phase=${phases[selectedPhaseIndex!].id}`);
                                    }}
                                  >
                                    Open in Hub <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                                  </Button>
                                </div>

                                {/* Tasks list */}
                                <div className="px-5 py-4">
                                  <h4 className="text-[11px] font-display font-semibold text-muted-foreground/70 uppercase tracking-wider mb-3">
                                    Tasks in this phase
                                  </h4>
                                  <div className="space-y-2">
                                    {phaseTasks.map((task, taskIdx) => {
                                      const toolIds = topicToolMap[task.id] || [];
                                      const taskTools = technologies.filter((t) => toolIds.includes(t.id));
                                      return (
                                        <div
                                          key={task.id}
                                          onClick={() => {
                                            setSelectedSocId(design.id);
                                            setFlow(flow);
                                            navigate(`/learn/${selectedPhase.id}/${task.id}`);
                                          }}
                                          className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/80 p-3.5 transition-all hover:border-primary/30 hover:shadow-sm group block cursor-pointer"
                                        >
                                          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-primary/10 text-primary text-xs font-display font-bold shrink-0 mt-0.5">
                                            {taskIdx + 1}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                              <span className="font-display font-semibold text-sm text-foreground/90 group-hover:text-primary transition-colors">{task.title}</span>
                                              {task.effort && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-border/40 text-muted-foreground/60 shrink-0">
                                                  Effort {task.effort}/5
                                                </Badge>
                                              )}
                                            </div>
                                            <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-1 leading-relaxed">
                                              {task.summary}
                                            </p>
                                            {taskTools.length > 0 && (
                                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                                {taskTools.map((tool) => {
                                                  const isEdaTool = tool.group === "EDA Tooling";
                                                  return (
                                                    <span
                                                      key={tool.id}
                                                      className={cn(
                                                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold",
                                                        isEdaTool
                                                          ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 ring-1 ring-sky-500/20"
                                                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20"
                                                      )}
                                                    >
                                                      {isEdaTool ? (
                                                        <Wrench className="h-2.5 w-2.5" />
                                                      ) : (
                                                        <Component className="h-2.5 w-2.5" />
                                                      )}
                                                      {tool.name}
                                                    </span>
                                                  );
                                                })}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
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
              {/* Last Proven */}
              {design.provenIn && design.provenIn.length > 0 && (() => {
                const allValidations = design.provenIn.flatMap((p: any) =>
                  (p.validations || []).map((v: any) => ({ ...v, type: p.type, details: p.details, board: p.board }))
                );
                if (allValidations.length === 0) return null;
                const latest = allValidations.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                return (
                  <div className="mt-3 rounded-xl border border-border/60 bg-card p-4 space-y-2.5 shadow-sm">
                    <h3 className="text-xs font-display font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Last Proven
                    </h3>
                    <div className="text-xs space-y-2">
                      <div>
                        <p className="text-muted-foreground text-[11px]">{latest.type === "FPGA" ? "Device" : "Process"}</p>
                        <p className="font-medium text-foreground/80">{latest.details}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[11px]">By</p>
                        <Link to={`/members/${latest.submitter?.toLowerCase().replace(/[\s.]+/g, "-")}`} className="font-medium text-primary hover:underline">
                          {latest.submitter}
                        </Link>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-[11px]">Date</p>
                        <p className="font-medium text-foreground/80">{new Date(latest.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      {latest.projectTitle && (
                        <div>
                          <p className="text-muted-foreground text-[11px]">Project</p>
                          <Link to={`/projects/${latest.projectId}`} className="font-medium text-primary hover:underline">
                            {latest.projectTitle}
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </aside>
          </div>
        </div>
      </section>
      {/* Proven submission dialog */}
      <Dialog open={provenDialogOpen} onOpenChange={setProvenDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Submit Silicon Proof</DialogTitle>
            <DialogDescription>
              Tell us how you've proven {design?.name}. We'll review your submission and contact you to verify.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="proven-type">Technology</Label>
              <Select value={provenType} onValueChange={(v) => setProvenType(v as "FPGA" | "ASIC")}>
                <SelectTrigger id="proven-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FPGA">FPGA Implementation</SelectItem>
                  <SelectItem value="ASIC">ASIC Fabrication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="proven-platform">Platform / Process</Label>
              <Input
                id="proven-platform"
                placeholder={provenType === "FPGA" ? "e.g. Xilinx Artix-7 (XC7A35T)" : "e.g. TSMC 65nm (via Europractice)"}
                value={provenPlatform}
                onChange={(e) => setProvenPlatform(e.target.value)}
              />
            </div>
            {provenType === "FPGA" && (
              <div className="space-y-2">
                <Label htmlFor="proven-board">Development Board</Label>
                <Input
                  id="proven-board"
                  placeholder="e.g. Digilent Arty A7-35T"
                  value={provenBoard}
                  onChange={(e) => setProvenBoard(e.target.value)}
                />
              </div>
            )}
            {userProjects.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="proven-project">Associated Project (optional)</Label>
                <Select value={provenProjectId} onValueChange={setProvenProjectId}>
                  <SelectTrigger id="proven-project">
                    <SelectValue placeholder="Select a project..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No project</SelectItem>
                    {userProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="proven-details">Details</Label>
              <Textarea
                id="proven-details"
                placeholder="Describe your implementation — what modifications were made, any issues encountered, performance results, etc."
                rows={4}
                value={provenDetails}
                onChange={(e) => setProvenDetails(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setProvenDialogOpen(false)}>Cancel</Button>
            <Button
              className="gap-1.5"
              disabled={!provenPlatform.trim()}
              onClick={() => {
                toast.success("Proof submitted!", { description: "We'll review your submission and get in touch." });
                setProvenDialogOpen(false);
                setProvenPlatform("");
                setProvenDetails("");
                setProvenBoard("");
                setProvenProjectId("");
                setProvenType("FPGA");
              }}
            >
              <Send className="h-3.5 w-3.5" /> Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proven entry detail dialog */}
      <Dialog open={!!provenDetailEntry} onOpenChange={(open) => { if (!open) { setProvenDetailEntry(null); setProvenValidationIdx(0); } }}>
        <DialogContent className="sm:max-w-md">
          {provenDetailEntry && (() => {
            const validations = provenDetailEntry.validations || [];
            const currentVal = validations[provenValidationIdx] || {};
            const hasPrev = provenValidationIdx > 0;
            const hasNext = provenValidationIdx < validations.length - 1;
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display flex items-center gap-2">
                    {provenDetailEntry.type === "FPGA" ? (
                      <CircuitBoard className="h-5 w-5 text-sky-400" />
                    ) : (
                      <Cpu className="h-5 w-5 text-violet-400" />
                    )}
                    {provenDetailEntry.type === "FPGA" ? "FPGA Implementation" : "ASIC Fabrication"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className={cn(
                    "rounded-xl p-4 space-y-3",
                    provenDetailEntry.type === "FPGA" ? "bg-sky-500/5 border border-sky-500/20" : "bg-violet-500/5 border border-violet-500/20"
                  )}>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">{provenDetailEntry.type === "FPGA" ? "Device" : "Process Node"}</p>
                      <p className="text-sm font-semibold text-foreground">{provenDetailEntry.details}</p>
                    </div>
                    {provenDetailEntry.board && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Development Board</p>
                        <p className="text-sm font-semibold text-sky-400">{provenDetailEntry.board}</p>
                      </div>
                    )}
                  </div>
                  {validations.length > 0 && (
                    <div className="space-y-3">
                      {validations.length > 1 && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-muted-foreground">Validation {provenValidationIdx + 1} of {validations.length}</p>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={!hasPrev}
                              onClick={() => setProvenValidationIdx(i => i - 1)}
                            >
                              <ChevronLeft className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              disabled={!hasNext}
                              onClick={() => setProvenValidationIdx(i => i + 1)}
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {currentVal.submitter && (
                        <div className="flex items-center gap-3">
                          <User className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Submitted by</p>
                            <p className="text-sm font-medium text-foreground">{currentVal.submitter}</p>
                          </div>
                        </div>
                      )}
                      {currentVal.date && (
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Date verified</p>
                            <p className="text-sm font-medium text-foreground">{new Date(currentVal.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                        </div>
                      )}
                      {currentVal.projectTitle && (
                        <div className="flex items-center gap-3">
                          <FolderOpen className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Associated project</p>
                            <p className="text-sm font-medium text-primary">{currentVal.projectTitle}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="ghost" onClick={() => { setProvenDetailEntry(null); setProvenValidationIdx(0); }}>Close</Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default DesignDetail;
