import { motion } from "framer-motion";
import { X, GitCompare, Check, Minus, Cpu, ArrowRight, Clock, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { referenceDesigns } from "@/data/mockData";

type Design = (typeof referenceDesigns)[number];

interface SoCComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const SoCComparisonDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onToggle,
  onClear,
}: SoCComparisonDialogProps) => {
  const selected = referenceDesigns.filter((d) => selectedIds.includes(d.id));

  // Collect all unique features and use cases
  const allFeatures = Array.from(new Set(selected.flatMap((d) => d.features)));
  const allUseCases = Array.from(new Set(selected.flatMap((d) => d.useCases)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto p-0 [&>button:last-child]:top-5 [&>button:last-child]:right-5 [&>button:last-child]:z-20">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/30 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 font-display">
              <GitCompare className="h-5 w-5 text-primary" />
              Compare Reference SoCs
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* SoC Headers */}
          <div className={cn("grid gap-4", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
            {selected.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-border/60 bg-muted/20 p-4 relative"
              >
                <button
                  onClick={() => onToggle(d.id)}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">{d.name}</h3>
                    <p className="text-[11px] text-muted-foreground">{d.processor}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{d.tagline}</p>
              </div>
            ))}
          </div>

          {/* Integration Time & Gate Count */}
          <div>
            <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Integration Time & Complexity
            </h3>
            <div className={cn("grid gap-4", selected.length === 2 ? "grid-cols-2" : "grid-cols-3")}>
              {selected.map((d) => (
                <div key={d.id} className="rounded-lg border border-border/40 p-4 space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      Integration Time
                    </p>
                    <p className="text-lg font-display font-bold text-foreground">
                      {(d as any).integrationTime || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                      Relative Gate Count
                    </p>
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <p className="text-lg font-display font-bold text-foreground">
                        {(d as any).relativeGateCount || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Features comparison */}
          <div>
            <h3 className="font-display font-bold text-sm mb-3">Key Features</h3>
            <div className="rounded-lg border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-[40%]">
                      Feature
                    </th>
                    {selected.map((d) => (
                      <th key={d.id} className="px-4 py-2.5 text-center text-xs font-display font-bold text-foreground">
                        {d.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allFeatures.map((feature, i) => (
                    <tr key={feature} className={cn("border-b border-border/20", i % 2 === 0 ? "bg-muted/10" : "")}>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{feature}</td>
                      {selected.map((d) => (
                        <td key={d.id} className="px-4 py-2 text-center">
                          {d.features.includes(feature) ? (
                            <Check className="h-4 w-4 text-emerald-500 inline-block" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground/30 inline-block" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Use Cases comparison */}
          <div>
            <h3 className="font-display font-bold text-sm mb-3">Use Cases</h3>
            <div className="rounded-lg border border-border/40 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/20">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground w-[40%]">
                      Use Case
                    </th>
                    {selected.map((d) => (
                      <th key={d.id} className="px-4 py-2.5 text-center text-xs font-display font-bold text-foreground">
                        {d.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allUseCases.map((uc, i) => (
                    <tr key={uc} className={cn("border-b border-border/20", i % 2 === 0 ? "bg-muted/10" : "")}>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{uc}</td>
                      {selected.map((d) => (
                        <td key={d.id} className="px-4 py-2 text-center">
                          {d.useCases.includes(uc) ? (
                            <Check className="h-4 w-4 text-emerald-500 inline-block" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground/30 inline-block" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer links */}
          <div className="flex flex-wrap gap-3 pt-2">
            {selected.map((d) => (
              <Button key={d.id} asChild size="sm" variant="outline" className="rounded-full">
                <Link to={`/designs/${d.id}`}>
                  Explore {d.name} <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SoCComparisonDialog;
