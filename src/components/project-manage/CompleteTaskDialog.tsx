import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const effortColors = [
  "bg-emerald-500", "bg-lime-500", "bg-amber-500", "bg-orange-500", "bg-red-500",
];
const uncertaintyColors = [
  "bg-sky-400", "bg-blue-400", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
];

interface CompleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  onSubmit: (data: { completed_date: string; effort_rating: number; uncertainty_rating: number }) => void;
}

const RatingSelector = ({
  label,
  value,
  onChange,
  colors,
  descriptions,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colors: string[];
  descriptions: string[];
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "flex-1 h-10 rounded-lg border-2 text-sm font-bold transition-all",
            value === i
              ? `${colors[i - 1]} text-white border-transparent scale-105 shadow-md`
              : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30"
          )}
        >
          {i}
        </button>
      ))}
    </div>
    <p className="text-[11px] text-muted-foreground">
      {value > 0 ? descriptions[value - 1] : "Select a rating"}
    </p>
  </div>
);

const CompleteTaskDialog = ({ open, onOpenChange, title, subtitle, onSubmit }: CompleteTaskDialogProps) => {
  const [completedDate, setCompletedDate] = useState<Date>(new Date());
  const [effortRating, setEffortRating] = useState(0);
  const [uncertaintyRating, setUncertaintyRating] = useState(0);

  const effortDescriptions = [
    "Minimal effort – straightforward task",
    "Low effort – some work required",
    "Moderate effort – meaningful work",
    "High effort – significant resources needed",
    "Extensive effort – major undertaking",
  ];

  const uncertaintyDescriptions = [
    "Well-understood – minimal unknowns",
    "Mostly clear – few uncertainties",
    "Some unknowns – moderate risk",
    "Many unknowns – significant risk",
    "Highly unpredictable – major unknowns",
  ];

  const canSubmit = effortRating > 0 && uncertaintyRating > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({
      completed_date: format(completedDate, "yyyy-MM-dd"),
      effort_rating: effortRating,
      uncertainty_rating: uncertaintyRating,
    });
    setEffortRating(0);
    setUncertaintyRating(0);
    setCompletedDate(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{title}</DialogTitle>
          {subtitle && <DialogDescription>{subtitle}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Completion Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Completion Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !completedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {completedDate ? format(completedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={completedDate}
                  onSelect={(d) => d && setCompletedDate(d)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Effort Rating */}
          <RatingSelector
            label="Effort Rating"
            value={effortRating}
            onChange={setEffortRating}
            colors={effortColors}
            descriptions={effortDescriptions}
          />

          {/* Uncertainty Rating */}
          <RatingSelector
            label="Uncertainty Rating"
            value={uncertaintyRating}
            onChange={setUncertaintyRating}
            colors={uncertaintyColors}
            descriptions={uncertaintyDescriptions}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Mark as Complete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteTaskDialog;
