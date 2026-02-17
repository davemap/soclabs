import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { learningPhases } from "@/data/mockData";

export interface MilestoneTaskFormData {
  task: string;
  blurb: string;
  assignee_id: string | null;
  start_date: string | null;
  projected_end_date: string | null;
  learning_topic_ids: string[];
}

interface Collaborator {
  user_id: string;
  full_name: string | null;
  username: string | null;
}

interface AddMilestoneTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: string;
  phaseLabel: string;
  collaborators: Collaborator[];
  onSubmit: (data: MilestoneTaskFormData) => void;
  initialData?: MilestoneTaskFormData | null;
}

const AddMilestoneTaskDialog = ({
  open,
  onOpenChange,
  phase,
  phaseLabel,
  collaborators,
  onSubmit,
  initialData,
}: AddMilestoneTaskDialogProps) => {
  const [task, setTask] = useState("");
  const [blurb, setBlurb] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  // Pre-fill when dialog opens
  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      if (initialData) {
        setTask(initialData.task || "");
        setBlurb(initialData.blurb || "");
        setAssigneeId(initialData.assignee_id || "");
        setStartDate(initialData.start_date ? new Date(initialData.start_date) : undefined);
        setEndDate(initialData.projected_end_date ? new Date(initialData.projected_end_date) : undefined);
        setSelectedTopics(initialData.learning_topic_ids || []);
      } else {
        setTask("");
        setBlurb("");
        setAssigneeId("");
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedTopics([]);
      }
    }
    prevOpenRef.current = open;
  }, [open, initialData]);

  const resetForm = () => {
    setTask("");
    setBlurb("");
    setAssigneeId("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedTopics([]);
  };

  const handleSubmit = () => {
    if (!task.trim()) return;
    onSubmit({
      task: task.trim(),
      blurb: blurb.trim(),
      assignee_id: assigneeId || null,
      start_date: startDate ? format(startDate, "yyyy-MM-dd") : null,
      projected_end_date: endDate ? format(endDate, "yyyy-MM-dd") : null,
      learning_topic_ids: selectedTopics,
    });
    resetForm();
    onOpenChange(false);
  };

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]
    );
  };

  const getTopicTitle = (topicId: string) => {
    for (const lp of learningPhases) {
      const topic = lp.topics.find((t) => t.id === topicId);
      if (topic) return topic.title;
    }
    return topicId;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            Add Task to <span className="text-primary">{phaseLabel}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Task Title *</Label>
            <Input
              id="task-title"
              placeholder="e.g. Implement AES core"
              value={task}
              onChange={(e) => setTask(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-blurb">Description</Label>
            <Textarea
              id="task-blurb"
              placeholder="Describe what this task involves..."
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              rows={3}
            />
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <Label>Assign to</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a collaborator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {collaborators.map((c) => (
                  <SelectItem key={c.user_id} value={c.user_id}>
                    {c.full_name || c.username || "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {startDate ? format(startDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label>Projected End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {endDate ? format(endDate, "PPP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Selected topics */}
          {selectedTopics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {selectedTopics.map((topicId) => (
                <Badge
                  key={topicId}
                  variant="secondary"
                  className="text-xs gap-1 cursor-pointer hover:bg-destructive/10"
                  onClick={() => toggleTopic(topicId)}
                >
                  {getTopicTitle(topicId)}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          {/* Learning Hub Topics */}
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Learning Hub Topics
            </Label>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              <Accordion type="multiple" className="w-full">
                {learningPhases.map((lp) => (
                  <AccordionItem key={lp.id} value={lp.id} className="border-b last:border-b-0">
                    <AccordionTrigger className="px-3 py-2 text-xs font-medium hover:no-underline">
                      {lp.title}
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-2">
                      <div className="flex flex-wrap gap-1">
                        {lp.topics
                          .filter((t) => t.id !== `${lp.id}-overview` && t.id !== "architecture-overview")
                          .map((topic) => (
                            <button
                              key={topic.id}
                              type="button"
                              onClick={() => toggleTopic(topic.id)}
                              className={cn(
                                "text-[11px] px-2 py-1 rounded-md border transition-colors",
                                selectedTopics.includes(topic.id)
                                  ? "bg-primary/10 text-primary border-primary/30"
                                  : "bg-muted/30 text-muted-foreground border-border/40 hover:border-primary/30 hover:text-foreground"
                              )}
                            >
                              {topic.title}
                            </button>
                          ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!task.trim()}>
              <Plus className="h-4 w-4 mr-1" /> Add Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMilestoneTaskDialog;
