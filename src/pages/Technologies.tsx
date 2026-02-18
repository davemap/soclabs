import { useState, useCallback, useMemo } from "react";
import { useUserInterests } from "@/hooks/useUserInterests";
import { interests as allInterests } from "@/data/interests";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { technologies, learningPhases } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight, Cpu, Wrench, Server, ChevronDown, Lightbulb, Plus, Send, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { FileText, Code, CheckCircle, CircuitBoard, Zap, FlaskConical, MemoryStick, Gauge, Radio, Microchip, Cable, HardDrive, Rocket } from "lucide-react";

const phaseIconMap: Record<string, React.ElementType> = {
  FileText, Code, CheckCircle, Cpu, CircuitBoard, Zap, FlaskConical,
};

// Icons for Component subcategories
const subcategoryIconMap: Record<string, React.ElementType> = {
  Processors: Microchip,
  "System Interconnects": Cable,
  Peripherals: Radio,
  "Memory Controllers": MemoryStick,
  "Hardware Acceleration": Gauge,
  "RTL Design": Code,
  Verification: CheckCircle,
  Synthesis: CircuitBoard,
  "Physical Design": Cpu,
  Tapeout: Zap,
  "Silicon Validation": FlaskConical,
  "FPGA Boards": HardDrive,
  "Shuttle Services": Rocket,
};

// Map EDA category names to learning phase IDs
const edaCategoryToPhaseId: Record<string, string> = {
  "RTL Design": "rtl",
  "Verification": "verification",
  "Synthesis": "synthesis",
  "Physical Design": "physical-design",
  "Tapeout": "tapeout",
  "Silicon Validation": "silicon-validation",
};

