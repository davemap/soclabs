import { useDesignFlow, DesignFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard } from "lucide-react";

export default function DesignFlowToggle({ className }: { className?: string }) {
  const { flow, setFlow } = useDesignFlow();

  return (
    <div className={cn("flex justify-center", className)}>
      <div className="inline-flex items-center rounded-2xl border-2 border-border/60 bg-card p-1.5 gap-1 shadow-sm">
        <button
          onClick={() => setFlow("FPGA")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-200",
            flow === "FPGA"
              ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 shadow-md ring-1 ring-sky-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <CircuitBoard className="h-5 w-5" />
          FPGA Flow
        </button>
        <button
          onClick={() => setFlow("ASIC")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-display font-bold transition-all duration-200",
            flow === "ASIC"
              ? "bg-violet-500/15 text-violet-600 dark:text-violet-400 shadow-md ring-1 ring-violet-500/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Cpu className="h-5 w-5" />
          ASIC Flow
        </button>
      </div>
    </div>
  );
}
