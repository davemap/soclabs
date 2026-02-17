import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare, Check, Minus, Cpu, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { referenceDesigns } from "@/data/mockData";

type Design = (typeof referenceDesigns)[number];

interface SoCComparisonProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
  onClear: () => void;
}

const comparisonRows: {
  label: string;
  key: string;
  render: (d: Design) => React.ReactNode;
}[] = [
  {
    label: "Processor",
    key: "processor",
    render: (d) => <span className="font-medium text-foreground">{d.processor}</span>,
  },
  {
    label: "Bus Architecture",
    key: "bus",
    render: (d) => <span>{d.busArchitecture}</span>,
  },
  {
    label: "Target Technology",
    key: "target",
    render: (d) => (
      <div className="flex flex-wrap gap-1">
        {d.targetTechnology.map((t) => (
          <Badge key={t} variant="outline" className="text-[10px]">
            {t}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    label: "Peripherals",
    key: "peripherals",
    render: (d) => (
      <div className="flex flex-wrap gap-1">
        {d.peripherals.map((p) => (
          <Badge key={p} variant="secondary" className="text-[10px] px-1.5 py-0">
            {p}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    label: "Silicon Proven",
    key: "proven",
    render: (d) =>
      d.provenIn && d.provenIn.length > 0 ? (
        <div className="space-y-1">
          {d.provenIn.map((p) => (
            <div key={p.details} className="flex items-center gap-1 text-xs">
              <Check className="h-3 w-3 text-emerald-500 shrink-0" />
              <span>
                {p.type}: {p.details}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground/60">—</span>
      ),
  },
  {
    label: "Version",
    key: "version",
    render: (d) => <span className="font-mono text-xs">{d.version}</span>,
  },
  {
    label: "Branch",
    key: "branch",
    render: (d) => <span className="font-mono text-xs">{d.branch}</span>,
  },
];

// Collect all unique peripherals across all designs for the feature matrix
const allPeripherals = Array.from(
  new Set(referenceDesigns.flatMap((d) => d.peripherals))
);

const SoCComparison = ({ selectedIds, onToggle, onClear }: SoCComparisonProps) => {
  const selected = referenceDesigns.filter((d) => selectedIds.includes(d.id));

  if (selected.length < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="rounded-2xl border border-primary/30 bg-card shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            <h2 className="font-display font-bold text-lg">
              Compare Reference SoCs
            </h2>
            <Badge variant="secondary" className="text-xs">
              {selected.length} selected
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-40">
                  Attribute
                </th>
                {selected.map((d) => (
                  <th key={d.id} className="px-6 py-3 text-left min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-primary/10">
                        <Cpu className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Link
                          to={`/designs/${d.id}`}
                          className="font-display font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {d.name}
                        </Link>
                        <p className="text-[10px] text-muted-foreground font-normal">
                          {d.tagline}
                        </p>
                      </div>
                      <button
                        onClick={() => onToggle(d.id)}
                        className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
                <tr
                  key={row.key}
                  className={cn(
                    "border-b border-border/30",
                    i % 2 === 0 ? "bg-muted/10" : ""
                  )}
                >
                  <td className="px-6 py-3 font-medium text-xs text-muted-foreground whitespace-nowrap">
                    {row.label}
                  </td>
                  {selected.map((d) => (
                    <td key={d.id} className="px-6 py-3 text-sm text-muted-foreground">
                      {row.render(d)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Peripheral matrix */}
              <tr className="border-b border-border/60 bg-muted/20">
                <td
                  colSpan={selected.length + 1}
                  className="px-6 py-2 font-display font-semibold text-xs text-foreground uppercase tracking-wider"
                >
                  Peripheral Matrix
                </td>
              </tr>
              {allPeripherals.map((peripheral, i) => (
                <tr
                  key={peripheral}
                  className={cn(
                    "border-b border-border/20",
                    i % 2 === 0 ? "bg-muted/10" : ""
                  )}
                >
                  <td className="px-6 py-2 text-xs text-muted-foreground">
                    {peripheral}
                  </td>
                  {selected.map((d) => (
                    <td key={d.id} className="px-6 py-2 text-center">
                      {d.peripherals.includes(peripheral) ? (
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

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex gap-3">
          {selected.map((d) => (
            <Button key={d.id} asChild size="sm" variant="outline" className="rounded-full">
              <Link to={`/designs/${d.id}`}>
                {d.name} <ArrowRight className="h-3 w-3 ml-1" />
              </Link>
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SoCComparison;
