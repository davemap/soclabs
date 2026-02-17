import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    target_technology: project.target_technology || "",
    fpga_family: project.fpga_family || "",
    asic_process: project.asic_process || "",
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
        target_technology: form.target_technology,
        fpga_family: form.target_technology === "FPGA" ? form.fpga_family : "",
        asic_process: form.target_technology === "ASIC" ? form.asic_process : "",
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
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
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
        <div className="space-y-2">
          <Label>Target Technology</Label>
          <Select value={form.target_technology} onValueChange={(v) => setForm({ ...form, target_technology: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Select technology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FPGA">FPGA</SelectItem>
              <SelectItem value="ASIC">ASIC</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {form.target_technology === "FPGA" && (
        <div className="space-y-2">
          <Label>FPGA Family</Label>
          <Input value={form.fpga_family} onChange={(e) => setForm({ ...form, fpga_family: e.target.value })} placeholder="e.g. Xilinx Artix-7" />
        </div>
      )}

      {form.target_technology === "ASIC" && (
        <div className="space-y-2">
          <Label>ASIC Process</Label>
          <Input value={form.asic_process} onChange={(e) => setForm({ ...form, asic_process: e.target.value })} placeholder="e.g. TSMC 28nm" />
        </div>
      )}

      <div className="space-y-2">
        <Label>Timeline</Label>
        <Select value={form.timeframe} onValueChange={(v) => setForm({ ...form, timeframe: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3 months">3 months</SelectItem>
            <SelectItem value="6 months">6 months</SelectItem>
            <SelectItem value="9 months">9 months</SelectItem>
            <SelectItem value="12 months">12 months</SelectItem>
            <SelectItem value="18 months">18 months</SelectItem>
            <SelectItem value="24 months">24 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
