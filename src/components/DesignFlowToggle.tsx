import { useDesignFlow, DesignFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard } from "lucide-react";

export default function DesignFlowToggle({ className }: { className?: string }) {
  const { flow, setFlow } = useDesignFlow();

  return (
    <div className={cn("inline-flex items-center rounded-xl border border-border/60 bg-card p-1 gap-0.5", className)}>
      <button
        onClick={() => setFlow("FPGA")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-200",
          flow === "FPGA"
            ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <CircuitBoard className="h-3.5 w-3.5" />
        FPGA
      </button>
      <button
        onClick={() => setFlow("ASIC")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-display font-semibold transition-all duration-200",
          flow === "ASIC"
            ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <Cpu className="h-3.5 w-3.5" />
        ASIC
      </button>
    </div>
  );
}
