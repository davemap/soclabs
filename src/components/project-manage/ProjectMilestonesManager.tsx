import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

const phases = [
  { value: "architecture", label: "Architecture" },
  { value: "rtl", label: "RTL Design" },
  { value: "verification", label: "Verification" },
  { value: "synthesis", label: "Synthesis" },
  { value: "physical-design", label: "Physical Design" },
  { value: "tapeout", label: "Tapeout" },
  { value: "silicon-validation", label: "Silicon Validation" },
];

interface MilestoneRow {
  id?: string;
  phase: string;
  task: string;
  done: boolean;
  sort_order: number;
}

export default function ProjectMilestonesManager({ projectId }: { projectId: string }) {
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          setMilestones(data.map((d) => ({ id: d.id, phase: d.phase, task: d.task, done: d.done, sort_order: d.sort_order })));
        }
        setLoading(false);
      });
  }, [projectId]);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      { phase: "architecture", task: "", done: false, sort_order: prev.length },
    ]);
  };

  const updateMilestone = (index: number, field: keyof MilestoneRow, value: any) => {
    setMilestones((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  };

  const removeMilestone = async (index: number) => {
    const m = milestones[index];
    if (m.id) {
      await supabase.from("project_milestones").delete().eq("id", m.id);
    }
    setMilestones((prev) => prev.filter((_, i) => i !== index));
    toast.success("Milestone removed");
  };

  const toggleDone = (index: number) => {
    updateMilestone(index, "done", !milestones[index].done);
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < milestones.length; i++) {
        const m = milestones[i];
        if (!m.task.trim()) continue;
        if (m.id) {
          await supabase
            .from("project_milestones")
            .update({ phase: m.phase, task: m.task, done: m.done, sort_order: i })
            .eq("id", m.id);
        } else {
          const { data } = await supabase
            .from("project_milestones")
            .insert({ project_id: projectId, phase: m.phase, task: m.task, done: m.done, sort_order: i })
            .select()
            .single();
          if (data) {
            milestones[i] = { ...m, id: data.id, sort_order: i };
          }
        }
      }
      setMilestones([...milestones]);
      toast.success("Milestones saved");
    } catch {
      toast.error("Failed to save milestones");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading milestones...</p>;

  // Group by phase for display
  const grouped = phases.map((p) => ({
    ...p,
    items: milestones
      .map((m, originalIndex) => ({ ...m, originalIndex }))
      .filter((m) => m.phase === p.value),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold">Milestones</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addMilestone}>
            <Plus className="h-4 w-4 mr-1" /> Add Milestone
          </Button>
          <Button size="sm" onClick={saveAll} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      {milestones.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No milestones yet. Add milestones to track your project's progress.
        </p>
      )}

      {/* Ungrouped list for editing */}
      <div className="space-y-2">
        {milestones.map((m, i) => (
          <div key={m.id || `new-${i}`} className="flex items-center gap-2 rounded-lg border p-3">
            <Checkbox
              checked={m.done}
              onCheckedChange={() => toggleDone(i)}
            />
            <Select value={m.phase} onValueChange={(v) => updateMilestone(i, "phase", v)}>
              <SelectTrigger className="w-[160px] h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Milestone task description"
              value={m.task}
              onChange={(e) => updateMilestone(i, "task", e.target.value)}
              className="flex-1 h-9"
            />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => removeMilestone(i)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      {/* Summary preview */}
      {grouped.length > 0 && (
        <div className="rounded-lg border bg-muted/20 p-4 mt-4">
          <h4 className="text-sm font-display font-bold mb-2">Progress Summary</h4>
          <div className="space-y-1">
            {grouped.map((g) => {
              const done = g.items.filter((m) => m.done).length;
              return (
                <div key={g.value} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{g.label}</span>
                  <span className="text-xs font-medium">
                    {done}/{g.items.length} done
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
