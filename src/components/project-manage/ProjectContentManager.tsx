import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { toast } from "sonner";

interface ContentSection {
  id?: string;
  title: string;
  body: string;
  sort_order: number;
}

export default function ProjectContentManager({ projectId, onSave }: { projectId: string; onSave?: () => void }) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("project_content")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSections(data.map((d) => ({ id: d.id, title: d.title, body: d.body, sort_order: d.sort_order })));
        }
        setLoading(false);
      });
  }, [projectId]);

  const addSection = () => {
    setSections((prev) => [...prev, { title: "", body: "", sort_order: prev.length }]);
  };

  const updateSection = (index: number, field: "title" | "body", value: string) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeSection = async (index: number) => {
    const section = sections[index];
    if (section.id) {
      await supabase.from("project_content").delete().eq("id", section.id);
    }
    setSections((prev) => prev.filter((_, i) => i !== index));
    toast.success("Section removed");
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (s.id) {
          await supabase
            .from("project_content")
            .update({ title: s.title, body: s.body, sort_order: i })
            .eq("id", s.id);
        } else {
          const { data } = await supabase
            .from("project_content")
            .insert({ project_id: projectId, title: s.title, body: s.body, sort_order: i })
            .select()
            .single();
          if (data) {
            sections[i] = { ...s, id: data.id, sort_order: i };
          }
        }
      }
      setSections([...sections]);
      toast.success("Content saved");
      onSave?.();
    } catch {
      toast.error("Failed to save content");
    }
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading content...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold">Content Sections</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4 mr-1" /> Add Section
          </Button>
          <Button size="sm" onClick={saveAll} disabled={saving}>
            <Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save All"}
          </Button>
        </div>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">
          No content sections yet. Add one to describe your project in detail.
        </p>
      )}

      {sections.map((section, i) => (
        <Card key={section.id || `new-${i}`}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              <Input
                placeholder="Section title (e.g. Architecture Overview)"
                value={section.title}
                onChange={(e) => updateSection(i, "title", e.target.value)}
                className="flex-1"
              />
              <Button variant="ghost" size="icon" onClick={() => removeSection(i)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <Textarea
              placeholder="Write content in Markdown..."
              value={section.body}
              onChange={(e) => updateSection(i, "body", e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
