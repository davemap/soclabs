import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Search, X } from "lucide-react";
import { toast } from "sonner";
import { interests } from "@/data/interests";
import { technologies } from "@/data/mockData";

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
}

export default function ProjectSettingsManager({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const [status, setStatus] = useState(project.status);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(project.interests || []);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(project.technologies || []);
  const [interestSearch, setInterestSearch] = useState("");
  const [techSearch, setTechSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredInterests = useMemo(() => {
    if (!interestSearch.trim()) return interests;
    const q = interestSearch.toLowerCase();
    return interests.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [interestSearch]);

  const filteredTechnologies = useMemo(() => {
    if (!techSearch.trim()) return technologies;
    const q = techSearch.toLowerCase();
    return technologies.filter(
      (t) => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [techSearch]);

  const toggleInterest = (slug: string) =>
    setSelectedInterests((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  const toggleTechnology = (name: string) =>
    setSelectedTechnologies((prev) => prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        status,
        interests: selectedInterests,
        technologies: selectedTechnologies,
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
    <div className="space-y-6 max-w-xl">
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

      {/* Interests */}
      <div className="space-y-3">
        <Label>Interests</Label>
        {selectedInterests.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedInterests.map((slug) => {
              const interest = interests.find((i) => i.slug === slug);
              return (
                <Badge key={slug} variant="secondary" className="gap-1">
                  {interest?.name ?? slug}
                  <button type="button" onClick={() => toggleInterest(slug)}><X className="h-3 w-3" /></button>
                </Badge>
              );
            })}
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search interests..." value={interestSearch} onChange={(e) => setInterestSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
          {filteredInterests.map((i) => (
            <button key={i.slug} type="button" onClick={() => toggleInterest(i.slug)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                selectedInterests.includes(i.slug) ? "bg-primary/10 text-primary" : "hover:bg-muted"
              }`}>
              <span>{i.name}</span>
              <span className="text-xs text-muted-foreground">{i.category}</span>
            </button>
          ))}
          {filteredInterests.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">No interests found.</p>
          )}
        </div>
      </div>

      {/* Technologies & Tools */}
      <div className="space-y-3">
        <Label>Technologies & Tools</Label>
        {selectedTechnologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {selectedTechnologies.map((name) => (
              <Badge key={name} variant="secondary" className="gap-1">
                {name}
                <button type="button" onClick={() => toggleTechnology(name)}><X className="h-3 w-3" /></button>
              </Badge>
            ))}
          </div>
        )}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search technologies..." value={techSearch} onChange={(e) => setTechSearch(e.target.value)} className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredTechnologies.map((t) => (
            <button key={t.name} type="button" onClick={() => toggleTechnology(t.name)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedTechnologies.includes(t.name) ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"
              }`}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
