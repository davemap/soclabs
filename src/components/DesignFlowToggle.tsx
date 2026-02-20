import { useState } from "react";
import { useDesignFlow, DesignFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard, Layers, ChevronRight, X } from "lucide-react";
import { referenceDesigns } from "@/data/mockData";
import { AnimatePresence, motion } from "framer-motion";

const socColors: Record<string, { bg: string; text: string; ring: string; hover: string }> = {
  nanosoc:  { bg: "bg-amber-400/15", text: "text-amber-500 dark:text-amber-300", ring: "ring-amber-400/20", hover: "hover:bg-muted/60" },
  millisoc: { bg: "bg-orange-500/15", text: "text-orange-600 dark:text-orange-400", ring: "ring-orange-500/20", hover: "hover:bg-muted/60" },
  megasoc:  { bg: "bg-orange-700/15", text: "text-orange-700 dark:text-orange-500", ring: "ring-orange-700/20", hover: "hover:bg-muted/60" },
};

interface DesignFlowToggleProps {
  className?: string;
  size?: "default" | "compact";
}

export default function DesignFlowToggle({ className, size = "default" }: DesignFlowToggleProps) {
  const { flow, setFlow, selectedSocId, setSelectedSocId } = useDesignFlow();
  const [socOpen, setSocOpen] = useState(false);

  const isCompact = size === "compact";
  const selectedSoc = selectedSocId ? referenceDesigns.find(d => d.id === selectedSocId) : null;

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative inline-flex items-center">
        {/* Main bar */}
        <div className={cn(
          "inline-flex items-center rounded-2xl border-2 border-border/60 bg-card gap-1 shadow-sm",
          isCompact ? "p-1 rounded-xl" : "p-1.5"
        )}>
          {/* FPGA button */}
          <button
            onClick={() => setFlow("FPGA")}
            className={cn(
              "flex items-center gap-1.5 font-display font-bold transition-all duration-200",
              isCompact ? "px-3 py-1.5 rounded-lg text-xs" : "px-5 py-2.5 rounded-xl text-sm gap-2",
              flow === "FPGA"
                ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-md ring-1 ring-sky-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <CircuitBoard className={isCompact ? "h-3.5 w-3.5" : "h-5 w-5"} />
            FPGA Flow
          </button>

          {/* ASIC button */}
          <button
            onClick={() => setFlow("ASIC")}
            className={cn(
              "flex items-center gap-1.5 font-display font-bold transition-all duration-200",
              isCompact ? "px-3 py-1.5 rounded-lg text-xs" : "px-5 py-2.5 rounded-xl text-sm gap-2",
              flow === "ASIC"
                ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-md ring-1 ring-violet-500/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Cpu className={isCompact ? "h-3.5 w-3.5" : "h-5 w-5"} />
            ASIC Flow
          </button>

          {/* Divider */}
          <div className={cn("w-px bg-border/60 mx-0.5", isCompact ? "h-5" : "h-7")} />

          {/* Reference SoC toggle button */}
          <button
            onClick={() => setSocOpen(!socOpen)}
            className={cn(
              "flex items-center gap-1.5 font-display font-bold transition-all duration-200",
              isCompact ? "px-3 py-1.5 rounded-lg text-xs" : "px-4 py-2.5 rounded-xl text-sm",
            selectedSocId
              ? cn(
                  socColors[selectedSocId]?.bg ?? "bg-primary/10",
                  socColors[selectedSocId]?.text ?? "text-primary",
                  "shadow-md ring-1",
                  socColors[selectedSocId]?.ring ?? "ring-primary/20"
                )
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Layers className={isCompact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            <span className="hidden sm:inline">{selectedSoc ? selectedSoc.name : "Ref SoC"}</span>
            {selectedSocId && (
              <X
                className={cn(isCompact ? "h-3 w-3" : "h-3.5 w-3.5", "opacity-60 hover:opacity-100")}
                onClick={(e) => { e.stopPropagation(); setSelectedSocId(null); }}
              />
            )}
            {!selectedSocId && (
              <ChevronRight className={cn(
                "transition-transform duration-200",
                isCompact ? "h-3 w-3" : "h-3.5 w-3.5",
                socOpen && "rotate-90"
              )} />
            )}
          </button>
        </div>

        {/* SoC options – drops down below the bar */}
        <AnimatePresence>
          {socOpen && !selectedSocId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-1 z-50 overflow-hidden"
            >
              <div className={cn(
                "flex flex-col gap-0.5 border-2 border-border/60 bg-card shadow-lg",
                isCompact ? "p-1 rounded-xl" : "p-1.5 rounded-2xl"
              )}>
                {referenceDesigns.map((soc) => (
                  <button
                    key={soc.id}
                    onClick={() => {
                      setSelectedSocId(soc.id);
                      setSocOpen(false);
                    }}
                    className={cn(
                      "font-display font-semibold transition-all duration-150 whitespace-nowrap text-left",
                      isCompact
                        ? "px-2.5 py-1.5 rounded-lg text-xs"
                        : "px-4 py-2.5 rounded-xl text-sm",
                      "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    )}
                  >
                    {soc.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
