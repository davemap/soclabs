import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export default function InlineMilestonesEditor({
  projectId,
  technology,
  onSave,
}: {
  projectId: string;
  technology?: string;
  onSave?: () => void;
}) {
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isFpga = technology?.toLowerCase().includes("fpga");
  const visiblePhases = isFpga
    ? phases.filter((p) => p.value !== "tapeout")
    : phases;

  useEffect(() => {
    supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order")
      .then(({ data }) => {
        if (data) {
          setMilestones(
            data.map((d) => ({
              id: d.id,
              phase: d.phase,
              task: d.task,
              done: d.done,
              sort_order: d.sort_order,
            }))
          );
        }
        setLoading(false);
      });
  }, [projectId]);

  const addTask = (phase: string) => {
    setMilestones((prev) => [
      ...prev,
      { phase, task: "", done: false, sort_order: prev.length },
    ]);
  };

  const updateTask = (index: number, field: keyof MilestoneRow, value: any) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const removeTask = async (index: number) => {
    const m = milestones[index];
    if (m.id) {
      await supabase.from("project_milestones").delete().eq("id", m.id);
    }
    setMilestones((prev) => prev.filter((_, i) => i !== index));
    toast.success("Task removed");
    onSave?.();
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
            .insert({
              project_id: projectId,
              phase: m.phase,
              task: m.task,
              done: m.done,
              sort_order: i,
            })
            .select()
            .single();
          if (data) {
            milestones[i] = { ...m, id: data.id, sort_order: i };
          }
        }
      }
      setMilestones([...milestones]);
      toast.success("Milestones saved");
      onSave?.();
    } catch {
      toast.error("Failed to save milestones");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <p className="text-sm text-muted-foreground py-4">Loading milestones...</p>
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold">Project Milestones</h3>
        <Button size="sm" onClick={saveAll} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save All"}
        </Button>
      </div>

      {visiblePhases.map((phase) => {
        const phaseTasks = milestones
          .map((m, i) => ({ ...m, originalIndex: i }))
          .filter((m) => m.phase === phase.value);

        return (
          <div key={phase.value} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-display font-bold text-foreground">
                {phase.label}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => addTask(phase.value)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
              </Button>
            </div>

            {phaseTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                No tasks yet. Click "Add Task" to get started.
              </p>
            ) : (
              <div className="space-y-1.5">
                {phaseTasks.map((m) => (
                  <div
                    key={m.id || `new-${m.originalIndex}`}
                    className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2"
                  >
                    <Checkbox
                      checked={m.done}
                      onCheckedChange={() =>
                        updateTask(m.originalIndex, "done", !m.done)
                      }
                    />
                    <Input
                      placeholder="Task description..."
                      value={m.task}
                      onChange={(e) =>
                        updateTask(m.originalIndex, "task", e.target.value)
                      }
                      className="flex-1 h-8 text-sm border-none bg-transparent shadow-none focus-visible:ring-0 px-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeTask(m.originalIndex)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
