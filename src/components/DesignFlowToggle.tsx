import { useDesignFlow, DesignFlow } from "@/hooks/useDesignFlow";
import { cn } from "@/lib/utils";
import { Cpu, CircuitBoard } from "lucide-react";

interface DesignFlowToggleProps {
  className?: string;
  size?: "default" | "compact";
}

export default function DesignFlowToggle({ className, size = "default" }: DesignFlowToggleProps) {
  const { flow, setFlow } = useDesignFlow();

  const isCompact = size === "compact";

  return (
    <div className={cn("flex justify-center", className)}>
      <div className={cn(
        "inline-flex items-center rounded-2xl border-2 border-border/60 bg-card gap-1 shadow-sm",
        isCompact ? "p-1 rounded-xl" : "p-1.5"
      )}>
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
      </div>
    </div>
  );
}
