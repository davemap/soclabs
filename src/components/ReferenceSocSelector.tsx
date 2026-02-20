import { cn } from "@/lib/utils";
import { referenceDesigns } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, X } from "lucide-react";

interface ReferenceSocSelectorProps {
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

export default function ReferenceSocSelector({ value, onChange, className }: ReferenceSocSelectorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Layers className="h-4 w-4" />
        <span className="font-display font-semibold hidden sm:inline">Reference SoC:</span>
      </div>
      <Select
        value={value ?? "generic"}
        onValueChange={(v) => onChange(v === "generic" ? null : v)}
      >
        <SelectTrigger className="w-[160px] h-9 text-sm font-display">
          <SelectValue placeholder="Generic" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="generic">Generic</SelectItem>
          {referenceDesigns.map((soc) => (
            <SelectItem key={soc.id} value={soc.id}>
              {soc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && (
        <button
          onClick={() => onChange(null)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title="Clear selection"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
