import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Search, X, Check, Plus, ChevronDown, Cpu, Wrench, Server, Brain, Shield, Code, CheckCircle, Zap, Radio, Microchip, Cable, MemoryStick, Gauge, HardDrive, Rocket, FlaskConical, Building2 } from "lucide-react";
import { toast } from "sonner";
import { interests as allInterests } from "@/data/interests";
import { technologies } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface ProjectData {
  id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  docs_url: string | null;
  status: string;
  target_technology: string | null;
  fpga_family: string | null;
  asic_process: string | null;
  timeframe: string | null;
  interests: string[] | null;
  technologies: string[] | null;
  organisations: string[] | null;
}

// ─── Technology groups (matches Technologies page) ───
const techGroups = [
  { key: "Components", label: "Components", icon: Cpu, description: "IP blocks that make up your SoC" },
  { key: "EDA Tooling", label: "EDA Tooling", icon: Wrench, description: "Tools for each stage of the design flow" },
  { key: "Infrastructure", label: "Infrastructure", icon: Server, description: "Boards, services, and fabrication" },
];

const techSubcategoryIconMap: Record<string, React.ElementType> = {
  Processors: Microchip, "System Interconnects": Cable, Peripherals: Radio,
  "Memory Controllers": MemoryStick, "Hardware Acceleration": Gauge,
  "RTL Design": Code, Verification: CheckCircle, Synthesis: Cpu,
  "Physical Design": Cpu, Tapeout: Zap, "Silicon Validation": FlaskConical,
  "FPGA Boards": HardDrive, "Shuttle Services": Rocket,
};

const techGroupColors: Record<string, string> = {
  Components: "border-primary/30",
  "EDA Tooling": "border-violet/30",
  Infrastructure: "border-coral/30",
};

