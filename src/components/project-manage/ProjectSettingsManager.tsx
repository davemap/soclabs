import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Save } from "lucide-react";
import { toast } from "sonner";

const fpgaFamilies = [
  "Xilinx Artix-7", "Xilinx Kintex-7", "Xilinx Zynq-7000", "Xilinx UltraScale+",
  "Intel Cyclone V", "Intel Cyclone 10", "Intel Arria 10", "Intel Stratix 10",
  "Lattice iCE40", "Lattice ECP5", "Gowin GW1N", "Undecided",
];

const asicProcessNodes = [
  "TSMC 180nm", "TSMC 130nm", "TSMC 65nm", "TSMC 40nm", "TSMC 28nm",
  "GlobalFoundries 180nm", "GlobalFoundries 130nm", "GlobalFoundries 22nm",
  "SkyWater 130nm", "IHP 130nm", "Undecided",
];

const timeframeSteps = [
  { value: 0, label: "1 Month" },
  { value: 1, label: "3 Months" },
  { value: 2, label: "6 Months" },
  { value: 3, label: "1 Year" },
  { value: 4, label: "2 Years" },
  { value: 5, label: "3 Years" },
  { value: 6, label: "Unknown" },
];

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

const timeframeLabelToIndex = (label: string | null): number => {
  if (!label) return 3;
  const idx = timeframeSteps.findIndex((s) => s.label === label);
  return idx >= 0 ? idx : 3;
};

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
  });
  const [timeframeIndex, setTimeframeIndex] = useState<number[]>([timeframeLabelToIndex(project.timeframe)]);
  const [saving, setSaving] = useState(false);

  const currentTimeframeLabel = timeframeSteps[timeframeIndex[0]]?.label ?? "1 Year";

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
        timeframe: currentTimeframeLabel,
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

      {/* Target Technology — matching StartProject wizard UI */}
      <div className="space-y-4">
        <Label>Target Technology</Label>
        <div className="flex gap-2">
          {["FPGA", "ASIC", "Undecided"].map((t) => (
            <button key={t} type="button"
              onClick={() => setForm({ ...form, target_technology: t, fpga_family: "", asic_process: "" })}
              className={`flex-1 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                form.target_technology === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
              }`}>
              {t}
            </button>
          ))}
        </div>
        {form.target_technology === "FPGA" && (
          <div className="space-y-2">
            <Label>FPGA Family</Label>
            <Select value={form.fpga_family} onValueChange={(v) => setForm({ ...form, fpga_family: v })}>
              <SelectTrigger><SelectValue placeholder="Select FPGA family" /></SelectTrigger>
              <SelectContent>
                {fpgaFamilies.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        )}
        {form.target_technology === "ASIC" && (
          <div className="space-y-2">
            <Label>Process Node</Label>
            <Select value={form.asic_process} onValueChange={(v) => setForm({ ...form, asic_process: v })}>
              <SelectTrigger><SelectValue placeholder="Select process node" /></SelectTrigger>
              <SelectContent>
                {asicProcessNodes.map((p) => (<SelectItem key={p} value={p}>{p}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Timeline — matching StartProject wizard slider UI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Project Duration</Label>
          <span className="text-sm font-medium text-primary">{currentTimeframeLabel}</span>
        </div>
        <Slider value={timeframeIndex} onValueChange={setTimeframeIndex} min={0} max={6} step={1} className="w-full" />
        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
          {timeframeSteps.map((s) => (<span key={s.value}>{s.label}</span>))}
        </div>
      </div>

      <Button onClick={save} disabled={saving}>
        <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
