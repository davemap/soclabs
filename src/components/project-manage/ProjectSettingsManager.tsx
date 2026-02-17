import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { toast } from "sonner";

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
}

export default function ProjectSettingsManager({ project, onUpdate }: { project: ProjectData; onUpdate: () => void }) {
  const [form, setForm] = useState({
    title: project.title,
    description: project.description || "",
    github_url: project.github_url || "",
    docs_url: project.docs_url || "",
    status: project.status,
    timeframe: project.timeframe || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("projects")
      .update({
        title: form.title,
        description: form.description,
        github_url: form.github_url,
        docs_url: form.docs_url,
        status: form.status,
        timeframe: form.timeframe,
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
    <div className="space-y-4 max-w-xl">
      <h3 className="text-lg font-display font-bold">Project Settings</h3>

      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>GitHub URL</Label>
        <Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
      </div>

      <div className="space-y-2">
        <Label>Documentation URL</Label>
        <Input value={form.docs_url} onChange={(e) => setForm({ ...form, docs_url: e.target.value })} placeholder="https://docs.example.com" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Input value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Timeframe</Label>
          <Input value={form.timeframe} onChange={(e) => setForm({ ...form, timeframe: e.target.value })} />
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