const techSubcategoryColors: Record<string, string> = {
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

function getTechSubcategories(groupKey: string) {
  const techs = technologies.filter((t) => (t as any).group === groupKey);
  return [...new Set(techs.map((t) => t.category))];
}

// ─── Discussion groups (matches Discussions page) ───
const discussionInterests = allInterests.filter((i) => i.category === "Discussions");

const discussionGroups = [
  { key: "AI & Computing", label: "AI & Computing", icon: Brain, description: "Machine learning, neuromorphic, and synthesis research" },
  { key: "Security & Communications", label: "Security & Communications", icon: Shield, description: "Cryptography, DSP, and signal processing" },
  { key: "Design Methodology", label: "Design Methodology", icon: Wrench, description: "Low-power, verification, and systems research" },
];

const discussionSubcategoryIconMap: Record<string, React.ElementType> = {
  "Hardware AI": Brain, "Synthesis": Code, "Security": Shield,
  "Signal Processing": Radio, "Power": Zap, "Systems": Cpu, "Verification": CheckCircle,
};

const discussionGroupColors: Record<string, string> = {
  "AI & Computing": "border-primary/30",
  "Security & Communications": "border-violet/30",
  "Design Methodology": "border-coral/30",
};

const discussionSubcategoryColors: Record<string, string> = {
  "Hardware AI": "bg-primary/10 text-primary",
  "Synthesis": "bg-violet/10 text-violet",
  "Security": "bg-violet/10 text-violet",
  "Signal Processing": "bg-coral/10 text-coral",
  "Power": "bg-amber/10 text-amber",
  "Systems": "bg-emerald-500/10 text-emerald-500",
  "Verification": "bg-sky-500/10 text-sky-500",
};

function getDiscussionSubcategories(groupKey: string) {
  const items = discussionInterests.filter((i) => i.group === groupKey);
  return [...new Set(items.map((i) => i.subcategory).filter(Boolean))] as string[];
}

// ─── Generic collapsible group selector ───
interface GroupedSelectorProps {
  groups: { key: string; label: string; icon: React.ElementType; description: string }[];
  groupColors: Record<string, string>;
  subcategoryColors: Record<string, string>;
  subcategoryIconMap: Record<string, React.ElementType>;
  getSubcategories: (groupKey: string) => string[];
  getItems: (groupKey: string, subcat: string, search: string) => { id: string; name: string; description: string }[];
  selectedItems: Set<string>;
  onToggle: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder: string;
}

function GroupedSelector({
  groups, groupColors, subcategoryColors, subcategoryIconMap, getSubcategories,
  getItems, selectedItems, onToggle, search, onSearchChange, searchPlaceholder,
}: GroupedSelectorProps) {
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set(groups.map(g => g.key)));
  const [collapsedSubcats, setCollapsedSubcats] = useState<Set<string>>(new Set());

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

  return (
    <div className="space-y-4">
      {/* Search + expand/collapse */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              onSearchChange(e.target.value);
              if (e.target.value) setCollapsedGroups(new Set());
            }}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-9 px-3 rounded-xl text-xs whitespace-nowrap"
          onClick={() => {
            const allCollapsed = collapsedGroups.size === groups.length;
            setCollapsedGroups(allCollapsed ? new Set() : new Set(groups.map(g => g.key)));
          }}
        >
          <ChevronDown className={cn("h-3.5 w-3.5 mr-1 transition-transform", collapsedGroups.size === groups.length && "-rotate-90")} />
          {collapsedGroups.size === groups.length ? "Expand" : "Collapse"}
        </Button>
      </div>

      {/* Selected badges */}
      {selectedItems.size > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Array.from(selectedItems).map((id) => (
            <Badge key={id} variant="secondary" className="gap-1 text-xs">
              {id}
              <button type="button" onClick={() => onToggle(id)}><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
      )}

      {/* Groups */}
      {groups.map((group) => {
        const Icon = group.icon;
        const subcats = getSubcategories(group.key);
        const hasMatches = subcats.some(s => getItems(group.key, s, search).length > 0);
        const isGroupCollapsed = search ? !hasMatches : collapsedGroups.has(group.key);

        if (search && !hasMatches) return null;

        return (
          <div key={group.key} className={cn("rounded-xl border bg-card/50 overflow-hidden", groupColors[group.key])}>
            <button
              onClick={() => toggleGroup(group.key)}
              className="w-full flex items-center gap-2.5 p-4 text-left hover:bg-accent/30 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-display font-bold">{group.label}</h3>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform duration-300", isGroupCollapsed && "-rotate-90")} />
            </button>

            <AnimatePresence initial={false}>
              {!isGroupCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-4">
                    {subcats.map((subcat) => {
                      const subcatKey = `${group.key}::${subcat}`;
                      const isSubcatCollapsed = collapsedSubcats.has(subcatKey);
                      const items = getItems(group.key, subcat, search);

                      if (search && items.length === 0) return null;

                      const SubIcon = subcategoryIconMap[subcat] || Cpu;

                      return (
                        <div key={subcat}>
                          <button
                            onClick={() => toggleSubcat(subcatKey)}
                            className="flex items-center gap-2 mb-2 w-full text-left"
                          >
                            <div className="w-1 h-4 rounded-full bg-primary/30" />
                            <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-semibold", subcategoryColors[subcat] || "bg-muted text-muted-foreground")}>
                              {subcat}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{items.length}</span>
                            <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform duration-200 ml-auto", isSubcatCollapsed && "-rotate-90")} />
                          </button>

                          <AnimatePresence initial={false}>
                            {!isSubcatCollapsed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="grid gap-2">
                                  {items.map((item) => {
                                    const isSelected = selectedItems.has(item.id);
                                    return (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => onToggle(item.id)}
                                        className={cn(
                                          "relative w-full text-left rounded-lg border p-3 transition-all duration-200",
                                          isSelected
                                            ? "border-primary/40 bg-primary/5 shadow-sm"
                                            : "border-border/50 hover:border-primary/30 hover:bg-accent/20"
                                        )}
                                      >
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0 flex-1">
                                            <h4 className="font-display font-semibold text-sm">{item.name}</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-0.5">
                                              {item.description}
                                            </p>
                                          </div>
                                          <div className={cn(
                                            "w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                                            isSelected
                                              ? "border-primary bg-primary text-primary-foreground"
                                              : "border-border/60 hover:border-primary/50"
                                          )}>
                                            {isSelected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5 text-muted-foreground" />}
                                          </div>
                                        </div>
                                      </button>
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
        );
      })}
    </div>
  );
}

// ─── Main component ───
export default function ProjectSettingsManager({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const [status, setStatus] = useState(project.status);
  const [selectedTechnologies, setSelectedTechnologies] = useState<Set<string>>(new Set(project.technologies || []));
  const [selectedDiscussions, setSelectedDiscussions] = useState<Set<string>>(new Set(project.interests || []));
  const [techSearch, setTechSearch] = useState("");
  const [discussionSearch, setDiscussionSearch] = useState("");
  const [saving, setSaving] = useState(false);

  // Organisation association state
  const [dbOrganisations, setDbOrganisations] = useState<{ id: string; name: string; type: string; description: string | null; logo: string | null }[]>([]);
  const [orgSearch, setOrgSearch] = useState("");
  const [projectOrgs, setProjectOrgs] = useState<string[]>(project.organisations || []);
  const [addingOrg, setAddingOrg] = useState(false);

  useEffect(() => {
    supabase.from("organisations").select("id, name, type, description, logo").order("name").then(({ data }) => {
      if (data) setDbOrganisations(data);
    });
  }, []);

  const toggleTechnology = useCallback((name: string) => {
    setSelectedTechnologies((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  }, []);

  const toggleDiscussion = useCallback((slug: string) => {
    setSelectedDiscussions((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  }, []);

  const getTechItems = useCallback((groupKey: string, subcat: string, search: string) => {
    return technologies
      .filter((t) => (t as any).group === groupKey && t.category === subcat &&
        (!search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())))
      .map((t) => ({ id: t.name, name: t.name, description: t.description }));
  }, []);

  const getDiscussionItems = useCallback((groupKey: string, subcat: string, search: string) => {
    return discussionInterests
      .filter((i) => i.group === groupKey && i.subcategory === subcat &&
        (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())))
      .map((i) => ({ id: i.slug, name: i.name, description: i.description }));
  }, []);

  const addOrganisation = async (orgId: string) => {
    if (projectOrgs.includes(orgId)) return;
    setAddingOrg(true);
    const newOrgs = [...projectOrgs, orgId];
    const { error } = await supabase.from("projects").update({ organisations: newOrgs }).eq("id", project.id);
    if (error) toast.error("Failed to add organisation");
    else {
      toast.success("Organisation associated");
      setProjectOrgs(newOrgs);
      onUpdate();
    }
    setAddingOrg(false);
  };

  const removeOrganisation = async (orgId: string) => {
    const newOrgs = projectOrgs.filter((id) => id !== orgId);
    const { error } = await supabase.from("projects").update({ organisations: newOrgs }).eq("id", project.id);
    if (error) toast.error("Failed to remove");
    else {
      toast.success("Organisation removed");
      setProjectOrgs(newOrgs);
      onUpdate();
    }
  };

  const filteredOrgs = dbOrganisations.filter(
    (o) => !projectOrgs.includes(o.id) &&
      (!orgSearch || o.name.toLowerCase().includes(orgSearch.toLowerCase()))
  );

  const associatedOrgs = dbOrganisations.filter((o) => projectOrgs.includes(o.id));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        status,
        interests: Array.from(selectedDiscussions),
        technologies: Array.from(selectedTechnologies),
      })
      .eq("id", project.id);

    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Project updated");
      onUpdate();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Status */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Associated Organisations */}
      <div className="space-y-3">
        <Label className="text-base font-display font-bold">Associated Organisations</Label>
        <p className="text-xs text-muted-foreground">Link this project to organisations on the platform.</p>

        {/* Currently associated */}
        {associatedOrgs.length > 0 && (
          <div className="grid gap-2">
            {associatedOrgs.map((org) => (
              <div key={org.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3 group">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/partners/${org.id}`} className="text-sm font-display font-semibold hover:text-primary transition-colors">
                    {org.name}
                  </Link>
                  <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeOrganisation(org.id)}
                  className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove organisation"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search and add */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search organisations to add..."
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-xl border border-border/60 bg-card text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
          />
        </div>

        {orgSearch && (
          <div className="rounded-xl border border-border/50 bg-card max-h-48 overflow-y-auto">
            {filteredOrgs.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground text-center">No organisations found</p>
            ) : (
              filteredOrgs.slice(0, 10).map((org) => (
                <button
                  key={org.id}
                  type="button"
                  onClick={() => { addOrganisation(org.id); setOrgSearch(""); }}
                  disabled={addingOrg}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent/30 transition-colors border-b border-border/30 last:border-0"
                >
                  <div className="p-1.5 rounded-lg bg-primary/10 shrink-0">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{org.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{org.type}</p>
                  </div>
                  <Plus className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <Label className="text-base font-display font-bold">Technologies & Tools</Label>
        <p className="text-xs text-muted-foreground">Select the technologies used in this project.</p>
        <GroupedSelector
          groups={techGroups}
          groupColors={techGroupColors}
          subcategoryColors={techSubcategoryColors}
          subcategoryIconMap={techSubcategoryIconMap}
          getSubcategories={getTechSubcategories}
          getItems={getTechItems}
          selectedItems={selectedTechnologies}
          onToggle={toggleTechnology}
          search={techSearch}
          onSearchChange={setTechSearch}
          searchPlaceholder="Search technologies..."
        />
      </div>

      {/* Discussions (formerly Interests) */}
      <div className="space-y-3">
        <Label className="text-base font-display font-bold">Discussions</Label>
        <p className="text-xs text-muted-foreground">Link this project to relevant discussion topics.</p>
        <GroupedSelector
          groups={discussionGroups}
          groupColors={discussionGroupColors}
          subcategoryColors={discussionSubcategoryColors}
          subcategoryIconMap={discussionSubcategoryIconMap}
          getSubcategories={getDiscussionSubcategories}
          getItems={getDiscussionItems}
          selectedItems={selectedDiscussions}
          onToggle={toggleDiscussion}
          search={discussionSearch}
          onSearchChange={setDiscussionSearch}
          searchPlaceholder="Search discussions..."
        />
      </div>

      <Button onClick={save} disabled={saving} className="mt-2">
        <Save className="h-4 w-4 mr-1.5" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
