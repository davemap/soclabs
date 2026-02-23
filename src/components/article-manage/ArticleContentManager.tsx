import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Plus, Trash2, GripVertical, Save, Bold, Underline, Heading1, Heading2, Heading3,
  ImageIcon, Loader2, Sigma,
} from "lucide-react";
import { toast } from "sonner";

interface ContentSection {
  id?: string;
  title: string;
  body: string;
  sort_order: number;
}

function ToolbarButton({ icon: Icon, label, onClick, disabled }: { icon: React.ElementType; label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" onClick={onClick} disabled={disabled} className="p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Icon className="h-4 w-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string, updateFn: (val: string) => void) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  const selected = text.slice(start, end) || "text";
  const newText = text.slice(0, start) + before + selected + after + text.slice(end);
  updateFn(newText);
  requestAnimationFrame(() => { textarea.focus(); textarea.setSelectionRange(start + before.length, start + before.length + selected.length); });
}

function insertAtCursor(textarea: HTMLTextAreaElement, insert: string, updateFn: (val: string) => void) {
  const start = textarea.selectionStart;
  const text = textarea.value;
  const newText = text.slice(0, start) + insert + text.slice(start);
  updateFn(newText);
  requestAnimationFrame(() => { textarea.focus(); const pos = start + insert.length; textarea.setSelectionRange(pos, pos); });
}

export default function ArticleContentManager({ articleId, onSave }: { articleId: string; onSave?: () => void }) {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const textareaRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    supabase
      .from("news_article_content" as any)
      .select("*")
      .eq("article_id", articleId)
      .order("sort_order")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSections(data.map((d: any) => ({ id: d.id, title: d.title, body: d.body, sort_order: d.sort_order })));
        }
        setLoading(false);
      });
  }, [articleId]);

  const addSection = () => setSections((prev) => [...prev, { title: "", body: "", sort_order: prev.length }]);

  const updateSection = (index: number, field: "title" | "body", value: string) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
  };

  const removeSection = async (index: number) => {
    const section = sections[index];
    if (section.id) await supabase.from("news_article_content" as any).delete().eq("id", section.id);
    setSections((prev) => prev.filter((_, i) => i !== index));
    toast.success("Section removed");
  };

  const handleDragStart = (e: React.DragEvent, index: number) => { setDragIndex(index); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOverIndex(index); };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) { setDragIndex(null); setDragOverIndex(null); return; }
    setSections((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return updated.map((s, i) => ({ ...s, sort_order: i }));
    });
    setDragIndex(null); setDragOverIndex(null);
  };
  const handleDragEnd = () => { setDragIndex(null); setDragOverIndex(null); };

  const handleImageUpload = useCallback(async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10MB"); return; }
    setUploadingImage(index);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `articles/${articleId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("project-content").upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("project-content").getPublicUrl(path);
      const textarea = textareaRefs.current[index];
      if (textarea) insertAtCursor(textarea, `\n![${file.name}](${publicUrl})\n`, (val) => updateSection(index, "body", val));
      else updateSection(index, "body", sections[index].body + `\n![${file.name}](${publicUrl})\n`);
      toast.success("Image uploaded");
    } catch (err: any) { toast.error("Upload failed: " + err.message); }
    finally { setUploadingImage(null); }
  }, [articleId, sections]);

  const saveAll = async () => {
    setSaving(true);
    try {
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        if (s.id) {
          await supabase.from("news_article_content" as any).update({ title: s.title, body: s.body, sort_order: i } as any).eq("id", s.id);
        } else {
          const { data } = await supabase.from("news_article_content" as any).insert({ article_id: articleId, title: s.title, body: s.body, sort_order: i } as any).select().single();
          if (data) sections[i] = { ...s, id: (data as any).id, sort_order: i };
        }
      }
      setSections([...sections]);
      toast.success("Content saved");
      onSave?.();
    } catch { toast.error("Failed to save content"); }
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Loading content...</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-bold">Content Sections</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addSection}><Plus className="h-4 w-4 mr-1" /> Add Section</Button>
          <Button size="sm" onClick={saveAll} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? "Saving..." : "Save All"}</Button>
        </div>
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">No content sections yet. Add one to write your article.</p>
      )}

      {sections.map((section, i) => (
        <Card
          key={section.id || `new-${i}`}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={(e) => handleDrop(e, i)}
          onDragEnd={handleDragEnd}
          className={`transition-all duration-200 ${dragIndex === i ? "opacity-40 scale-[0.98]" : ""} ${dragOverIndex === i && dragIndex !== i ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : ""}`}
        >
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <div draggable onDragStart={(e) => handleDragStart(e, i)} className="cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-muted/50 transition-colors">
                <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              </div>
              <Input placeholder="Section title" value={section.title} onChange={(e) => updateSection(i, "title", e.target.value)} className="flex-1" />
              <Button variant="ghost" size="icon" onClick={() => removeSection(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>

            <div className="flex items-center gap-0.5 px-1 py-1 rounded-lg border border-border/60 bg-muted/30 flex-wrap">
              <ToolbarButton icon={Bold} label="Bold" onClick={() => { const ta = textareaRefs.current[i]; if (ta) wrapSelection(ta, "**", "**", (v) => updateSection(i, "body", v)); }} />
              <ToolbarButton icon={Underline} label="Underline" onClick={() => { const ta = textareaRefs.current[i]; if (ta) wrapSelection(ta, "<u>", "</u>", (v) => updateSection(i, "body", v)); }} />
              <div className="w-px h-5 bg-border/60 mx-1" />
              <ToolbarButton icon={Heading1} label="Heading 1" onClick={() => { const ta = textareaRefs.current[i]; if (ta) insertAtCursor(ta, "\n# ", (v) => updateSection(i, "body", v)); }} />
              <ToolbarButton icon={Heading2} label="Heading 2" onClick={() => { const ta = textareaRefs.current[i]; if (ta) insertAtCursor(ta, "\n## ", (v) => updateSection(i, "body", v)); }} />
              <ToolbarButton icon={Heading3} label="Heading 3" onClick={() => { const ta = textareaRefs.current[i]; if (ta) insertAtCursor(ta, "\n### ", (v) => updateSection(i, "body", v)); }} />
              <div className="w-px h-5 bg-border/60 mx-1" />
              <ToolbarButton icon={Sigma} label="Inline formula" onClick={() => { const ta = textareaRefs.current[i]; if (ta) wrapSelection(ta, "$", "$", (v) => updateSection(i, "body", v)); }} />
              <div className="w-px h-5 bg-border/60 mx-1" />
              <ToolbarButton icon={ImageIcon} label="Upload image" disabled={uploadingImage === i} onClick={() => fileInputRefs.current[i]?.click()} />
              {uploadingImage === i && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-1" />}
              <input ref={(el) => { fileInputRefs.current[i] = el; }} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleImageUpload(i, file); e.target.value = ""; }} />
            </div>

            <Textarea
              ref={(el) => { textareaRefs.current[i] = el; }}
              placeholder="Write content in Markdown..."
              value={section.body}
              onChange={(e) => updateSection(i, "body", e.target.value)}
              rows={8}
              className="font-mono text-sm"
              onKeyDown={(e) => { if (e.ctrlKey && e.key === "b") { e.preventDefault(); const ta = textareaRefs.current[i]; if (ta) wrapSelection(ta, "**", "**", (v) => updateSection(i, "body", v)); } }}
              onDrop={(e) => { const file = e.dataTransfer.files?.[0]; if (file && file.type.startsWith("image/")) { e.preventDefault(); handleImageUpload(i, file); } }}
              onDragOver={(e) => { if (e.dataTransfer.types.includes("Files")) e.preventDefault(); }}
            />
            <p className="text-[10px] text-muted-foreground">Supports Markdown, LaTeX ($..$ inline, $$..$$ block), and image uploads.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
