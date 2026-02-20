import { useState, useEffect, useRef } from "react";
import { useDesignFlow, DesignFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard, Layers, ChevronRight, X } from "lucide-react";
import { referenceDesigns } from "@/data/mockData";
import { AnimatePresence, motion } from "framer-motion";

const socColors: Record<string, { bg: string; text: string; ring: string; hover: string }> = {
  nanosoc:  { bg: "bg-emerald-400/15", text: "text-emerald-500 dark:text-emerald-300", ring: "ring-emerald-400/20", hover: "hover:bg-muted/60" },
  millisoc: { bg: "bg-green-500/15",   text: "text-green-600 dark:text-green-400",     ring: "ring-green-500/20",   hover: "hover:bg-muted/60" },
  megasoc:  { bg: "bg-teal-600/15",    text: "text-teal-700 dark:text-teal-400",       ring: "ring-teal-600/20",    hover: "hover:bg-muted/60" },
};

interface DesignFlowToggleProps {
  className?: string;
  size?: "default" | "compact";
}

export default function DesignFlowToggle({ className, size = "default" }: DesignFlowToggleProps) {
  const { flow, setFlow, selectedSocId, setSelectedSocId } = useDesignFlow();
  const [socOpen, setSocOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!socOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        toggleRef.current && !toggleRef.current.contains(e.target as Node)
      ) {
        setSocOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [socOpen]);

  const isCompact = size === "compact";
  const selectedSoc = selectedSocId ? referenceDesigns.find(d => d.id === selectedSocId) : null;

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative inline-flex items-center">
        {/* Main bar */}
        <div className={cn(
          "inline-flex items-center rounded-xl border border-border/60 bg-card gap-0.5 shadow-sm",
          isCompact ? "p-0.5 rounded-lg" : "p-1"
        )}>
          {/* FPGA button */}
          <button
            onClick={() => setFlow("FPGA")}
            className={cn(
              "flex items-center gap-1 font-display font-bold transition-all duration-200",
              isCompact ? "px-2.5 py-1 rounded-md text-[10px]" : "px-3.5 py-1.5 rounded-lg text-xs gap-1.5",
              flow === "FPGA"
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm ring-1 ring-sky-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CircuitBoard className={isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            FPGA
          </button>

          {/* ASIC button */}
          <button
            onClick={() => setFlow("ASIC")}
            className={cn(
              "flex items-center gap-1 font-display font-bold transition-all duration-200",
              isCompact ? "px-2.5 py-1 rounded-md text-[10px]" : "px-3.5 py-1.5 rounded-lg text-xs gap-1.5",
              flow === "ASIC"
                ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-sm ring-1 ring-violet-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Cpu className={isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            ASIC
          </button>

          {/* Divider */}
          <div className={cn("w-px bg-border/60 mx-0.5", isCompact ? "h-4" : "h-5")} />

          {/* Reference SoC toggle button */}
          <button
            ref={toggleRef}
            onClick={() => setSocOpen(!socOpen)}
            className={cn(
              "flex items-center gap-1 font-display font-bold transition-all duration-200",
              isCompact ? "px-2.5 py-1 rounded-md text-[10px]" : "px-3 py-1.5 rounded-lg text-xs",
            selectedSocId
              ? cn(
                  socColors[selectedSocId]?.bg ?? "bg-primary/10",
                  socColors[selectedSocId]?.text ?? "text-primary",
                  "shadow-sm ring-1",
                  socColors[selectedSocId]?.ring ?? "ring-primary/20"
                )
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Layers className={isCompact ? "h-3 w-3" : "h-3.5 w-3.5"} />
            <span className="hidden sm:inline">{selectedSoc ? selectedSoc.name : "SoC"}</span>
            {selectedSocId && (
              <X
                className={cn(isCompact ? "h-2.5 w-2.5" : "h-3 w-3", "opacity-60 hover:opacity-100")}
                onClick={(e) => { e.stopPropagation(); setSelectedSocId(null); }}
              />
            )}
            {!selectedSocId && (
              <ChevronRight className={cn(
                "transition-transform duration-200",
                isCompact ? "h-2.5 w-2.5" : "h-3 w-3",
                socOpen && "rotate-90"
              )} />
            )}
          </button>
        </div>

        {/* SoC popover dropdown */}
        <AnimatePresence>
          {socOpen && !selectedSocId && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute right-0 top-full mt-1.5 z-50 border border-border bg-popover rounded-lg shadow-md",
                isCompact ? "p-0.5 min-w-[100px]" : "p-1 min-w-[130px]"
              )}
            >
              {referenceDesigns.map((soc) => (
                <button
                  key={soc.id}
                  onClick={() => {
                    setSelectedSocId(soc.id);
                    setSocOpen(false);
                  }}
                  className={cn(
                    "w-full font-display font-semibold transition-all duration-150 whitespace-nowrap text-center",
                    isCompact
                      ? "px-2 py-1 rounded-md text-[10px]"
                      : "px-3 py-1.5 rounded-md text-xs",
                    "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  {soc.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