const phaseIdToEdaCategory: Record<string, string> = Object.fromEntries(
  Object.entries(edaCategoryToPhaseId).map(([k, v]) => [v, k])
);

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
  const { registeredSlugs, toggleInterest } = useUserInterests();

  // Map tech names to interest slugs for persistence
  const techNameToSlug = useMemo(() => {
    const map: Record<string, string> = {};
    allInterests.forEach((i) => { if (i.technologyName) map[i.technologyName] = i.slug; });
    return map;
  }, []);

  const selectedTechs = useMemo(() => {
    return allInterests
      .filter((i) => i.technologyName && registeredSlugs.has(i.slug))
      .map((i) => i.technologyName!);
  }, [registeredSlugs, techNameToSlug]);

  const toggleTech = useCallback((name: string) => {
    const slug = techNameToSlug[name];
    if (slug) toggleInterest(slug);
  }, [techNameToSlug, toggleInterest]);

  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(groups.map(g => g.key)));
  const [collapsedSubcats, setCollapsedSubcats] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<Record<string, string | null>>({});
  const [search, setSearch] = useState("");
  const [proposalOpen, setProposalOpen] = useState(false);
  const [proposalName, setProposalName] = useState("");
  const [proposalGroup, setProposalGroup] = useState("Components");
  const [proposalDescription, setProposalDescription] = useState("");

  const toggleGroup = (key: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleSubcat = (key: string) => {
    setCollapsedSubcats((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const handlePropose = () => {
    if (!proposalName.trim()) return;
    toast.success("Technology proposed!", { description: `"${proposalName}" has been submitted for review.` });
    setProposalName("");
    setProposalDescription("");
    setProposalOpen(false);
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

          {/* Search bar + collapse toggle */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search technologies..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value) {
                      setCollapsedGroups(new Set());
                    }
                  }}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 rounded-xl text-xs whitespace-nowrap"
                onClick={() => {
                  const allCollapsed = collapsedGroups.size === groups.length;
                  setCollapsedGroups(allCollapsed ? new Set() : new Set(groups.map(g => g.key)));
                }}
              >
                <ChevronDown className={cn(
                  "h-4 w-4 mr-1.5 transition-transform",
                  collapsedGroups.size === groups.length && "-rotate-90"
                )} />
                {collapsedGroups.size === groups.length ? "Expand All" : "Collapse All"}
              </Button>
            </div>
          </div>
          <div className="max-w-6xl mx-auto flex gap-8">
            {/* Main content */}
            <div className="flex-1 min-w-0">
          {/* Groups */}
          {groups.map((group, gi) => {
            const Icon = group.icon;
            const subcats = getSubcategories(group.key);
            const matchingTechCount = technologies.filter(
              (t) => (t as any).group === group.key &&
                (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
            ).length;
            const isGroupCollapsed = search
              ? matchingTechCount === 0
              : collapsedGroups.has(group.key);
            const techCount = technologies.filter((t) => (t as any).group === group.key).length;

            return (
              <motion.div
                key={group.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: gi * 0.1 }}
                className="mb-8"
              >
                <div className={cn("rounded-2xl border bg-card/50 overflow-hidden", groupColors[group.key])}>
                  {/* Group header — clickable */}
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className="w-full flex items-center gap-3 p-6 md:p-8 text-left hover:bg-accent/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-display font-bold">{group.label}</h2>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground font-medium">{techCount}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-300",
                          isGroupCollapsed && "-rotate-90"
                        )}
                      />
                    </div>
                  </button>

                  {/* Group content */}
                  <AnimatePresence initial={false}>
                    {!isGroupCollapsed && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-6">
                        {/* Subcategory filter bar */}
                        {subcats.length > 1 && (() => {
                          const colorStyles: Record<string, { bar: string; active: string; inactive: string; label: string; filterLabel: string }> = {
                            Components: {
                              bar: "border-primary/30 bg-gradient-to-r from-primary/5 via-card to-primary/5 shadow-primary/5",
                              active: "bg-primary/20 border-primary text-primary scale-110 shadow-lg shadow-primary/25",
                              inactive: "bg-card border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5",
                              label: "text-primary",
                              filterLabel: "text-primary",
                            },
                            "EDA Tooling": {
                              bar: "border-violet/30 bg-gradient-to-r from-violet/5 via-card to-violet/5 shadow-violet/5",
                              active: "bg-violet/20 border-violet text-violet scale-110 shadow-lg shadow-violet/25",
                              inactive: "bg-card border-border/50 text-muted-foreground hover:border-violet/50 hover:text-violet hover:bg-violet/5",
                              label: "text-violet",
                              filterLabel: "text-violet",
                            },
                            Infrastructure: {
                              bar: "border-coral/30 bg-gradient-to-r from-coral/5 via-card to-coral/5 shadow-coral/5",
                              active: "bg-coral/20 border-coral text-coral scale-110 shadow-lg shadow-coral/25",
                              inactive: "bg-card border-border/50 text-muted-foreground hover:border-coral/50 hover:text-coral hover:bg-coral/5",
                              label: "text-coral",
                              filterLabel: "text-coral",
                            },
                          };
                          const colors = colorStyles[group.key] || colorStyles.Components;
                          const activeSubcat = activeFilter[group.key] || null;
                          const abbreviations: Record<string, string> = {
                            "Processors": "CPU",
                            "System Interconnects": "Bus",
                            "Peripherals": "Periph",
                            "Memory Controllers": "Mem",
                            "Hardware Acceleration": "Accel",
                            "FPGA Boards": "FPGA",
                            "Shuttle Services": "Shuttle",
                          };

                          return (
                            <div className="mb-2">
                              <div className={cn("relative flex items-center justify-between rounded-2xl border-2 px-6 py-4 shadow-sm", colors.bar)}>
                                {subcats.map((subcatName) => {
                                  const SubIcon = subcategoryIconMap[subcatName] || Cpu;
                                  const isActive = activeSubcat === subcatName;
                                  let shortLabel = subcatName;
                                  if (group.key === "EDA Tooling") {
                                    const phaseId = edaCategoryToPhaseId[subcatName];
                                    const phase = learningPhases.find((p) => p.id === phaseId);
                                    if (phase) shortLabel = phase.shortTitle;
                                  } else {
                                    shortLabel = abbreviations[subcatName] || subcatName;
                                  }

                                  return (
                                    <button
                                      key={subcatName}
                                      onClick={() => setActiveFilter(prev => ({
                                        ...prev,
                                        [group.key]: isActive ? null : subcatName
                                      }))}
                                      className="relative z-10 flex flex-col items-center gap-1.5 group/phase"
                                      title={subcatName}
                                    >
                                      <div className={cn(
                                        "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 border-2",
                                        isActive ? colors.active : colors.inactive
                                      )}>
                                        <SubIcon className="h-4 w-4" />
                                      </div>
                                      <span className={cn(
                                        "text-[10px] font-display font-semibold transition-colors hidden sm:block",
                                        isActive ? colors.label : "text-muted-foreground/70"
                                      )}>
                                        {shortLabel}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                              {activeSubcat && (
                                <div className="flex items-center gap-2 mt-2 ml-1">
                                  <span className={cn("text-xs font-medium", colors.filterLabel)}>Filtering: {activeSubcat}</span>
                                  <button
                                    onClick={() => setActiveFilter(prev => ({ ...prev, [group.key]: null }))}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    (clear)
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        {subcats.filter((subcat) => {
                          const active = activeFilter[group.key];
                          if (active) return subcat === active;
                          return true;
                        }).map((subcat) => {
                            const subcatKey = `${group.key}::${subcat}`;
                            const isSubcatCollapsed = collapsedSubcats.has(subcatKey);
                            const techsInSubcat = technologies.filter(
                              (t) => (t as any).group === group.key && t.category === subcat &&
                                (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
                            );

                            if (search && techsInSubcat.length === 0) return null;

                            return (
                              <div key={subcat}>
                                {/* Subcategory header — clickable */}
                                <button
                                  onClick={() => toggleSubcat(subcatKey)}
                                  className="flex items-center gap-2 mb-3 ml-1 group/sub w-full text-left"
                                >
                                  <div className="w-1 h-5 rounded-full bg-primary/30" />
                                  <span
                                    className={cn(
                                      "text-xs px-3 py-1 rounded-full font-semibold",
                                      subcategoryColors[subcat] || "bg-muted text-muted-foreground"
                                    )}
                                  >
                                    {subcat}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground ml-0.5">
                                    {techsInSubcat.length}
                                  </span>
                                  {group.key === "EDA Tooling" && (
                                    <Link
                                      to="/learn"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-[10px] text-muted-foreground hover:text-primary transition-colors ml-1"
                                    >
                                      → Learning Hub
                                    </Link>
                                  )}
                                  <ChevronDown
                                    className={cn(
                                      "h-3.5 w-3.5 text-muted-foreground/60 transition-transform duration-200 ml-auto",
                                      isSubcatCollapsed && "-rotate-90"
                                    )}
                                  />
                                </button>

                                {/* Subcategory cards */}
                                <AnimatePresence initial={false}>
                                  {!isSubcatCollapsed && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.25, ease: "easeInOut" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="grid md:grid-cols-2 gap-3">
                                        {techsInSubcat.map((tech) => {
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
                                                    <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                                                      {tech.description}
                                                    </p>
                                                    <span className={cn(
                                                      "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                                                      isSelected
                                                        ? "bg-primary/15 text-primary"
                                                        : "bg-muted/60 text-muted-foreground"
                                                    )}>
                                                      <Check className={cn("h-2.5 w-2.5", isSelected ? "opacity-100" : "opacity-40")} />
                                                      {isSelected ? "Interested" : "Register interest"}
                                                    </span>
                                                  </CardContent>
                                                </Card>
                                              </Link>
                                              <button
                                                onClick={() => toggleTech(tech.name)}
                                                className={cn(
                                                  "absolute top-4 right-4 w-8 h-8 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 z-10",
                                                  isSelected
                                                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                                                    : "border-border/60 hover:border-primary/50 hover:bg-primary/5"
                                                )}
                                                title={
                                                  isSelected
                                                    ? "Interest registered ✓"
                                                    : `Register interest in ${tech.name}`
                                                }
                                              >
                                                {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                                              </button>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}

            </div>

            {/* Sticky sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 space-y-4">
                {/* Register interest hint */}
                <div className="rounded-xl border border-primary/20 bg-card/95 backdrop-blur-xl shadow-lg shadow-primary/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h3 className="font-display font-bold text-sm">Register Interest</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Click on any section to expand it. Use the <Plus className="inline h-3 w-3 text-primary -mt-0.5" /> button on each card to register your interest.
                  </p>
                  {selectedCount > 0 && (
                    <div className="border-t border-border/40 pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-primary">{selectedCount} selected</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {selectedTechs.slice(0, 5).map((name) => (
                          <button
                            key={name}
                            onClick={() => toggleTech(name)}
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                          >
                            {name}
                            <X className="h-2 w-2" />
                          </button>
                        ))}
                        {selectedTechs.length > 5 && (
                          <span className="text-[10px] text-muted-foreground">+{selectedTechs.length - 5} more</span>
                        )}
                      </div>
                      <Button asChild size="sm" className="w-full rounded-full text-xs">
                        <Link to="/about#join">
                          Register <ArrowRight className="ml-1.5 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>

                {/* Propose new technology card */}
                <div className="rounded-xl border border-border/60 bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-sm">Propose a Technology</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">
                    Can't find a tool or IP block? Suggest it for the community catalogue.
                  </p>

                  <AnimatePresence>
                    {proposalOpen ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-3"
                      >
                        <Input
                          placeholder="Technology name"
                          value={proposalName}
                          onChange={(e) => setProposalName(e.target.value)}
                          className="text-sm h-9"
                        />
                        <div className="flex gap-1.5 flex-wrap">
                          {["Components", "EDA Tooling", "Infrastructure"].map((g) => (
                            <button
                              key={g}
                              onClick={() => setProposalGroup(g)}
                              className={cn(
                                "text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all",
                                proposalGroup === g
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : "border-border/60 text-muted-foreground hover:border-primary/40"
                              )}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                        <textarea
                          placeholder="Brief description (optional)"
                          value={proposalDescription}
                          onChange={(e) => setProposalDescription(e.target.value)}
                          className="w-full text-sm rounded-lg border border-border/60 bg-background p-2.5 h-20 resize-none placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 rounded-full text-xs" onClick={handlePropose} disabled={!proposalName.trim()}>
                            <Send className="h-3 w-3 mr-1.5" /> Submit
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => setProposalOpen(false)}>
                            Cancel
                          </Button>
                        </div>
                      </motion.div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full text-xs"
                        onClick={() => setProposalOpen(true)}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" /> Propose New Technology
                      </Button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Selected technologies summary */}
                {selectedCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border border-primary/20 bg-primary/5 p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-sm">Your Technologies</h3>
                      <span className="text-xs text-primary font-semibold">{selectedCount}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {selectedTechs.map((name) => (
                        <button
                          key={name}
                          onClick={() => toggleTech(name)}
                          className="inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-colors"
                        >
                          {name}
                          <X className="h-2.5 w-2.5" />
                        </button>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full rounded-full text-xs">
                      <Link to="/about#join">
                        Register <ArrowRight className="ml-1.5 h-3 w-3" />
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Floating CTA — mobile/smaller screens */}
      <AnimatePresence>
        {selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 xl:hidden"
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
